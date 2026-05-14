import { supabase } from './supabase';
import { resources as mockResources, Resource } from './resources-data';

// --- Constants ---
const DB_TABLE_NAME = 'resources';
const RESOURCE_CODE_PREFIX = 'Dslogs-';
const PADDING_LENGTH = 3;
const IS_SUPABASE_CONFIGURED = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

// --- Types ---
export type ResourceFormData = Omit<Resource, 'id' | 'code' | 'date'>;

/**
 * Clean Code Refactor: ResourceService
 * 
 * Refactor Decisions:
 * 1. Extracted constants for magic strings and configuration.
 * 2. Implemented SRP by separating code generation from data fetching.
 * 3. Simplified code generation logic using standard String.padStart.
 * 4. Improved error handling with clear logging and meaningful returns.
 * 5. Reduced duplication by centralizing Supabase availability checks.
 */

export class ResourceService {
  
  /**
   * Fetches all resources from the configured provider (Supabase or Mock).
   */
  static async getAll(): Promise<Resource[]> {
    if (!IS_SUPABASE_CONFIGURED) return mockResources;

    try {
      const { data, error } = await supabase
        .from(DB_TABLE_NAME)
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return (data as Resource[]) || [];
    } catch (error) {
      console.error('[ResourceService] Fetch All Failed:', error);
      return mockResources;
    }
  }

  /**
   * Finds a resource by its unique access code (case-insensitive).
   */
  static async getByCode(code: string): Promise<Resource | undefined> {
    const normalizedCode = code.trim().toLowerCase();

    if (!IS_SUPABASE_CONFIGURED) {
      return mockResources.find(r => r.code.toLowerCase() === normalizedCode);
    }

    try {
      // Primary attempt: Single match
      const { data, error } = await supabase
        .from(DB_TABLE_NAME)
        .select('*')
        .eq('code', code)
        .single();

      if (!error && data) return data as Resource;

      // Fallback: Case-insensitive scan
      const all = await this.getAll();
      return all.find(r => r.code.toLowerCase() === normalizedCode);
    } catch (err) {
      console.error('[ResourceService] Fetch By Code Failed:', err);
      return undefined;
    }
  }

  /**
   * Creates a new resource with an auto-generated sequential code.
   */
  static async create(formData: ResourceFormData): Promise<Resource | null> {
    const currentResources = await this.getAll();
    const formattedCode = this.generateNextCode(currentResources.length);
    
    const resourceToSave = {
      ...formData,
      code: formattedCode,
      date: new Date().toISOString().split('T')[0]
    };

    if (!IS_SUPABASE_CONFIGURED) {
      return this.createMockResource(resourceToSave);
    }

    return this.persistToSupabase(resourceToSave);
  }

  /**
   * Updates an existing resource.
   */
  static async update(id: string, formData: Partial<Resource>): Promise<Resource | null> {
    if (!IS_SUPABASE_CONFIGURED) {
      const idx = mockResources.findIndex(r => r.id === id);
      if (idx !== -1) {
        mockResources[idx] = { ...mockResources[idx], ...formData };
        return mockResources[idx];
      }
      return null;
    }

    try {
      const { data, error } = await supabase
        .from(DB_TABLE_NAME)
        .update(formData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Resource;
    } catch (err) {
      console.error('[ResourceService] Update Failed:', err);
      return null;
    }
  }

  /**
   * Deletes a resource by its unique ID.
   */
  static async delete(id: string): Promise<boolean> {
    if (!IS_SUPABASE_CONFIGURED) return true;

    try {
      const { error } = await supabase
        .from(DB_TABLE_NAME)
        .delete()
        .eq('id', id);

      return !error;
    } catch (error) {
      console.error('[ResourceService] Delete Failed:', error);
      return false;
    }
  }

  /**
   * Deletes multiple resources by their IDs.
   */
  static async bulkDelete(ids: string[]): Promise<boolean> {
    if (!IS_SUPABASE_CONFIGURED) return true;

    try {
      const { error } = await supabase
        .from(DB_TABLE_NAME)
        .delete()
        .in('id', ids);

      return !error;
    } catch (error) {
      console.error('[ResourceService] Bulk Delete Failed:', error);
      return false;
    }
  }

  /**
   * Exports resources to a CSV file.
   */
  static exportToCSV(resources: Resource[]) {
    const headers = ['Code', 'Title', 'Category', 'Date', 'Instagram URL'];
    const rows = resources.map(r => [
      r.code,
      `"${r.title.replace(/"/g, '""')}"`,
      r.category,
      r.date,
      r.instagram_url
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `dslogs-resources-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // --- Private Helper Methods ---

  private static generateNextCode(currentCount: number): string {
    const nextSequence = currentCount + 1;
    const paddedNumber = String(nextSequence).padStart(PADDING_LENGTH, '0');
    return `${RESOURCE_CODE_PREFIX}${paddedNumber}`;
  }

  private static createMockResource(resource: any): Resource {
    const mockId = Math.random().toString(36).substring(2, 11);
    const newResource = { ...resource, id: mockId } as Resource;
    console.log('[ResourceService] Created Mock Resource:', newResource);
    return newResource;
  }

  private static async persistToSupabase(resource: any): Promise<Resource | null> {
    try {
      const { data, error } = await supabase
        .from(DB_TABLE_NAME)
        .insert([resource])
        .select()
        .single();

      if (error) throw error;
      return data as Resource;
    } catch (err) {
      console.error('[ResourceService] Persistence Failed:', err);
      return null;
    }
  }
}
