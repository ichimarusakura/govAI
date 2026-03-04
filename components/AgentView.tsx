
import React, { useState, useRef, useEffect } from 'react';
import { AgentType, ChatMessage, ChatSession } from '../types';
import { generateResponse } from '../services/geminiService';
import { 
  Send, Plus, Search, MessageSquare, Bot, 
  FileText, TrendingUp, Link as LinkIcon, 
  Building2, UserCheck, ScrollText, GitMerge, Scale,
  Sparkles, Image as ImageIcon,
  Paperclip, ArrowUp, ChevronDown, UserPlus,
  PanelLeftClose, PanelLeftOpen, Settings2,
  Languages, PenTool, FileCheck, FileCode,
  Trash2, Info, CheckCircle2, ArrowLeft, FilePlus, X, Filter,
  BookOpen, AlertCircle, ChevronUp, Check, ThumbsUp, ThumbsDown, FileSearch, Download
} from 'lucide-react';

const AGENT_ICONS: Record<string, React.ReactNode> = {
  [AgentType.ContentQuery]: <Search size={16} />,
  [AgentType.Translation]: <Languages size={16} />,
  [AgentType.Polishing]: <PenTool size={16} />,
  [AgentType.Writing]: <FileText size={16} />,
  [AgentType.IndustryAnalysis]: <TrendingUp size={16} />,
  [AgentType.ChainAnalysis]: <LinkIcon size={16} />,
  [AgentType.EnterpriseRec]: <Building2 size={16} />,
  [AgentType.EnterpriseProfile]: <UserCheck size={16} />,
  [AgentType.PolicyGen]: <ScrollText size={16} />,
  [AgentType.PolicyDeduction]: <GitMerge size={16} />,
  [AgentType.GovernanceRights]: <Scale size={16} />,
  [AgentType.ContractGen]: <FilePlus size={16} />,
  [AgentType.ContractReview]: <FileCheck size={16} />,
  [AgentType.SmartContract]: <FileCode size={16} />,
};

const BUSINESS_AGENTS = [
  { name: AgentType.Writing, icon: <FileText size={18} className="text-blue-500" />, desc: '日常公文，一键生成' },
  { name: AgentType.IndustryAnalysis, icon: <TrendingUp size={18} className="text-green-500" />, desc: '产业环节，深度解读' },
  { name: AgentType.ChainAnalysis, icon: <LinkIcon size={18} className="text-purple-500" />, desc: '产业全局，精准扫描' },
  { name: AgentType.EnterpriseRec, icon: <Building2 size={18} className="text-orange-500" />, desc: '潜在企业，优质推荐' },
  { name: AgentType.PolicyGen, icon: <ScrollText size={18} className="text-red-500" />, desc: '科学研判，精准施策' },
  { name: AgentType.EnterpriseProfile, icon: <UserCheck size={18} className="text-cyan-500" />, desc: '多维标签，全景绘像' },
  { name: AgentType.PolicyDeduction, icon: <GitMerge size={18} className="text-indigo-500" />, desc: '动态推演，以策赋能' },
  { name: AgentType.GovernanceRights, icon: <Scale size={18} className="text-yellow-500" />, desc: '明晰权责，协同共治' },
  { name: AgentType.ContractGen, icon: <FilePlus size={18} className="text-teal-500" />, desc: '标准范本，一键生成' },
  { name: AgentType.ContractReview, icon: <FileCheck size={18} className="text-pink-500" />, desc: '严审合规，把控风险' },
];

const MOCK_AGENTS_LIST = [
    { id: '1', name: '测试问答助手', active: true, type: AgentType.ContentQuery },
    { id: '2', name: '法律顾问', active: false, type: AgentType.ContractReview },
    { id: '3', name: '产业分析专家', active: false, type: AgentType.IndustryAnalysis },
];

// --- MOCK DATA ---
const MOCK_POLICIES = [
  { id: '1', title: '工业数字化转型行动计划', date: '2023-11-15', organ: '工信部', region: '全国', type: '法规', source: '系统数据' },
  { id: '2', title: '关于本市纺织行业补贴通知', date: '2024-01-20', organ: '市政府', region: '杭州', type: '通知', source: '用户上传' },
  { id: '3', title: '2024年环境保护标准', date: '2023-12-05', organ: '环保局', region: '全国', type: '标准', source: '系统数据' },
  { id: '4', title: '中小企业数字化赋能专项行动方案', date: '2023-10-10', organ: '工信部', region: '全国', type: '方案', source: '系统数据' },
  { id: '5', title: '高新技术企业认定管理办法', date: '2016-01-29', organ: '科技部', region: '全国', type: '办法', source: '系统数据' },
  { id: '6', title: '数据安全法', date: '2021-06-10', organ: '人大常委会', region: '全国', type: '法律', source: '系统数据' },
];

const MOCK_SESSIONS_DATA: ChatSession[] = [
    { id: '8', title: '2026年1-6月经济运行分析情况报告', lastMessage: '谢谢您提供的信息，按照你的要求撰写的公文如下...', updatedAt: new Date(), agentType: AgentType.Writing },
    { id: '1', title: '关于纺织行业的讨论', lastMessage: '请展示相关数据图表...', updatedAt: new Date(), agentType: AgentType.IndustryAnalysis },
    { id: '2', title: '政策分析草稿', lastMessage: '第四章保障措施中提到...', updatedAt: new Date(Date.now() - 86400000), agentType: AgentType.PolicyGen },
    { id: '3', title: '企业环保合规检查', lastMessage: '化工企业排污许可证年检...', updatedAt: new Date(Date.now() - 172800000), agentType: AgentType.EnterpriseProfile },
    { id: '4', title: '技术服务合同审核', lastMessage: '第3.2条关于知识产权...', updatedAt: new Date(Date.now() - 259200000), agentType: AgentType.ContractReview },
    { id: '5', title: '劳动纠纷咨询', lastMessage: '试用期辞退赔偿问题...', updatedAt: new Date(Date.now() - 345600000), agentType: AgentType.GovernanceRights },
    { id: '6', title: '恒力集团信息查询', lastMessage: '2023年销售收入数据...', updatedAt: new Date(Date.now() - 432000000), agentType: AgentType.ContentQuery },
    { id: '7', title: '商务邮件翻译', lastMessage: 'Here is the translation...', updatedAt: new Date(Date.now() - 518400000), agentType: AgentType.Translation },
];

const MOCK_SESSION_HISTORY: Record<string, ChatMessage[]> = {
    '8': [
        { role: 'user', text: '帮我写一份2026年1-6月经济运行分析情况报告', timestamp: new Date(Date.now() - 200000) },
        { role: 'model', text: '好的，您的问题已经成功接收，首先让我确认下您的任务需求', timestamp: new Date(Date.now() - 190000), type: 'writing_form' },
        { role: 'model', text: '', timestamp: new Date(Date.now() - 180000), type: 'writing_outline' },
        { role: 'model', text: '谢谢您提供的信息，按照你的要求撰写的公文如下', timestamp: new Date(Date.now() - 170000), type: 'writing_result' }
    ],
    '1': [
        { role: 'user', text: '最近纺织行业出口情况如何？', timestamp: new Date(Date.now() - 100000) },
        { role: 'model', text: '根据海关总署最新数据，2024年第一季度纺织服装累计出口293.7亿美元，同比增长2.5%。其中，纺织品出口134.5亿美元，增长7.7%；服装出口159.2亿美元，下降1.3%。整体来看，产业链上游恢复较快，下游终端需求仍显疲软。', timestamp: new Date(Date.now() - 90000) },
        { role: 'user', text: '请展示相关数据图表。', timestamp: new Date(Date.now() - 80000) },
        { role: 'model', text: '好的，已为您生成2023-2024年纺织服装月度出口趋势图。\n\n[图表生成中...]\n\n从趋势看，3月份出口额环比回升明显，预示着二季度有望迎来订单回流。', timestamp: new Date(Date.now() - 70000) }
    ],
    '2': [
        { role: 'user', text: '帮我分析一下最新的《数字化转型行动计划》。', timestamp: new Date(Date.now() - 86500000) },
        { role: 'model', text: '《行动计划》主要提出了三个重点方向：\n1. **基础设施升级**：加快5G、工业互联网标识解析体系建设。\n2. **平台赋能**：培育一批行业级、区域级工业互联网平台。\n3. **智能制造推广**：推动中小企业上云用数赋智。\n\n该计划的核心目标是到2025年，规上工业企业关键工序数控化率达到65%。', timestamp: new Date(Date.now() - 86450000) },
        { role: 'user', text: '对中小企业有什么补贴吗？', timestamp: new Date(Date.now() - 86420000) },
        { role: 'model', text: '第四章保障措施中提到：\n- 对购买云服务的专精特新中小企业，给予最高50%的补贴。\n- 对实施数字化改造项目的企业，按照设备和软件投入的10%-20%给予奖补。\n\n建议您关注当地工信局发布的具体申报指南。', timestamp: new Date(Date.now() - 86400000) }
    ],
    '3': [
        { role: 'user', text: '化工企业排污许可证年检需要注意什么？', timestamp: new Date(Date.now() - 172900000) },
        { role: 'model', text: '化工企业排污许可证年检需要重点关注以下几点：\n1. **自行监测数据完整性**：检查是否按频次进行了监测，数据是否上传至国家平台。\n2. **台账记录规范性**：生产设施运行记录、污染治理设施运行记录是否齐全。\n3. **执行报告合规性**：季度报告和年度报告是否按时提交，内容是否真实。\n4. **总量控制**：实际排放量是否超过许可排放限值。', timestamp: new Date(Date.now() - 172800000) }
    ],
    '4': [
        { role: 'user', text: '帮我看看这份技术服务合同的风险点。', timestamp: new Date(Date.now() - 259300000) },
        { role: 'model', text: '请上传合同文件或粘贴文本，我将为您进行智能审查。', timestamp: new Date(Date.now() - 259280000) },
        { role: 'user', text: '合同内容：\n3.2 乙方在开发过程中产生的知识产权归甲方所有，但乙方有权在其他项目中使用...', timestamp: new Date(Date.now() - 259250000) },
        { role: 'model', text: '经审查，发现以下风险点：\n1. **知识产权归属模糊**（第3.2条）：条款中“乙方有权在其他项目中使用”可能导致核心技术泄露给竞争对手。建议修改为“未经甲方书面同意，乙方不得在其他商业项目中使用核心代码”。\n2. **验收标准缺失**：合同未明确具体的技术验收指标（如响应时间、并发数），建议补充附件。\n3. **违约责任**：未约定乙方延期交付的违约金比例。', timestamp: new Date(Date.now() - 259200000) }
    ],
    '5': [
        { role: 'user', text: '员工试用期不符合录用条件辞退，需要赔偿吗？', timestamp: new Date(Date.now() - 345700000) },
        { role: 'model', text: '根据《劳动合同法》第三十九条，劳动者在试用期间被证明不符合录用条件的，用人单位可以解除劳动合同，且**不需要支付经济补偿金**。\n\n但企业必须举证：\n1. 入职时已明确告知录用条件（如签字确认的岗位说明书）。\n2. 有具体的考核记录证明其不符合该条件。\n3. 在试用期届满前通知解除。', timestamp: new Date(Date.now() - 345600000) }
    ],
    '6': [
        { role: 'user', text: '查一下恒力集团的最新年报数据。', timestamp: new Date(Date.now() - 432100000) },
        { role: 'model', text: '根据恒力石化（600346.SH）发布的2023年年度报告：\n- **营业收入**：2348.66亿元，同比增长5.6%。\n- **归母净利润**：69.05亿元，同比增长197.8%。\n- **总资产**：2654.3亿元。\n\n主要增长动力来自于炼化一体化装置的高负荷运行以及下游聚酯需求的回暖。', timestamp: new Date(Date.now() - 432000000) }
    ],
    '7': [
        { role: 'user', text: '把这段回复翻译成英文：感谢您的来信，我们已收到您的报价，正在进行内部评估，预计下周三前给您答复。', timestamp: new Date(Date.now() - 518500000) },
        { role: 'model', text: 'Here is the translation:\n\n"Thank you for your email. We have received your quotation and are currently conducting an internal evaluation. We expect to provide you with a response by next Wednesday."\n\n(Tone: Professional & Business)', timestamp: new Date(Date.now() - 518400000) }
    ]
};

const AgentView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'chat' | 'config'>('chat');
  const [activeAgentId, setActiveAgentId] = useState<string>(MOCK_AGENTS_LIST[0].id);
  const [selectedSkill, setSelectedSkill] = useState<typeof BUSINESS_AGENTS[0] | null>(null);
  const [agentFilter, setAgentFilter] = useState<string>('全部');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [currentViewedDoc, setCurrentViewedDoc] = useState('');
  
  // Mock sessions
  const [sessions, setSessions] = useState<ChatSession[]>(MOCK_SESSIONS_DATA);

  // Contract Generation Specific State
  const [contractMode, setContractMode] = useState<'smart' | 'template' | null>(null);
  const [contractTemplateType, setContractTemplateType] = useState('框架协议');

  // Policy Generation Specific State
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [selectedPolicies, setSelectedPolicies] = useState<typeof MOCK_POLICIES>([]);

  // Helper to get current agent details
  const currentAgent = MOCK_AGENTS_LIST.find(a => a.id === activeAgentId) || MOCK_AGENTS_LIST[0];

  // Config Form State
  const [configForm, setConfigForm] = useState({
      name: '测试问答助手',
      desc: '',
      instructions: '',
      opening: '',
      emptyResp: '',
      deepThinking: false,
      multiTurn: false,
      kb: '',
      role: '',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset states when skill changes
  useEffect(() => {
    setContractMode(null);
    setContractTemplateType('框架协议');
    setSelectedPolicies([]);
  }, [selectedSkill]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    
    // Update or Create Session
    if (!activeSessionId) {
        // Simple logic to create a new session visually (no persistence backend)
        const newId = Date.now().toString();
        const newSession: ChatSession = {
            id: newId,
            title: input.length > 15 ? input.slice(0, 15) + '...' : input,
            lastMessage: input,
            updatedAt: new Date(),
            agentType: selectedSkill ? selectedSkill.name : currentAgent.type
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newId);
    } else {
        setSessions(prev => prev.map(s => 
            s.id === activeSessionId 
            ? { ...s, lastMessage: input, updatedAt: new Date() }
            : s
        ));
    }

    try {
      const agentName = selectedSkill ? selectedSkill.name : currentAgent.name;
      const systemPrompt = `你是一个专用于政府和企业平台的${agentName}智能助手。请用中文回答，保持专业、简洁。`;
      
      let policyContext = '';
      if (selectedPolicies.length > 0) {
        policyContext = `\n\n参考政策上下文：\n${selectedPolicies.map(p => `- ${p.title} (${p.type}, ${p.date})`).join('\n')}\n请基于以上政策进行回答。`;
      }

      const fullPrompt = `${systemPrompt}${policyContext}\n\n用户: ${userMsg.text}`;
      
      const responseText = await generateResponse(fullPrompt);
      const modelMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = { role: 'model', text: "抱歉，遇到了一些错误。", timestamp: new Date() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (docName: string) => {
    setCurrentViewedDoc(docName);
    setIsDocViewerOpen(true);
    setIsSidebarOpen(false);
  };

  const handleSessionClick = (session: ChatSession) => {
    setActiveSessionId(session.id);
    setSelectedPolicies([]); // Reset policies on session switch
    
    // Load historical messages
    const history = MOCK_SESSION_HISTORY[session.id] || [];
    setMessages(history);

    // Context switching: Set selected skill based on agentType if possible
    const skill = BUSINESS_AGENTS.find(a => a.name === session.agentType);
    if (skill) {
        setSelectedSkill(skill);
    } else {
        setSelectedSkill(null);
        // Try to find matching general agent type
        const agent = MOCK_AGENTS_LIST.find(a => a.type === session.agentType);
        if (agent) {
            setActiveAgentId(agent.id);
        }
    }
  };

  const handleDeleteSession = () => {
    if (sessionToDelete) {
      setSessions(prev => prev.filter(s => s.id !== sessionToDelete));
      if (activeSessionId === sessionToDelete) {
        setActiveSessionId(null);
        setMessages([]);
        setSelectedSkill(null);
      }
      setSessionToDelete(null);
    }
  };

  // Logic for populating input based on contract mode
  const handleSmartDraft = () => {
    setContractMode('smart');
    setInput("合同名称:\n合同类型与要素:\n甲方:\n乙方:");
  };

  const handleTemplateDraft = (templateType: string) => {
    setContractMode('template');
    setContractTemplateType(templateType);
    setInput(`选择模板: ${templateType}\n合同名称: <必填>\n甲方: <必填>\n乙方: <必填>\n补充条款:`);
  };

  const renderWritingForm = () => (
    <div className="mt-4 text-text-primary w-full max-w-3xl">
      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex justify-between items-center bg-surface-highlight/30">
          <span className="font-bold text-base">待填信息</span>
          <ChevronUp size={18} className="text-text-muted" />
        </div>
        <div className="p-5 space-y-6">
          {/* 1. 公文标题 */}
          <div>
            <label className="block text-sm mb-2 text-text-secondary">1、公文标题</label>
            <input type="text" value="2026年1-6月经济运行分析情况报告" readOnly className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-secondary focus:outline-none" />
          </div>
          {/* 2. 公文类型 */}
          <div>
            <label className="block text-sm mb-2 text-text-secondary">2、公文类型</label>
            <div className="relative">
              <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-secondary appearance-none focus:outline-none">
                <option>事务公文 - 情况报告</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-2.5 text-text-muted pointer-events-none" />
            </div>
          </div>
          {/* 3. 确认数据 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-text-secondary">3、确认数据</label>
              <button className="text-xs text-text-muted flex items-center gap-1 hover:text-blue-500"><Filter size={12}/> 选择数据</button>
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-green-500" />
                <span className="text-sm text-text-primary">数发局-规上企业经济运行分析核心指标表头.xlsx</span>
              </div>
              <button onClick={() => handleViewDetails('数发局-规上企业经济运行分析核心指标表头.xlsx')} className="text-xs text-blue-500 hover:underline">查看详情</button>
            </div>
          </div>
          {/* 4. 参考范文 */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-text-secondary">4、参考范文</label>
              <div className="flex items-center gap-3">
                <button className="text-xs text-text-muted flex items-center gap-1 hover:text-blue-500"><Search size={12}/> 一键检索</button>
                <button className="text-xs text-text-muted flex items-center gap-1 hover:text-blue-500"><FileSearch size={12}/> 查找文档</button>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-orange-500 mb-2">
              <AlertCircle size={12} />
              <span>因此类公文结构较为复杂，涉及数据较多，建议您选择合适的范文作为参考</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-blue-500" />
                <span className="text-sm text-text-primary">1-6月经济运行分析情况汇报</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => handleViewDetails('1-6月经济运行分析情况汇报')} className="text-xs text-blue-500 hover:underline">查看详情</button>
                <div className="w-4 h-4 rounded border border-border bg-surface-highlight flex items-center justify-center"><Check size={12} className="text-text-muted"/></div>
              </div>
            </div>
          </div>
          {/* 5. 其他参考文档 */}
          <div>
            <label className="block text-sm mb-2 text-text-secondary">5、其他参考文档</label>
            <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-background/50 cursor-pointer hover:bg-surface-highlight/50 transition-colors">
              <div className="flex items-center gap-2 text-sm text-text-primary mb-1">
                <div className="w-5 h-5 rounded-full bg-text-primary text-surface flex items-center justify-center"><Plus size={14}/></div>
                上传文件
              </div>
              <div className="text-xs text-text-muted">只支持 pdf、txt、doc、docx、md文件</div>
            </div>
          </div>
          {/* 6. 其他要求 */}
          <div>
            <label className="block text-sm mb-2 text-text-secondary">6、其他要求</label>
            <input type="text" placeholder="请输入" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none placeholder:text-text-muted" />
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button className="px-6 py-2 bg-surface-highlight text-text-muted rounded-lg text-sm font-medium cursor-not-allowed">确认</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWritingOutline = () => (
    <div className="mt-4 w-full max-w-4xl text-text-primary">
      <div className="rounded-xl">
        <h3 className="text-xl font-bold mb-6">大纲</h3>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <CheckCircle2 size={16} className="text-text-muted" /> 参考资料分析 <ChevronDown size={14} className="text-text-muted"/>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <CheckCircle2 size={16} className="text-text-muted" /> 生成大纲草稿 <ChevronDown size={14} className="text-text-muted"/>
          </div>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-center mb-8">2026年1-6月经济运行分析情况报告</h2>
          
          <div className="space-y-8">
            {/* Section 1 */}
            <div>
              <h3 className="text-lg font-bold mb-3">一、总体运行情况概述</h3>
              <p className="text-sm text-text-secondary mb-3">对2026年1-6月经济运行总体情况进行概括性描述</p>
              <ul className="list-disc pl-5 text-sm text-text-secondary space-y-1 mb-4">
                <li>概述规上企业数量变化情况（新增、退库、转出等）；说明整体营收预估完成情况（规模、同比变化、缺口分析）；明确经济运行的主要特点和趋势</li>
              </ul>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-text-muted">数据要求：</span>
                <button className="text-xs text-text-muted flex items-center gap-1 hover:text-blue-500"><Filter size={12}/> 选择数据</button>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-green-500" />
                  <span className="text-sm text-text-primary">数发局-规上企业经济运行分析核心指标表头.xlsx</span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleViewDetails('数发局-规上企业经济运行分析核心指标表头.xlsx')} className="text-xs text-blue-500 hover:underline">查看详情</button>
                  <button className="text-text-muted hover:text-red-500"><Trash2 size={14}/></button>
                </div>
              </div>
            </div>
            
            <div className="w-full h-px bg-border"></div>
  
            {/* Section 2 */}
            <div>
              <h3 className="text-lg font-bold mb-3">二、指标完成情况分析</h3>
              <p className="text-sm text-text-secondary mb-3">对主要经济指标完成情况进行详细分解和分析</p>
              <ul className="list-disc pl-5 text-sm text-text-secondary space-y-1 mb-4">
                <li>列举正增长企业及其营收与同比增长数据；列举降幅明显企业及其营收与同比降低数据；分析总体缺口形成的主要原因及影响</li>
              </ul>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-text-muted">数据要求：</span>
                <button className="text-xs text-text-muted flex items-center gap-1 hover:text-blue-500"><Filter size={12}/> 选择数据</button>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-green-500" />
                  <span className="text-sm text-text-primary">数发局-规上企业经济运行分析核心指标表头.xlsx</span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleViewDetails('数发局-规上企业经济运行分析核心指标表头.xlsx')} className="text-xs text-blue-500 hover:underline">查看详情</button>
                  <button className="text-text-muted hover:text-red-500"><Trash2 size={14}/></button>
                </div>
              </div>
            </div>
  
            <div className="w-full h-px bg-border"></div>
  
            {/* Section 3 */}
            <div>
              <h3 className="text-lg font-bold mb-3">三、经济运行影响因素分析</h3>
              <p className="text-sm text-text-secondary mb-3">从多维度深入分析影响经济运行的关键因素</p>
              <ul className="list-disc pl-5 text-sm text-text-secondary space-y-1 mb-4">
                <li>分析项目周期性对营收的影响（回款周期、项目验收等）；分析企业业务重心调整或内部变动的影响（高利润项目转向、业务范围变化等）；分析外部环境变化的影响（客户需求波动、市场环境变化等）</li>
              </ul>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-text-muted">数据要求：</span>
                <button className="text-xs text-text-muted flex items-center gap-1 hover:text-blue-500"><Filter size={12}/> 选择数据</button>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-green-500" />
                  <span className="text-sm text-text-primary">数发局-规上企业经济运行分析核心指标表头.xlsx</span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleViewDetails('数发局-规上企业经济运行分析核心指标表头.xlsx')} className="text-xs text-blue-500 hover:underline">查看详情</button>
                  <button className="text-text-muted hover:text-red-500"><Trash2 size={14}/></button>
                </div>
              </div>
            </div>
  
            <div className="w-full h-px bg-border"></div>
  
            {/* Section 4 */}
            <div>
              <h3 className="text-lg font-bold mb-3">四、下一步工作措施</h3>
              <p className="text-sm text-text-secondary mb-3">针对当前经济运行情况提出具体的工作措施和建议</p>
              <ul className="list-disc pl-5 text-sm text-text-secondary space-y-1 mb-4">
                <li>实施重点企业攻坚策略（动态跟踪、一企一策、项目纳统等）；协助企业拓展合作渠道（走访摸排、供需对接、人才培养等）；强化服务保障体系（政策支持、资金申报指导等）</li>
              </ul>
            </div>
  
          </div>
        </div>
      </div>
    </div>
  );

  const renderWritingResult = () => (
    <div className="mt-4 w-full max-w-3xl text-text-primary">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <CheckCircle2 size={16} className="text-text-muted" /> 数据指标分析 <ChevronDown size={14} className="text-text-muted"/>
        </div>
        
        <p className="text-sm">谢谢您提供的信息，按照你的要求撰写的公文如下</p>
        
        <div className="bg-surface border border-border rounded-xl p-4 shadow-sm w-80">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center shrink-0">
              <FileText size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-text-primary line-clamp-2">2026年1-6月经济运行分析情况报告</div>
              <button onClick={() => handleViewDetails('2026年1-6月经济运行分析情况报告')} className="text-xs text-blue-500 hover:underline mt-1">查看详情</button>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-text-muted hover:text-text-primary cursor-pointer border-t border-border pt-3">
            <Download size={14} /> 保存到我的文档
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-text-muted pt-2">
          <button className="hover:text-blue-500"><ThumbsUp size={16}/></button>
          <button className="hover:text-red-500"><ThumbsDown size={16}/></button>
        </div>
      </div>
    </div>
  );

  const renderConfigView = () => (
      <div className="flex h-full w-full bg-background text-text-primary animate-fade-in">
          {/* Config Sidebar */}
          <div 
            className={`flex flex-col border-r border-border bg-surface/30 shrink-0 transition-all duration-300 ease-in-out ${
              isSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden border-none'
            }`}
          >
              <div className="p-4">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 transition-all font-medium shadow-lg shadow-blue-900/20 hover:scale-[1.02]">
                      <Plus size={16} /> 新增问答助手
                  </button>
              </div>
              <div className="px-4 py-2 text-xs font-medium text-text-muted">问答助手列表</div>
              <div className="flex-1 overflow-y-auto px-2 space-y-1">
                  {MOCK_AGENTS_LIST.map(agent => (
                      <div key={agent.id} className={`flex items-center justify-between p-3 rounded-lg cursor-pointer group transition-colors ${agent.active ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'hover:bg-surface-highlight text-text-secondary border border-transparent'}`}>
                          <div className="flex items-center gap-3 overflow-hidden">
                              <Bot size={18} />
                              <span className="truncate text-sm font-medium">{agent.name}</span>
                          </div>
                          <button className="text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 size={14} />
                          </button>
                      </div>
                  ))}
              </div>
          </div>

          {/* Config Form Area */}
          <div className="flex-1 flex flex-col h-full">
               {/* Added Header with Back Button and Sidebar Toggle */}
              <div className="h-14 border-b border-border flex items-center px-4 gap-2 bg-surface/30 shrink-0">
                  <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-highlight rounded-lg transition-colors"
                    title={isSidebarOpen ? "收起侧边栏" : "展开侧边栏"}
                  >
                      {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                  </button>
                  <div className="w-px h-4 bg-border-highlight mx-2"></div>
                  <button 
                    onClick={() => setViewMode('chat')}
                    className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-highlight rounded-lg transition-colors"
                  >
                      <ArrowLeft size={20} />
                  </button>
                  <h2 className="font-bold text-text-primary ml-2">配置智能体</h2>
              </div>

              <div className="flex-1 overflow-y-auto p-8 animate-slide-up">
                  {/* ... Config form content ... */}
                  <div className="max-w-3xl mx-auto space-y-8 pb-20">
                      {/* Assistant Name */}
                      <div className="flex gap-4 items-start">
                          <label className="w-24 pt-2.5 text-right text-sm font-medium text-text-secondary"><span className="text-red-500 mr-1">*</span>助手名称:</label>
                          <div className="flex-1 relative">
                              <input 
                                  type="text" 
                                  value={configForm.name}
                                  onChange={e => setConfigForm({...configForm, name: e.target.value})}
                                  className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-blue-500 transition-colors"
                                  placeholder="请输入助手名称"
                                  maxLength={50}
                              />
                              <span className="absolute right-3 top-2.5 text-xs text-text-muted">{configForm.name.length} / 50</span>
                          </div>
                      </div>

                      {/* Description */}
                      <div className="flex gap-4 items-start">
                          <label className="w-24 pt-2.5 text-right text-sm font-medium text-text-secondary">助手描述:</label>
                          <div className="flex-1 relative">
                              <textarea 
                                  value={configForm.desc}
                                  onChange={e => setConfigForm({...configForm, desc: e.target.value})}
                                  className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-blue-500 transition-colors resize-none h-24 custom-scrollbar"
                                  placeholder="请输入助手的介绍"
                                  maxLength={2000}
                              />
                              <span className="absolute right-3 bottom-2 text-xs text-text-muted">{configForm.desc.length} / 2000</span>
                          </div>
                      </div>

                      {/* Instructions */}
                      <div className="flex gap-4 items-start">
                          <label className="w-24 pt-2.5 text-right text-sm font-medium text-text-secondary flex items-center justify-end gap-1">
                              助手提示词
                              <Info size={12} className="text-text-muted" />:
                          </label>
                          <div className="flex-1 relative">
                              <textarea 
                                  value={configForm.instructions}
                                  onChange={e => setConfigForm({...configForm, instructions: e.target.value})}
                                  className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-blue-500 transition-colors resize-none h-32 custom-scrollbar"
                                  placeholder="请输入助手提示词"
                                  maxLength={2000}
                              />
                              <span className="absolute right-3 bottom-2 text-xs text-text-muted">{configForm.instructions.length} / 2000</span>
                          </div>
                      </div>

                      {/* Opening */}
                      <div className="flex gap-4 items-start">
                          <label className="w-24 pt-2.5 text-right text-sm font-medium text-text-secondary">助手开场白:</label>
                          <div className="flex-1 relative">
                              <textarea 
                                  value={configForm.opening}
                                  onChange={e => setConfigForm({...configForm, opening: e.target.value})}
                                  className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-blue-500 transition-colors resize-none h-24 custom-scrollbar"
                                  placeholder="请输入助手的开场白"
                                  maxLength={2000}
                              />
                              <span className="absolute right-3 bottom-2 text-xs text-text-muted">{configForm.opening.length} / 2000</span>
                          </div>
                      </div>

                      {/* Empty Response */}
                      <div className="flex gap-4 items-start">
                          <label className="w-24 pt-2.5 text-right text-sm font-medium text-text-secondary">空回复:</label>
                          <div className="flex-1 relative">
                              <textarea 
                                  value={configForm.emptyResp}
                                  onChange={e => setConfigForm({...configForm, emptyResp: e.target.value})}
                                  className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-blue-500 transition-colors resize-none h-24 custom-scrollbar"
                                  placeholder="当没有检索到有用的知识时，你想让大模型怎么回复？如果不填，则让大模型自由发挥进行回复"
                                  maxLength={2000}
                              />
                              <span className="absolute right-3 bottom-2 text-xs text-text-muted">{configForm.emptyResp.length} / 2000</span>
                          </div>
                      </div>

                      {/* QA Params */}
                      <div className="flex gap-4 items-center">
                          <label className="w-24 text-right text-sm font-medium text-text-secondary">问答参数:</label>
                          <div className="flex-1">
                              <div className="relative w-full">
                                <select className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer">
                                    <option>请选择</option>
                                    <option>精确匹配</option>
                                    <option>模糊匹配</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-2.5 text-text-muted pointer-events-none" />
                              </div>
                          </div>
                      </div>

                      {/* Toggles */}
                      <div className="flex gap-4 items-center">
                          <label className="w-24 text-right text-sm font-medium text-text-secondary">深度思考:</label>
                          <button 
                            onClick={() => setConfigForm({...configForm, deepThinking: !configForm.deepThinking})}
                            className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${configForm.deepThinking ? 'bg-blue-600' : 'bg-border-highlight'}`}
                          >
                              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 left-1 transition-transform duration-200 ${configForm.deepThinking ? 'translate-x-5' : 'translate-x-0'}`}></div>
                          </button>
                      </div>

                      <div className="flex gap-4 items-center">
                          <label className="w-24 text-right text-sm font-medium text-text-secondary">支持多轮对话:</label>
                          <button 
                            onClick={() => setConfigForm({...configForm, multiTurn: !configForm.multiTurn})}
                            className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${configForm.multiTurn ? 'bg-blue-600' : 'bg-border-highlight'}`}
                          >
                              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 left-1 transition-transform duration-200 ${configForm.multiTurn ? 'translate-x-5' : 'translate-x-0'}`}></div>
                          </button>
                      </div>

                      {/* Knowledge Base */}
                      <div className="flex gap-4 items-start">
                          <label className="w-24 pt-2.5 text-right text-sm font-medium text-text-secondary"><span className="text-red-500 mr-1">*</span>知识库配置:</label>
                          <div className="flex-1 space-y-1">
                              <div className="relative w-full">
                                <select 
                                    value={configForm.kb}
                                    onChange={e => setConfigForm({...configForm, kb: e.target.value})}
                                    className={`w-full bg-surface border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer ${!configForm.kb ? 'border-red-500/50' : 'border-border'}`}
                                >
                                    <option value="">请选择知识库</option>
                                    <option value="kb1">纺织行业政策库</option>
                                    <option value="kb2">企业合规知识库</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-2.5 text-text-muted pointer-events-none" />
                              </div>
                              {!configForm.kb && <div className="text-xs text-red-500 pl-1">请选择知识库</div>}
                          </div>
                      </div>

                      {/* Role Config */}
                      <div className="flex gap-4 items-start">
                          <label className="w-24 pt-2.5 text-right text-sm font-medium text-text-secondary"><span className="text-red-500 mr-1">*</span>角色配置:</label>
                          <div className="flex-1 space-y-1">
                              <div className="relative w-full">
                                <select 
                                    value={configForm.role}
                                    onChange={e => setConfigForm({...configForm, role: e.target.value})}
                                    className={`w-full bg-surface border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer ${!configForm.role ? 'border-red-500/50' : 'border-border'}`}
                                >
                                    <option value="">请选择角色</option>
                                    <option value="role1">政策分析专员</option>
                                    <option value="role2">法律顾问</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-2.5 text-text-muted pointer-events-none" />
                              </div>
                              {!configForm.role && <div className="text-xs text-red-500 pl-1">请选择角色</div>}
                          </div>
                      </div>

                       {/* Status */}
                       <div className="flex gap-4 items-center">
                          <label className="w-24 text-right text-sm font-medium text-text-secondary">助手状态:</label>
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded">
                               <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                               已上线
                          </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-4 pl-28 pt-4">
                          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20 hover:scale-105 transform duration-200">
                              保存
                          </button>
                          <button className="px-6 py-2 bg-surface border border-border hover:bg-surface-highlight text-text-secondary rounded-lg text-sm font-medium transition-colors hover:border-text-muted">
                              上线
                          </button>
                          <button className="px-6 py-2 bg-surface border border-border hover:bg-surface-highlight text-text-secondary rounded-lg text-sm font-medium transition-colors hover:border-text-muted">
                              下线
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const filteredSessions = agentFilter === '全部' 
    ? sessions 
    : sessions.filter(s => s.agentType === agentFilter);

  const renderChatView = () => (
      <div className="flex h-full bg-background text-text-primary">
          {/* Sidebar - Floating Cards Style */}
          <div 
            className={`flex flex-col border-r border-border/50 bg-background/50 shrink-0 transition-all duration-300 ease-in-out ${
              isSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden border-none'
            }`}
          >
            <div className="p-4 space-y-4">
                {/* New Chat Button */}
                <button 
                  onClick={() => {
                      setSelectedSkill(null);
                      setMessages([]);
                      setInput('');
                      setActiveSessionId(null);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 transition-all font-medium shadow-lg shadow-blue-900/20 hover:scale-[1.02]"
                >
                    <Plus size={18} /> 新建对话
                </button>
                
                {/* Search & Filter */}
                <div className="flex gap-2">
                    <div className="relative group/filter shrink-0">
                        <div className="flex items-center justify-center w-10 h-10 bg-surface-highlight border border-border-highlight rounded-lg cursor-pointer hover:bg-border-highlight transition-colors">
                            <Filter size={16} className={agentFilter !== '全部' ? 'text-blue-500' : 'text-text-muted'} />
                        </div>
                        {/* Filter Dropdown */}
                        <div className="absolute top-full left-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-xl overflow-hidden max-h-64 overflow-y-auto custom-scrollbar z-30 opacity-0 invisible group-hover/filter:opacity-100 group-hover/filter:visible transition-all duration-200 transform origin-top-left flex flex-col">
                            <div className="p-2 border-b border-border-highlight text-xs text-text-muted font-medium">智能体筛选</div>
                            <button 
                                onClick={() => setAgentFilter('全部')} 
                                className={`w-full text-left px-3 py-2 text-xs hover:bg-surface-highlight transition-colors ${agentFilter === '全部' ? 'text-blue-500 bg-blue-500/10' : 'text-text-secondary'}`}
                            >
                                全部
                            </button>
                            {[
                                AgentType.ContentQuery,
                                AgentType.Writing,
                                AgentType.IndustryAnalysis,
                                AgentType.ChainAnalysis,
                                AgentType.EnterpriseRec,
                                AgentType.PolicyGen,
                                AgentType.EnterpriseProfile,
                                AgentType.PolicyDeduction,
                                AgentType.GovernanceRights,
                                AgentType.ContractGen,
                                AgentType.ContractReview
                            ].map(type => (
                                <button 
                                    key={type} 
                                    onClick={() => setAgentFilter(type)} 
                                    className={`w-full text-left px-3 py-2 text-xs hover:bg-surface-highlight transition-colors flex items-center gap-2 ${agentFilter === type ? 'text-blue-500 bg-blue-500/10' : 'text-text-secondary'}`}
                                >
                                    {AGENT_ICONS[type]}
                                    <span className="truncate">{type}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="relative group flex-1">
                        <Search className="absolute left-3 top-2.5 text-text-muted group-focus-within:text-text-secondary transition-colors" size={16} />
                        <input 
                            type="text" 
                            placeholder="搜索..." 
                            className="w-full pl-9 pr-3 py-2 bg-transparent border border-border-highlight rounded-lg text-sm text-text-secondary focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-text-muted"
                        />
                    </div>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 custom-scrollbar">
              <div className="px-1 text-xs font-semibold text-text-muted uppercase tracking-wider">最近</div>
              {filteredSessions.map(session => (
                <div 
                    key={session.id} 
                    onClick={() => handleSessionClick(session)}
                    className={`p-3 border rounded-xl shadow-sm cursor-pointer flex items-start gap-3 transition-all group hover:translate-x-1 duration-200 relative ${
                        activeSessionId === session.id 
                        ? 'bg-surface-highlight border-border-highlight' 
                        : 'bg-surface border-border hover:border-border-highlight'
                    }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      activeSessionId === session.id 
                      ? 'bg-blue-600/20 text-blue-500' 
                      : 'bg-surface-highlight text-text-muted group-hover:bg-blue-600/10 group-hover:text-blue-500'
                  }`}>
                     {AGENT_ICONS[session.agentType as string] || <MessageSquare size={16} />}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <div className="flex justify-between items-start">
                        <div className={`text-sm font-medium truncate pr-6 transition-colors ${activeSessionId === session.id ? 'text-blue-400' : 'text-text-primary group-hover:text-blue-400'}`}>
                            {session.title}
                        </div>
                        <span className="text-[10px] text-text-muted shrink-0 mt-0.5 group-hover:opacity-0 transition-opacity absolute right-3">
                            {session.updatedAt > new Date(Date.now() - 86400000) ? '今天' : 
                             session.updatedAt > new Date(Date.now() - 172800000) ? '昨天' : 
                             `${session.updatedAt.getMonth() + 1}/${session.updatedAt.getDate()}`}
                        </span>
                    </div>
                    <div className="text-xs text-text-muted truncate mt-1 group-hover:text-text-secondary">{session.lastMessage}</div>
                  </div>
                  
                  {/* Delete Button */}
                  <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setSessionToDelete(session.id);
                    }}
                    className="absolute right-2 top-2 p-1.5 text-text-muted hover:text-red-400 hover:bg-border-highlight/50 rounded-md opacity-0 group-hover:opacity-100 transition-all z-10"
                    title="删除对话"
                  >
                      <Trash2 size={14} />
                  </button>
                </div>
              ))}
              
               <div className="px-1 text-xs font-semibold text-text-muted uppercase tracking-wider mt-6">更早</div>
               <div className="p-3 bg-surface border border-border rounded-xl shadow-sm opacity-60 hover:opacity-100 transition-all cursor-pointer flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-highlight flex items-center justify-center shrink-0 text-text-muted">
                     <MessageSquare size={16} />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <div className="text-sm font-medium text-text-primary truncate">年度总结报告大纲</div>
                    <div className="text-xs text-text-muted truncate mt-1">请帮我列出2023年度...</div>
                  </div>
                </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col relative bg-background overflow-hidden">
            
            {/* Header Toolbar - Sidebar Toggle & Agent Actions */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-3 pointer-events-none">
                 {/* Collapse/Expand Sidebar */}
                 <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="pointer-events-auto p-2 bg-surface/50 backdrop-blur-md border border-border/50 text-text-secondary hover:text-text-primary hover:bg-surface-highlight rounded-lg transition-colors shadow-sm"
                    title={isSidebarOpen ? "收起侧边栏" : "展开侧边栏"}
                 >
                     {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                 </button>

                 {/* New Chat Button (Visible only when sidebar is closed) */}
                 {!isSidebarOpen && (
                    <button 
                      onClick={() => {
                          setSelectedSkill(null);
                          setMessages([]);
                          setInput('');
                          setActiveSessionId(null);
                      }}
                      className="pointer-events-auto p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:scale-105"
                      title="新建对话"
                    >
                        <Plus size={18} />
                    </button>
                 )}

                 {/* Create Agent - Hidden when skill is selected */}
                 {!selectedSkill && (
                     <button 
                        onClick={() => setViewMode('config')}
                        className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 bg-surface/50 backdrop-blur-md border border-border/50 text-text-primary hover:text-text-primary hover:bg-surface-highlight rounded-lg transition-colors text-xs font-medium shadow-sm hover:scale-105 duration-200"
                     >
                         <UserPlus size={16} className="text-blue-500"/>
                         <span>创建智能体</span>
                     </button>
                 )}
            </div>

            {/* Messages / Welcome Screen */}
            <div className="flex-1 overflow-y-auto">
              {messages.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center p-8 overflow-y-auto custom-scrollbar animate-fade-in">
                     <div className="w-full max-w-4xl flex flex-col items-center">
                        <h2 className="text-4xl font-bold text-text-primary mb-8 tracking-tight mt-10 animate-slide-up text-center">
                            {selectedSkill ? selectedSkill.desc : "下午好，小市"}
                        </h2>
                        
                        {/* Central Input Box */}
                        <div className="w-full bg-surface border border-border rounded-2xl shadow-2xl p-4 min-h-[160px] flex flex-col justify-between mb-8 group focus-within:border-blue-500/30 transition-all relative animate-slide-up delay-100">
                            {/* Agent Selector Inside Input - New Dropdown Style */}
                            <div className="absolute top-4 left-4 z-20 flex gap-4">
                                {selectedSkill ? (
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-highlight border border-border-highlight animate-scale-in">
                                        <span className="text-blue-500">{selectedSkill.icon}</span>
                                        <span className="text-sm font-medium text-text-primary">{selectedSkill.name}</span>
                                        <button 
                                           onClick={(e) => { e.stopPropagation(); setSelectedSkill(null); }}
                                           className="ml-1 text-text-muted hover:text-text-primary transition-colors p-0.5 rounded-full hover:bg-border-highlight"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative group/agent-select">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-highlight border border-border-highlight hover:border-blue-500/50 hover:bg-border-highlight transition-all cursor-pointer">
                                            <span className="text-blue-500">{AGENT_ICONS[currentAgent.type || AgentType.ContentQuery]}</span>
                                            <span className="text-xs font-medium text-text-primary">{currentAgent.name}</span>
                                            <ChevronDown size={12} className="text-text-muted group-hover/agent-select:rotate-180 transition-transform"/>
                                        </div>
                                        
                                        {/* Dropdown Menu */}
                                        <div className="absolute top-full left-0 mt-1 w-48 bg-surface border border-border rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar opacity-0 invisible group-hover/agent-select:opacity-100 group-hover/agent-select:visible transition-all duration-200 transform origin-top-left flex flex-col">
                                            {MOCK_AGENTS_LIST.map(agent => (
                                                <button 
                                                    key={agent.id} 
                                                    onClick={() => setActiveAgentId(agent.id)}
                                                    className={`flex items-center gap-2 w-full text-left px-3 py-2 text-xs hover:bg-surface-highlight transition-colors ${activeAgentId === agent.id ? 'text-blue-500 bg-blue-500/10' : 'text-text-secondary'}`}
                                                >
                                                    {AGENT_ICONS[agent.type] || <Bot size={14} />}
                                                    <span className="truncate">{agent.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Smart Draft Options (Visible only for Contract Generation) */}
                                {selectedSkill?.name === AgentType.ContractGen && (
                                    <div className="flex items-center gap-2 animate-fade-in">
                                        <button 
                                            onClick={handleSmartDraft}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${contractMode === 'smart' ? 'bg-blue-600 text-white border-blue-500' : 'bg-surface-highlight text-text-secondary border-border-highlight hover:bg-border-highlight'}`}
                                        >
                                            智能起草
                                        </button>
                                        <button 
                                            onClick={() => handleTemplateDraft('框架协议')}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${contractMode === 'template' ? 'bg-blue-600 text-white border-blue-500' : 'bg-surface-highlight text-text-secondary border-border-highlight hover:bg-border-highlight'}`}
                                        >
                                            模板起草
                                        </button>
                                    </div>
                                )}

                                 {/* Policy Select Option (Visible only for Policy Deduction) */}
                                {selectedSkill?.name === AgentType.PolicyDeduction && (
                                    <div className="flex items-center gap-2 animate-fade-in">
                                        <button 
                                            onClick={() => setIsPolicyModalOpen(true)}
                                            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border bg-surface-highlight text-text-secondary border-border-highlight hover:bg-border-highlight flex items-center gap-1"
                                        >
                                            <FileText size={12} />
                                            选择政策 ({selectedPolicies.length})
                                        </button>
                                    </div>
                                )}
                            </div>

                             {/* Template Select Overlay for Template Draft Mode */}
                             {selectedSkill?.name === AgentType.ContractGen && contractMode === 'template' && (
                                <div className="absolute top-14 right-4 z-20 flex items-center gap-2 bg-surface-highlight/80 backdrop-blur p-1 rounded-lg border border-border-highlight animate-slide-in-right">
                                    <span className="text-xs text-text-secondary pl-2">选择模板:</span>
                                    <div className="relative">
                                        <select 
                                            value={contractTemplateType}
                                            onChange={(e) => handleTemplateDraft(e.target.value)}
                                            className="appearance-none bg-background border border-border-highlight rounded text-xs text-text-primary py-1 pl-2 pr-6 focus:outline-none focus:border-blue-500 cursor-pointer hover:bg-surface-highlight transition-colors"
                                        >
                                            <option value="框架协议">框架协议</option>
                                            <option value="投资协议">投资协议</option>
                                            <option value="电商补贴协议">电商补贴协议</option>
                                        </select>
                                        <ChevronDown size={12} className="absolute right-2 top-1.5 text-text-muted pointer-events-none" />
                                    </div>
                                </div>
                            )}

                             {/* Selected Policies Display (Inside Input Area) */}
                             {selectedSkill?.name === AgentType.PolicyDeduction && selectedPolicies.length > 0 && (
                                <div className="absolute top-14 left-4 right-4 z-10 flex flex-wrap gap-2 animate-fade-in pointer-events-none">
                                    {selectedPolicies.map(p => (
                                        <div key={p.id} className="flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-xs pointer-events-auto">
                                            <span className="truncate max-w-[150px]">{p.title}</span>
                                            <button onClick={() => setSelectedPolicies(prev => prev.filter(i => i.id !== p.id))} className="hover:text-white"><X size={12}/></button>
                                        </div>
                                    ))}
                                </div>
                             )}


                            <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                                // Backspace to delete selected skill
                                if (e.key === 'Backspace' && input === '' && selectedSkill) {
                                    setSelectedSkill(null);
                                }
                            }}
                            placeholder="想问点什么？"
                            className={`w-full bg-transparent text-text-primary text-lg placeholder:text-text-muted border-none focus:ring-0 resize-none h-full outline-none font-mono ${selectedSkill?.name === AgentType.PolicyDeduction && selectedPolicies.length > 0 ? 'pt-20' : 'pt-10'}`}
                            />
                            <div className="flex justify-between items-center pt-2">
                                <div className="flex items-center gap-3">
                                    <button className="text-text-muted hover:text-text-secondary transition-colors p-1.5 hover:bg-surface-highlight rounded-lg hover:scale-110">
                                        <Paperclip size={18} />
                                    </button>
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-highlight/50 text-text-secondary hover:bg-surface-highlight transition-colors text-xs font-medium border border-border hover:scale-105">
                                        <Sparkles size={14} />
                                        深度思考
                                    </button>
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-highlight/50 text-text-secondary hover:bg-surface-highlight transition-colors text-xs font-medium border border-border hover:scale-105">
                                        <Search size={14} />
                                        联网搜索
                                    </button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={handleSend}
                                        disabled={!input.trim()}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${input.trim() ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20 hover:scale-105' : 'bg-surface-highlight text-text-muted cursor-not-allowed'}`}
                                    >
                                        <ArrowUp size={18} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Skills - Pill Style with Wrap */}
                        {!selectedSkill && (
                            <div className="w-full max-w-4xl px-4 animate-slide-up delay-200">
                                <div className="flex flex-wrap justify-center gap-3">
                                {BUSINESS_AGENTS.map((skill, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => setSelectedSkill(skill)}
                                        className="flex items-center gap-2 px-5 py-3 bg-surface border border-border rounded-full hover:bg-surface-highlight hover:border-border-highlight transition-all group shadow-sm hover:shadow-md hover:scale-105 duration-200"
                                    >
                                        <div className="group-hover:scale-110 transition-transform duration-200">
                                            {skill.icon}
                                        </div>
                                        <span className="text-sm font-medium text-text-secondary">{skill.name}</span>
                                    </button>
                                ))}
                                </div>
                            </div>
                        )}
                     </div>
                 </div>
              ) : (
                <div className="max-w-4xl mx-auto flex flex-col gap-6 p-4 pt-24 pb-32">
                    {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-up`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'model' ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white' : 'bg-border-highlight text-text-secondary'}`}>
                        {msg.role === 'model' ? <Bot size={18} /> : <UserCheck size={18} />}
                        </div>
                        <div className={`max-w-[80%] rounded-2xl p-4 shadow-md ${msg.role === 'model' ? 'bg-transparent text-text-primary' : 'bg-surface-highlight text-text-primary'}`}>
                            {msg.role === 'model' && msg.type && (
                                <div className="text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                    政务AI写作助手
                                </div>
                            )}
                            {msg.type ? (
                                <div className="w-full">
                                    {msg.type === 'writing_form' && (
                                        <>
                                            <div className="text-sm text-text-primary mb-2">{msg.text}</div>
                                            {renderWritingForm()}
                                        </>
                                    )}
                                    {msg.type === 'writing_outline' && renderWritingOutline()}
                                    {msg.type === 'writing_result' && renderWritingResult()}
                                </div>
                            ) : (
                                <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.text}</p>
                            )}
                        </div>
                    </div>
                    ))}
                    {isLoading && (
                    <div className="flex gap-4 animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
                        <Bot size={18} />
                    </div>
                    <div className="bg-transparent rounded-lg p-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Floating Input Area (Only visible when there are messages) */}
            {messages.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent z-20 animate-fade-in">
                <div className="max-w-4xl mx-auto relative">
                    <div className="bg-surface border border-border rounded-3xl shadow-2xl p-2 flex flex-col relative group focus-within:border-blue-500/50 transition-colors">
                         {/* Agent Selector Pill Floating Input - New Dropdown Style */}
                         <div className="flex items-center gap-2 px-4 pt-2 flex-wrap">
                            <div className="relative inline-block group/agent-select">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-highlight border border-border-highlight hover:border-blue-500/50 transition-all cursor-pointer">
                                    {selectedSkill ? (
                                        <>
                                            <span className="text-blue-500">{selectedSkill.icon}</span>
                                            <span className="text-xs font-medium text-text-secondary">{selectedSkill.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-blue-500">{AGENT_ICONS[currentAgent.type || AgentType.ContentQuery]}</span>
                                            <span className="text-xs font-medium text-text-secondary">{currentAgent.name}</span>
                                        </>
                                    )}
                                    <ChevronDown size={12} className="text-text-muted group-hover/agent-select:rotate-180 transition-transform" />
                                </div>
                                
                                <div className="absolute bottom-full left-0 mb-1 w-48 bg-surface border border-border rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar opacity-0 invisible group-hover/agent-select:opacity-100 group-hover/agent-select:visible transition-all duration-200 transform origin-bottom-left flex flex-col">
                                    {MOCK_AGENTS_LIST.map(agent => (
                                        <button 
                                            key={agent.id} 
                                            onClick={() => { setActiveAgentId(agent.id); setSelectedSkill(null); }}
                                            className={`flex items-center gap-2 w-full text-left px-3 py-2 text-xs hover:bg-surface-highlight transition-colors ${activeAgentId === agent.id && !selectedSkill ? 'text-blue-500 bg-blue-500/10' : 'text-text-secondary'}`}
                                        >
                                            {AGENT_ICONS[agent.type] || <Bot size={14} />}
                                            <span className="truncate">{agent.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                             {/* Policy Select Option (Visible only for Policy Deduction) */}
                             {selectedSkill?.name === AgentType.PolicyDeduction && (
                                <button 
                                    onClick={() => setIsPolicyModalOpen(true)}
                                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border bg-surface-highlight text-text-secondary border-border-highlight hover:bg-border-highlight flex items-center gap-1"
                                >
                                    <FileText size={12} />
                                    选择政策 ({selectedPolicies.length})
                                </button>
                            )}
                         </div>

                        {/* Selected Policies Display (Inside Floating Input Area) */}
                        {selectedSkill?.name === AgentType.PolicyDeduction && selectedPolicies.length > 0 && (
                        <div className="flex flex-wrap gap-2 px-4 pt-2 pb-0">
                            {selectedPolicies.map(p => (
                                <div key={p.id} className="flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-xs">
                                    <span className="truncate max-w-[150px]">{p.title}</span>
                                    <button onClick={() => setSelectedPolicies(prev => prev.filter(i => i.id !== p.id))} className="hover:text-white"><X size={12}/></button>
                                </div>
                            ))}
                        </div>
                        )}

                        <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                            }
                        }}
                        placeholder={`...`}
                        className="w-full bg-transparent text-text-primary rounded-xl pl-4 pr-12 py-2 focus:outline-none resize-none h-[48px] placeholder:text-text-muted font-mono"
                        />
                        
                        <div className="flex justify-between items-center px-2 pb-1 pt-1">
                            <div className="flex items-center gap-2 text-text-muted">
                                <button className="p-2 hover:bg-surface-highlight rounded-full transition-colors hover:text-text-primary hover:scale-110" title="深度思考">
                                    <Sparkles size={16} />
                                </button>
                                <button className="p-2 hover:bg-surface-highlight rounded-full transition-colors hover:text-text-primary hover:scale-110" title="上传图片">
                                    <ImageIcon size={16} />
                                </button>
                            </div>
                            <button 
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:bg-surface-highlight disabled:text-text-muted transition-all flex items-center justify-center shadow-lg shadow-blue-900/30 hover:scale-105"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                    <div className="text-center mt-3">
                        <p className="text-xs text-text-muted">内容由 AI 生成，请仔细甄别</p>
                    </div>
                </div>
                </div>
            )}
          </div>

          {/* Policy Selection Modal */}
          {isPolicyModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
                    <div className="bg-surface rounded-xl shadow-2xl w-[600px] max-h-[80vh] flex flex-col border border-border animate-scale-in">
                        <div className="p-4 border-b border-border flex justify-between items-center bg-surface-highlight">
                            <h3 className="font-semibold text-text-primary flex items-center gap-2">
                                <BookOpen size={18} className="text-blue-500"/>
                                政策库内容
                            </h3>
                            <button onClick={() => setIsPolicyModalOpen(false)}><X size={20} className="text-text-muted hover:text-text-primary"/></button>
                        </div>
                        <div className="p-4 border-b border-border bg-surface-highlight/50">
                             <div className="relative">
                                <Search className="absolute left-3 top-2.5 text-text-muted" size={16} />
                                <input type="text" placeholder="搜索政策标题..." className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-blue-500/50" />
                             </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            {MOCK_POLICIES.map(policy => {
                                const isSelected = selectedPolicies.some(p => p.id === policy.id);
                                return (
                                    <div 
                                        key={policy.id} 
                                        onClick={() => {
                                            if (isSelected) setSelectedPolicies(prev => prev.filter(p => p.id !== policy.id));
                                            else setSelectedPolicies(prev => [...prev, policy]);
                                        }}
                                        className={`p-3 rounded-lg border mb-2 cursor-pointer transition-all flex items-center justify-between group ${isSelected ? 'bg-blue-600/10 border-blue-500/50' : 'bg-surface border-border hover:border-border-highlight'}`}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className={`font-medium text-sm truncate ${isSelected ? 'text-blue-400' : 'text-text-primary'}`}>{policy.title}</div>
                                            <div className="text-xs text-text-muted mt-1 flex gap-3">
                                                <span>{policy.organ}</span>
                                                <span>{policy.date}</span>
                                            </div>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-border-highlight group-hover:border-text-muted'}`}>
                                            {isSelected && <CheckCircle2 size={12} className="text-white"/>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="p-4 border-t border-border bg-surface-highlight flex justify-between items-center">
                            <span className="text-sm text-text-muted">已选 {selectedPolicies.length} 项</span>
                            <button onClick={() => setIsPolicyModalOpen(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                                确认引用
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Session Confirmation Modal */}
            {sessionToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
                    <div className="bg-surface rounded-xl shadow-2xl w-[400px] p-6 border border-border animate-scale-in flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                            <Trash2 size={24} className="text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold text-text-primary mb-2">确认删除对话？</h3>
                        <p className="text-sm text-text-muted mb-6">
                            删除后，该对话记录将无法恢复。
                        </p>
                        <div className="flex gap-3 w-full">
                            <button 
                                onClick={() => setSessionToDelete(null)}
                                className="flex-1 px-4 py-2 bg-surface hover:bg-surface-highlight text-text-secondary rounded-lg text-sm font-medium transition-colors border border-border"
                            >
                                取消
                            </button>
                            <button 
                                onClick={handleDeleteSession}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-red-900/20"
                            >
                                确认删除
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Document Viewer Pane */}
            <div 
                className={`flex flex-col border-l border-border bg-surface shrink-0 transition-all duration-300 ease-in-out ${
                    isDocViewerOpen ? 'w-[400px] xl:w-[500px] opacity-100' : 'w-0 opacity-0 overflow-hidden border-none'
                }`}
            >
                <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-surface-highlight/30 shrink-0">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <FileText size={16} className="text-blue-500 shrink-0" />
                        <h3 className="font-medium text-sm text-text-primary truncate">{currentViewedDoc}</h3>
                    </div>
                    <button 
                        onClick={() => setIsDocViewerOpen(false)}
                        className="p-1.5 text-text-muted hover:text-text-primary hover:bg-border-highlight rounded-lg transition-colors shrink-0"
                    >
                        <X size={16} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-background">
                    {/* Mock Content based on doc type */}
                    <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
                        {currentViewedDoc.includes('.xlsx') ? (
                            <div className="border border-border rounded-lg overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-surface-highlight text-text-primary">
                                        <tr><th className="p-2 border-b border-border">企业名称</th><th className="p-2 border-b border-border">所属行业</th><th className="p-2 border-b border-border">本月营收(万元)</th><th className="p-2 border-b border-border">同比增速</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr><td className="p-2 border-b border-border">示例科技公司A</td><td className="p-2 border-b border-border">电子信息</td><td className="p-2 border-b border-border">1,250</td><td className="p-2 border-b border-border text-green-500">+15.2%</td></tr>
                                        <tr><td className="p-2 border-b border-border">示例制造公司B</td><td className="p-2 border-b border-border">装备制造</td><td className="p-2 border-b border-border">890</td><td className="p-2 border-b border-border text-red-500">-5.4%</td></tr>
                                        <tr><td className="p-2 border-b border-border">示例新材料C</td><td className="p-2 border-b border-border">新材料</td><td className="p-2 border-b border-border">3,420</td><td className="p-2 border-b border-border text-green-500">+22.1%</td></tr>
                                        <tr><td className="p-2 border-b border-border">示例纺织公司D</td><td className="p-2 border-b border-border">纺织服装</td><td className="p-2 border-b border-border">560</td><td className="p-2 border-b border-border text-red-500">-12.3%</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-lg font-bold text-text-primary text-center mb-6">{currentViewedDoc.replace('.docx', '').replace('.pdf', '')}</h2>
                                <p>一、总体情况</p>
                                <p>今年以来，面对复杂严峻的外部环境，全市上下坚持稳中求进工作总基调，完整、准确、全面贯彻新发展理念，加快构建新发展格局，着力推动高质量发展，经济运行总体平稳、稳中有进。</p>
                                <p>二、主要指标完成情况</p>
                                <p>1-6月，全市实现地区生产总值（GDP）同比增长5.5%。其中，第一产业增加值增长3.2%；第二产业增加值增长6.1%；第三产业增加值增长5.2%。</p>
                                <p>规上工业增加值同比增长6.8%，固定资产投资同比增长4.5%，社会消费品零售总额同比增长5.0%。</p>
                                <p>三、存在的主要问题</p>
                                <p>一是部分传统行业恢复较慢，有效需求仍然不足；二是企业盈利空间受到挤压，部分中小微企业经营困难；三是外部环境不确定性增加，出口面临一定压力。</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
      </div>
  );

  return viewMode === 'config' ? renderConfigView() : renderChatView();
};

export default AgentView;
