"""
Example: Creating a DCR (Document Change Request) using the ingestion API.
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from dcr_ingestion import DCRIngestion
from datetime import date, timedelta

# Initialize DCR ingestion client
dcr = DCRIngestion()

# Example 1: Create a new DCR
print("Creating new DCR...")
dcr_id = dcr.create_dcr(
    requester="john.doe@lwscientific.com",
    department="Quality Assurance",
    change_type="correction",
    reason="ISO 13485:2016 Clause 7.3.5 requires documentation of design verification",
    description="Add verification test protocol section to SOP-023 Design Controls",
    affected_process="Design and Development",
    priority="High",
    target_completion_date=date.today() + timedelta(days=30)
)
print(f"✓ Created DCR: {dcr_id}")

# Example 2: Link documents to the DCR
print("\nLinking documents...")
documents = [
    {
        "document_id": "SOP-023",
        "document_title": "Design Control Procedure",
        "current_revision": "Rev C",
        "proposed_revision": "Rev D",
        "notes": "Adding verification test protocol requirements"
    },
    {
        "document_id": "WI-045",
        "document_title": "Design Verification Work Instruction",
        "current_revision": "Rev A",
        "proposed_revision": "Rev B",
        "notes": "Clarifying acceptance criteria"
    }
]
dcr.add_dcr_documents(dcr_id, documents)
print("✓ Documents linked")

# Example 3: Set up approval routing
print("\nSetting up approval routing...")
approvals = [
    {"approver": "qa.manager@lwscientific.com", "role": "QA Manager"},
    {"approver": "engineering.lead@lwscientific.com", "role": "Engineering Lead"},
    {"approver": "ceo@lwscientific.com", "role": "Management"}
]

for approval in approvals:
    approval_id = dcr.add_dcr_approval(
        dcr_id=dcr_id,
        approver=approval["approver"],
        role=approval["role"],
        approval_status="Pending"
    )
    print(f"  ✓ Added approval for {approval['role']}: {approval_id}")

# Example 4: Update DCR status
print("\nUpdating DCR status...")
dcr.update_dcr_status(dcr_id, "In Review")
print("✓ Status updated to 'In Review'")

# Example 5: Check DCR status
print("\nRetrieving DCR details...")
dcr_details = dcr.get_dcr_status(dcr_id)
print(f"✓ DCR {dcr_details.get('dcr_id')} - Status: {dcr_details.get('status')}")
print(f"  Priority: {dcr_details.get('priority')}")
print(f"  Requester: {dcr_details.get('requester')}")
print(f"  Description: {dcr_details.get('description')[:80]}...")

print("\n" + "="*60)
print("DCR WORKFLOW COMPLETE")
print("="*60)
print(f"DCR ID: {dcr_id}")
print("Next steps:")
print("  1. Route to approvers via email")
print("  2. Track approval status in BigQuery")
print("  3. Update to 'Approved' or 'Rejected'")
print("  4. Implement changes and mark 'Implemented'")
