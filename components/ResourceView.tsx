
import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, MoreHorizontal, FileText, 
  Trash2, Download, Upload, Star, BarChart2,
  BookOpen, Folder, Calendar, Tag, ChevronDown, X,
  Plus, ArrowLeft, RefreshCw, Eye, Activity, FileSearch,
  ToggleLeft, ToggleRight, Loader2, Table, MousePointerClick,
  CheckCircle2, AlertCircle, Settings2, Wand2, Save, LayoutTemplate,
  ChevronRight, ArrowRight, Database, Clock, File
} from 'lucide-react';
import { Policy, ModelText, Indicator, Report } from '../types';

type ResourceTab = 'Knowledge' | 'Policy' | 'ModelText' | 'Indicator' | 'Case' | 'MyLibrary';

// --- TYPES ---
interface KnowledgeBase {
    id: string;
    name: string;
    description: string;
    docCount: number;
    appCount: number;
    lastEdited: string;
    enabled: boolean;
    icon: string;
    color: string;
    tags?: string[];
    author?: string;
    editTime?: string;
    customTags?: string[];
}

interface ColumnConfig {
    index: number;
    name: string;
    description: string;
    type: 'String' | 'Number' | 'Date' | 'Boolean' | 'Currency';
    attribute: 'Original' | 'Calculated';
}

interface ConfigTemplate {
    id: string;
    name: string;
    configs: Partial<ColumnConfig>[]; // Stores partial configs to match by name or index
}

// --- MOCK DATA ---
const MOCK_KNOWLEDGE_BASES: KnowledgeBase[] = [
    { 
        id: '1', 
        name: 'ai_studio_code.txt', 
        description: 'useful for when you want to answer queries about the ai_studio_code.txt', 
        docCount: 1, 
        appCount: 0, 
        lastEdited: '22 天前', 
        enabled: true, 
        icon: '🤖', 
        color: 'bg-orange-100 text-orange-600',
        tags: ['通用', '高质量 · 向量检索'],
        author: 'Dify',
        editTime: '22 天前'
    },
    { 
        id: '2', 
        name: 'MN_房地产产业.xlsx', 
        description: 'useful for when you want to answer queries about the MN_房地产产业.xlsx', 
        docCount: 3, 
        appCount: 0, 
        lastEdited: '7 个月前', 
        enabled: true, 
        icon: '🤖', 
        color: 'bg-orange-100 text-orange-600',
        tags: ['父子', '高质量 · 混合检索'],
        author: 'Dify',
        editTime: '7 个月前',
        customTags: ['3434', '22', '热热热', '喂喂喂']
    },
    { 
        id: '3', 
        name: '统计局', 
        description: '', 
        docCount: 1, 
        appCount: 0, 
        lastEdited: '7 个月前', 
        enabled: true, 
        icon: '🤖', 
        color: 'bg-orange-100 text-orange-600',
        tags: ['通用', '高质量 · 混合检索'],
        author: 'Dify',
        editTime: '7 个月前',
        customTags: ['热热热']
    },
    { 
        id: '4', 
        name: '调研报告_党建_X县破解基层治理“小...', 
        description: 'useful for when you want to answer queries about the 调研报告_党建_X县破解基层治理“小马拉大车”突出问题的调研报...', 
        docCount: 3, 
        appCount: 0, 
        lastEdited: '9 个月前', 
        enabled: true, 
        icon: '🤖', 
        color: 'bg-orange-100 text-orange-600',
        tags: ['父子', '高质量 · 混合检索'],
        author: 'Dify',
        editTime: '9 个月前'
    },
    { 
        id: '5', 
        name: '鸠江区人民政府办公室关于印发《芜湖市...', 
        description: 'useful for when you want to answer queries about the 鸠江区人民政府办公室关于印发《芜湖市鸠江区安全生产委托执法...', 
        docCount: 1, 
        appCount: 0, 
        lastEdited: '9 个月前', 
        enabled: true, 
        icon: '🤖', 
        color: 'bg-orange-100 text-orange-600',
        tags: ['父子', '高质量 · 向量检索'],
        author: 'Dify',
        editTime: '9 个月前'
    },
];

const MOCK_POLICIES: Policy[] = [
  { id: '1', title: '工业数字化转型行动计划', date: '2023-11-15', organ: '工信部', region: '全国', type: '法规', source: '系统数据' },
  { id: '2', title: '关于本市纺织行业补贴通知', date: '2024-01-20', organ: '市政府', region: '杭州', type: '通知', source: '用户上传' },
  { id: '3', title: '2024年环境保护标准', date: '2023-12-05', organ: '环保局', region: '全国', type: '标准', source: '系统数据' },
];

const MOCK_MODEL_TEXTS: ModelText[] = [
  { id: '1', title: '技术转让标准合同', abstract: '企业与研究机构之间技术转让协议的标准模板。', type: '法定范文', uploader: '管理员', isFavorite: true },
  { id: '2', title: '年度安全检查报告模板', abstract: '用于进行年度安全审计的标准化表格。', type: '事务性范文', uploader: '用户A', isFavorite: false },
];

const MOCK_INDICATORS: Indicator[] = [
  { id: '1', source: '统计局', topic: 'GDP增长率', modified: '2024-02-01', creator: '系统', type: '结构化', status: '可用' },
  { id: '2', source: '内部调研', topic: '员工满意度', modified: '2024-02-10', creator: '人资部', type: '非结构化', status: '提取中' },
  { id: '3', source: '第三方报告', topic: '市场占有率', modified: '2024-01-20', creator: '市场部', type: '非结构化', status: '失败' },
  { id: '4', source: '环保局', topic: '碳排放量', modified: '2023-12-15', creator: '系统', type: '结构化', status: '禁用' },
];

const MOCK_REPORTS: Report[] = [
  { id: '1', title: '2024年第一季度行业分析', source: '智能体生成', time: '2024-04-01' },
  { id: '2', title: '竞争对手格局回顾', source: '手动上传', time: '2024-03-15' },
];

// Mock data for Rights List (Case Library)
const RIGHTS_LIST = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  creator: i === 1 ? 'sfj-zr' : 'superAdmin',
  name: i === 1 ? '对旅行社变更名称、经营场所...' : '对经营出境旅游业务的旅行...',
  type: '行政处罚',
  basis: '【法规】《旅行社条例》 (2...',
  subject: '市文化广播电视和旅游局...',
  content: '直接实施责任: 1.制定公布...',
  accountability: '因不履行或不正确履行行政...',
}));

// Mock Excel Data for Preview (Multi-sheet)
const PREVIEW_EXCEL_SHEETS: Record<string, string[][]> = {
  'GDP数据': [
    ['年份', '地区', '指标名称', '数值', '单位', '同比增长'],
    ['2023', '北京', '地区生产总值', '43760.7', '亿元', '5.2%'],
    ['2023', '上海', '地区生产总值', '47218.66', '亿元', '5.0%'],
    ['2023', '广州', '地区生产总值', '30355.73', '亿元', '4.6%'],
    ['2023', '深圳', '地区生产总值', '34606.40', '亿元', '6.0%'],
    ['2023', '杭州', '地区生产总值', '20059.00', '亿元', '5.6%'],
    ['2023', '苏州', '地区生产总值', '24653.40', '亿元', '4.6%'],
    ['2023', '成都', '地区生产总值', '22074.70', '亿元', '6.0%'],
    ['2023', '武汉', '地区生产总值', '20011.65', '亿元', '5.7%'],
    ['2023', '南京', '地区生产总值', '17421.40', '亿元', '4.6%'],
    ['2023', '天津', '地区生产总值', '16737.30', '亿元', '4.3%'],
    ['2023', '宁波', '地区生产总值', '16452.80', '亿元', '5.5%'],
    ['2023', '青岛', '地区生产总值', '15760.34', '亿元', '5.9%'],
    ['2023', '无锡', '地区生产总值', '15456.19', '亿元', '6.0%'],
    ['2023', '长沙', '地区生产总值', '14341.98', '亿元', '4.8%'],
  ],
  '人口数据': [
    ['城市', '常住人口(万人)', '城镇化率'],
    ['北京', '2185.8', '87.6%'],
    ['上海', '2489.4', '89.3%'],
    ['广州', '1873.4', '86.5%'],
    ['深圳', '1768.2', '99.8%'],
    ['杭州', '1252.2', '84.0%'],
  ],
  '产业结构': [
    ['城市', '第一产业(%)', '第二产业(%)', '第三产业(%)'],
    ['北京', '0.2', '15.8', '84.0'],
    ['上海', '0.2', '25.7', '74.1'],
    ['深圳', '0.1', '38.2', '61.7'],
  ]
};

const MOCK_TEMPLATES: ConfigTemplate[] = [
    {
        id: 't1',
        name: '通用经济指标',
        configs: [
            { name: '年份', description: '统计年份', type: 'Date', attribute: 'Original' },
            { name: '地区', description: '行政区划名称', type: 'String', attribute: 'Original' },
            { name: '数值', description: '具体指标数值', type: 'Number', attribute: 'Original' },
            { name: '同比增长', description: '与上一年相比的增长率', type: 'String', attribute: 'Calculated' },
        ]
    }
];

// --- SUB COMPONENTS ---

const UploadModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [files, setFiles] = useState<{name: string, type: string, validity: string}[]>([]);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = {
        name: e.target.files[0].name,
        type: '通知',
        validity: '1年'
      };
      setFiles([...files, newFile]);
    }
  };

  const removeFile = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface rounded-xl shadow-2xl w-[600px] overflow-hidden border border-border animate-scale-in">
        <div className="bg-surface px-6 py-4 border-b border-border flex justify-between items-center">
          <h3 className="font-semibold text-text-primary">上传政策</h3>
          <button onClick={onClose}><X size={20} className="text-text-muted hover:text-text-secondary" /></button>
        </div>
        <div className="p-6">
          <div className="border-2 border-dashed border-border-highlight rounded-lg p-8 text-center bg-background hover:bg-surface-highlight transition-colors cursor-pointer relative group">
             <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileSelect} />
             <Upload className="mx-auto text-blue-500 mb-2 group-hover:scale-110 transition-transform" size={32} />
             <p className="text-sm text-text-muted">点击选择本地文件</p>
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <h4 className="text-xs font-semibold text-text-muted uppercase mb-2">已选文件</h4>
              <div className="space-y-2">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-surface border border-border p-2 rounded-md animate-slide-up">
                    <FileText size={16} className="text-text-muted" />
                    <span className="text-sm text-text-secondary flex-1 truncate">{file.name}</span>
                    <select 
                      className="text-xs border-border border rounded px-1 py-0.5 bg-background text-text-secondary focus:ring-1 focus:ring-blue-500"
                      value={file.type}
                      onChange={(e) => {
                        const newFiles = [...files];
                        newFiles[idx].type = e.target.value;
                        setFiles(newFiles);
                      }}
                    >
                      <option>通知</option>
                      <option>法规</option>
                      <option>法律</option>
                    </select>
                    <select 
                      className="text-xs border-border border rounded px-1 py-0.5 bg-background text-text-secondary focus:ring-1 focus:ring-blue-500"
                      value={file.validity}
                      onChange={(e) => {
                        const newFiles = [...files];
                        newFiles[idx].validity = e.target.value;
                        setFiles(newFiles);
                      }}
                    >
                      <option>1年</option>
                      <option>3年</option>
                      <option>长期</option>
                    </select>
                    <button onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="px-6 py-4 bg-surface border-t border-border flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-text-muted hover:bg-surface-highlight rounded-md transition-colors">取消</button>
          <button onClick={onClose} className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors">上传</button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN VIEW ---

const ResourceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ResourceTab>('Knowledge');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Navigation State
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
  const [isExtracting, setIsExtracting] = useState(false); // For "Data Extraction" view
  const [extractionStep, setExtractionStep] = useState<'upload' | 'result'>('upload'); // State for extraction steps
  const [activeSheet, setActiveSheet] = useState<string>('GDP数据'); // State for Excel preview active sheet

  // Table Selection & Configuration State
  const [selection, setSelection] = useState<{start: {r: number, c: number}, end: {r: number, c: number}} | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [headerRow, setHeaderRow] = useState<number | null>(0); // Default 0
  const [dataRows, setDataRows] = useState<{start: number, end: number} | null>(null);
  
  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>([]);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [templates, setTemplates] = useState<ConfigTemplate[]>(MOCK_TEMPLATES);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Indicator Data State
  const [indicators, setIndicators] = useState<Indicator[]>(MOCK_INDICATORS);

  // Case Tab State
  const [caseSubTab, setCaseSubTab] = useState<'Rights' | 'History'>('Rights');

  const toggleIndicatorStatus = (id: string) => {
    setIndicators(prev => prev.map(ind => {
        if (ind.id === id && (ind.status === '可用' || ind.status === '禁用')) {
            return { ...ind, status: ind.status === '可用' ? '禁用' : '可用' };
        }
        return ind;
    }));
  };

  // Reset selection when changing sheets
  useEffect(() => {
    setSelection(null);
    setHeaderRow(0);
    // Auto-guess data rows (1 to end)
    const currentSheetData = PREVIEW_EXCEL_SHEETS[activeSheet] || [];
    if (currentSheetData.length > 1) {
        setDataRows({ start: 1, end: currentSheetData.length - 1 });
    } else {
        setDataRows(null);
    }
    // Only reset configs if we are NOT in detail view mode (where we want to persist/load state)
    // For simplicity, in this demo, we reset configs on sheet change to show dynamic behaviour
    if (!selectedIndicator) {
        setColumnConfigs([]);
        setShowConfigPanel(false);
    }
  }, [activeSheet]);

  const openIndicatorDetail = (ind: Indicator) => {
      setSelectedIndicator(ind);
      setIsExtracting(false); 
      setExtractionStep('upload'); // Reset extraction step
      
      // Mock Data Init for detail view
      const sheetName = 'GDP数据';
      setActiveSheet(sheetName);
      const data = PREVIEW_EXCEL_SHEETS[sheetName];
      if (data && data.length > 0) {
          setHeaderRow(0);
          setDataRows({ start: 1, end: data.length - 1 });
          const rowData = data[0];
          const newConfigs: ColumnConfig[] = rowData.map((cell, idx) => ({
              index: idx,
              name: cell,
              description: '',
              type: 'String',
              attribute: 'Original'
          }));
          setColumnConfigs(newConfigs);
          setShowConfigPanel(true);
      }
  };

  // --- Knowledge Base View ---
  const renderKnowledgeView = () => (
    <div key="Knowledge" className="flex-1 flex flex-col h-full bg-background animate-fade-in">
        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-text-secondary font-medium cursor-pointer">
                    <input type="checkbox" className="rounded border-border text-[var(--color-primary)] focus:ring-[var(--color-primary)] bg-surface" />
                    所有知识库
                </label>
                <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center text-text-muted text-xs cursor-help">?</div>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="relative group">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-lg text-sm text-text-secondary hover:bg-surface-highlight transition-colors">
                        <Tag size={14} /> 全部标签 <ChevronDown size={14} />
                    </button>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-2 text-text-muted" size={16} />
                    <input 
                        type="text" 
                        placeholder="搜索" 
                        className="pl-9 pr-4 py-1.5 bg-surface-highlight border-none rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 w-64 placeholder:text-text-muted"
                    />
                </div>
                <div className="h-6 w-px bg-border mx-2"></div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-lg text-sm text-text-secondary hover:bg-surface-highlight transition-colors">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div> 服务 API
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-lg text-sm text-text-secondary hover:bg-surface-highlight transition-colors">
                    <Database size={14} /> 外部知识库 API
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Create New Card */}
                <div className="bg-surface-highlight/30 border border-border rounded-xl p-0 flex flex-col cursor-pointer hover:shadow-md transition-all group h-[220px]">
                    <div className="flex-1 p-6 flex flex-col justify-center items-start">
                        <div className="flex items-center gap-2 text-text-secondary mb-2">
                            <Plus size={20} />
                            <span className="font-medium">创建知识库</span>
                        </div>
                        <p className="text-xs text-text-muted pl-7">通过知识流水线创建知识库</p>
                    </div>
                    <div className="px-6 py-4 border-t border-border flex items-center gap-2 text-text-muted hover:text-[var(--color-primary)] transition-colors">
                        <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">
                            <Plus size={8} />
                        </div>
                        <span className="text-sm font-medium">连接外部知识库</span>
                    </div>
                </div>

                {MOCK_KNOWLEDGE_BASES.map(kb => (
                    <div key={kb.id} className="bg-surface border border-border rounded-xl p-5 hover:shadow-lg transition-all duration-200 group flex flex-col h-[220px] relative cursor-pointer">
                        <div className="flex gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-2xl shrink-0 ${kb.color}`}>
                                {kb.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-text-primary text-base truncate mb-1" title={kb.name}>{kb.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-text-muted">
                                    <span>{kb.author} · 编辑于 {kb.editTime}</span>
                                </div>
                            </div>
                            <button className="text-text-muted hover:text-text-primary self-start">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                            {kb.tags?.map((tag, i) => (
                                <span key={i} className="px-1.5 py-0.5 bg-surface-highlight text-text-secondary text-[10px] rounded border border-border">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <p className="text-xs text-text-muted mb-auto line-clamp-2 leading-relaxed">
                            {kb.description}
                        </p>

                        {/* Custom Tags Row */}
                        {kb.customTags && kb.customTags.length > 0 && (
                             <div className="flex gap-1 overflow-hidden mb-3">
                                {kb.customTags.map((t, i) => (
                                    <span key={i} className="px-1.5 py-0.5 bg-surface text-text-muted text-[10px] rounded border border-border flex items-center gap-1 whitespace-nowrap">
                                        <Tag size={8} /> {t}
                                    </span>
                                ))}
                             </div>
                        )}

                        <div className="flex items-center gap-4 pt-3 border-t border-border text-xs text-text-muted">
                            <div className="flex items-center gap-1.5">
                                <FileText size={14} />
                                <span>{kb.docCount}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <LayoutTemplate size={14} />
                                <span>{kb.appCount}</span>
                            </div>
                            <div className="ml-auto">
                                更新于 {kb.lastEdited}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderSidebar = () => (
    <div className="w-56 bg-surface border-r border-border flex flex-col py-4 shrink-0">
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <BookOpen className="text-blue-500" size={20} /> 资源中心
        </h2>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {[
          { id: 'Knowledge', label: '知识库', icon: Database },
          { id: 'Policy', label: '政策库', icon: FileText },
          { id: 'ModelText', label: '范文库', icon: BookOpen },
          { id: 'Indicator', label: '指标库', icon: BarChart2 },
          { id: 'Case', label: '案例库', icon: Folder },
          { id: 'MyLibrary', label: '我的文库', icon: Star },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
                setActiveTab(item.id as ResourceTab);
                // Reset detail views on tab change
                setSelectedPolicy(null);
                setSelectedIndicator(null);
                setIsExtracting(false);
                setExtractionStep('upload');
                setActiveSheet('GDP数据');
                setSelection(null);
                setShowConfigPanel(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-surface-highlight text-text-primary shadow-sm translate-x-1' 
                : 'text-text-muted hover:bg-surface-highlight/50 hover:text-text-primary hover:translate-x-1'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );

  // --- Policy Detail View ---
  const renderPolicyDetail = () => {
      if (!selectedPolicy) return null;
      return (
          <div className="flex-1 flex flex-col h-full bg-background animate-fade-in overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-border flex items-center gap-2">
                  <button 
                    onClick={() => setSelectedPolicy(null)}
                    className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                      <ArrowLeft size={16} /> 返回
                  </button>
                  <div className="w-px h-4 bg-border-highlight mx-2"></div>
                  <h3 className="font-bold text-text-primary">政策详情</h3>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full custom-scrollbar">
                  <h1 className="text-3xl font-bold text-text-primary text-center mb-10">{selectedPolicy.title}</h1>
                  
                  {/* Metadata Info */}
                  <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                          <h4 className="font-semibold text-blue-500">政策信息</h4>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-12 text-sm bg-surface/50 p-6 rounded-xl border border-border">
                          <div>
                              <span className="text-text-muted block mb-1">发文机关:</span>
                              <span className="text-text-primary">{selectedPolicy.organ || '-'}</span>
                          </div>
                          <div>
                              <span className="text-text-muted block mb-1">发文时间:</span>
                              <span className="text-text-primary">{selectedPolicy.date || '-'}</span>
                          </div>
                           <div>
                              <span className="text-text-muted block mb-1">公文类型:</span>
                              <span className="text-text-primary">{selectedPolicy.type || '通知'}</span>
                          </div>
                          <div>
                              <span className="text-text-muted block mb-1">发文字号:</span>
                              <span className="text-text-primary">-</span>
                          </div>
                          <div>
                              <span className="text-text-muted block mb-1">行使时效:</span>
                              <span className="text-text-primary">无效</span>
                          </div>
                      </div>
                  </div>

                   {/* Body Text */}
                   <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                          <h4 className="font-semibold text-blue-500">政策全文</h4>
                      </div>
                      <div className="text-text-secondary leading-relaxed space-y-4 text-justify min-h-[300px]">
                          <p>
                              为贯彻落实国家关于加快数字化发展的战略部署，深化新一代信息技术与制造业融合发展，推动制造业高端化、智能化、绿色化发展，特制定本行动计划。
                          </p>
                          <p>
                              一、总体要求。坚持以习近平新时代中国特色社会主义思想为指导，全面贯彻党的二十大精神，完整、准确、全面贯彻新发展理念，以推动高质量发展为主题，以深化供给侧结构性改革为主线，以智能制造为主攻方向，以工业互联网为关键支撑，加快工业全要素、全产业链、全价值链深度互联，推动工业经济实现质的有效提升和量的合理增长。
                          </p>
                          <p>
                              二、主要目标。到2025年，全省规模以上工业企业关键工序数控化率达到65%，数字化研发设计工具普及率达到85%。建成一批具有行业影响力的工业互联网平台，培育一批数字化转型标杆企业。
                          </p>
                          <p>
                              三、重点任务。（一）实施基础设施升级行动。加快5G、千兆光网、数据中心等新型基础设施建设，提升工业园区网络覆盖和服务能力。（二）实施平台赋能提升行动。支持龙头企业建设跨行业跨领域工业互联网平台，鼓励中小企业上云用数赋智。（三）实施智能制造推广行动。推广应用智能检测、智能物流、智能仓储等技术装备，建设一批智能车间和智能工厂。
                          </p>
                          <p>
                              四、保障措施。加强组织领导，建立健全工作机制。加大政策支持，统筹利用各类专项资金。加强人才培养，建设高素质数字化人才队伍。优化发展环境，加强知识产权保护和数据安全保障。
                          </p>
                      </div>
                   </div>

                   {/* Actions */}
                   <div className="flex justify-center mb-10">
                       <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 shadow-lg shadow-blue-900/30 transition-all hover:scale-105">
                           <Download size={18} /> 下载原文
                       </button>
                   </div>
              </div>
          </div>
      )
  };

  const renderPolicyContent = () => {
    if (selectedPolicy) return renderPolicyDetail();
    
    return (
    <div key="Policy" className="flex-1 flex flex-col h-full bg-background animate-fade-in">
      {/* Filter Bar */}
      <div className="bg-surface border-b border-border p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 text-text-muted" size={16} />
            <input 
              type="text" 
              placeholder="搜索政策标题..." 
              className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-text-muted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-text-muted hover:bg-surface-highlight bg-surface transition-colors">
              <Calendar size={16} /> 日期范围 <ChevronDown size={14} />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-text-muted hover:bg-surface-highlight bg-surface transition-colors">
              <Tag size={16} /> 政策类型 <ChevronDown size={14} />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-text-muted hover:bg-surface-highlight bg-surface transition-colors">
              <Filter size={16} /> 来源 <ChevronDown size={14} />
            </button>
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 shadow-lg shadow-blue-900/30 ml-2 transition-all hover:scale-105"
            >
              <Upload size={16} /> 上传政策
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="p-6 overflow-y-auto">
        <div className="grid gap-3">
          {MOCK_POLICIES.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).map((policy) => (
            <div key={policy.id} onClick={() => setSelectedPolicy(policy)} className="bg-surface p-4 rounded-lg border border-border hover:border-text-muted transition-all group flex items-center gap-4 hover:translate-x-1 duration-200 cursor-pointer">
              
              {/* Content Area */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                   <h3 className="font-semibold text-text-primary text-base truncate group-hover:text-blue-400 transition-colors">{policy.title}</h3>
                   <span className={`text-[10px] px-2 py-0.5 rounded border ${policy.source === '系统数据' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'} shrink-0`}>
                    {policy.source}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-y-2 text-xs text-text-muted">
                   <div className="flex items-center gap-2 min-w-[120px]">
                      <span className="text-text-muted">发文日期</span>
                      <span className="text-text-muted">{policy.date}</span>
                   </div>
                   <div className="w-px h-3 bg-border-highlight mx-3 hidden sm:block"></div>
                   <div className="flex items-center gap-2 min-w-[100px]">
                      <span className="text-text-muted">发文机关</span>
                      <span className="text-text-muted">{policy.organ}</span>
                   </div>
                   <div className="w-px h-3 bg-border-highlight mx-3 hidden sm:block"></div>
                   <div className="flex items-center gap-2 min-w-[80px]">
                      <span className="text-text-muted">发文地区</span>
                      <span className="text-text-muted">{policy.region}</span>
                   </div>
                   <div className="w-px h-3 bg-border-highlight mx-3 hidden sm:block"></div>
                   <div className="flex items-center gap-2 min-w-[80px]">
                      <span className="text-text-muted">政策类型</span>
                      <span className="text-text-muted">{policy.type}</span>
                   </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="flex items-center gap-1 pl-4 border-l border-border-highlight shrink-0">
                 <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedPolicy(policy); }}
                    className="p-2 text-text-muted hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-all hover:scale-110" 
                    title="查看内容"
                 >
                    <FileText size={16} />
                 </button>
                 <button 
                    onClick={(e) => e.stopPropagation()} 
                    className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-highlight rounded-md transition-all hover:scale-110" 
                    title="下载"
                 >
                    <Download size={16} />
                 </button>
                 <button 
                  className="p-2 text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all hover:scale-110" 
                  title="删除"
                  onClick={(e) => { e.stopPropagation(); if(window.confirm('确认删除该政策？')) { console.log('Deleted'); } }}
                 >
                    <Trash2 size={16} />
                 </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
    );
  };

  const renderModelTextContent = () => (
     <div key="ModelText" className="flex-1 flex flex-col h-full bg-background animate-fade-in">
       <div className="bg-surface border-b border-border p-4 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-text-muted" size={16} />
            <input type="text" placeholder="搜索范文..." className="w-full pl-9 py-2 bg-background border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted" />
        </div>
        <div className="flex gap-2 text-sm">
            {['全部', '法定范文', '事务性范文', '我的收藏', '我的上传'].map(f => (
                <button key={f} className="px-3 py-1.5 rounded-full border border-border hover:bg-surface-highlight text-text-muted transition-colors bg-surface hover:border-text-muted hover:text-text-primary">{f}</button>
            ))}
        </div>
       </div>
       <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
          {MOCK_MODEL_TEXTS.map(item => (
              <div key={item.id} className="bg-surface p-5 rounded-xl border border-border shadow-sm hover:border-border-highlight transition-all hover:-translate-y-1 duration-200">
                  <div className="flex justify-between mb-2">
                      <h3 className="font-bold text-text-primary">{item.title}</h3>
                      <button className={item.isFavorite ? "text-yellow-500" : "text-text-muted hover:text-yellow-400 transition-colors"}>
                          <Star size={18} fill={item.isFavorite ? "currentColor" : "none"} />
                      </button>
                  </div>
                  <p className="text-sm text-text-muted mb-4 line-clamp-2">{item.abstract}</p>
                  <div className="flex justify-between items-center text-xs text-text-muted">
                      <span className="bg-surface-highlight px-2 py-1 rounded">类型: {item.type}</span>
                      <span>上传用户: {item.uploader}</span>
                  </div>
              </div>
          ))}
       </div>
     </div>
  );

  // --- Data Extraction View ---
  const renderExtractionView = () => {
    // Determine if we should show upload UI: New extraction (isExtracting=true, no selectedIndicator) AND on upload step
    const showUpload = isExtracting && !selectedIndicator && extractionStep === 'upload';
    
    // Show table editor if in extraction result step OR if viewing an indicator detail (Edit Mode)
    const showTableEditor = (isExtracting && !selectedIndicator && extractionStep === 'result') || !!selectedIndicator;
    
    // Get current sheet data
    const currentSheetData = PREVIEW_EXCEL_SHEETS[activeSheet] || [];

    // Table Selection logic helpers
    const handleCellMouseDown = (r: number, c: number) => {
      setIsSelecting(true);
      setSelection({ start: {r, c}, end: {r, c} });
    };

    const handleCellMouseEnter = (r: number, c: number) => {
      if (isSelecting && selection) {
          setSelection({ ...selection, end: {r, c} });
      }
    };

    const handleMouseUp = () => {
      setIsSelecting(false);
    };

    const getCellClass = (r: number, c: number) => {
      let classes = "border-b border-r border-border p-2 text-text-secondary cursor-cell select-none transition-colors ";
      
      // Header Style (Applied to the row)
      if (headerRow === r) {
          classes += "bg-yellow-500/10 text-text-primary ";
      } 
      // Data Style (Applied to the row range)
      else if (dataRows && r >= dataRows.start && r <= dataRows.end) {
          classes += "bg-green-500/10 text-text-primary ";
      }

      // Selection Highlight
      if (selection) {
          const minR = Math.min(selection.start.r, selection.end.r);
          const maxR = Math.max(selection.start.r, selection.end.r);
          const minC = Math.min(selection.start.c, selection.end.c);
          const maxC = Math.max(selection.start.c, selection.end.c);
          
          if (r >= minR && r <= maxR && c >= minC && c <= maxC) {
              classes += "!bg-blue-500/20 "; // Use !important to override other bgs
              if (r === minR) classes += "border-t-2 border-t-blue-500 ";
              if (c === minC) classes += "border-l-2 border-l-blue-500 ";
              if (r === maxR) classes += "border-b-2 border-b-blue-500 ";
              if (c === maxC) classes += "border-r-2 border-r-blue-500 ";
          }
      }

      return classes;
    };

    // Actions
    const handleSetHeader = () => {
      if (selection) {
          const r = selection.start.r;
          setHeaderRow(r);
          setSelection(null);
          
          // Auto-guess data rows (next row to end)
          if (r < currentSheetData.length - 1) {
              setDataRows({ start: r + 1, end: currentSheetData.length - 1 });
          }

          // Initialize Configs based on the selected header row
          const rowData = currentSheetData[r] || [];
          const newConfigs: ColumnConfig[] = rowData.map((cell, idx) => ({
              index: idx,
              name: cell,
              description: '',
              type: 'String',
              attribute: 'Original'
          }));
          setColumnConfigs(newConfigs);
          setShowConfigPanel(true); // Auto open panel
      }
    };

    const handleSetData = () => {
      if (selection) {
          const minR = Math.min(selection.start.r, selection.end.r);
          const maxR = Math.max(selection.start.r, selection.end.r);
          setDataRows({ start: minR, end: maxR });
          setSelection(null);
      }
    };

    // Config Panel Logic
    const updateColumnConfig = (index: number, updates: Partial<ColumnConfig>) => {
        setColumnConfigs(prev => prev.map(c => c.index === index ? { ...c, ...updates } : c));
    };

    const handleAIGenerate = () => {
        setIsGeneratingAI(true);
        // Simulate API call delay
        setTimeout(() => {
            setColumnConfigs(prev => prev.map(c => ({
                ...c,
                description: c.description || `AI Generated: ${c.name} indicator description`,
                type: c.name.includes('率') || c.name.includes('比') ? 'Number' : c.type
            })));
            setIsGeneratingAI(false);
        }, 1000);
    };

    const handleApplyTemplate = (templateId: string) => {
        const tmpl = templates.find(t => t.id === templateId);
        if (!tmpl) return;
        
        setColumnConfigs(prev => prev.map(c => {
            // Find matching config in template by name
            const match = tmpl.configs.find(tc => tc.name === c.name);
            if (match) {
                return { ...c, ...match };
            }
            return c;
        }));
    };

    const handleSaveTemplate = () => {
        const name = prompt("请输入模版名称", "新模版");
        if (name) {
            const newTmpl: ConfigTemplate = {
                id: `t${Date.now()}`,
                name,
                configs: columnConfigs.map(({index, ...rest}) => rest) // Store without index
            };
            setTemplates([...templates, newTmpl]);
        }
    };

    return (
    <div className="flex-1 flex flex-col h-full bg-background animate-fade-in overflow-hidden relative" onMouseUp={handleMouseUp}>
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface z-20">
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => { setIsExtracting(false); setSelectedIndicator(null); setExtractionStep('upload'); setSelection(null); setShowConfigPanel(false); }}
                    className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors"
                >
                    <ArrowLeft size={16} /> 返回列表
                </button>
                <div className="w-px h-4 bg-border-highlight mx-2"></div>
                
                {selectedIndicator ? (
                        <div className="flex items-center gap-2">
                        <span className="text-text-muted text-sm font-medium">数据主题:</span>
                        <input 
                            type="text" 
                            value={selectedIndicator.topic} 
                            onChange={(e) => setSelectedIndicator({...selectedIndicator, topic: e.target.value})}
                            className="bg-surface-highlight border border-border rounded px-2 py-1 text-text-primary font-bold focus:border-blue-500 outline-none w-64"
                        />
                        </div>
                ) : (
                    <h3 className="font-bold text-text-primary">
                        {showUpload ? '上传文件' : '文件预览 & 提取'}
                    </h3>
                )}
            </div>
            
             {/* Save button for Detail Mode */}
            {selectedIndicator && (
                <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20">
                    <Save size={14} /> 保存修改
                </button>
            )}
        </div>
        
        {/* Content */}
        {showUpload ? (
            <div className="flex-1 p-8 flex flex-col animate-slide-up">
                 <div className="mb-6 flex items-center gap-2 text-sm text-text-muted">
                     <span className="text-blue-500 font-bold border-l-4 border-blue-500 pl-2">上传文件</span>
                 </div>
                 
                 <div className="flex-1 flex flex-col">
                    <div 
                        className="w-full border-2 border-dashed border-border rounded-lg flex-1 flex flex-col items-center justify-center bg-surface/30 hover:bg-surface/50 transition-colors cursor-pointer group mb-6 relative"
                        onClick={() => {
                            // Simulate file selection then go to next step
                             setExtractionStep('result'); 
                        }}
                    >
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div className="w-12 h-12 rounded-full bg-surface-highlight flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                            <Plus className="text-text-muted" size={24} />
                        </div>
                        <p className="text-base text-text-secondary font-medium mb-1">拖拽或点击上传</p>
                        <p className="text-text-muted text-xs">支持 xlsx、xls、csv，最大不超过50.0MB</p>
                    </div>
                    
                    <div>
                        <button 
                            onClick={() => setExtractionStep('result')}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors shadow-lg shadow-blue-900/20"
                        >
                            下一步
                        </button>
                    </div>
                </div>
            </div>
        ) : showTableEditor ? (
            <div className="flex-1 flex flex-row overflow-hidden">
                {/* Main Preview Area */}
                <div className={`flex-1 flex flex-col p-6 animate-slide-up overflow-hidden transition-all duration-300 ${showConfigPanel ? 'mr-0' : ''}`}>
                    <div className="flex items-center justify-between mb-4">
                         {selectedIndicator ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center text-purple-500">
                                        <BarChart2 size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-text-primary">{selectedIndicator.source}</h4>
                                        <p className="text-xs text-text-muted">最后修改: {selectedIndicator.modified}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center text-green-500">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-text-primary">2023年全国主要城市GDP数据.xlsx</h4>
                                        <p className="text-xs text-text-muted">12.5KB | 刚刚上传</p>
                                    </div>
                                </div>
                            )}

                        <div className="flex gap-2">
                            {selection ? (
                                <div className="flex items-center gap-2 bg-surface-highlight rounded-lg p-1 border border-border animate-scale-in">
                                    <button 
                                        onClick={handleSetHeader}
                                        className="px-3 py-1.5 text-xs bg-yellow-600/20 text-yellow-500 hover:bg-yellow-600/30 border border-yellow-600/30 rounded transition-colors flex items-center gap-1"
                                    >
                                        <MousePointerClick size={14} /> 设为表头
                                    </button>
                                    <button 
                                        onClick={handleSetData}
                                        className="px-3 py-1.5 text-xs bg-green-600/20 text-green-500 hover:bg-green-600/30 border border-green-600/30 rounded transition-colors flex items-center gap-1"
                                    >
                                        <CheckCircle2 size={14} /> 设为数据区域
                                    </button>
                                    <button 
                                        onClick={() => setSelection(null)}
                                        className="px-2 py-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 text-xs text-text-muted">
                                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-500/20 border border-yellow-500/50 rounded-sm"></div> 表头区域</span>
                                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500/20 border border-green-500/50 rounded-sm"></div> 数据区域</span>
                                </div>
                            )}
                            <div className="w-px h-6 bg-border-highlight mx-2"></div>
                            {headerRow !== null && !showConfigPanel && (
                                <button 
                                    onClick={() => setShowConfigPanel(true)}
                                    className="px-3 py-1.5 text-xs border border-border text-text-secondary rounded hover:bg-surface-highlight transition-colors flex items-center gap-1"
                                >
                                    <Settings2 size={14} /> 配置字段
                                </button>
                            )}
                            {/* Start Extraction button only shown in Extraction Mode */}
                            {!selectedIndicator && (
                                <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-1">
                                    <Activity size={14} /> 开始智能提取
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 bg-surface border border-border rounded-xl overflow-hidden shadow-sm flex flex-col select-none relative">
                        {/* Sheet Tabs */}
                        <div className="flex items-center bg-surface-highlight border-b border-border overflow-x-auto custom-scrollbar">
                            {Object.keys(PREVIEW_EXCEL_SHEETS).map(sheetName => (
                                <button
                                    key={sheetName}
                                    onClick={() => setActiveSheet(sheetName)}
                                    className={`px-4 py-2 text-xs font-medium border-r border-border transition-colors whitespace-nowrap flex items-center gap-2 ${
                                        activeSheet === sheetName 
                                        ? 'bg-surface text-blue-500 border-b-2 border-b-blue-500' 
                                        : 'text-text-muted hover:bg-surface-highlight hover:text-text-primary'
                                    }`}
                                >
                                    <Table size={12} className={activeSheet === sheetName ? "text-blue-500" : "text-text-muted"}/>
                                    {sheetName}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-auto custom-scrollbar relative">
                            {/* Selection Info Overlay if Selecting */}
                            {selection && (
                                <div className="absolute top-2 right-2 z-20 bg-blue-600 text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none">
                                    {Math.abs(selection.end.r - selection.start.r) + 1}行 x {Math.abs(selection.end.c - selection.start.c) + 1}列
                                </div>
                            )}

                            <table className="w-full text-left text-sm border-collapse" onMouseLeave={() => setIsSelecting(false)}>
                                <thead className="bg-surface-highlight sticky top-0 z-10">
                                    <tr>
                                        <th className="w-12 border-b border-r border-border p-2 text-center text-text-muted bg-surface-highlight font-mono text-xs select-none"></th>
                                        {currentSheetData[0]?.map((header, i) => (
                                            <th key={i} className="border-b border-r border-border p-2 text-text-muted font-medium min-w-[100px] select-none bg-surface-highlight">
                                                {String.fromCharCode(65 + i)}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentSheetData.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            <td className="border-b border-r border-border p-2 text-center text-text-muted bg-surface-highlight/50 font-mono text-xs sticky left-0 select-none">
                                                {rowIndex + 1}
                                            </td>
                                            {row.map((cell, cellIndex) => (
                                                <td 
                                                    key={cellIndex} 
                                                    className={getCellClass(rowIndex, cellIndex)}
                                                    onMouseDown={() => handleCellMouseDown(rowIndex, cellIndex)}
                                                    onMouseEnter={() => handleCellMouseEnter(rowIndex, cellIndex)}
                                                >
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Excel-like Status Bar */}
                        <div className="h-6 bg-surface-highlight border-t border-border flex items-center px-4 justify-between text-[10px] text-text-muted">
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1 text-text-muted"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> 就绪</span>
                                {selection && <span>选中: R{selection.start.r + 1}C{selection.start.c + 1} : R{selection.end.r + 1}C{selection.end.c + 1}</span>}
                            </div>
                            <div className="flex gap-4">
                                <span>行数: {currentSheetData.length}</span>
                                <span>列数: {currentSheetData[0]?.length || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Configuration Panel - Slide out from right */}
                <div 
                    className={`bg-surface border-l border-border w-[350px] flex flex-col transition-all duration-300 transform ${showConfigPanel ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full shadow-none border-none pointer-events-none'}`}
                >
                    <div className="p-4 border-b border-border flex justify-between items-center bg-surface-highlight">
                        <h3 className="font-bold text-text-primary flex items-center gap-2">
                            <Settings2 size={16} className="text-blue-500" /> 字段配置
                        </h3>
                        <button onClick={() => setShowConfigPanel(false)} className="text-text-muted hover:text-text-secondary">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    
                    {/* Panel Toolbar */}
                    <div className="p-4 bg-surface-highlight/50 border-b border-border space-y-3">
                         <div className="flex gap-2">
                             <button 
                                onClick={handleAIGenerate}
                                disabled={isGeneratingAI}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600/10 text-purple-400 border border-purple-500/20 rounded hover:bg-purple-600/20 transition-colors text-xs font-medium"
                             >
                                 {isGeneratingAI ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                                 AI 智能生成描述
                             </button>
                             <button 
                                onClick={handleSaveTemplate}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded hover:bg-blue-600/20 transition-colors text-xs font-medium"
                             >
                                 <Save size={14} /> 保存为模版
                             </button>
                         </div>
                         
                         {/* Template Selector */}
                         <div className="relative group">
                            <div className="flex items-center justify-between gap-2 bg-surface-highlight border border-border rounded px-3 py-2 text-xs text-text-secondary cursor-pointer hover:border-text-muted">
                                <span className="flex items-center gap-2"><LayoutTemplate size={14}/> 应用模版配置</span>
                                <ChevronDown size={14}/>
                            </div>
                            <div className="absolute top-full left-0 w-full mt-1 bg-surface border border-border rounded-lg shadow-xl overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                {templates.map(tmpl => (
                                    <button 
                                        key={tmpl.id}
                                        onClick={() => handleApplyTemplate(tmpl.id)}
                                        className="w-full text-left px-3 py-2 text-xs text-text-secondary hover:bg-surface-highlight transition-colors flex justify-between items-center"
                                    >
                                        {tmpl.name}
                                        <ChevronRight size={12} className="opacity-50"/>
                                    </button>
                                ))}
                            </div>
                         </div>
                    </div>

                    {/* Fields List */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                        {columnConfigs.length === 0 ? (
                            <div className="text-center text-text-muted py-10 text-sm">
                                请先在左侧表格中选中一行<br/>并点击"设为表头"
                            </div>
                        ) : (
                            columnConfigs.map((col, idx) => (
                                <div key={col.index} className="bg-surface-highlight border border-border rounded-lg p-3 animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <span className="w-5 h-5 flex items-center justify-center bg-surface rounded text-[10px] text-text-muted font-mono">
                                                {String.fromCharCode(65 + col.index)}
                                            </span>
                                            <span className="text-sm font-bold text-text-primary truncate">{col.name}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div>
                                            <input 
                                                type="text" 
                                                placeholder="字段描述"
                                                className="w-full bg-background border border-border rounded px-2 py-1.5 text-xs text-text-secondary focus:border-blue-500/50 focus:outline-none transition-colors"
                                                value={col.description}
                                                onChange={(e) => updateColumnConfig(col.index, { description: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <select 
                                                className="flex-1 bg-background border border-border rounded px-2 py-1.5 text-xs text-text-secondary focus:border-blue-500/50 focus:outline-none transition-colors"
                                                value={col.type}
                                                onChange={(e) => updateColumnConfig(col.index, { type: e.target.value as any })}
                                            >
                                                <option value="String">文本 (String)</option>
                                                <option value="Number">数值 (Number)</option>
                                                <option value="Date">日期 (Date)</option>
                                                <option value="Boolean">布尔 (Boolean)</option>
                                            </select>
                                            <select 
                                                className="flex-1 bg-background border border-border rounded px-2 py-1.5 text-xs text-text-secondary focus:border-blue-500/50 focus:outline-none transition-colors"
                                                value={col.attribute}
                                                onChange={(e) => updateColumnConfig(col.index, { attribute: e.target.value as any })}
                                            >
                                                <option value="Original">原始值</option>
                                                <option value="Calculated">预计算</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-text-muted animate-slide-up">
                <div className="w-full max-w-4xl bg-surface border border-border rounded-xl p-8 shadow-lg min-h-[500px]">
                    <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                        <FileSearch className="text-blue-500" />
                        {selectedIndicator ? `提取指标: ${selectedIndicator.topic}` : '提取结果预览'}
                    </h2>
                    
                    {/* Mock Extraction Process/Result */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-surface-highlight/50 rounded-lg border border-border">
                                <h3 className="text-sm font-semibold text-text-muted mb-2">源文件</h3>
                                <div className="h-40 bg-surface-highlight rounded border border-border-highlight flex items-center justify-center">
                                    <span className="text-text-muted text-sm">文档预览区域</span>
                                </div>
                            </div>
                            <div className="p-4 bg-surface-highlight/50 rounded-lg border border-border">
                                <h3 className="text-sm font-semibold text-text-muted mb-2">提取结果</h3>
                                <div className="h-40 bg-surface-highlight rounded border border-border-highlight flex items-center justify-center">
                                    <span className="text-text-muted text-sm">结构化数据预览</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-border">
                            <button className="px-4 py-2 text-sm text-text-muted hover:bg-surface-highlight rounded-md transition-colors" onClick={() => {setIsExtracting(false); setSelectedIndicator(null);}}>取消</button>
                            <button className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors shadow-lg shadow-blue-900/20">开始提取</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
    );
  };

  const renderIndicatorContent = () => {
      if (isExtracting || selectedIndicator) return renderExtractionView();

      return (
      <div key="Indicator" className="flex-1 flex flex-col h-full bg-background p-6 overflow-hidden animate-fade-in">
        <div className="bg-surface rounded-xl shadow-sm border border-border flex flex-col h-full">
            <div className="p-4 border-b border-border flex justify-between items-center">
                <h3 className="font-semibold text-text-primary">数据指标</h3>
                <div className="flex gap-2">
                    <input type="text" placeholder="搜索主题..." className="border border-border bg-background rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-blue-500/50" />
                    <button 
                        onClick={() => { setIsExtracting(true); setExtractionStep('upload'); }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/30 ml-2"
                    >
                        <FileSearch size={14} /> 数据提取
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm text-text-muted">
                    <thead className="bg-surface-highlight/80 text-text-muted font-medium sticky top-0 z-10 backdrop-blur-md">
                        <tr>
                            <th className="px-6 py-3">数据来源</th>
                            <th className="px-6 py-3">数据主题</th>
                            <th className="px-6 py-3">最后修改时间</th>
                            <th className="px-6 py-3">创建者</th>
                            <th className="px-6 py-3">类型</th>
                            <th className="px-6 py-3">状态</th>
                            <th className="px-6 py-3 text-right w-64">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {indicators.map(ind => (
                            <tr key={ind.id} className="hover:bg-surface-highlight/50 transition-colors group">
                                <td className="px-6 py-3">{ind.source}</td>
                                <td 
                                    className="px-6 py-3 font-medium text-text-primary cursor-pointer hover:text-blue-400"
                                    onClick={() => openIndicatorDetail(ind)}
                                >
                                    {ind.topic}
                                </td>
                                <td className="px-6 py-3">{ind.modified}</td>
                                <td className="px-6 py-3">{ind.creator}</td>
                                <td className="px-6 py-3">
                                    <span className="px-2 py-0.5 rounded bg-surface-highlight border border-border text-xs text-text-muted">
                                        {ind.type}
                                    </span>
                                </td>
                                <td className="px-6 py-3">
                                    <div className="flex items-center gap-1.5">
                                        {ind.status === '可用' && <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>}
                                        {ind.status === '提取中' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>}
                                        {ind.status === '失败' && <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>}
                                        {ind.status === '禁用' && <div className="w-1.5 h-1.5 rounded-full bg-text-muted"></div>}
                                        <span className={`text-xs ${
                                            ind.status === '可用' ? 'text-green-400' : 
                                            ind.status === '失败' ? 'text-red-400' :
                                            ind.status === '提取中' ? 'text-blue-400' : 'text-text-muted'
                                        }`}>{ind.status}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {/* Status Toggle - Only for Available/Disabled */}
                                        {(ind.status === '可用' || ind.status === '禁用') && (
                                            <button 
                                                onClick={() => toggleIndicatorStatus(ind.id)}
                                                className={`p-2 rounded-md transition-all hover:scale-110 ${ind.status === '可用' ? 'text-blue-500 hover:bg-blue-500/10' : 'text-text-muted hover:text-blue-500 hover:bg-surface-highlight'}`}
                                                title={ind.status === '可用' ? '禁用' : '启用'}
                                            >
                                                {ind.status === '可用' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                            </button>
                                        )}
                                        
                                        {/* Dynamic Main Action Button */}
                                        {ind.status === '失败' ? (
                                            <button 
                                                className="p-2 text-text-muted hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-all hover:scale-110"
                                                title="重新提取"
                                                onClick={() => setSelectedIndicator(ind)}
                                            >
                                                <RefreshCw size={16} />
                                            </button>
                                        ) : (ind.status === '可用' || ind.status === '禁用') ? (
                                            <button 
                                                className="p-2 text-text-muted hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-all hover:scale-110"
                                                title="查看详情"
                                                onClick={() => openIndicatorDetail(ind)}
                                            >
                                                <FileText size={16} />
                                            </button>
                                        ) : (
                                            <button className="p-2 text-text-muted cursor-wait" title="处理中">
                                                <Loader2 size={16} className="animate-spin" />
                                            </button>
                                        )}

                                        {/* Data Analysis Button */}
                                        <button 
                                            disabled={ind.status === '失败' || ind.status === '提取中'}
                                            className={`p-2 rounded-md transition-all hover:scale-110 ${ind.status === '失败' || ind.status === '提取中' ? 'text-text-muted cursor-not-allowed' : 'text-text-muted hover:text-purple-400 hover:bg-purple-500/10'}`}
                                            title="数据分析"
                                        >
                                            <BarChart2 size={16} />
                                        </button>

                                        {/* Delete Button */}
                                        <button className="p-2 text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all hover:scale-110" title="删除">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
      );
  };
  
  const renderMyLibraryContent = () => (
      <div key="MyLibrary" className="flex-1 p-6 bg-background overflow-y-auto animate-fade-in">
          <div className="bg-surface rounded-xl shadow-sm border border-border">
            <div className="p-4 border-b border-border font-bold text-text-primary">我的报告</div>
            <table className="w-full text-left text-sm text-text-muted">
                    <thead className="bg-surface-highlight">
                        <tr>
                            <th className="px-6 py-3">文章标题</th>
                            <th className="px-6 py-3">来源</th>
                            <th className="px-6 py-3">时间</th>
                            <th className="px-6 py-3 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {MOCK_REPORTS.map(rep => (
                            <tr key={rep.id} className="hover:bg-surface-highlight/50 transition-colors">
                                <td className="px-6 py-3 text-blue-500 cursor-pointer hover:underline">{rep.title}</td>
                                <td className="px-6 py-3">{rep.source}</td>
                                <td className="px-6 py-3">{rep.time}</td>
                                <td className="px-6 py-3 text-right">
                                    <button className="text-red-500 hover:text-red-400 hover:scale-110 transition-transform"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
            </table>
          </div>
      </div>
  );

  const renderCaseContent = () => (
     <div key="Case" className="flex-1 flex flex-col h-full bg-background animate-fade-in">
        {/* Sub Tabs */}
        <div className="flex items-center gap-6 px-6 pt-4 border-b border-border bg-surface/50">
           <button
             onClick={() => setCaseSubTab('Rights')}
             className={`pb-3 text-sm font-medium transition-all border-b-2 ${caseSubTab === 'Rights' ? 'border-blue-500 text-blue-400' : 'border-transparent text-text-muted hover:text-text-primary'}`}
           >
             权责清单
           </button>
           <button
             onClick={() => setCaseSubTab('History')}
             className={`pb-3 text-sm font-medium transition-all border-b-2 ${caseSubTab === 'History' ? 'border-blue-500 text-blue-400' : 'border-transparent text-text-muted hover:text-text-primary'}`}
           >
             过往案例
           </button>
        </div>

        {caseSubTab === 'Rights' ? (
        <>
            {/* Toolbar */}
            <div className="p-4 flex items-center justify-between gap-4">
               <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20">
                     <Plus size={14}/> 新增
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-text-secondary rounded text-xs hover:bg-surface-highlight transition-colors">
                     <Download size={14}/> 下载模板
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-text-secondary rounded text-xs hover:bg-surface-highlight transition-colors">
                     <Upload size={14}/> 导入
                  </button>
               </div>
               <div className="flex items-center gap-2">
                  <div className="flex items-center bg-surface-highlight border border-border rounded-md overflow-hidden">
                     <div className="px-3 py-1.5 border-r border-border text-xs text-text-muted bg-surface-highlight/50 flex items-center gap-1 cursor-pointer hover:text-text-secondary">
                        关键词 <ChevronDown size={12}/>
                     </div>
                     <div className="relative">
                         <Search size={14} className="absolute left-2 top-2 text-text-muted" />
                         <input type="text" className="bg-transparent border-none text-xs text-text-primary pl-8 pr-3 py-1.5 w-48 focus:outline-none placeholder:text-text-muted" placeholder="请输入"/>
                     </div>
                  </div>
               </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto px-4 pb-4">
                <div className="border border-border rounded-lg overflow-hidden bg-surface shadow-sm">
                   <table className="w-full text-left text-xs">
                      <thead className="bg-surface-highlight/80 text-text-muted font-medium border-b border-border">
                         <tr>
                            <th className="p-3 w-10"><input type="checkbox" className="rounded bg-surface-highlight border-border focus:ring-1 focus:ring-blue-500"/></th>
                            <th className="p-3 w-12">序号</th>
                            <th className="p-3 w-24">创建人</th>
                            <th className="p-3 min-w-[200px]">事项名称</th>
                            <th className="p-3 w-24">
                                <div className="flex items-center gap-1 cursor-pointer hover:text-text-secondary">
                                    权力类型 <Filter size={10}/>
                                </div>
                            </th>
                            <th className="p-3 min-w-[150px]">实施依据</th>
                            <th className="p-3 w-32">责任主体</th>
                            <th className="p-3 min-w-[150px]">责任事项内容</th>
                            <th className="p-3 min-w-[150px]">追责情形</th>
                            <th className="p-3 w-32 text-center">操作</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-text-secondary">
                         {RIGHTS_LIST.map((row) => (
                            <tr key={row.id} className="hover:bg-surface-highlight/50 transition-colors">
                               <td className="p-3"><input type="checkbox" className="rounded bg-surface-highlight border-border focus:ring-1 focus:ring-blue-500"/></td>
                               <td className="p-3 text-text-muted">{row.id}</td>
                               <td className="p-3">{row.creator}</td>
                               <td className="p-3 text-blue-400 cursor-pointer hover:underline truncate max-w-[200px]" title={row.name}>{row.name}</td>
                               <td className="p-3">{row.type}</td>
                               <td className="p-3 truncate max-w-[200px] text-text-muted" title={row.basis}>{row.basis}</td>
                               <td className="p-3 truncate max-w-[150px] text-text-muted" title={row.subject}>{row.subject}</td>
                               <td className="p-3 truncate max-w-[200px] text-text-muted" title={row.content}>{row.content}</td>
                               <td className="p-3 truncate max-w-[200px] text-text-muted" title={row.accountability}>{row.accountability}</td>
                               <td className="p-3 text-center">
                                   <div className="flex items-center justify-center gap-2">
                                      <button className="text-blue-500 hover:text-blue-400">查看</button>
                                      <button className="text-blue-500 hover:text-blue-400">修改</button>
                                      <button className="text-red-500 hover:text-red-400">删除</button>
                                   </div>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
            </div>

            {/* Footer */}
            <div className="h-12 border-t border-border bg-surface px-4 flex items-center justify-between text-xs text-text-muted shrink-0">
               <div className="flex items-center gap-4">
                  <span>已选 0 条</span>
                  <button className="px-3 py-1 bg-surface-highlight text-text-secondary border border-border rounded hover:bg-border-highlight transition-colors">导出Excel</button>
                  <button className="px-3 py-1 bg-surface-highlight text-text-secondary border border-border rounded hover:bg-border-highlight transition-colors">批量删除</button>
               </div>
               {/* Pagination (Simplified) */}
               <div className="flex items-center gap-2">
                  <span>共 10 条</span>
                  <button className="w-6 h-6 border border-border rounded flex items-center justify-center hover:bg-surface-highlight disabled:opacity-50 transition-colors" disabled>&lt;</button>
                  <button className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center">1</button>
                  <button className="w-6 h-6 border border-border rounded flex items-center justify-center hover:bg-surface-highlight disabled:opacity-50 transition-colors" disabled>&gt;</button>
               </div>
            </div>
        </>
        ) : (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-text-muted">
                <Folder size={48} className="mb-4 text-text-muted animate-bounce" />
                <h3 className="text-lg font-medium text-text-secondary">过往案例库</h3>
                <p className="max-w-md mt-2 text-text-muted text-center">此处展示过往处理的历史案例归档。</p>
                 <div className="mt-8 grid grid-cols-2 gap-6 w-full max-w-2xl">
                    <div className="bg-surface p-6 rounded-xl shadow-sm border border-border hover:border-border-highlight transition-all hover:scale-105 duration-200">
                        <h4 className="font-bold text-text-primary mb-2">2023年案例</h4>
                        <p className="text-xs text-text-muted">归档 54 个案例</p>
                    </div>
                    <div className="bg-surface p-6 rounded-xl shadow-sm border border-border hover:border-border-highlight transition-all hover:scale-105 duration-200">
                        <h4 className="font-bold text-text-primary mb-2">2022年案例</h4>
                        <p className="text-xs text-text-muted">归档 35 个案例</p>
                    </div>
                 </div>
            </div>
        )}
     </div>
  );

  return (
    <div className="flex h-full bg-background">
      {renderSidebar()}
      {activeTab === 'Knowledge' && renderKnowledgeView()}
      {activeTab === 'Policy' && renderPolicyContent()}
      {activeTab === 'ModelText' && renderModelTextContent()}
      {activeTab === 'Indicator' && renderIndicatorContent()}
      {activeTab === 'MyLibrary' && renderMyLibraryContent()}
      {activeTab === 'Case' && renderCaseContent()}
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
    </div>
  );
};

export default ResourceView;
