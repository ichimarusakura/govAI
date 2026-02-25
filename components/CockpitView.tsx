import React, { useState, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area
} from 'recharts';
import { LayoutDashboard, Search, Building, ChevronLeft, MoreHorizontal, X, MapPin, Calendar, Users, Filter, ChevronDown, FileText, AlertTriangle, Lightbulb, TrendingUp, Globe2, Bot } from 'lucide-react';
import { ScreenType } from '../App';

// --- MOCK DATA ---

// Governance Screen Specific Data
const GOV_STATS = [
  { label: '诉求总量', value: '9818', unit: '件', color: 'text-white' },
  { label: '办结量', value: '8025', unit: '件', color: 'text-white' },
  { label: '按期办结率', value: '99.8', unit: '%', color: 'text-blue-400' },
  { label: '满意度', value: '91.4', unit: '%', color: 'text-blue-400' },
];

const APPEAL_DISTRIBUTION = [
  { name: '投诉', value: 7818, percent: '79.6%' },
  { name: '求助', value: 829, percent: '8.4%' },
  { name: '建议', value: 641, percent: '6.5%' },
  { name: '咨询', value: 406, percent: '4.1%' },
  { name: '举报', value: 120, percent: '1.2%' },
  { name: '表扬', value: 4, percent: '0.0%' },
];
// Colors matching the image: Blue, Cyan, Purple, Green, Orange, Yellow
const GOV_COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const DEPT_PROCESS_DATA = [
  { name: '区属单位', value: 7553 },
  { name: '街道办事处', value: 2074 },
  { name: '国企', value: 191 },
];

const HOT_ISSUES_RANK = [
  { name: '劳动纠纷', count: 1806, percent: 18.4, color: '#f59e0b' },
  { name: '物业服务', count: 1217, percent: 12.4, color: '#8b5cf6' },
  { name: '消费纠纷', count: 935, percent: 9.5, color: '#ef4444' },
  { name: '人居环境', count: 673, percent: 6.9, color: '#10b981' },
  { name: '市容管理', count: 514, percent: 5.2, color: '#3b82f6' },
];

const OVERDUE_TREND_DATA = [
  { name: '8-01', value: 7.2 },
  { name: '8-05', value: 7.1 },
  { name: '8-10', value: 7.0 },
  { name: '8-15', value: 6.9 },
  { name: '8-20', value: 6.8 },
  { name: '8-25', value: 6.9 },
  { name: '8-30', value: 7.0 },
];

// Industry Screen Data
const BASE_CITY_RANK_DATA = [
  { name: '苏州市', count: 98 },
  { name: '广州市', count: 88 },
  { name: '杭州市', count: 70 },
  { name: '宁波市', count: 68 },
  { name: '常州市', count: 55 },
  { name: '青岛市', count: 53 },
  { name: '无锡市', count: 50 },
  { name: '温州市', count: 48 },
  { name: '佛山市', count: 32 },
  { name: '南京市', count: 28 },
];

const BASE_MONITORING_LIST = [
    { id: 1, name: '盛虹控股集团有限公司', tags: ['服装纺织', '高新技术'], region: '江苏', city: '苏州市' },
    { id: 2, name: '恒力集团', tags: ['服装纺织', '世界500强'], region: '江苏', city: '苏州市' },
    { id: 3, name: '宝武钢铁集团', tags: ['钢铁', '央企'], region: '上海', city: '上海市' },
    { id: 4, name: '沙钢集团', tags: ['钢铁', '民营巨头'], region: '江苏', city: '苏州市' },
    { id: 5, name: '徐工集团', tags: ['装备制造', '国企'], region: '江苏', city: '徐州市' },
    { id: 6, name: '亨通集团', tags: ['光通信', '高新'], region: '江苏', city: '苏州市' },
    { id: 7, name: '广汽集团', tags: ['装备制造', '汽车'], region: '广东', city: '广州市' },
    { id: 8, name: '美的集团', tags: ['装备制造', '家电'], region: '广东', city: '佛山市' },
    { id: 9, name: '吉利控股', tags: ['装备制造', '汽车'], region: '浙江', city: '杭州市' },
    { id: 10, name: '荣盛石化', tags: ['服装纺织', '化工'], region: '浙江', city: '杭州市' },
];

interface EnterpriseDetail {
    id: number;
    name: string;
    legalRep: string;
    region: string;
    capital: string;
    staff: string;
    date: string;
    type: string;
    patents: number;
    status: string;
    taxReg: string;
    address: string;
    scope: string;
}

const MOCK_ENTERPRISE_DETAILS: Record<number, EnterpriseDetail> = {
    1: {
        id: 1,
        name: '盛虹控股集团有限公司',
        legalRep: '缪汉根',
        region: '江苏省苏州市',
        capital: '500,000万人民币',
        staff: '5000-9999人',
        date: '1992-05-18',
        type: '有限责任公司',
        patents: 452,
        status: '存续',
        taxReg: '91320500xxxxxx',
        address: '苏州市吴江区盛泽镇市场东路',
        scope: '纺织品研发、生产、销售；实业投资；石油化工产品的销售；自营和代理各类商品及技术的进出口业务。'
    },
    2: {
        id: 2,
        name: '恒力集团有限公司',
        legalRep: '陈建华',
        region: '江苏省苏州市',
        capital: '300,000万人民币',
        staff: '10000人以上',
        date: '1994-02-12',
        type: '有限责任公司',
        patents: 890,
        status: '存续',
        taxReg: '91320509xxxxxx',
        address: '苏州市吴江区盛泽镇南三环路',
        scope: '化纤、纺织、石化、炼油、热电等相关产品的生产、销售及研发；普通货运。'
    }
};

const MAP_REGIONS = [
    { name: '新疆', style: 'top-[10%] left-[10%]' },
    { name: '内蒙古', style: 'top-[5%] right-[30%]' },
    { name: '黑龙江', style: 'top-[8%] right-[8%]' },
    { name: '吉林', style: 'top-[18%] right-[8%]' },
    { name: '西藏', style: 'bottom-[20%] left-[5%]' },
    { name: '青海', style: 'top-[40%] left-[25%]' },
    { name: '甘肃', style: 'top-[35%] left-[35%]' },
    { name: '宁夏', style: 'top-[35%] left-[45%]' },
    { name: '四川', style: 'top-[50%] left-[32%]' },
    { name: '云南', style: 'bottom-[15%] left-[32%]' },
    { name: '陕西', style: 'top-[45%] left-[48%]' },
    { name: '山西', style: 'top-[35%] left-[55%]' },
    { name: '河北', style: 'top-[30%] right-[30%]' },
    { name: '北京', style: 'top-[28%] right-[28%]' },
    { name: '山东', style: 'top-[40%] right-[25%]' },
    { name: '河南', style: 'top-[48%] right-[35%]' },
    { name: '湖北', style: 'top-[55%] right-[35%]' },
    { name: '安徽', style: 'top-[55%] right-[25%]' },
    { name: '江苏', style: 'top-[50%] right-[18%]' },
    { name: '上海', style: 'top-[55%] right-[12%]' },
    { name: '浙江', style: 'top-[62%] right-[15%]' },
    { name: '重庆', style: 'top-[55%] left-[45%]' },
    { name: '贵州', style: 'bottom-[25%] left-[42%]' },
    { name: '湖南', style: 'bottom-[25%] right-[38%]' },
    { name: '江西', style: 'bottom-[25%] right-[25%]' },
    { name: '福建', style: 'bottom-[20%] right-[15%]' },
    { name: '广西', style: 'bottom-[10%] right-[40%]' },
    { name: '广东', style: 'bottom-[10%] right-[25%]' },
    { name: '海南', style: 'bottom-[2%] right-[30%]' },
    { name: '台湾', style: 'bottom-[15%] right-[5%]' },
];

const PROVINCE_CITY_MAP: Record<string, string[]> = {
    '江苏': ['苏州市', '南京市', '无锡市', '常州市', '徐州市', '南通市'],
    '浙江': ['杭州市', '宁波市', '温州市', '嘉兴市', '绍兴市'],
    '广东': ['广州市', '深圳市', '佛山市', '东莞市', '惠州市'],
    '山东': ['济南市', '青岛市', '烟台市', '潍坊市'],
    '上海': ['上海市'],
    '北京': ['北京市'],
};

const PROVINCES_LIST = ['全国', ...MAP_REGIONS.map(r => r.name).sort()];

type IndustryType = '服装纺织' | '装备制造' | '钢铁';

// Nested Chain Data for Drill-down
const CHAIN_DATA_MAPPING: Record<IndustryType, { name: string; value: number; children?: { name: string; value: number }[] }[]> = {
  '服装纺织': [
    { name: '原材料供应', value: 35, children: [{ name: '天然纤维', value: 40 }, { name: '化学纤维', value: 35 }, { name: '染料助剂', value: 25 }] },
    { name: '生产制造', value: 45, children: [{ name: '纺纱织造', value: 50 }, { name: '印染整理', value: 30 }, { name: '成衣加工', value: 20 }] },
    { name: '设备加工', value: 25, children: [{ name: '纺机制造', value: 60 }, { name: '备件生产', value: 40 }] },
    { name: '物流运输', value: 15, children: [{ name: '仓储', value: 45 }, { name: '配送', value: 55 }] },
    { name: '售后服务', value: 10, children: [{ name: '质检', value: 70 }, { name: '回收', value: 30 }] },
  ],
  '钢铁': [
    { name: '铁矿采选', value: 30, children: [{ name: '露天开采', value: 60 }, { name: '地下开采', value: 40 }] },
    { name: '冶炼加工', value: 50, children: [{ name: '炼铁', value: 40 }, { name: '炼钢', value: 40 }, { name: '轧材', value: 20 }] },
    { name: '物流仓储', value: 20, children: [{ name: '港口物流', value: 70 }, { name: '铁路运输', value: 30 }] },
  ],
  '装备制造': [
    { name: '研发设计', value: 25, children: [{ name: '工业设计', value: 50 }, { name: '系统集成', value: 50 }] },
    { name: '零部件制造', value: 40, children: [{ name: '精密加工', value: 40 }, { name: '铸造锻造', value: 30 }, { name: '电子元器件', value: 30 }] },
    { name: '整机组装', value: 35, children: [{ name: '总装调试', value: 70 }, { name: '质量检测', value: 30 }] },
  ]
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'];

interface CockpitViewProps {
    type: ScreenType;
}

// Reusable Dropdown Component
const CustomDropdown: React.FC<{
    value: string;
    options: string[];
    onSelect: (val: string) => void;
    label?: string;
    icon?: React.ReactNode;
    width?: string;
}> = ({ value, options, onSelect, label, icon, width = "w-32" }) => {
    return (
        <div className="relative group z-30">
            <div className={`flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-700 cursor-pointer hover:border-blue-500/50 transition-colors shadow-lg`}>
                {icon}
                <span className="text-sm font-medium text-zinc-200 truncate max-w-[100px]">{value}</span>
                <ChevronDown size={14} className="text-zinc-500 shrink-0" />
            </div>
            {/* Floating Dropdown */}
            <div className={`absolute top-full left-0 mt-1 ${width} bg-surface border border-border rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left flex flex-col`}>
                {options.map(p => (
                    <button 
                        key={p}
                        onClick={() => onSelect(p)}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-zinc-800 transition-colors ${value === p ? 'text-blue-500 bg-blue-500/10' : 'text-zinc-300'}`}
                    >
                        {p}
                    </button>
                ))}
            </div>
        </div>
    );
}

const CockpitView: React.FC<CockpitViewProps> = ({ type }) => {
  const [activeIndustry, setActiveIndustry] = useState<IndustryType>('服装纺织');
  const [activeProvince, setActiveProvince] = useState<string>('全国');
  const [activeCity, setActiveCity] = useState<string>('全部');
  const [activeChainSector, setActiveChainSector] = useState<string | null>(null);
  
  // Governance Dropdown States
  const [appealFilter, setAppealFilter] = useState('全部');

  // State for Enterprise Modal & List View
  const [selectedEnterprise, setSelectedEnterprise] = useState<EnterpriseDetail | null>(null);
  const [showFullEnterpriseList, setShowFullEnterpriseList] = useState(false);

  const handleIndustryChange = (ind: IndustryType) => {
      setActiveIndustry(ind);
      setActiveChainSector(null);
  };
  
  const handleProvinceChange = (prov: string) => {
      setActiveProvince(prov);
      setActiveCity('全部');
  };

  const handleEnterpriseClick = (id: number) => {
      // Use mock data or fallback to a generic object if id doesn't exist in mock
      const detail = MOCK_ENTERPRISE_DETAILS[id] || {
          id,
          name: BASE_MONITORING_LIST.find(e => e.id === id)?.name || '未知企业',
          legalRep: '张三',
          region: '未知地区',
          capital: '1000万',
          staff: '100-499人',
          date: '2010-01-01',
          type: '有限责任公司',
          patents: 10,
          status: '存续',
          taxReg: '91320xxxxxx',
          address: '某省某市某区某路1号',
          scope: '一般项目：技术服务、技术开发、技术咨询、技术交流、技术转让、技术推广。'
      };
      setSelectedEnterprise(detail);
  };

  // Simulate data changing based on region/industry
  const rankData = useMemo(() => {
    return [...BASE_CITY_RANK_DATA].sort(() => Math.random() - 0.5);
  }, [activeProvince, activeCity, activeIndustry]);

  const radarData = useMemo(() => {
    // Modify data slightly based on region to simulate linkage
    const modifier = activeProvince === '全国' ? 1 : 0.8;
    return [
        { subject: '强环节数', A: Math.floor((Math.random() * 50 + 100) * modifier), fullMark: 150 },
        { subject: '专利数量', A: Math.floor((Math.random() * 50 + 80) * modifier), fullMark: 150 },
        { subject: '弱环节数', A: Math.floor(Math.random() * 30) + 20, fullMark: 150 },
        { subject: '高新企业', A: Math.floor((Math.random() * 50 + 90) * modifier), fullMark: 150 },
        { subject: '上市公司', A: Math.floor((Math.random() * 50 + 70) * modifier), fullMark: 150 },
    ];
  }, [activeProvince, activeIndustry]);

  const currentChainData = useMemo(() => {
    const industryData = CHAIN_DATA_MAPPING[activeIndustry] || [];
    
    // Simulate region impact on chain data (randomize values slightly)
    const regionalData = industryData.map(item => ({
        ...item,
        value: activeProvince === '全国' ? item.value : Math.max(5, item.value + (Math.random() * 10 - 5)),
        children: item.children?.map(c => ({
            ...c,
            value: activeProvince === '全国' ? c.value : Math.max(5, c.value + (Math.random() * 10 - 5))
        }))
    }));

    // Normalize percentages to sum closely to 100 (visual simulation)
    const total = regionalData.reduce((acc, curr) => acc + curr.value, 0);
    const normalizedData = regionalData.map(item => ({
        ...item,
        value: Math.round((item.value / total) * 100)
    }));
    
    if (activeChainSector) {
        const sector = normalizedData.find(s => s.name === activeChainSector);
        return sector?.children || [];
    }
    
    return normalizedData;
  }, [activeIndustry, activeChainSector, activeProvince]);

  const monitoringList = useMemo(() => {
      // Filter list based on province AND city. If '全国', show all. 
      let list = [...BASE_MONITORING_LIST];
      if (activeProvince !== '全国') {
          list = list.filter(m => m.region.includes(activeProvince));
          if (activeCity !== '全部') {
              list = list.filter(m => m.city?.includes(activeCity));
          }
      }
      return list;
  }, [activeProvince, activeCity]);

  const tooltipStyle = {
    backgroundColor: '#18181b', 
    border: '1px solid #3f3f46', 
    borderRadius: '8px', 
    color: '#fff',
    fontSize: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
  };


  const renderGovernanceScreen = () => (
    <div className="h-full flex flex-col p-6 gap-6 bg-background text-zinc-100 overflow-hidden animate-fade-in">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-4 gap-6 h-28 shrink-0">
        {GOV_STATS.map((stat, i) => (
          <div key={i} className={`bg-surface border border-border rounded-xl p-5 shadow-lg flex flex-col justify-center relative overflow-hidden group animate-slide-up`} style={{ animationDelay: `${i * 100}ms` }}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-50"></div>
            
            <h3 className="text-zinc-400 font-medium mb-1 z-10">{stat.label}</h3>
            <div className="flex items-end gap-1 z-10">
              <span className={`text-4xl font-bold font-mono tracking-tighter ${stat.color}`}>{stat.value}</span>
              <span className="text-sm text-zinc-500 mb-1.5">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid: Left Charts (2 cols wide) + Right AI Panel (1 col wide) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Column: Charts (Spans 3 cols) */}
          <div className="lg:col-span-3 grid grid-rows-2 gap-6 h-full">
              
              {/* Row 1: Appeal Analysis & Dept Data */}
              <div className="grid grid-cols-2 gap-6 min-h-0">
                  {/* Appeal Analysis */}
                  <div className="bg-surface border border-border rounded-xl p-5 shadow-lg flex flex-col animate-slide-up delay-100">
                      <div className="flex justify-between items-center mb-2">
                          <h3 className="font-bold flex items-center gap-2 text-zinc-200"><div className="w-1 h-4 bg-blue-500 rounded-full"></div> 诉求分析</h3>
                          <CustomDropdown 
                             value={appealFilter} 
                             options={['全部', '投诉', '求助', '建议', '咨询', '举报', '表扬']}
                             onSelect={setAppealFilter}
                             width="w-24"
                          />
                      </div>
                      <div className="flex-1 flex items-center min-h-0 relative">
                           <div className="w-1/2 h-full">
                               <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                      <Pie
                                          data={APPEAL_DISTRIBUTION}
                                          cx="50%"
                                          cy="50%"
                                          innerRadius={40}
                                          outerRadius={65}
                                          paddingAngle={3}
                                          dataKey="value"
                                          stroke="none"
                                          animationDuration={1500}
                                          animationEasing="ease-out"
                                      >
                                          {APPEAL_DISTRIBUTION.map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={GOV_COLORS[index % GOV_COLORS.length]} style={{ outline: 'none' }} />
                                          ))}
                                      </Pie>
                                      <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} />
                                  </PieChart>
                               </ResponsiveContainer>
                           </div>
                           <div className="w-1/2 h-full overflow-y-auto custom-scrollbar flex flex-col justify-center gap-2 text-xs">
                                {APPEAL_DISTRIBUTION.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between pr-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: GOV_COLORS[index % GOV_COLORS.length] }}></div>
                                            <span className="text-zinc-400">{item.name}</span>
                                        </div>
                                        <div className="flex gap-2 text-right">
                                            <span className="text-zinc-200 font-mono">{item.value}</span>
                                            <span className="text-zinc-500">{item.percent}</span>
                                        </div>
                                    </div>
                                ))}
                           </div>
                      </div>
                  </div>

                  {/* Dept Processing */}
                  <div className="bg-surface border border-border rounded-xl p-5 shadow-lg flex flex-col animate-slide-up delay-100">
                     <div className="flex justify-between items-center mb-2">
                          <h3 className="font-bold flex items-center gap-2 text-zinc-200"><div className="w-1 h-4 bg-green-500 rounded-full"></div> 部门办理</h3>
                      </div>
                      <div className="flex-1 min-h-0">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={DEPT_PROCESS_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#71717a" fontSize={12} width={80} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{fill: '#27272a'}} contentStyle={tooltipStyle} />
                                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} animationDuration={1500} animationEasing="ease-out" />
                            </BarChart>
                         </ResponsiveContainer>
                      </div>
                  </div>
              </div>

              {/* Row 2: Hot Issues & Trends */}
              <div className="grid grid-cols-2 gap-6 min-h-0">
                   {/* Hot Issues */}
                   <div className="bg-surface border border-border rounded-xl p-5 shadow-lg flex flex-col animate-slide-up delay-200">
                      <div className="flex justify-between items-center mb-2">
                          <h3 className="font-bold flex items-center gap-2 text-zinc-200"><div className="w-1 h-4 bg-orange-500 rounded-full"></div> 热点诉求 TOP5</h3>
                      </div>
                      <div className="flex-1 space-y-3 pt-2">
                          {HOT_ISSUES_RANK.map((issue, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-sm">
                                  <div className={`w-5 h-5 flex items-center justify-center rounded text-xs font-bold ${idx < 3 ? 'bg-zinc-100 text-black' : 'bg-zinc-800 text-zinc-500'}`}>{idx + 1}</div>
                                  <div className="flex-1">
                                      <div className="flex justify-between mb-1">
                                          <span className="text-zinc-300">{issue.name}</span>
                                          <span className="text-zinc-400 text-xs font-mono">{issue.count}</span>
                                      </div>
                                      <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                          <div className="h-full rounded-full transition-all duration-1000 ease-in-out" style={{ width: `${issue.percent}%`, backgroundColor: issue.color }}></div>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                   </div>

                   {/* Trends */}
                   <div className="bg-surface border border-border rounded-xl p-5 shadow-lg flex flex-col animate-slide-up delay-200">
                      <div className="flex justify-between items-center mb-2">
                          <h3 className="font-bold flex items-center gap-2 text-zinc-200"><div className="w-1 h-4 bg-purple-500 rounded-full"></div> 逾期率趋势</h3>
                      </div>
                      <div className="flex-1 min-h-0">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={OVERDUE_TREND_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} domain={[6, 8]} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" animationDuration={1500} animationEasing="ease-out" />
                            </AreaChart>
                         </ResponsiveContainer>
                      </div>
                   </div>
              </div>
          </div>

          {/* Right Column: AI Governance Report */}
          <div className="bg-surface border border-border rounded-xl p-1 shadow-lg flex flex-col animate-slide-in-right h-full overflow-hidden">
               <div className="bg-zinc-900/50 p-4 border-b border-border">
                  <h3 className="font-bold flex items-center gap-2 text-zinc-200 text-lg">
                      <Bot className="text-blue-500" /> 智能治理简报
                  </h3>
               </div>
               <div className="p-5 overflow-y-auto custom-scrollbar space-y-6 text-sm">
                   <div className="space-y-2">
                       <h4 className="text-blue-400 font-semibold flex items-center gap-2">
                           <AlertTriangle size={16} /> 异常预警
                       </h4>
                       <p className="text-zinc-400 leading-relaxed bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                           本周<span className="text-white font-medium mx-1">劳动纠纷</span>类诉求环比上升 <span className="text-red-400 font-mono">15.2%</span>，主要集中在<span className="text-white mx-1">欠薪</span>问题，建议重点关注建筑行业及劳动密集型企业。
                       </p>
                   </div>

                   <div className="space-y-2">
                       <h4 className="text-green-400 font-semibold flex items-center gap-2">
                           <Lightbulb size={16} /> 治理建议
                       </h4>
                       <ul className="list-disc pl-4 space-y-2 text-zinc-400">
                           <li>建议联合人社局开展专项检查行动。</li>
                           <li>对于物业服务投诉，建议建立红黑榜公示制度，倒逼物业提升服务质量。</li>
                       </ul>
                   </div>

                   <div className="space-y-2">
                       <h4 className="text-purple-400 font-semibold flex items-center gap-2">
                           <TrendingUp size={16} /> 舆情研判
                       </h4>
                       <p className="text-zinc-400 leading-relaxed">
                           近期关于<span className="text-white mx-1">夜间施工扰民</span>的讨论热度有所下降，表明前期治理措施初见成效。但需警惕反弹。
                       </p>
                   </div>
                   
                   {/* Decorative visual for AI processing */}
                   <div className="mt-4 pt-4 border-t border-zinc-800">
                       <div className="flex items-center gap-2 text-xs text-zinc-600 mb-2">
                           <span className="animate-pulse">●</span> 系统实时分析中...
                       </div>
                       <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600/50 w-2/3 animate-[growX_2s_infinite]"></div>
                       </div>
                   </div>
               </div>
          </div>
      </div>
    </div>
  );

  const renderFullEnterpriseList = () => (
      <div className="h-full bg-background flex flex-col p-6 animate-slide-in-right">
          <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => setShowFullEnterpriseList(false)}
                className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                  <ChevronLeft size={24} />
              </button>
              <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
                  <Building className="text-blue-500" /> 企业名录库
              </h2>
          </div>

          {/* Filter Bar */}
          <div className="bg-surface border border-border rounded-xl p-4 shadow-sm mb-6 animate-fade-in delay-100">
            <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-2.5 text-zinc-500" size={16} />
                <input 
                type="text" 
                placeholder="搜索企业名称、法人、注册号..." 
                className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-border rounded-lg text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-zinc-600"
                />
            </div>
            <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-zinc-400 hover:bg-zinc-800 bg-zinc-900 transition-colors">
                    <MapPin size={16} /> 所属地区 <ChevronDown size={14} />
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-zinc-400 hover:bg-zinc-800 bg-zinc-900 transition-colors">
                    <Building size={16} /> 行业分类 <ChevronDown size={14} />
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-zinc-400 hover:bg-zinc-800 bg-zinc-900 transition-colors">
                    <Filter size={16} /> 注册资本 <ChevronDown size={14} />
                </button>
            </div>
            </div>
          </div>

          {/* Full List */}
          <div className="flex-1 overflow-y-auto animate-fade-in delay-200">
              <div className="grid gap-3">
                  {monitoringList.length > 0 ? monitoringList.map((company, index) => (
                      <div key={`${company.id}-${index}`} onClick={() => handleEnterpriseClick(company.id)} className="bg-surface p-4 rounded-lg border border-border hover:border-blue-500/50 transition-all cursor-pointer group flex items-center gap-4 hover:translate-x-1 duration-200">
                          <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-500 group-hover:text-blue-500 transition-colors">
                             <Building size={24} />
                          </div>
                          <div className="flex-1">
                              <h3 className="font-semibold text-zinc-200 text-lg mb-1 group-hover:text-blue-400 transition-colors">{company.name}</h3>
                              <div className="flex gap-2 mb-2">
                                  {company.tags.map(tag => (
                                      <span key={tag} className="text-xs bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded border border-zinc-700">{tag}</span>
                                  ))}
                              </div>
                              <div className="flex gap-6 text-xs text-zinc-500">
                                  <span className="flex items-center gap-1"><MapPin size={12}/> {company.region}</span>
                                  <span className="flex items-center gap-1"><Users size={12}/> 5000人以上</span>
                                  <span className="flex items-center gap-1"><Calendar size={12}/> 20年老店</span>
                              </div>
                          </div>
                          <div className="px-4">
                              <span className="text-blue-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">查看详情</span>
                          </div>
                      </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
                        <Building size={48} className="mb-4 opacity-50"/>
                        <p>暂无该地区企业数据</p>
                    </div>
                  )}
              </div>
          </div>
      </div>
  );

  const renderIndustryScreen = () => {
    if (showFullEnterpriseList) return renderFullEnterpriseList();
    
    // Get cities for current province
    const cityOptions = activeProvince !== '全国' && PROVINCE_CITY_MAP[activeProvince] 
        ? ['全部', ...PROVINCE_CITY_MAP[activeProvince]] 
        : ['全部'];

    return (
    <div className="h-full bg-background p-4 overflow-hidden animate-fade-in">
        <div className="grid grid-cols-12 gap-4 h-full">
            {/* --- Left Column: Rankings & Analysis --- */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 h-full">
                
                {/* Ranking Chart */}
                <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm flex-col flex h-[55%] animate-slide-up">
                     <div className="flex items-center gap-2 mb-4 border-l-4 border-blue-500 pl-2 shrink-0">
                         <h3 className="font-bold text-zinc-100 text-base">{activeIndustry}企业分布排行</h3>
                     </div>
                     <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
                        {rankData.map((item, index) => (
                            <div key={item.name} className="mb-3 flex items-center gap-2 group hover:translate-x-1 transition-transform opacity-0 animate-slide-in-right" style={{ animationDelay: `${index * 100}ms` }}>
                                <span className="text-xs text-zinc-500 w-12 text-right">{item.name}</span>
                                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden relative cursor-default" title={`${item.count}家`}>
                                    <div 
                                        className="h-full bg-blue-500 rounded-full group-hover:bg-blue-400 transition-all duration-1000 ease-in-out animate-grow-x" 
                                        style={{ width: `${(item.count / 100) * 100}%`, animationDelay: `${index * 100 + 200}ms` }}
                                    ></div>
                                </div>
                                <span className="text-[10px] text-zinc-600 w-6 group-hover:text-blue-400 transition-colors font-mono">{item.count}</span>
                            </div>
                        ))}
                     </div>
                </div>

                {/* Radar Analysis */}
                <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm flex-col flex h-[45%] animate-slide-up delay-100">
                     <div className="flex items-center gap-2 mb-2 border-l-4 border-blue-500 pl-2 shrink-0">
                         <h3 className="font-bold text-zinc-100 text-base">{activeProvince === '全国' ? '全国' : activeProvince}产业健康分析</h3>
                     </div>
                     <div className="flex-1 -ml-4 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="#3f3f46" />
                                <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fill: '#71717a'}} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="none" />
                                <Radar name="Analysis" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} style={{ outline: 'none' }} animationDuration={1000} animationEasing="ease-out" />
                                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                     </div>
                </div>
            </div>

            {/* --- Center Column: Map & Tabs --- */}
            <div className="col-span-12 lg:col-span-6 flex flex-col h-full animate-slide-up delay-200">
                 <div className="bg-surface rounded-3xl border border-border shadow-lg flex-1 relative overflow-hidden p-6 flex items-center justify-center">
                    
                    {/* Map Controls: Region Select & National View (Moved to Right) */}
                    <div className="absolute top-6 right-6 z-30 flex flex-col items-end gap-2">
                         <div className="flex items-center gap-2">
                            {/* Province Dropdown */}
                            <CustomDropdown 
                                value={activeProvince} 
                                options={PROVINCES_LIST}
                                onSelect={handleProvinceChange}
                                icon={<MapPin size={14} className="text-blue-500"/>}
                                width="w-32"
                            />

                            {/* City Dropdown (Cascading) */}
                            {activeProvince !== '全国' && (
                                <CustomDropdown 
                                    value={activeCity} 
                                    options={cityOptions}
                                    onSelect={setActiveCity}
                                    width="w-32"
                                />
                            )}
                         </div>

                         {/* Removed Return to National View button as requested */}
                    </div>

                    {/* Top Tabs (Industry) */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-zinc-900/80 backdrop-blur-md p-1.5 rounded-full border border-zinc-700 flex gap-1 shadow-2xl">
                        {(['服装纺织', '钢铁', '装备制造'] as IndustryType[]).map((ind) => (
                            <button
                            key={ind}
                            onClick={() => handleIndustryChange(ind)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                activeIndustry === ind 
                                ? 'bg-blue-600 text-white shadow-lg scale-105' 
                                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                            }`}
                            >
                            {ind}
                            </button>
                        ))}
                    </div>

                    {/* Map Visualization */}
                    <div className="w-full h-full relative opacity-100 select-none animate-scale-in duration-500">
                         {/* Map Container */}
                         <div className="absolute inset-4 md:inset-12 lg:inset-16">
                             {/* Scattered Bubbles simulating map regions */}
                             {MAP_REGIONS.map((region) => (
                                 <button
                                     key={region.name}
                                     onClick={() => handleProvinceChange(region.name)}
                                     className={`absolute px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg transition-all transform hover:scale-110 duration-500 ease-out ${region.style}
                                        ${activeProvince === region.name 
                                            ? 'bg-blue-600 text-white border-blue-400 scale-110 z-10 shadow-blue-500/50' 
                                            : 'bg-zinc-800/80 border border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                                        }
                                     `}
                                 >
                                     {region.name}
                                 </button>
                             ))}
                             
                             {/* Decorative Grid/Lines for 'tech' feel */}
                             <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                         </div>
                    </div>

                    {/* Bottom Legend */}
                    <div className="absolute bottom-6 w-full flex justify-center z-20 pointer-events-none">
                        <div className="bg-white text-zinc-900 px-6 py-2.5 rounded-full shadow-xl text-sm font-medium flex items-center gap-4 animate-slide-up delay-300 pointer-events-auto">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                区域: <span className="font-bold text-blue-700">{activeProvince} {activeCity !== '全部' ? ` - ${activeCity}` : ''}</span>
                            </div>
                            <div className="w-px h-3 bg-zinc-300"></div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-800"></span>
                                产业: <span className="font-bold">{activeIndustry}</span>
                            </div>
                        </div>
                    </div>

                 </div>
            </div>

            {/* --- Right Column: Chain & List --- */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 h-full">
                 {/* Chain Composition */}
                 <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm h-[45%] flex flex-col animate-slide-up delay-100">
                     <div className="flex items-center gap-2 mb-2 border-l-4 border-blue-500 pl-2 shrink-0 justify-between">
                         <div className="flex items-center gap-2">
                             {activeChainSector && (
                                 <button 
                                    onClick={() => setActiveChainSector(null)}
                                    className="p-1 -ml-1 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
                                 >
                                     <ChevronLeft size={16} />
                                 </button>
                             )}
                             <h3 className="font-bold text-zinc-100 text-base">
                                 {activeChainSector ? activeChainSector : '产业链环节组成'}
                             </h3>
                         </div>
                         {activeChainSector && <span className="text-[10px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded animate-scale-in">细分领域</span>}
                     </div>
                     <div className="flex-1 relative min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                data={currentChainData}
                                innerRadius={50}
                                outerRadius={70}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                                onClick={(data) => {
                                    if (!activeChainSector) {
                                        setActiveChainSector(data.name);
                                    }
                                }}
                                className={!activeChainSector ? "cursor-pointer" : ""}
                                animationDuration={1000}
                                animationEasing="ease-out"
                                >
                                {currentChainData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity" style={{ outline: 'none' }} />
                                ))}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none animate-fade-in">
                             <span className="text-xl font-bold text-zinc-200">
                                 {activeChainSector ? '详情' : (activeProvince === '全国' ? '100%' : '区域')}
                             </span>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-y-2 gap-x-1 mt-2 shrink-0 overflow-y-auto max-h-[60px] custom-scrollbar">
                        {currentChainData.map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-1.5 text-xs text-zinc-400 animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                                <span className="w-2 h-2 rounded-full shrink-0" style={{backgroundColor: COLORS[index % COLORS.length]}}></span>
                                <span className="truncate">{entry.name} {entry.value}%</span>
                            </div>
                        ))}
                     </div>
                 </div>

                 {/* Enterprise List */}
                 <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm flex-col flex h-[55%] animate-slide-up delay-200">
                     <div className="flex items-center justify-between mb-4 border-l-4 border-blue-500 pl-2 shrink-0">
                         <h3 className="font-bold text-zinc-100 text-base">企业名录</h3>
                         <button 
                            onClick={() => setShowFullEnterpriseList(true)}
                            className="p-1 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded transition-colors hover:scale-110" title="更多"
                         >
                             <MoreHorizontal size={18} />
                         </button>
                     </div>
                     
                     <div className="relative mb-4 shrink-0">
                         <Search className="absolute left-3 top-2.5 text-zinc-500" size={14} />
                         <input 
                            type="text" 
                            placeholder="快速搜索..." 
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500/50 placeholder:text-zinc-600 transition-all focus:ring-1 focus:ring-blue-500/30"
                         />
                     </div>

                     <div className="flex-1 overflow-auto space-y-3 pr-1 custom-scrollbar">
                        {monitoringList.length > 0 ? monitoringList.map(company => (
                            <div key={company.id} onClick={() => handleEnterpriseClick(company.id)} className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl hover:bg-zinc-800 transition-all cursor-pointer group border border-transparent hover:border-zinc-700 hover:translate-x-1 duration-200">
                                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-blue-600/10 group-hover:text-blue-500 text-zinc-500 transition-colors">
                                    <Building size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-zinc-200 truncate group-hover:text-blue-400 transition-colors">{company.name}</h4>
                                    <div className="flex gap-2 mt-1">
                                        {company.tags.map(tag => (
                                            <span key={tag} className="text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-700">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center h-full text-zinc-500 text-xs">
                                <Building size={32} className="mb-2 opacity-50"/>
                                暂无该地区企业数据
                            </div>
                        )}
                     </div>
                 </div>
            </div>
        </div>
    </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-background text-zinc-200 overflow-hidden relative">
      <style>{`
        /* Remove default focus outline for charts */
        :focus { outline: none; }
        .recharts-pie-sector:focus, .recharts-layer:focus { outline: none !important; }
      `}</style>
      
      {/* Note: Tabs are now controlled by the parent dropdown in App.tsx */}
      <div className="flex-1 overflow-hidden relative">
        {type === 'Governance' ? renderGovernanceScreen() : renderIndustryScreen()}
      </div>

      {/* Enterprise Detail Modal */}
      {selectedEnterprise && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-surface border border-border rounded-xl shadow-2xl w-[800px] max-h-[90%] flex flex-col overflow-hidden animate-scale-in">
                  <div className="p-6 border-b border-border flex justify-between items-center bg-zinc-900">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Building className="text-blue-500"/>
                          {selectedEnterprise.name}
                      </h3>
                      <button 
                        onClick={() => setSelectedEnterprise(null)}
                        className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors hover:rotate-90 duration-200"
                      >
                          <X size={20} />
                      </button>
                  </div>
                  <div className="p-8 overflow-y-auto">
                      <h4 className="text-sm font-bold text-blue-500 mb-4 uppercase tracking-wider">企业基础信息</h4>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-sm">
                          <div className="space-y-1">
                              <span className="text-zinc-500">企业法人</span>
                              <div className="text-zinc-200 font-medium">{selectedEnterprise.legalRep}</div>
                          </div>
                          <div className="space-y-1">
                              <span className="text-zinc-500">所属地区</span>
                              <div className="text-zinc-200 font-medium">{selectedEnterprise.region}</div>
                          </div>
                          <div className="space-y-1">
                              <span className="text-zinc-500">注册资本</span>
                              <div className="text-zinc-200 font-medium">{selectedEnterprise.capital}</div>
                          </div>
                          <div className="space-y-1">
                              <span className="text-zinc-500">人员规模</span>
                              <div className="text-zinc-200 font-medium">{selectedEnterprise.staff}</div>
                          </div>
                          <div className="space-y-1">
                              <span className="text-zinc-500">成立日期</span>
                              <div className="text-zinc-200 font-medium">{selectedEnterprise.date}</div>
                          </div>
                          <div className="space-y-1">
                              <span className="text-zinc-500">企业类型</span>
                              <div className="text-zinc-200 font-medium">{selectedEnterprise.type}</div>
                          </div>
                          <div className="space-y-1">
                              <span className="text-zinc-500">发明专利</span>
                              <div className="text-zinc-200 font-medium flex items-center gap-2">
                                  {selectedEnterprise.patents} 项
                                  <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded">高新</span>
                              </div>
                          </div>
                          <div className="space-y-1">
                              <span className="text-zinc-500">企业状态</span>
                              <div className="text-green-400 font-medium flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                  {selectedEnterprise.status}
                              </div>
                          </div>
                          <div className="space-y-1">
                              <span className="text-zinc-500">纳税登记号</span>
                              <div className="text-zinc-200 font-medium font-mono">{selectedEnterprise.taxReg}</div>
                          </div>
                          <div className="space-y-1">
                              <span className="text-zinc-500">注册地址</span>
                              <div className="text-zinc-200 font-medium">{selectedEnterprise.address}</div>
                          </div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-zinc-800">
                          <div className="space-y-2">
                              <span className="text-zinc-500">经营范围</span>
                              <div className="text-zinc-300 leading-relaxed bg-zinc-900/50 p-4 rounded-lg border border-zinc-800/50">
                                  {selectedEnterprise.scope}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default CockpitView;