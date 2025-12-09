"""
Example: Creating a CAPA (Corrective and Preventive Action) using the ingestion API.
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from capa_ingestion import CAPAIngestion
from datetime import date, timedelta

# Initialize CAPA ingestion client
capa = CAPAIngestion()

# Example 1: Create a new CAPA case
print("Creating new CAPA case...")
capa_id = capa.create_capa(
    reported_by="jane.smith@lwscientific.com",
    department="Manufacturing",
    issue_description="Sterilization indicator on Lot #2024-1205 showed inconsistent color change. 3 units affected.",
    severity="Major",
    due_date=date.today() + timedelta(days=45)
)
print(f"✓ Created CAPA: {capa_id}")

# Example 2: Add root cause analysis
print("\nAdding root cause analysis...")
capa.update_capa_analysis(
    capa_id=capa_id,
    root_cause="Sterilization chamber temperature deviated by 2°C below setpoint due to calibration drift",
    correction="Immediate re-sterilization of affected lot. Chamber recalibrated and verified.",
    corrective_action="Implement weekly temperature verification checks per SOP-018",
    preventive_action="Add temperature monitoring alerts to sterilization equipment"
)
print("✓ Analysis added")

# Example 3: Add action items
print("\nAdding action items...")
actions = [
    {
        "assigned_to": "maintenance.tech@lwscientific.com",
        "description": "Install temperature monitoring alerts on all sterilization chambers",
        "due_days": 14
    },
    {
        "assigned_to": "qa.specialist@lwscientific.com",
        "description": "Update SOP-018 to include weekly temperature verification",
        "due_days": 21
    },
    {
        "assigned_to": "production.supervisor@lwscientific.com",
        "description": "Train all operators on new temperature verification procedure",
        "due_days": 28
    }
]

action_ids = []
for action in actions:
    action_id = capa.add_capa_action(
        capa_id=capa_id,
        assigned_to=action["assigned_to"],
        action_description=action["description"],
        due_date=date.today() + timedelta(days=action["due_days"])
    )
    action_ids.append(action_id)
    print(f"  ✓ Added action: {action_id}")

# Example 4: Complete first action
print("\nCompleting first action...")
capa.complete_capa_action(action_ids[0])
print(f"✓ Action {action_ids[0]} marked complete")

# Example 5: Add approvals
print("\nSetting up approval routing...")
approvals = [
    {"approver": "qa.manager@lwscientific.com", "role": "QA Manager"},
    {"approver": "operations.director@lwscientific.com", "role": "Operations Director"}
]

for approval in approvals:
    approval_id = capa.add_capa_approval(
        capa_id=capa_id,
        approver=approval["approver"],
        role=approval["role"],
        approval_status="Pending"
    )
    print(f"  ✓ Added approval for {approval['role']}: {approval_id}")

# Example 6: Update CAPA status
print("\nUpdating CAPA status...")
capa.update_capa_status(capa_id, "In Progress")
print("✓ Status updated to 'In Progress'")

# Example 7: Get comprehensive CAPA details
print("\nRetrieving CAPA details...")
capa_details = capa.get_capa_details(capa_id)

case = capa_details['case']
print(f"✓ CAPA {case.get('capa_id')} - Status: {case.get('status')}")
print(f"  Severity: {case.get('severity')}")
print(f"  Issue: {case.get('issue_description')[:80]}...")
print(f"  Actions: {len(capa_details['actions'])} total")
print(f"  Approvals: {len(capa_details['approvals'])} pending")

# Example 8: Log monthly metrics
print("\nLogging monthly CAPA metrics...")
capa.log_monthly_metrics(
    month_start=date(2025, 12, 1),
    total_open=8,
    total_closed=5,
    avg_closure_time_days=32,
    overdue_actions=2,
    recurring_issues=1,
    notes="December 2025 - Sterilization process improvements in progress"
)
print("✓ Monthly metrics logged")

print("\n" + "="*60)
print("CAPA WORKFLOW COMPLETE")
print("="*60)
print(f"CAPA ID: {capa_id}")
print("Next steps:")
print("  1. Monitor action completion via BigQuery")
print("  2. Track approval status")
print("  3. Perform effectiveness check")
print("  4. Close CAPA when verified effective")
