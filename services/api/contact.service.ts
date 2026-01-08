/**
 * Contact Service
 * Handles API calls for contact-related data
 */

import type { Contact, ContactStatus } from '@/types/crm';
import { authService } from './auth.service';
import { apiClient } from './client';
import { decryptionService } from './decryption';


export class ContactService {
  /**
   * Fetch contacts from the API
   * Note: Using the task endpoint as requested by the user
   */
  async getContacts(page: number = 1, limit: number = 4): Promise<any> {
    try {
      const token = await authService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const endpoint = `/task?page=${page}&limit=${limit}`;
      
      const response = await apiClient.get<any>(endpoint, token);
      
      let processedData = response;
      if (typeof response === 'string' && response.includes('gAAAAA')) {
        const match = response.match(/gAAAAA[a-zA-Z0-9\-_=]+/);
        if (match) {
          const decryptedStr = decryptionService.decrypt(match[0]);
          processedData = JSON.parse(decryptedStr);
        }
      } else if (response && response.data && typeof response.data === 'string' && response.data.includes('gAAAAA')) {
        const match = response.data.match(/gAAAAA[a-zA-Z0-9\-_=]+/);
        if (match) {
          const decryptedStr = decryptionService.decrypt(match[0]);
          processedData = { ...response, data: JSON.parse(decryptedStr) };
        }
      }

      return processedData;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  /**
   * Fetch a single contact (task) by ID
   */
  async getContact(id: string): Promise<Contact | null> {
    try {
      const token = await authService.getToken();
      if (!token) throw new Error('No token');

      // Typically /task/:id for single item
      const endpoint = `/task/${id}`;
      const response = await apiClient.get<any>(endpoint, token);
      
      let processedData = response;
      // Handle same decryption logic for single item if needed
      if (typeof response === 'string' && response.includes('gAAAAA')) {
          const match = response.match(/gAAAAA[a-zA-Z0-9\-_=]+/);
          if (match) {
            const decryptedStr = decryptionService.decrypt(match[0]);
            processedData = JSON.parse(decryptedStr);
          }
      } else if (response?.data && typeof response.data === 'string' && response.data.includes('gAAAAA')) {
          const match = response.data.match(/gAAAAA[a-zA-Z0-9\-_=]+/);
          if (match) {
            const decryptedStr = decryptionService.decrypt(match[0]);
            processedData = { ...response, data: JSON.parse(decryptedStr) };
          }
      }

      // If data is wrapped in another object, extract it
      const item = processedData.data || processedData;
      return this.mapToContact(item);
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error);
      return null;
    }
  }

  /**
   * Shared mapping logic to convert API task response to Contact type
   */
  mapToContact(item: any): Contact {
    const formData = item.form_data || item;

    // Safely extract status label
    let statusLabel = "active";
    if (typeof item.status === "string") {
      statusLabel = item.status.toLowerCase();
    } else if (item.status && typeof item.status.name === "string") {
      statusLabel = item.status.name.toLowerCase();
    } else if (item.status && typeof item.status.key === "string") {
      statusLabel = item.status.key.toLowerCase();
    }

    // Map to valid ContactStatus
    const validStatuses: ContactStatus[] = ["active", "inactive", "lead", "customer", "prospect"];
    const normalizedStatus: ContactStatus = validStatuses.includes(statusLabel as any)
      ? (statusLabel as ContactStatus)
      : "active";

    // Safely extract name
    let name = "Unknown";
    if (typeof formData.name === "string") {
      name = formData.name;
    } else if (formData.name && typeof formData.name.name === "string") {
      name = formData.name.name;
    } else if (typeof item.title === "string") {
      name = item.title;
    }

    return {
      id: String(item.id || item._id || Math.random()),
      firstName: name,
      lastName: "",
      email: typeof formData.email === "string" ? formData.email : "",
      phone: typeof formData.phone === "string" ? formData.phone : "",
      company: typeof formData.company === "string" ? formData.company : "No Company",
      status: normalizedStatus,
      tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
      dateAdded: new Date(item.created_at || item.createdAt || Date.now()),
      // Additional data from API
      notes: typeof item.description === 'string' ? item.description : undefined,
    };
  }

}

export const contactService = new ContactService();
