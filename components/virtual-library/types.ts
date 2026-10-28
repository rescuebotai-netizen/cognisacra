export interface DocumentItem {
  id: string;
  title: string;
  author: string;
  category: 'Textbook' | 'Research Paper' | 'Journal' | 'Thesis' | 'Lecture' | 'Podcast';
  institution?: string;
  year: number;
  tags: string[];
  excerpt: string;
  content: string;
  citations: {
    apa: string;
    harvard: string;
    mla: string;
    chicago: string;
    ieee: string;
  };
  price?: {
    amount: number;
    currency: string;
  };
}

export interface ResearchGap {
  id: string;
  topic: string;
  description: string;
  impactScore: number; // 1-10
}

export interface AIAnalysisResult {
  trends: string[];
  valRating: number; // 1-10
  literatureGaps: ResearchGap[];
  citationRecommendations: string[];
}

export interface NotebookItem {
  id: string;
  title: string;
  date: string;
  text: string;
  tags: string[];
}

export interface KanbanTask {
  id: string;
  title: string;
  status: 'todo' | 'progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}

export interface SkillMapItem {
  skill: string;
  level: number; // 0-100
  careerPaths: string[];
}
