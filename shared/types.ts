export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Minimal real-world chat example types (shared by frontend and worker)
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}
// Rails 2025 Report Types
export interface ReportSection {
  id: string;
  title: string;
  excerpt: string;
  fullContent?: string;
  codeSample?: string;
}
export interface Annotation {
  id: string;
  sectionId: string;
  note: string;
  ts: number;
}
export interface Bookmark {
  id: string;
  title: string; // Corresponds to ReportSection.id
  url?: string;
  note?: string;
  data?: unknown; // For storing things like studio arrangements or section title
  ts: number;
  annotations?: Annotation[];
}