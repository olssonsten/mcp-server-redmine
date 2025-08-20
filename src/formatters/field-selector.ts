/**
 * Utilities for selective field inclusion in brief mode formatting
 */

import type { RedmineIssue } from "../lib/types/index.js";
import type { BriefFieldOptions } from "./format-options.js";

/**
 * Select fields from an issue based on brief field options
 */
export function selectFields(issue: RedmineIssue, options: BriefFieldOptions): Partial<RedmineIssue> {
  // Always include essential fields
  const selected: Partial<RedmineIssue> = {
    id: issue.id,
    subject: issue.subject,
    project: issue.project,
    tracker: issue.tracker,
    status: issue.status,
    priority: issue.priority,
    author: issue.author
  };

  // Conditionally include optional fields based on options
  if (options.assignee && issue.assigned_to) {
    selected.assigned_to = issue.assigned_to;
  }

  if (options.description && issue.description) {
    selected.description = issue.description;
  }

  if (options.dates) {
    if (issue.start_date) selected.start_date = issue.start_date;
    if (issue.due_date) selected.due_date = issue.due_date;
    selected.created_on = issue.created_on;
    selected.updated_on = issue.updated_on;
    if (issue.closed_on) selected.closed_on = issue.closed_on;
  }

  if (options.category && issue.category) {
    selected.category = issue.category;
  }

  if (options.version && issue.fixed_version) {
    selected.fixed_version = issue.fixed_version;
  }

  if (options.time_tracking) {
    if (issue.estimated_hours !== undefined) selected.estimated_hours = issue.estimated_hours;
    if (issue.spent_hours !== undefined) selected.spent_hours = issue.spent_hours;
    if (issue.done_ratio !== undefined) selected.done_ratio = issue.done_ratio;
  }

  if (options.custom_fields && issue.custom_fields) {
    selected.custom_fields = skipEmptyCustomFields(issue.custom_fields);
  }

  if (options.journals && issue.journals) {
    selected.journals = issue.journals;
  }

  if (options.relations && issue.relations) {
    selected.relations = issue.relations;
  }

  return selected;
}

/**
 * Filter out empty custom fields to reduce noise
 */
export function skipEmptyCustomFields(customFields: Array<{
  id: number;
  name: string;
  value: string | string[] | null;
}>): Array<{ id: number; name: string; value: string | string[] | null }> {
  return customFields.filter(field => {
    if (field.value === null || field.value === undefined) {
      return false;
    }
    
    if (typeof field.value === 'string') {
      return field.value.trim().length > 0;
    }
    
    if (Array.isArray(field.value)) {
      return field.value.length > 0 && field.value.some(v => v && v.trim().length > 0);
    }
    
    return true;
  });
}

/**
 * Check if any brief fields are enabled
 */
export function hasBriefFieldsEnabled(options?: BriefFieldOptions): boolean {
  if (!options) return false;
  
  return Object.values(options).some(value => value === true);
}

/**
 * Get a summary of enabled brief fields for logging/debugging
 */
export function getBriefFieldsSummary(options?: BriefFieldOptions): string {
  if (!options) return 'none';
  
  const enabled = Object.entries(options)
    .filter(([, value]) => value === true)
    .map(([key]) => key);
    
  return enabled.length > 0 ? enabled.join(', ') : 'none';
}
