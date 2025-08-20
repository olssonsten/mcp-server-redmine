import { jest, expect, describe, it, beforeEach } from '@jest/globals';
import { selectFields, skipEmptyCustomFields } from '../field-selector.js';
import type { RedmineIssue } from '../../lib/types/issues/types.js';
import type { BriefFieldOptions } from '../format-options.js';

describe('Field Selector', () => {
  let mockIssue: RedmineIssue;

  beforeEach(() => {
    mockIssue = {
      id: 1,
      subject: 'Test Issue',
      project: { id: 1, name: 'Test Project' },
      tracker: { id: 1, name: 'Bug' },
      status: { id: 1, name: 'New' },
      priority: { id: 2, name: 'Normal' },
      author: { id: 1, name: 'Test User' },
      assigned_to: { id: 2, name: 'Assigned User' },
      category: { id: 1, name: 'Test Category' },
      fixed_version: { id: 1, name: 'Version 1.0' },
      parent: { id: 2 },
      description: 'This is a test issue description',
      start_date: '2024-01-01',
      due_date: '2024-01-31',
      done_ratio: 50,
      estimated_hours: 8,
      spent_hours: 4,
      custom_fields: [
        { id: 1, name: 'Custom Field 1', value: 'Value 1' },
        { id: 2, name: 'Custom Field 2', value: null },
        { id: 3, name: 'Custom Field 3', value: '' },
        { id: 4, name: 'Custom Field 4', value: ['Option 1', 'Option 2'] }
      ],
      created_on: '2024-01-01T10:00:00Z',
      updated_on: '2024-01-15T15:30:00Z',
      closed_on: null,
      journals: [
        {
          id: 1,
          user: { id: 1, name: 'Test User' },
          notes: 'First comment',
          created_on: '2024-01-02T10:00:00Z',
          details: []
        }
      ],
      relations: [
        {
          id: 1,
          issue_id: 1,
          issue_to_id: 3,
          relation_type: 'relates',
          delay: null
        }
      ]
    };
  });

  describe('selectFields', () => {
    it('should return all fields when all options are true', () => {
      const options: BriefFieldOptions = {
        assignee: true,
        description: true,
        custom_fields: true,
        dates: true,
        category: true,
        version: true,
        time_tracking: true,
        journals: true,
        relations: true,
        attachments: true
      };

      const result = selectFields(mockIssue, options);

      // Should include all core fields
      expect(result.id).toBe(mockIssue.id);
      expect(result.subject).toBe(mockIssue.subject);
      expect(result.project).toEqual(mockIssue.project);
      expect(result.tracker).toEqual(mockIssue.tracker);
      expect(result.status).toEqual(mockIssue.status);
      expect(result.priority).toEqual(mockIssue.priority);
      expect(result.author).toEqual(mockIssue.author);
      
      // Should include optional fields when enabled
      expect(result.assigned_to).toEqual(mockIssue.assigned_to);
      expect(result.description).toBe(mockIssue.description);
      expect(result.category).toEqual(mockIssue.category);
      expect(result.fixed_version).toEqual(mockIssue.fixed_version);
      expect(result.start_date).toBe(mockIssue.start_date);
      expect(result.due_date).toBe(mockIssue.due_date);
      expect(result.created_on).toBe(mockIssue.created_on);
      expect(result.updated_on).toBe(mockIssue.updated_on);
      expect(result.done_ratio).toBe(mockIssue.done_ratio);
      expect(result.estimated_hours).toBe(mockIssue.estimated_hours);
      expect(result.spent_hours).toBe(mockIssue.spent_hours);
      expect(result.journals).toEqual(mockIssue.journals);
      expect(result.relations).toEqual(mockIssue.relations);
      
      // Custom fields should be filtered (empty ones removed)
      expect(result.custom_fields).toHaveLength(2); // Only non-empty ones
    });

    it('should exclude assignee when assignee is false', () => {
      const options: BriefFieldOptions = {
        assignee: false
      };

      const result = selectFields(mockIssue, options);

      expect(result.assigned_to).toBeUndefined();
      expect(result.id).toBe(mockIssue.id);
      expect(result.subject).toBe(mockIssue.subject);
    });

    it('should exclude description when description is false', () => {
      const options: BriefFieldOptions = {
        description: false
      };

      const result = selectFields(mockIssue, options);

      expect(result.description).toBeUndefined();
      expect(result.id).toBe(mockIssue.id);
    });

    it('should exclude custom_fields when custom_fields is false', () => {
      const options: BriefFieldOptions = {
        custom_fields: false
      };

      const result = selectFields(mockIssue, options);

      expect(result.custom_fields).toBeUndefined();
      expect(result.id).toBe(mockIssue.id);
    });

    it('should exclude date fields when dates is false', () => {
      const options: BriefFieldOptions = {
        dates: false
      };

      const result = selectFields(mockIssue, options);

      expect(result.start_date).toBeUndefined();
      expect(result.due_date).toBeUndefined();
      expect(result.created_on).toBeUndefined();
      expect(result.updated_on).toBeUndefined();
      expect(result.closed_on).toBeUndefined();
      expect(result.id).toBe(mockIssue.id);
    });

    it('should exclude category when category is false', () => {
      const options: BriefFieldOptions = {
        category: false
      };

      const result = selectFields(mockIssue, options);

      expect(result.category).toBeUndefined();
      expect(result.id).toBe(mockIssue.id);
    });

    it('should exclude version when version is false', () => {
      const options: BriefFieldOptions = {
        version: false
      };

      const result = selectFields(mockIssue, options);

      expect(result.fixed_version).toBeUndefined();
      expect(result.id).toBe(mockIssue.id);
    });

    it('should exclude time tracking fields when time_tracking is false', () => {
      const options: BriefFieldOptions = {
        time_tracking: false
      };

      const result = selectFields(mockIssue, options);

      expect(result.done_ratio).toBeUndefined();
      expect(result.estimated_hours).toBeUndefined();
      expect(result.spent_hours).toBeUndefined();
      expect(result.id).toBe(mockIssue.id);
    });

    it('should exclude journals when journals is false', () => {
      const options: BriefFieldOptions = {
        journals: false
      };

      const result = selectFields(mockIssue, options);

      expect(result.journals).toBeUndefined();
      expect(result.id).toBe(mockIssue.id);
    });

    it('should exclude relations when relations is false', () => {
      const options: BriefFieldOptions = {
        relations: false
      };

      const result = selectFields(mockIssue, options);

      expect(result.relations).toBeUndefined();
      expect(result.id).toBe(mockIssue.id);
    });

    it('should always preserve core fields regardless of options', () => {
      const options: BriefFieldOptions = {
        assignee: false,
        description: false,
        custom_fields: false,
        dates: false,
        category: false,
        version: false,
        time_tracking: false,
        journals: false,
        relations: false,
        attachments: false
      };

      const result = selectFields(mockIssue, options);

      // Core fields should always be present
      expect(result.id).toBe(mockIssue.id);
      expect(result.subject).toBe(mockIssue.subject);
      expect(result.project).toEqual(mockIssue.project);
      expect(result.tracker).toEqual(mockIssue.tracker);
      expect(result.status).toEqual(mockIssue.status);
      expect(result.priority).toEqual(mockIssue.priority);
      expect(result.author).toEqual(mockIssue.author);
    });

    it('should handle undefined options gracefully', () => {
      const options: BriefFieldOptions = {};

      const result = selectFields(mockIssue, options);

      // Should only include core fields when options are empty/undefined
      expect(result.id).toBe(mockIssue.id);
      expect(result.subject).toBe(mockIssue.subject);
      expect(result.project).toEqual(mockIssue.project);
      expect(result.tracker).toEqual(mockIssue.tracker);
      expect(result.status).toEqual(mockIssue.status);
      expect(result.priority).toEqual(mockIssue.priority);
      expect(result.author).toEqual(mockIssue.author);
      
      // Optional fields should be undefined when not explicitly enabled
      expect(result.assigned_to).toBeUndefined();
      expect(result.description).toBeUndefined();
    });

    it('should handle issue without optional fields', () => {
      const minimalIssue: RedmineIssue = {
        id: 1,
        subject: 'Minimal Issue',
        project: { id: 1, name: 'Test Project' },
        tracker: { id: 1, name: 'Bug' },
        status: { id: 1, name: 'New' },
        priority: { id: 2, name: 'Normal' },
        author: { id: 1, name: 'Test User' },
        done_ratio: 0,
        created_on: '2024-01-01T10:00:00Z',
        updated_on: '2024-01-01T10:00:00Z'
      };

      const options: BriefFieldOptions = {
        assignee: true,
        description: true,
        custom_fields: true
      };

      const result = selectFields(minimalIssue, options);

      expect(result.id).toBe(minimalIssue.id);
      expect(result.assigned_to).toBeUndefined();
      expect(result.description).toBeUndefined();
      expect(result.custom_fields).toBeUndefined();
    });
  });

  describe('skipEmptyCustomFields', () => {
    it('should filter out custom fields with null values', () => {
      const customFields = [
        { id: 1, name: 'Field 1', value: 'Value 1' },
        { id: 2, name: 'Field 2', value: null },
        { id: 3, name: 'Field 3', value: 'Value 3' }
      ];

      const result = skipEmptyCustomFields(customFields);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 1, name: 'Field 1', value: 'Value 1' });
      expect(result[1]).toEqual({ id: 3, name: 'Field 3', value: 'Value 3' });
    });

    it('should filter out custom fields with empty string values', () => {
      const customFields = [
        { id: 1, name: 'Field 1', value: 'Value 1' },
        { id: 2, name: 'Field 2', value: '' },
        { id: 3, name: 'Field 3', value: 'Value 3' }
      ];

      const result = skipEmptyCustomFields(customFields);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 1, name: 'Field 1', value: 'Value 1' });
      expect(result[1]).toEqual({ id: 3, name: 'Field 3', value: 'Value 3' });
    });

    it('should keep custom fields with array values', () => {
      const customFields = [
        { id: 1, name: 'Field 1', value: ['Option 1', 'Option 2'] },
        { id: 2, name: 'Field 2', value: null },
        { id: 3, name: 'Field 3', value: [] }
      ];

      const result = skipEmptyCustomFields(customFields);

      // Empty arrays are filtered out by the implementation
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ id: 1, name: 'Field 1', value: ['Option 1', 'Option 2'] });
    });

    it('should keep custom fields with zero values', () => {
      const customFields = [
        { id: 1, name: 'Field 1', value: '0' },
        { id: 2, name: 'Field 2', value: 'false' },
        { id: 3, name: 'Field 3', value: null }
      ];

      const result = skipEmptyCustomFields(customFields);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 1, name: 'Field 1', value: '0' });
      expect(result[1]).toEqual({ id: 2, name: 'Field 2', value: 'false' });
    });

    it('should return empty array when all fields are empty', () => {
      const customFields = [
        { id: 1, name: 'Field 1', value: null },
        { id: 2, name: 'Field 2', value: '' },
        { id: 3, name: 'Field 3', value: null }
      ];

      const result = skipEmptyCustomFields(customFields);

      expect(result).toHaveLength(0);
    });

    it('should handle empty input array', () => {
      const customFields: Array<{ id: number; name: string; value: string | string[] | null }> = [];

      const result = skipEmptyCustomFields(customFields);

      expect(result).toHaveLength(0);
    });

    it('should preserve original objects without mutation', () => {
      const customFields = [
        { id: 1, name: 'Field 1', value: 'Value 1' },
        { id: 2, name: 'Field 2', value: null }
      ];

      const result = skipEmptyCustomFields(customFields);

      expect(result[0]).toEqual(customFields[0]);
      expect(result[0]).toBe(customFields[0]); // filter() returns same object references
      expect(customFields[1].value).toBe(null); // Original should be unchanged
    });
  });
});
