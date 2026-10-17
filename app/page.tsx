
"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";

type RoastResult = {
  developerType: string;
  score: number;
  roasts: {
    title: string;
    observation: string;
    punchline: string;
  }[];
  verdict: string;
};

type ApiResponse = {
  profile: {
    username: string;
    name: string | null;
    avatarUrl: string;
    profileUrl: string;
  };
  roast: RoastResult;
};

export default function Home() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  async function handleDownloadCard() {
    if (!cardRef.current || !result) return;

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#090b0a",
      });

      const link = document.createElement("a");
      link.download = `github-roast-${result.profile.username}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Card export failed:", err);
      setError("Couldn't export the roast card. Please try again.");
    }
  }

  function handleShareOnX() {
    if (!result) return;

    const text =
      `I got roasted by AI 💀🔥\\n` +
      `Developer type: ${result.roast.developerType}\\n` +
      `Roast score: ${result.roast.score}/100\\n\\n` +
      `Your turn:`;

    const shareUrl = new URL(
      "https://twitter.com/intent/tweet"
    );

    shareUrl.searchParams.set("text", text);
    shareUrl.searchParams.set("url", window.location.origin);

    window.open(
      shareUrl.toString(),
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function handleRoast() {
    const value = username.trim();

    if (!value) {
      setError("Enter a GitHub username first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `/api/roast/${encodeURIComponent(value)}`,
        { method: "POST" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Roast generation failed.");
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#090b0a] px-5 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="mb-5 font-mono text-sm text-green-400">
          {"// THE INTERNET'S MOST UNNECESSARY CODE REVIEW"}
        </p>

        <h1 className="text-5xl font-black tracking-tight sm:text-7xl">
          Roast My
          <br />
          <span className="text-green-400">GitHub.</span>
        </h1>

        <p className="mt-5 max-w-xl text-gray-400">
          Your repositories have been talking.
          Let AI tell you what they really think.
        </p>

        <form
          className="mt-8 flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            void handleRoast();
          }}
        >
          <div className="flex flex-1 items-center rounded-xl border border-white/10 bg-white/5 px-4">
            <span className="text-green-400">@</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="your-github-username"
              maxLength={39}
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent px-3 py-4 outline-none"
              aria-label="GitHub username"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-green-400 px-6 py-4 font-bold text-black transition hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Roasting..." : "Roast me 🔥"}
          </button>
        </form>

        {loading && (
          <p role="status" className="mt-6 font-mono text-green-400">
            Analyzing public profile signals...
            <br />
            Preparing emotional damage...
          </p>
        )}

        {error && (
          <p role="alert" className="mt-5 text-red-400">
            {error}
          </p>
        )}

        {result && (
          <>
          <section
            aria-live="polite"
            className="mt-12 space-y-6"
            id="roast-result"
          >
            <div className="rounded-2xl border border-green-400/30 bg-green-400/5 p-6">
              <div className="flex flex-wrap items-center gap-4">
                <img
                  src={result.profile.avatarUrl}
                  alt=""
                  className="h-16 w-16 rounded-full border-2 border-green-400"
                />

                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold">
                    {result.roast.developerType}
                  </h2>
                  <a
                    href={result.profile.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-gray-400 hover:text-green-400"
                  >
                    @{result.profile.username} ↗
                  </a>
                </div>

                <div className="text-right">
                  <p className="text-4xl font-black text-green-400">
                    {result.roast.score}
                    <span className="text-lg">/100</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Roast score
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                A comedic score, not a code-quality assessment.
              </p>
            </div>

            {result.roast.roasts.map((roast, index) => (
              <article
                key={`${roast.title}-${index}`}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <p className="font-mono text-sm text-green-400">
                  ROAST_0{index + 1}
                </p>
                <h3 className="mt-3 text-xl font-bold">
                  {roast.title}
                </h3>
                <p className="mt-3 text-gray-400">
                  {roast.observation}
                </p>
                <p className="mt-4 font-semibold text-white">
                  {roast.punchline}
                </p>
              </article>
            ))}

            <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-6">
              <p className="font-mono text-sm text-red-400">
                FINAL_VERDICT
              </p>
              <p className="mt-3 text-lg font-bold">
                {result.roast.verdict}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setResult(null);
                setError("");
                setUsername("");
              }}
              className="rounded-xl border border-white/15 px-5 py-3 text-sm hover:bg-white/5"
            >
              Roast another developer ↗
            </button>
          </section>
          
        {/* Shareable PNG card */}
        <div
          ref={cardRef}
          className="overflow-hidden rounded-2xl border border-green-400/30 bg-[#090b0a] p-6 sm:p-8"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-sm font-bold text-green-400">
              GITHUB ROAST.exe
            </p>
            <span className="text-xs text-gray-500">
              AI ANALYSIS COMPLETE
            </span>
          </div>

          <div className="my-6 border-t border-white/10" />

          <div className="flex items-center gap-4">
            <img
              src={result.profile.avatarUrl}
              alt=""
              crossOrigin="anonymous"
              className="h-16 w-16 rounded-full border-2 border-green-400"
            />

            <div className="min-w-0 flex-1">
              <p className="break-words text-lg font-bold text-white">
                @{result.profile.username}
              </p>
              <p className="mt-1 text-sm text-green-400">
                {result.roast.developerType}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500">ROAST SCORE</p>
              <p className="mt-1 text-4xl font-black text-green-400">
                {result.roast.score}
                <span className="text-lg text-gray-500">/100</span>
              </p>
            </div>

            <p className="max-w-[55%] text-right text-sm font-semibold text-white">
              {result.roast.verdict}
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <p className="font-mono text-xs text-green-400">
              THE ROAST 💀
            </p>
            <p className="mt-3 break-words font-semibold leading-relaxed text-white">
              {result.roast.roasts[0]?.punchline ??
                "Your repositories have been roasted."}
            </p>
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
            <p className="text-sm font-bold text-green-400">
              AI Roast My GitHub
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Built for developers who can handle the truth.
            </p>
          </div>
        </div>

        {/* Share actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => void handleDownloadCard()}
            className="flex-1 rounded-xl bg-green-400 px-5 py-3 font-bold text-black transition hover:bg-green-300"
          >
            ↓ Download Roast Card
          </button>

          <button
            type="button"
            onClick={handleShareOnX}
            className="flex-1 rounded-xl border border-white/15 px-5 py-3 font-bold transition hover:bg-white/5"
          >
            Share on X ↗
          </button>
        </div>

          </>
        )}

        <footer className="mt-20 border-t border-white/10 pt-6 text-sm text-gray-600">
          Built for developers who can handle the truth.
          <br />
          Public profile signals only. All roasts are for fun.
        </footer>
      </div>
    </main>
  );
}
