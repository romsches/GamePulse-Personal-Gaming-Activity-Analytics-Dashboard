/**
 * REST API client service for GamePulse Analytics Dashboard.
 *
 * Provides typed abstraction methods over backend FastAPI endpoints.
 */

const API_BASE = '/api';

export const api = {
  /**
   * Fetch aggregated analytics metrics, KPI summaries, and chart time-series.
   *
   * @param {Object} params - Query parameters (startDate, endDate, category, platform, search)
   * @returns {Promise<Object>} Aggregated analytics data payload
   */
  async getAnalytics(params = {}) {
    const query = new URLSearchParams();
    if (params.startDate) query.append('start_date', params.startDate);
    if (params.endDate) query.append('end_date', params.endDate);
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.platform && params.platform !== 'all') query.append('platform', params.platform);
    if (params.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE}/analytics?${query.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to fetch analytics' }));
      throw new Error(err.detail || 'Failed to fetch analytics metrics');
    }
    return res.json();
  },

  /**
   * Fetch paginated and filtered activity records.
   *
   * @param {Object} params - Query parameters (skip, limit, search, category, platform, startDate, endDate)
   * @returns {Promise<Object>} Paginated records and total count
   */
  async getActivities(params = {}) {
    const query = new URLSearchParams({
      skip: params.skip || 0,
      limit: params.limit || 15
    });
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.platform && params.platform !== 'all') query.append('platform', params.platform);
    if (params.startDate) query.append('start_date', params.startDate);
    if (params.endDate) query.append('end_date', params.endDate);

    const res = await fetch(`${API_BASE}/activities?${query.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to fetch activities' }));
      throw new Error(err.detail || 'Failed to fetch activity records');
    }
    return res.json();
  },

  /**
   * Create a new activity session or expenditure record.
   *
   * @param {Object} activity - Activity payload matching ActivityCreate schema
   * @returns {Promise<Object>} Created activity entity
   */
  async createActivity(activity) {
    const res = await fetch(`${API_BASE}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to create' }));
      throw new Error(err.detail || 'Failed to create activity record');
    }
    return res.json();
  },

  /**
   * Delete a single activity record by its primary key.
   *
   * @param {number} id - Activity primary key
   * @returns {Promise<Object>} Deletion status confirmation
   */
  async deleteActivity(id) {
    const res = await fetch(`${API_BASE}/activities/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to delete' }));
      throw new Error(err.detail || 'Failed to delete activity record');
    }
    return res.json();
  },

  /**
   * Truncate and purge all activity records in database.
   *
   * @returns {Promise<Object>} Deletion result summary
   */
  async deleteAllActivities() {
    const res = await fetch(`${API_BASE}/activities`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to clear data' }));
      throw new Error(err.detail || 'Failed to clear activity data');
    }
    return res.json();
  },

  /**
   * Upload and ingest a CSV or JSON dataset file.
   *
   * @param {File} file - CSV or JSON file instance
   * @returns {Promise<Object>} Ingestion batch summary
   */
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(err.detail || 'Upload failed');
    }
    return res.json();
  },

  /**
   * Seed the database with the bundled multi-month demo dataset.
   *
   * @returns {Promise<Object>} Ingestion confirmation
   */
  async loadSampleData() {
    const res = await fetch(`${API_BASE}/upload/load-sample`, {
      method: 'POST'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Load sample failed' }));
      throw new Error(err.detail || 'Failed to load sample dataset');
    }
    return res.json();
  }
};
