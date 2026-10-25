import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { TrendingUp, PieChart, Award, Layers } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ChartsSection({ analytics }) {
  if (!analytics) return null;

  const { monthly_trend, category_distribution, platform_distribution, top_games } = analytics;

  // Chart 1: Monthly Hours & Spend Trend
  const monthlyData = {
    labels: monthly_trend.map((m) => m.month),
    datasets: [
      {
        type: 'bar',
        label: 'Часов в игре',
        data: monthly_trend.map((m) => m.hours),
        backgroundColor: 'rgba(139, 92, 246, 0.65)',
        borderColor: '#8b5cf6',
        borderWidth: 1.5,
        borderRadius: 6,
        yAxisID: 'y'
      },
      {
        type: 'line',
        label: 'Расходы ($)',
        data: monthly_trend.map((m) => m.spent),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderWidth: 2.5,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#10b981',
        pointRadius: 4,
        yAxisID: 'y1'
      }
    ]
  };

  const monthlyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#cbd5e1', font: { size: 12 } }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' },
        title: { display: true, text: 'Часы', color: '#94a3b8' }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { color: '#10b981' },
        title: { display: true, text: 'USD ($)', color: '#10b981' }
      }
    }
  };

  // Chart 2: Category Distribution
  const categoryColors = [
    '#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b',
    '#06b6d4', '#6366f1', '#14b8a6', '#f43f5e', '#84cc16'
  ];

  const categoryData = {
    labels: category_distribution.map((c) => c.category),
    datasets: [
      {
        data: category_distribution.map((c) => c.hours),
        backgroundColor: categoryColors.slice(0, category_distribution.length),
        borderColor: '#0f172a',
        borderWidth: 2,
        hoverOffset: 6
      }
    ]
  };

  const categoryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#cbd5e1',
          font: { size: 11 },
          boxWidth: 12
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        callbacks: {
          label: (item) => {
            const cat = category_distribution[item.dataIndex];
            return ` ${cat.category}: ${cat.hours} ч. (${cat.percentage}%)`;
          }
        }
      }
    },
    cutout: '68%'
  };

  // Chart 3: Top Games by Hours
  const topGamesData = {
    labels: top_games.map((g) => g.title),
    datasets: [
      {
        axis: 'y',
        label: 'Часов сыграно',
        data: top_games.map((g) => g.total_hours),
        backgroundColor: 'rgba(59, 130, 246, 0.75)',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };

  const topGamesOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        callbacks: {
          label: (item) => {
            const game = top_games[item.dataIndex];
            return ` ${game.total_hours} ч. (${game.sessions_count} сессий, потрачено $${game.total_spent})`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        grid: { display: false },
        ticks: {
          color: '#cbd5e1',
          font: { size: 12 }
        }
      }
    }
  };

  // Chart 4: Platform Share
  const platformColors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
  const platformData = {
    labels: platform_distribution.map((p) => p.platform),
    datasets: [
      {
        data: platform_distribution.map((p) => p.hours),
        backgroundColor: platformColors.slice(0, platform_distribution.length),
        borderColor: '#0f172a',
        borderWidth: 2
      }
    ]
  };

  const platformOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#cbd5e1', font: { size: 11 }, boxWidth: 12 }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Monthly Dynamics (Full width on small, 8 cols on large) */}
      <div className="lg:col-span-8 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Динамика активности и расходов по месяцам
            </h3>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Часы vs Расходы ($)
          </span>
        </div>
        <div className="h-72 w-full">
          {monthly_trend.length > 0 ? (
            <Bar data={monthlyData} options={monthlyOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              Нет данных за выбранный период
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown (4 cols on large) */}
      <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400">
              <PieChart className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-white">Категории и жанры</h3>
          </div>
        </div>
        <div className="h-72 w-full flex items-center justify-center">
          {category_distribution.length > 0 ? (
            <Doughnut data={categoryData} options={categoryOptions} />
          ) : (
            <div className="text-slate-500 text-sm">Нет данных</div>
          )}
        </div>
      </div>

      {/* Top Games Ranking (7 cols) */}
      <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Рейтинг игр по сыгранным часам (Топ-10)
            </h3>
          </div>
        </div>
        <div className="h-72 w-full">
          {top_games.length > 0 ? (
            <Bar data={topGamesData} options={topGamesOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              Нет данных
            </div>
          )}
        </div>
      </div>

      {/* Platform Distribution (5 cols) */}
      <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Распределение по платформам
            </h3>
          </div>
        </div>
        <div className="h-72 w-full flex items-center justify-center">
          {platform_distribution.length > 0 ? (
            <Doughnut data={platformData} options={platformOptions} />
          ) : (
            <div className="text-slate-500 text-sm">Нет данных</div>
          )}
        </div>
      </div>
    </div>
  );
}
