import { NextResponse } from 'next/server';
import { YouTubeMetadata, ScriptConcept } from '@/lib/types';

// Example Backend Logic: Calling YouTube Data API
async function fetchYouTubeTrends(topic: string): Promise<YouTubeMetadata[]> {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  if (!API_KEY) {
    console.warn('YOUTUBE_API_KEY not found, using mock data');
    return [
      { title: `How to master ${topic}`, description: 'Best tips for beginners.', viewCount: '1.2M', publishedAt: '2024-01-01' },
      { title: `${topic} 101: Everything you need to know`, description: 'Deep dive into the subject.', viewCount: '850K', publishedAt: '2024-02-15' },
    ];
  }

  try {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(topic)}&type=video&maxResults=5&order=viewCount&key=${API_KEY}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData.items) return [];

    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`;
    const statsRes = await fetch(statsUrl);
    const statsData = await statsRes.json();

    return statsData.items.map((item: any) => ({
      title: item.snippet.title,
      description: item.snippet.description.substring(0, 200) + '...',
      viewCount: parseInt(item.statistics.viewCount).toLocaleString(),
      publishedAt: item.snippet.publishedAt,
    }));
  } catch (error) {
    console.error('YouTube API Error:', error);
    return [];
  }
}

// Example Backend Logic: Sending data to AI Model
async function generateScriptsWithAI(topic: string, metadata: YouTubeMetadata[]): Promise<ScriptConcept[]> {
  const API_KEY = process.env.OPENROUTER_API_KEY;
  
  if (!API_KEY) {
    console.warn('OPENROUTER_API_KEY not found, using mock generation');
    return [
      {
        title: `The Ultimate ${topic} Blueprint`,
        hook: "What if everything you knew about this was wrong?",
        thumbnailIdea: "A split screen showing 'Before' vs 'After' with high contrast.",
        fullScript: "Hook: 30s. Problem: The confusion around topic. Insights: Points 1, 2, 3. Examples: Real world case. Conclusion: Call to action."
      },
      {
        title: `Stop Doing THIS if you want to succeed in ${topic}`,
        hook: "The number one mistake creators make is actually quite simple.",
        thumbnailIdea: "Large red 'X' over a common mistake.",
        fullScript: "Hook: 20s. Problem: Why mistake happens. Insights: Better way. Examples: Comparison. Conclusion: Subscribe."
      },
      {
        title: `The Future of ${topic} (2026 Edition)`,
        hook: "The landscape is changing faster than you think.",
        thumbnailIdea: "Futuristic neon background with glowing text.",
        fullScript: "Hook: 40s. Problem: Old methods dying. Insights: Future trends. Examples: Upcoming tech. Conclusion: Join the community."
      }
    ];
  }

  const prompt = `You are a world-class YouTube Content Strategist and Scriptwriter.
Your task is to generate 3 HIGH-RETENTION, ORIGINAL YouTube script concepts for the topic: "${topic}".

RESEARCH DATA (Top performing videos for this topic):
${metadata.map(m => `- Title: ${m.title} | Views: ${m.viewCount}`).join('\n')}

For each of the 3 concepts, provide:
1. A viral Title.
2. An attention-grabbing Hook (first 30 seconds).
3. A Thumbnail Idea (visual description).
4. A 5-minute Script outline (Hook, Problem, Insights, Examples, Conclusion).

RULES:
- Do NOT copy the research data. Use it only for trend inspiration.
- Focus on high-retention storytelling.
- Return ONLY a valid JSON array of 3 objects with these keys: "title", "hook", "thumbnailIdea", "fullScript".

Example format:
[
  {
    "title": "...",
    "hook": "...",
    "thumbnailIdea": "...",
    "fullScript": "..."
  },
  ...
]`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "model": "google/gemini-2.0-flash-001",
        "messages": [
          { "role": "user", "content": prompt }
        ],
        "response_format": { "type": "json_object" }
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Some models might wrap JSON in markdown blocks
    const cleanContent = content.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanContent);
    
    // If it's a single object with a key like 'scripts', extract it
    return Array.isArray(parsed) ? parsed : (parsed.scripts || parsed.concepts || []);
  } catch (error) {
    console.error('AI Generation Error:', error);
    return [];
  }
}

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    // 1. Fetch Research Data
    const trends = await fetchYouTubeTrends(topic);

    // 2. Generate Scripts
    const scripts = await generateScriptsWithAI(topic, trends);

    return NextResponse.json({ scripts });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
