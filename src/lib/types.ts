export interface YouTubeMetadata {
  title: string;
  description: string;
  viewCount: string;
  publishedAt: string;
}

export interface ScriptConcept {
  hook: string;
  title: string;
  thumbnailIdea: string;
  fullScript: string;
}

export interface ApiResponse {
  scripts?: ScriptConcept[];
  error?: string;
}
