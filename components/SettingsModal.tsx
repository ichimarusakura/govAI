import React, { useState, useEffect } from 'react';
import { X, Check, Moon, Sun, Monitor, Key, Palette } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const THEMES = [
    { 
      id: 'zinc', name: '默认黑', primary: '#3b82f6', // blue-500
      background: '#09090b', // zinc-950
      surface: '#18181b', // zinc-900
      surfaceHighlight: '#27272a', // zinc-800
      border: '#27272a', // zinc-800
      borderHighlight: '#3f3f46', // zinc-700
      textPrimary: '#fafafa', // zinc-50
      textSecondary: '#a1a1aa', // zinc-400
      textMuted: '#71717a' // zinc-500
    },
    { 
      id: 'light', name: '纯净白', primary: '#3b82f6', // blue-500
      background: '#f8fafc', // slate-50
      surface: '#ffffff', // white
      surfaceHighlight: '#f1f5f9', // slate-100
      border: '#e2e8f0', // slate-200
      borderHighlight: '#cbd5e1', // slate-300
      textPrimary: '#0f172a', // slate-900
      textSecondary: '#64748b', // slate-500
      textMuted: '#94a3b8' // slate-400
    },
    { 
      id: 'blue', name: '科技蓝', primary: '#3b82f6', // blue-500
      background: '#0f172a', // slate-900
      surface: '#1e293b', // slate-800
      surfaceHighlight: '#334155', // slate-700
      border: '#1e293b', // slate-800
      borderHighlight: '#334155', // slate-700
      textPrimary: '#f8fafc', // slate-50
      textSecondary: '#94a3b8', // slate-400
      textMuted: '#64748b' // slate-500
    },
    { 
      id: 'purple', name: '深邃紫', primary: '#8b5cf6', // violet-500
      background: '#2e1065', // violet-950
      surface: '#4c1d95', // violet-900
      surfaceHighlight: '#5b21b6', // violet-800
      border: '#4c1d95', // violet-900
      borderHighlight: '#5b21b6', // violet-800
      textPrimary: '#f5f3ff', // violet-50
      textSecondary: '#a78bfa', // violet-400
      textMuted: '#8b5cf6' // violet-500
    },
    { 
      id: 'green', name: '生态绿', primary: '#10b981', // emerald-500
      background: '#022c22', // emerald-950
      surface: '#064e3b', // emerald-900
      surfaceHighlight: '#065f46', // emerald-800
      border: '#064e3b', // emerald-900
      borderHighlight: '#065f46', // emerald-800
      textPrimary: '#ecfdf5', // emerald-50
      textSecondary: '#34d399', // emerald-400
      textMuted: '#10b981' // emerald-500
    },
  ];

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'theme' | 'api'>('theme');
  const [apiKey, setApiKey] = useState('');
  const [apiBaseUrl, setApiBaseUrl] = useState('');
  const [modelName, setModelName] = useState('');
  const [currentTheme, setCurrentTheme] = useState('zinc');

  useEffect(() => {
    // Load saved settings
    try {
        const savedKey = localStorage.getItem('gemini_api_key');
        const savedUrl = localStorage.getItem('gemini_base_url');
        const savedModel = localStorage.getItem('gemini_model_name');
        const savedTheme = localStorage.getItem('app_theme') || 'zinc';
        
        if (savedKey) setApiKey(savedKey);
        if (savedUrl) setApiBaseUrl(savedUrl);
        if (savedModel) setModelName(savedModel);
        setCurrentTheme(savedTheme);
    } catch (e) {
        console.warn('Failed to load settings from localStorage', e);
    }
  }, [isOpen]);

  const handleSaveApi = () => {
    try {
        localStorage.setItem('gemini_api_key', apiKey);
        localStorage.setItem('gemini_base_url', apiBaseUrl);
        localStorage.setItem('gemini_model_name', modelName);
        // Notify user or update state instead of reloading
        alert('配置已保存，请刷新页面以应用更改');
    } catch (e) {
        console.error('Failed to save settings', e);
        alert('保存失败，请检查浏览器设置');
    }
  };

  const handleThemeChange = (themeId: string) => {
    const theme = THEMES.find(t => t.id === themeId);
    if (!theme) return;

    setCurrentTheme(themeId);
    localStorage.setItem('app_theme', themeId);

    // Apply theme variables
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--color-surface', theme.surface);
    root.style.setProperty('--color-surface-highlight', theme.surfaceHighlight);
    root.style.setProperty('--color-border', theme.border);
    root.style.setProperty('--color-border-highlight', theme.borderHighlight);
    root.style.setProperty('--color-text-primary', theme.textPrimary);
    root.style.setProperty('--color-text-secondary', theme.textSecondary);
    root.style.setProperty('--color-text-muted', theme.textMuted);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-surface border border-border rounded-xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <h3 className="text-lg font-semibold text-text-primary">系统设置</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('theme')}
            className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'theme' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-text-muted hover:text-text-primary hover:bg-surface-highlight/50'
            }`}
          >
            <Palette size={16} /> 主题设置
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'api' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5' : 'text-text-muted hover:text-text-primary hover:bg-surface-highlight/50'
            }`}
          >
            <Key size={16} /> 模型配置
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'theme' ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-3">配色方案</label>
                <div className="grid grid-cols-2 gap-3">
                  {THEMES.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        currentTheme === theme.id 
                          ? 'bg-surface-highlight border-blue-500 ring-1 ring-blue-500/50' 
                          : 'bg-background/50 border-border hover:border-border-highlight'
                      }`}
                    >
                      <div 
                        className="w-8 h-8 rounded-full shadow-sm flex items-center justify-center text-white"
                        style={{ background: theme.primary }}
                      >
                         {currentTheme === theme.id && <Check size={14} />}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-text-primary">{theme.name}</div>
                        <div className="text-xs text-text-muted" style={{ color: theme.primary }}>Primary</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex gap-3 text-yellow-500 text-xs">
                 <div className="shrink-0 mt-0.5"><Monitor size={14}/></div>
                 <div>
                    配置将保存在本地浏览器中。请确保您使用的是受信任的设备。
                    <br/>修改后将自动刷新页面生效。
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Model Name</label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="gemini-3-flash-preview"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-blue-500 placeholder:text-text-muted"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">API Endpoint (Base URL)</label>
                <input
                  type="text"
                  value={apiBaseUrl}
                  onChange={(e) => setApiBaseUrl(e.target.value)}
                  placeholder="https://generativelanguage.googleapis.com"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-blue-500 placeholder:text-text-muted"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-blue-500 placeholder:text-text-muted"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSaveApi}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
                >
                  保存并应用
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
