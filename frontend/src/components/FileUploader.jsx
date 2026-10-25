import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

export default function FileUploader({ isOpen, onClose, onUploadSuccess, onLoadSample }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    setError(null);
    setSuccessMsg(null);
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'csv' && ext !== 'json') {
      setError('Поддерживаются только файлы форматов .csv и .json');
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);
    try {
      await onUploadSuccess(selectedFile);
      setSuccessMsg(`Файл ${selectedFile.name} успешно загружен и обработан!`);
      setSelectedFile(null);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки файла');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Загрузка данных активности</h3>
            <p className="text-xs text-slate-400">Импорт истории игр из CSV или JSON файла</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-800 rounded-xl flex items-center space-x-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-950/50 border border-emerald-800 rounded-xl flex items-center space-x-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Drag & Drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
            dragActive
              ? 'border-purple-500 bg-purple-950/20'
              : 'border-slate-700 hover:border-slate-500 bg-slate-800/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, .json"
            onChange={handleFileChange}
            className="hidden"
          />

          <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-200">
            Перетащите сюда файл или <span className="text-purple-400 underline">выберите с диска</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">Поддерживаются .CSV и .JSON (до 15 МБ)</p>

          {selectedFile && (
            <div className="mt-4 p-3 bg-purple-950/40 border border-purple-800/60 rounded-xl inline-flex items-center space-x-2 text-xs text-purple-200">
              <FileText className="w-4 h-4 text-purple-400" />
              <span className="font-semibold">{selectedFile.name}</span>
              <span className="text-slate-400">({(selectedFile.size / 1024).toFixed(1)} КБ)</span>
            </div>
          )}
        </div>

        {/* Schema Guide info */}
        <div className="mt-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300">Ожидаемые поля:</p>
          <p className="font-mono text-[11px] text-slate-300">
            title, category, platform, date, hours_played, money_spent, rating, notes
          </p>
          <p className="text-[11px] text-slate-500">
            * Приложение автоматически сопоставляет синонимы (game, genre, hours, cost, price).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => {
              onLoadSample();
              onClose();
            }}
            className="inline-flex items-center text-xs text-indigo-400 hover:text-indigo-300 transition"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Загрузить готовый демо-датасет
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition"
            >
              Отмена
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 rounded-xl shadow-lg shadow-purple-600/20 transition"
            >
              {uploading ? 'Импорт...' : 'Импортировать'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
