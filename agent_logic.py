"""
ISO 13485 QMS Agent Logic - Hybrid Architecture
Uses Google Vertex AI Search for retrieval + OpenAI GPT-4 for reasoning.
"""

import os
from typing import List
from google.cloud import discoveryengine_v1 as discoveryengine
from openai import OpenAI
from pathlib import Path

# Configuration
PROJECT_ID = os.environ.get("PROJECT_ID")
DATA_STORE_ID = os.environ.get("DATA_STORE_ID")
DATA_STORE_LOCATION = os.environ.get("DATA_STORE_LOCATION", "us")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# Initialize Clients
openai_client = OpenAI(api_key=OPENAI_API_KEY)

# Initialize regional Discovery Engine client for 'us' location
client_options = {"api_endpoint": f"{DATA_STORE_LOCATION}-discoveryengine.googleapis.com"}
search_client = discoveryengine.SearchServiceClient(client_options=client_options)


def search_qms(query: str) -> List[dict]:
    """
    RETRIEVE: Query Google Vertex AI Search for relevant QMS document chunks.

    Args:
        query (str): The user's compliance question

    Returns:
        List[dict]: Context chunks with source metadata
    """
    # Build the full serving config path for structured datastore
    # Format: projects/{project}/locations/{location}/dataStores/{datastore_id}/servingConfigs/default_config
    serving_config = f"projects/{PROJECT_ID}/locations/{DATA_STORE_LOCATION}/dataStores/{DATA_STORE_ID}/servingConfigs/default_config"

    request = discoveryengine.SearchRequest(
        serving_config=serving_config,
        query=query,
        page_size=5,  # Top 5 relevant chunks
        content_search_spec=discoveryengine.SearchRequest.ContentSearchSpec(
            snippet_spec=discoveryengine.SearchRequest.ContentSearchSpec.SnippetSpec(
                return_snippet=True
            )
        ),
    )

    response = search_client.search(request)

    # Format results for LLM context
    context_chunks = []
    for result in response.results:
        # Extract document metadata
        doc_data = result.document.derived_struct_data
        title = doc_data.get("title", "Untitled Document")
        link = doc_data.get("link", "")

        # Extract snippet text
        snippets = doc_data.get("snippets", [])
        snippet_text = snippets[0].get("snippet", "") if snippets else ""

        context_chunks.append({
            "title": title,
            "url": link,
            "content": snippet_text
        })

    return context_chunks


def run_agent_query(query_text: str):
    """
    REASON: Send Google Search results to OpenAI GPT-4 for compliance analysis.

    Args:
        query_text (str): The user's ISO 13485 compliance question

    Returns:
        dict: Response containing:
            - 'answer': GPT-4 generated compliance response with citations
            - 'citations': List of source documents used
    """
    # Step 1: Retrieve context from Vertex AI Search
    context_results = search_qms(query_text)

    if not context_results:
        return {
            "answer": "I could not find any relevant procedures or documents in the QMS knowledge base for this query.",
            "citations": []
        }

    # Step 2: Format context for GPT-4
    context_str = "\n\n".join([
        f"SOURCE: {chunk['title']} ({chunk['url']})\nCONTENT: {chunk['content']}"
        for chunk in context_results
    ])

    # Step 3: Load system instructions
    instructions_path = Path(__file__).parent / "system_instructions.md"
    with open(instructions_path, "r") as f:
        system_prompt = f.read()

    # Append grounding rules
    system_prompt += """

CRITICAL GROUNDING RULES:
1. Answer STRICTLY based on the provided context chunks below
2. Do NOT use outside knowledge or make assumptions
3. If the answer is not in the context, explicitly state: "I cannot find this information in the current QMS documentation"
4. Always cite the SOURCE title when referencing information
5. Maintain professional, formal tone per ISO 13485 standards
"""

    user_prompt = f"""
USER QUESTION: {query_text}

CONTEXT FROM QMS DATABASE:
{context_str}
"""

    # Step 4: Call OpenAI GPT-4
    completion = openai_client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.3  # Low temperature for factual accuracy
    )

    answer = completion.choices[0].message.content

    # Step 5: Return formatted response with citations
    citations = [
        {
            "title": chunk["title"],
            "url": chunk["url"],
            "page": None  # Page number not available from snippet API
        }
        for chunk in context_results
    ]

    return {
        "answer": answer,
        "citations": citations
    }
