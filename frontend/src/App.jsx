import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import KpiCards from './components/KpiCards';
import FiltersBar from './components/FiltersBar';
import ChartsSection from './components/ChartsSection';
import ActivityTable from './components/ActivityTable';
import FileUploader from './components/FileUploader';
import AddActivityModal from './components/AddActivityModal';
import { api } from './services/api';
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export default function App() {
  const [analytics, setAnalytics] = useState(null);
  const [activitiesData, setActivitiesData] = useState({ items: [], total: 0, skip: 0, limit: 15 });
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    platform: 'all',
    startDate: '',
    endDate: ''
  });

  const [loading, setLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  const [toast, setToast] = useState(null);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch Dashboard Data
  const loadData = useCallback(async (currentFilters = filters, skip = 0) => {
    try {
      setLoading(true);
      const [analyticsRes, activitiesRes] = await Promise.all([
        api.getAnalytics(currentFilters),
        api.getActivities({ ...currentFilters, skip, limit: activitiesData.limit })
      ]);
      setAnalytics(analyticsRes);
      setActivitiesData(activitiesRes);
    } catch (err) {
      showToast(err.message || 'Ошибка загрузки данных', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, activitiesData.limit]);

  useEffect(() => {
    loadData(filters, 0);
  }, [filters]);

  const handleFilterChange = (newValues) => {
    setFilters((prev) => ({ ...prev, ...newValues }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      platform: 'all',
      startDate: '',
      endDate: ''
    });
  };

  const handlePageChange = (newSkip) => {
    loadData(filters, newSkip);
  };

  const handleFileUpload = async (file) => {
    const res = await api.uploadFile(file);
    showToast(res.message);
    loadData(filters, 0);
  };

  const handleLoadSample = async () => {
    try {
      setIsLoadingSample(true);
      const res = await api.loadSampleData();
      showToast(res.message);
      loadData(filters, 0);
    } catch (err) {
      showToast(err.message || 'Не удалось загрузить демо-данные', 'error');
    } finally {
      setIsLoadingSample(false);
    }
  };

  const handleAddActivity = async (activityData) => {
    await api.createActivity(activityData);
    showToast('Активность успешно сохранена!');
    loadData(filters, 0);
  };

  const handleDeleteActivity = async (id) => {
    if (!window.confirm('Удалить эту запись?')) return;
    try {
      await api.deleteActivity(id);
      showToast('Запись удалена');
      loadData(filters, activitiesData.skip);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить ВСЕ записи? Это действие необратимо.')) return;
    try {
      setIsClearing(true);
      const res = await api.deleteAllActivities();
      showToast(res.message);
      loadData(filters, 0);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-sm border backdrop-blur-md animate-bounce-once ${
            toast.type === 'error'
              ? 'bg-red-950/90 border-red-800 text-red-200'
              : 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
          ) : (
            <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenAdd={() => setIsAddOpen(true)}
        onLoadSample={handleLoadSample}
        onClearAll={handleClearAll}
        isClearing={isClearing}
        isLoadingSample={isLoadingSample}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Summary Cards */}
        {analytics && <KpiCards kpis={analytics.kpis} />}

        {/* Filters and Search Bar */}
        {analytics && (
          <FiltersBar
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            categories={analytics.categories_list}
            platforms={analytics.platforms_list}
          />
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex items-center justify-center py-6 space-x-2 text-sm text-purple-400">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Обновление аналитики...</span>
          </div>
        )}

        {/* Charts Section */}
        {analytics && <ChartsSection analytics={analytics} />}

        {/* Activity Table */}
        <ActivityTable
          activities={activitiesData.items}
          total={activitiesData.total}
          skip={activitiesData.skip}
          limit={activitiesData.limit}
          onPageChange={handlePageChange}
          onDelete={handleDeleteActivity}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <p>
          Gaming & Activity Personal Analytics Dashboard • Построено на{' '}
          <span className="text-slate-400">FastAPI, pandas, PostgreSQL/SQLite, React & Chart.js</span>
        </p>
      </footer>

      {/* Modals */}
      <FileUploader
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleFileUpload}
        onLoadSample={handleLoadSample}
      />

      <AddActivityModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddActivity={handleAddActivity}
      />
    </div>
  );
}
