export type Resource = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  code: string;
  category: string;
  date: string;
  instagram_url: string;
  pdf_url?: string;
};

export const resources: Resource[] = [
  {
    id: '1',
    title: 'Google AI Agents Course (5-Day)',
    excerpt: 'Access Google\'s free professional course on building autonomous AI agents and intelligent systems.',
    content: `
# Google AI Agents Course (5-Day)

Google has released a comprehensive 5-day course focused on AI Agents. This resource includes links to the official modules and my personal study notes.

## What you will learn:
- Fundamentals of AI Agents
- Building autonomous systems
- Integrating Google AI models
- Real-world deployment projects

[Access Official Course →](https://cloud.google.com/blog/topics/training-certifications/free-google-ai-training-courses)
    `,
    code: 'Dslogs-001',
    category: 'ML',
    date: '2024-05-14',
    instagram_url: 'https://www.instagram.com/p/C6_...',
  },
  {
    id: '2',
    title: 'Data Science Roadmap 2026',
    excerpt: 'The most realistic and structured roadmap for B.Tech students to master Data Science by 2026.',
    content: `
# Data Science Roadmap 2026

Stop wandering YouTube playlists. This roadmap is built by a student for students.

## Phase 1: Python & Math
- NumPy, Pandas, Matplotlib
- Probability & Linear Algebra

## Phase 2: Data Analysis
- Exploratory Data Analysis (EDA)
- Feature Engineering

## Phase 3: Machine Learning
- Supervised vs Unsupervised
- Model Evaluation

## Phase 4: Real-world Projects
- Portfolio building
- Deployment basics
    `,
    code: 'Dslogs-002',
    category: 'Career',
    date: '2024-05-14',
    instagram_url: 'https://www.instagram.com/p/C7_...',
  },
  {
    id: '3',
    title: '5 Future AI Projects (2026)',
    excerpt: 'A curated list of high-impact AI projects that will dominate the job market in 2026.',
    content: `
# 5 Future AI Projects (2026)

These are NOT beginner copy-paste projects. These are designed to showcase real impact.

1. **Multi-Agent RAG System**: Specialized knowledge retrieval.
2. **Autonomous Coding Assistant**: Domain-specific code generation.
3. **AI-Powered Logistics Optimizer**: Real-time graph optimization.
4. **Predictive Health Analytics**: Time-series on wearable data.
5. **Real-time Video Synthesis**: Generative UI/UX.
    `,
    code: 'Dslogs-003',
    category: 'ML',
    date: '2024-05-14',
    instagram_url: 'https://www.instagram.com/p/C8_...',
  }
];

export const categories = ['All', 'Python', 'SQL', 'Career', 'ML', 'Stats'];
