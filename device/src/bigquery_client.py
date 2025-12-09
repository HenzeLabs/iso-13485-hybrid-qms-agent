"""
BigQuery Client for QMS Workflows
Handles connections and base operations for DCR/CAPA ingestion.
"""

from google.cloud import bigquery
import os
from datetime import datetime
from typing import List, Dict, Any

PROJECT_ID = os.environ.get("PROJECT_ID", "lw-qms-rag")
DATASET_ID = "qms_workflows"


class QMSBigQueryClient:
    """Client for writing QMS workflow data to BigQuery."""
    
    def __init__(self, project_id: str = PROJECT_ID):
        self.project_id = project_id
        self.dataset_id = DATASET_ID
        self.client = bigquery.Client(project=project_id)
        
    def _get_table_ref(self, table_name: str) -> str:
        """Get fully qualified table reference."""
        return f"{self.project_id}.{self.dataset_id}.{table_name}"
    
    def insert_rows(self, table_name: str, rows: List[Dict[str, Any]]) -> bool:
        """
        Insert rows into a BigQuery table.
        
        Args:
            table_name: Name of the table (e.g., 'dcr_requests')
            rows: List of dictionaries containing row data
            
        Returns:
            bool: True if successful, raises exception otherwise
        """
        import logging
        logger = logging.getLogger("QMSBigQueryClient")
        table_ref = self._get_table_ref(table_name)
        logger.debug(f"Inserting rows into {table_ref}: {rows}")
        # Add timestamp if not present
        for row in rows:
            if 'created_at' not in row:
                row['created_at'] = datetime.utcnow().isoformat()
        try:
            errors = self.client.insert_rows_json(table_ref, rows)
            if errors:
                logger.error(f"BigQuery insert errors: {errors}")
                raise Exception(f"BigQuery insert errors: {errors}")
            logger.info(f"Rows inserted successfully into {table_ref}")
        except Exception as e:
            logger.error(f"Exception during BigQuery insert: {e}")
            raise
        return True
    
    def query(self, sql: str) -> List[Dict[str, Any]]:
        """
        Execute a SQL query and return results as list of dicts.
        
        Args:
            sql: SQL query string
            
        Returns:
            List of row dictionaries
        """
        query_job = self.client.query(sql)
        results = query_job.result()
        
        return [dict(row) for row in results]
