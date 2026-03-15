# Roadmap Research Engine

Frontend app that builds learning roadmaps from live search results and model synthesis.

## Stack

- React + TypeScript + Vite
- Tailwind + shadcn/ui
- TanStack Query

## Setup

1. Install dependencies:

```sh
npm i
```

2. Create a `.env` file in the project root:

```env
VITE_TAVILY_API_KEY=
VITE_YOUTUBE_API_KEY=
VITE_GROQ_API_KEY=
VITE_GROQ_MODEL=openai/gpt-oss-120b
VITE_NVIDIA_API_KEY=
VITE_NVIDIA_MODEL=moonshotai/kimi-k2-instruct
VITE_NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
```

3. Run the app:

```sh
npm run dev
```

## Notes

- Tavily and YouTube provide real sources/citations.
- Roadmap synthesis first tries Groq, then NVIDIA Kimi K2 if needed.
- If any key is missing, the app skips that provider and continues.
