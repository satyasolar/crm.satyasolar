-- Migration: 20260616000000_simplified_workflow.sql
-- Purpose: Normalize existing cases and stage history entries to the 13 simplified department stages

UPDATE public.cases
SET current_stage = CASE current_stage
  WHEN 'Case Confirmed' THEN 'Sales'
  WHEN 'Registration: Document Verification' THEN 'Registration'
  WHEN 'Registration: Government Portal' THEN 'Registration'
  WHEN 'Registration: Payment Verification' THEN 'Registration'
  WHEN 'Bank & Finance' THEN 'Banking & Finance'
  WHEN 'Project: Survey & Design' THEN 'Project Phase 1'
  WHEN 'Warehouse: Material Dispatch' THEN 'Warehouse'
  WHEN 'Project: Installation' THEN 'Project Phase 2'
  WHEN 'Electrical: Net Metering' THEN 'Electrical'
  WHEN 'Accounts: Payment Clearance' THEN 'Accounts'
  WHEN 'Subsidy Registration' THEN 'Subsidy'
  WHEN 'Customer Service Update' THEN 'Customer Service / AMC'
  WHEN 'Project Completed' THEN 'Project Closed'
  WHEN 'Completed' THEN 'Project Closed'
  ELSE current_stage
END;

UPDATE public.case_history
SET stage = CASE stage
  WHEN 'Case Confirmed' THEN 'Sales'
  WHEN 'Registration: Document Verification' THEN 'Registration'
  WHEN 'Registration: Government Portal' THEN 'Registration'
  WHEN 'Registration: Payment Verification' THEN 'Registration'
  WHEN 'Bank & Finance' THEN 'Banking & Finance'
  WHEN 'Project: Survey & Design' THEN 'Project Phase 1'
  WHEN 'Warehouse: Material Dispatch' THEN 'Warehouse'
  WHEN 'Project: Installation' THEN 'Project Phase 2'
  WHEN 'Electrical: Net Metering' THEN 'Electrical'
  WHEN 'Accounts: Payment Clearance' THEN 'Accounts'
  WHEN 'Subsidy Registration' THEN 'Subsidy'
  WHEN 'Customer Service Update' THEN 'Customer Service / AMC'
  WHEN 'Project Completed' THEN 'Project Closed'
  WHEN 'Completed' THEN 'Project Closed'
  ELSE stage
END;

NOTIFY pgrst, 'reload schema';
