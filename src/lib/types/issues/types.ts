// // 外部参照用のinclude可能な値のリスト（GET /issues.json）
// const LIST_ISSUE_INCLUDES = ['attachments', 'relations'] as const;
// type ListIssueInclude = typeof LIST_ISSUE_INCLUDES[number]; // Unused

// // 外部参照用のinclude可能な値のリスト（GET /issues/:id.json）
// const SHOW_ISSUE_INCLUDES = [
//   'children',
//   'attachments',
//   'relations',
//   'changesets',
//   'journals',
//   'watchers',
//   'allowed_statuses'
// ] as const;
// type ShowIssueInclude = typeof SHOW_ISSUE_INCLUDES[number]; // Unused

// Query params
export interface IssueListParams {
  offset?: number;
  limit?: number;
  sort?: string;
  include?: string; 
  issue_id?: number | string;
  project_id?: number | string;
  subproject_id?: string;
  tracker_id?: number;
  status_id?: "open" | "closed" | "*" | number;
  assigned_to_id?: number | "me";
  parent_id?: number;
  created_on?: string;
  updated_on?: string;
  // Text filters
  subject_filter?: string;
  description_filter?: string;
  notes_filter?: string;
  [key: `cf_${number}`]: string; // Custom fields e.g. cf_1, cf_2
}

export interface IssueShowParams {
  include?: string;
  [key: string]: string | undefined; // Index signature for compatibility
}

// Resource types
export interface RedmineIssue {
  id: number;
  project: {
    id: number;
    name: string;
  };
  tracker: {
    id: number;
    name: string;
  };
  status: {
    id: number;
    name: string;
    is_closed?: boolean;
  };
  priority: {
    id: number;
    name: string;
  };
  author: {
    id: number;
    name: string;
  };
  assigned_to?: {
    id: number;
    name: string;
  };
  category?: {
    id: number;
    name: string;
  };
  fixed_version?: {
    id: number;
    name: string;
  };
  parent?: { // Parent issue
    id: number;
  };
  subject: string;
  description?: string | null;
  start_date?: string | null; // YYYY-MM-DD or null
  due_date?: string | null; // YYYY-MM-DD or null
  done_ratio: number;
  estimated_hours?: number | null;
  total_estimated_hours?: number | null; // With subtasks
  spent_hours?: number; // Spent time for this issue
  total_spent_hours?: number; // With subtasks
  custom_fields?: {
    id: number;
    name: string;
    value: string | string[] | null; // Value can be a string, an array of strings, or null for some custom field types
  }[];
  created_on: string; // datetime
  updated_on: string; // datetime
  closed_on?: string | null; // datetime or null
  // Included via 'include' parameter
  notes?: string; // from journals
  private_notes?: boolean; // from journals (if permission)
  is_private?: boolean;
  watcher_user_ids?: number[];
  relations?: {
    id: number,
    issue_id: number, // ID of the source issue
    issue_to_id: number, // ID of the related issue
    relation_type: string, // e.g. "relates", "duplicates", "blocks"
    delay: number | null, // Delay in days for "precedes" and "follows" relations
  }[];
  journals?: {
    id: number;
    user: {
      id: number;
      name: string;
    };
    notes?: string | null;
    private_notes?: boolean;
    created_on: string; // datetime
    details?: {
      property: string;
      name: string;
      old_value?: string | null;
      new_value?: string | null;
    }[];
  }[];
  // children?: RedmineIssue[]; // If 'children' is included. Be careful with recursion.

  // Added based on the reference document for list_project_statuses
  allowed_statuses?: {
    id: number;
    name: string;
    is_closed?: boolean;
  }[];
}

export interface RedmineIssueCreate {
  project_id: number;
  tracker_id?: number;
  status_id?: number;
  priority_id?: number;
  subject: string;
  description?: string;
  category_id?: number;
  fixed_version_id?: number;
  assigned_to_id?: number;
  parent_issue_id?: number;
  custom_fields?: {
    id: number;
    value: string | string[] | null;
  }[];
  watcher_user_ids?: number[];
  is_private?: boolean;
  estimated_hours?: number;
  start_date?: string; // YYYY-MM-DD
  due_date?: string; // YYYY-MM-DD
}

export interface RedmineIssueUpdate extends Partial<RedmineIssueCreate> {
  notes?: string; // Add notes during update
  private_notes?: boolean; // Add private notes
}

// Extended parameter interfaces for formatting options
export interface IssueListParamsExtended extends IssueListParams {
  detail_level?: 'brief' | 'full';
  brief_fields?: string; // JSON string of BriefFieldOptions
  max_description_length?: number;
  max_journal_entries?: number;
}

export interface IssueShowParamsExtended {
  include?: string;
  detail_level?: 'brief' | 'full';
  brief_fields?: string; // JSON string of BriefFieldOptions
  max_description_length?: number;
  max_journal_entries?: number;
  [key: string]: string | number | undefined; // Index signature for compatibility
}
