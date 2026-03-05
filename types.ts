
export interface Policy {
  id: string;
  title: string;
  date: string;
  organ: string;
  region: string;
  type: string;
  source: '系统数据' | '用户上传';
}

export interface ModelText {
  id: string;
  title: string;
  abstract: string;
  type: string;
  uploader: string;
  isFavorite: boolean;
}

export interface Indicator {
  id: string;
  source: string;
  topic: string;
  modified: string;
  creator: string;
  type: '结构化' | '非结构化';
  status: '提取中' | '可用' | '失败' | '禁用';
}

export interface Report {
  id: string;
  title: string;
  source: string;
  time: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  type?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: Date;
  agentType?: AgentType | string;
  isPinned?: boolean;
}

export enum AgentType {
  ContentQuery = '智能问答',
  Translation = '文档翻译',
  Polishing = '文稿润色',
  Writing = '公文写作',
  IndustryAnalysis = '产业分析',
  ChainAnalysis = '产业链分析',
  EnterpriseRec = '企业推荐',
  EnterpriseProfile = '企业画像',
  PolicyGen = '政策生成',
  PolicyDeduction = '政策推演',
  GovernanceRights = '综治权责',
  ContractGen = '合同生成',
  ContractReview = '合同审查',
  SmartContract = '智能合同'
}
