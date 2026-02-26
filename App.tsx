import React, { useState, useEffect } from 'react';
import AgentView from './components/AgentView';
import ResourceView from './components/ResourceView';
import CockpitView from './components/CockpitView';
import SettingsModal from './components/SettingsModal';
import { Bot, Library, LayoutDashboard, Settings, Bell, User, ChevronDown, Landmark } from 'lucide-react';

type MainTab = 'Agent' | 'Resource' | 'Cockpit';
export type ScreenType = 'Governance' | 'Industry';

const THEMES = [
    { 
      id: 'zinc', name: '默认黑', primary: '#3b82f6', 
      background: '#09090b', surface: '#18181b', surfaceHighlight: '#27272a',
      border: '#27272a', borderHighlight: '#3f3f46',
      textPrimary: '#e4e4e7', textSecondary: '#a1a1aa', textMuted: '#71717a'
    },
    { 
      id: 'light', name: '纯净白', primary: '#3b82f6', 
      background: '#f8fafc', surface: '#ffffff', surfaceHighlight: '#f1f5f9',
      border: '#e2e8f0', borderHighlight: '#cbd5e1',
      textPrimary: '#0f172a', textSecondary: '#475569', textMuted: '#94a3b8'
    },
    { 
      id: 'blue', name: '科技蓝', primary: '#3b82f6', 
      background: '#0f172a', surface: '#1e293b', surfaceHighlight: '#334155',
      border: '#1e293b', borderHighlight: '#334155',
      textPrimary: '#f1f5f9', textSecondary: '#94a3b8', textMuted: '#64748b'
    },
    { 
      id: 'purple', name: '深邃紫', primary: '#8b5cf6', 
      background: '#1e1b4b', surface: '#312e81', surfaceHighlight: '#4338ca',
      border: '#312e81', borderHighlight: '#4338ca',
      textPrimary: '#e0e7ff', textSecondary: '#a5b4fc', textMuted: '#818cf8'
    },
    { 
      id: 'green', name: '生态绿', primary: '#10b981', 
      background: '#022c22', surface: '#064e3b', surfaceHighlight: '#065f46',
      border: '#064e3b', borderHighlight: '#065f46',
      textPrimary: '#ecfdf5', textSecondary: '#6ee7b7', textMuted: '#34d399'
    },
  ];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('Agent');
  const [cockpitScreen, setCockpitScreen] = useState<ScreenType>('Industry');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // Initialize theme
    try {
        const savedThemeId = localStorage.getItem('app_theme') || 'zinc';
        const theme = THEMES.find(t => t.id === savedThemeId);
        if (theme) {
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
        }
    } catch (e) {
        console.warn('Failed to load theme from localStorage', e);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden text-text-primary">
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      
      {/* Top Navigation Bar */}
      <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 shadow-sm z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20 hover:scale-105 transition-transform duration-200">
            <Landmark className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">AI政务服务系统</h1>
        </div>

        <div className="flex items-center gap-8">
            {/* Main Tabs - Right Aligned & Simplified */}
            <nav className="flex items-center gap-6">
            <button
                onClick={() => setActiveTab('Agent')}
                className={`flex items-center gap-2 py-2 text-sm font-medium transition-all duration-300 border-b-2 hover:opacity-80 ${
                activeTab === 'Agent' 
                    ? 'border-blue-500 text-text-primary' 
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
            >
                <Bot size={18} /> 智能体
            </button>
            <button
                onClick={() => setActiveTab('Resource')}
                className={`flex items-center gap-2 py-2 text-sm font-medium transition-all duration-300 border-b-2 hover:opacity-80 ${
                activeTab === 'Resource' 
                    ? 'border-blue-500 text-text-primary' 
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
            >
                <Library size={18} /> 资源中心
            </button>
            
            {/* Cockpit Dropdown */}
            <div className="relative group h-full flex items-center">
                <button
                    className={`flex items-center gap-2 py-2 text-sm font-medium transition-all duration-300 border-b-2 hover:opacity-80 ${
                    activeTab === 'Cockpit' 
                        ? 'border-blue-500 text-text-primary' 
                        : 'border-transparent text-text-secondary hover:text-text-primary'
                    }`}
                >
                    <LayoutDashboard size={18} /> 驾驶舱 <ChevronDown size={14} className="opacity-50 group-hover:rotate-180 transition-transform duration-300" />
                </button>
                {/* Dropdown Content */}
                <div className="absolute top-full right-0 w-40 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform group-hover:translate-y-1">
                    <div className="bg-surface border border-border rounded-lg shadow-xl overflow-hidden flex flex-col animate-scale-in origin-top-right">
                        <button 
                            onClick={() => { setActiveTab('Cockpit'); setCockpitScreen('Governance'); }}
                            className={`px-4 py-3 text-left text-sm hover:bg-surface-highlight transition-colors ${activeTab === 'Cockpit' && cockpitScreen === 'Governance' ? 'text-blue-500 bg-blue-500/10' : 'text-text-secondary'}`}
                        >
                            综治大屏
                        </button>
                        <button 
                            onClick={() => { setActiveTab('Cockpit'); setCockpitScreen('Industry'); }}
                            className={`px-4 py-3 text-left text-sm hover:bg-surface-highlight transition-colors ${activeTab === 'Cockpit' && cockpitScreen === 'Industry' ? 'text-blue-500 bg-blue-500/10' : 'text-text-secondary'}`}
                        >
                            产业大屏
                        </button>
                    </div>
                </div>
            </div>

            </nav>

            {/* Divider */}
            <div className="h-5 w-px bg-border-highlight"></div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
                <button className="text-text-secondary hover:text-text-primary transition-colors hover:scale-110 duration-200">
                    <Bell size={20} />
                </button>
                <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="text-text-secondary hover:text-text-primary transition-colors hover:scale-110 duration-200"
                >
                    <Settings size={20} />
                </button>
                <div className="w-8 h-8 rounded-full bg-surface-highlight flex items-center justify-center border border-border-highlight text-text-secondary hover:border-text-muted transition-colors cursor-pointer hover:scale-105 duration-200">
                    <User size={16} />
                </div>
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main key={activeTab} className="flex-1 overflow-hidden relative bg-background animate-fade-in">
        {activeTab === 'Agent' && <AgentView />}
        {activeTab === 'Resource' && <ResourceView />}
        {activeTab === 'Cockpit' && <CockpitView type={cockpitScreen} />}
      </main>
    </div>
  );
};

export default App;