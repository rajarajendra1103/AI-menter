
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface NoteData {
  concept: string;
  types?: string[];
  syntax: string;
  flowchartMermaid: string;
  exampleProgram: string;
  errorProneProgram: string;
  howToUse: string;
  restrictions: string;
  useCases: string[];
  quiz: QuizQuestion[];
}

export interface VariableEntry {
  name: string;
  value: string;
}

export interface ExecutionStep {
  step: number;
  line: number;
  variables: VariableEntry[];
  description: string;
}

export interface CodeSummary {
  functions: string[];
  variables: string[];
  inputs: string[];
}

export interface AnimationNode {
  id: string;
  label: string;
  type: 'variable' | 'loop' | 'condition' | 'io';
}

export interface AnimationData {
  nodes: AnimationNode[];
  highlightSequence: { nodeId: string; value?: any }[];
}

export interface CompilerAnalysis {
  asciiFlow: string;
  stateTable: ExecutionStep[];
  executionLogic: string;
  mermaidChart: string;
  narration: string[];
  output: string;
  summary?: CodeSummary;
  animationData: AnimationData;
}

export interface KeywordDetail {
  keyword: string;
  concept: string;
  howToUse: string;
  whereToUse: string;
  example: string;
}

export enum AppMode {
  NOTES = 'NOTES',
  COMPILER = 'COMPILER',
  KEYWORDS = 'KEYWORDS'
}
