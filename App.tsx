import React, { useState } from 'react';
import AgentView from './components/AgentView';
import ResourceView from './components/ResourceView';
import CockpitView from './components/CockpitView';
import { Bot, Library, LayoutDashboard, Settings, Bell, User, ChevronDown, Landmark } from 'lucide-react';

type MainTab = 'Agent' | 'Resource' | 'Cockpit';
export type ScreenType = 'Governance' | 'Industry';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('Agent');
  const [cockpitScreen, setCockpitScreen] = useState<ScreenType>('Industry');

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden text-zinc-200">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 shadow-sm z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20 hover:scale-105 transition-transform duration-200">
            <Landmark className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">AI政务服务系统</h1>
        </div>

        <div className="flex items-center gap-8">
            {/* Main Tabs - Right Aligned & Simplified */}
            <nav className="flex items-center gap-6">
            <button
                onClick={() => setActiveTab('Agent')}
                className={`flex items-center gap-2 py-2 text-sm font-medium transition-all duration-300 border-b-2 hover:opacity-80 ${
                activeTab === 'Agent' 
                    ? 'border-blue-500 text-white' 
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
            >
                <Bot size={18} /> 智能体
            </button>
            <button
                onClick={() => setActiveTab('Resource')}
                className={`flex items-center gap-2 py-2 text-sm font-medium transition-all duration-300 border-b-2 hover:opacity-80 ${
                activeTab === 'Resource' 
                    ? 'border-blue-500 text-white' 
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
            >
                <Library size={18} /> 资源中心
            </button>
            
            {/* Cockpit Dropdown */}
            <div className="relative group h-full flex items-center">
                <button
                    className={`flex items-center gap-2 py-2 text-sm font-medium transition-all duration-300 border-b-2 hover:opacity-80 ${
                    activeTab === 'Cockpit' 
                        ? 'border-blue-500 text-white' 
                        : 'border-transparent text-zinc-400 hover:text-zinc-200'
                    }`}
                >
                    <LayoutDashboard size={18} /> 驾驶舱 <ChevronDown size={14} className="opacity-50 group-hover:rotate-180 transition-transform duration-300" />
                </button>
                {/* Dropdown Content */}
                <div className="absolute top-full right-0 w-40 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform group-hover:translate-y-1">
                    <div className="bg-surface border border-border rounded-lg shadow-xl overflow-hidden flex flex-col animate-scale-in origin-top-right">
                        <button 
                            onClick={() => { setActiveTab('Cockpit'); setCockpitScreen('Governance'); }}
                            className={`px-4 py-3 text-left text-sm hover:bg-zinc-800 transition-colors ${activeTab === 'Cockpit' && cockpitScreen === 'Governance' ? 'text-blue-500 bg-blue-500/10' : 'text-zinc-300'}`}
                        >
                            综治大屏
                        </button>
                        <button 
                            onClick={() => { setActiveTab('Cockpit'); setCockpitScreen('Industry'); }}
                            className={`px-4 py-3 text-left text-sm hover:bg-zinc-800 transition-colors ${activeTab === 'Cockpit' && cockpitScreen === 'Industry' ? 'text-blue-500 bg-blue-500/10' : 'text-zinc-300'}`}
                        >
                            产业大屏
                        </button>
                    </div>
                </div>
            </div>

            </nav>

            {/* Divider */}
            <div className="h-5 w-px bg-zinc-700"></div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
                <button className="text-zinc-400 hover:text-white transition-colors hover:scale-110 duration-200">
                    <Bell size={20} />
                </button>
                <button className="text-zinc-400 hover:text-white transition-colors hover:scale-110 duration-200">
                    <Settings size={20} />
                </button>
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 text-zinc-300 hover:border-zinc-500 transition-colors cursor-pointer hover:scale-105 duration-200">
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