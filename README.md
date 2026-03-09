# YouTube Script Generator AI 🎥✨

A powerful SaaS MVP built with **Next.js 15 (App Router)** and **Tailwind CSS v4** that generates viral, data-driven YouTube scripts by analyzing real-time trends.

## 🚀 Features

- **Trend Analysis:** Fetches real-time video performance data using the YouTube Data API.
- **AI-Powered Concepts:** Generates 3 unique high-retention script concepts (Titles, Hooks, and Thumbnail ideas).
- **Full Script Outlines:** Provides detailed 5-minute script outlines for each concept.
- **Responsive UI:** Clean, modern, and mobile-friendly interface built with Tailwind CSS.
- **Modern Tech Stack:** React 19, Lucide Icons, and Next.js Server Actions.

## 🛠️ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **API:** [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- **Data:** [YouTube Data API v3](https://developers.google.com/youtube/v3)
- **AI Model:** [OpenRouter](https://openrouter.ai/) (Gemini 2.0 Flash)

## 📦 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/nazmul-research/youtube-script-generator.git
    cd youtube-script-generator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add your API keys:
    ```env
    YOUTUBE_API_KEY=your_youtube_api_key_here
    OPENROUTER_API_KEY=your_openrouter_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3001](http://localhost:3001) (or your preferred port) in your browser.

## 🚀 Deployment (Vercel)

1.  **Push your code to GitHub.**
2.  **Log in to [Vercel](https://vercel.com/)** and import your repository.
3.  **Add Environment Variables:** In the project settings, add `YOUTUBE_API_KEY` and `OPENROUTER_API_KEY`.
4.  **Deploy!** Vercel will automatically build and host your application.

## 📄 License

This project is licensed under the MIT License.

---
*Last Updated: March 2026*
