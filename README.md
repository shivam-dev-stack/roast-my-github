# 💀 AI Roast My GitHub

**Your GitHub profile looks impressive. Until AI takes a closer look.**

AI Roast My GitHub is a fun, AI-powered tool that analyzes your public GitHub profile and roasts your developer habits, repositories, and coding persona. Get your developer type, a roast score, and brutally funny verdicts — then share the damage with the world.

## ✨ Features

- 🔍 **GitHub Profile Analysis** — Fetches public GitHub profile data.
- 🤖 **AI-Powered Roasts** — Generates personalized, humorous roasts using Google's Gemini.
- 🎭 **Developer Type** — Discover your unique developer persona.
- 💯 **Roast Score** — Get a comedic score out of 100.
- 💀 **Final Verdict** — Receive your final AI-generated judgment.
- 📸 **Shareable Roast Card** — Download your roast as a PNG image.
- 𝕏 **Share on X** — Share your results and challenge other developers.

## 🛠️ Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **UI:** React + Tailwind CSS
- **AI:** Google Gemini API (`@google/genai`)
- **API Integration:** GitHub REST API
- **Validation:** Zod
- **Image Export:** `html-to-image`

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- A Google Gemini API key
- Git

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_supported_gemini_model
```

Use a Gemini model currently available to your API key and account quota. Keep your API key private and never expose it in client-side code or commit it to Git.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 How It Works

1. Enter a GitHub username.
2. The app retrieves public profile information from GitHub.
3. The backend prepares the profile data for AI analysis.
4. Gemini generates a developer type, roast score, roasts, and final verdict.
5. View your results, download your roast card, and share it on X.

## 📁 Project Structure

```text
app/
├── api/
│   ├── github/
│   │   └── [username]/
│   │       └── route.ts
│   └── roast/
│       └── [username]/
│           └── route.ts
├── page.tsx
└── ...
lib/
├── github.ts
└── roast.ts
```

*Note: The structure above reflects the intended API and library organization. Adjust it to match your actual repository.*

## 🔐 Privacy & Limitations

- The app analyzes public GitHub information.
- The roast score is for entertainment, not a genuine measure of code quality or developer skill.
- AI-generated content can be inaccurate, exaggerated, or inconsistent.
- API availability and rate limits may affect results.
- Never expose API keys or other secrets in the browser.

## 🗺️ Roadmap

- [ ] Improve GitHub repository analysis.
- [ ] Add more developer personas and roast styles.
- [ ] Improve roast card design and social sharing.
- [ ] Add caching and API rate limiting.
- [ ] Explore repository-specific analysis.

## 🤝 Contributing

Contributions, suggestions, and creative roast ideas are welcome!

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request.

## 📄 License

Add a license before distributing or accepting contributions. If you choose MIT, include the appropriate MIT License text in a `LICENSE` file.

---

**Think your GitHub is roast-proof? Prove it.** 💀🔥

Built for developers who can handle the truth.
