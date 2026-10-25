const API_BASE = '/api';

export const api = {
  // Analytics
  async getAnalytics(params = {}) {
    const query = new URLSearchParams();
    if (params.startDate) query.append('start_date', params.startDate);
    if (params.endDate) query.append('end_date', params.endDate);
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.platform && params.platform !== 'all') query.append('platform', params.platform);
    if (params.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE}/analytics?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  // Activities
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
    if (!res.ok) throw new Error('Failed to fetch activities');
    return res.json();
  },

  async createActivity(activity) {
    const res = await fetch(`${API_BASE}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to create' }));
      throw new Error(err.detail || 'Failed to create activity');
    }
    return res.json();
  },

  async deleteActivity(id) {
    const res = await fetch(`${API_BASE}/activities/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete activity');
    return res.json();
  },

  async deleteAllActivities() {
    const res = await fetch(`${API_BASE}/activities`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to clear data');
    return res.json();
  },

  // File Upload
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

  // Load bundled demo dataset
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
