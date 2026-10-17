
import "server-only";

const GITHUB_API = "https://api.github.com";
const REQUEST_TIMEOUT_MS = 8_000;

export type GitHubProfile = {
  username: string;
  name: string | null;
  bio: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  createdAt: string;
  profileUrl: string;
  avatarUrl: string;
  repositories: GitHubRepository[];
};

export type GitHubRepository = {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  isFork: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  url: string;
};

export class GitHubApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "GitHubApiError";
  }
}

type GitHubUserResponse = {
  login: string;
  name: string | null;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  html_url: string;
  avatar_url: string;
};

type GitHubRepoResponse = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
  html_url: string;
};

function validateUsername(username: string): string {
  const value = username.trim();

  const valid =
    /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(value) &&
    !value.includes("--");

  if (!valid) {
    throw new GitHubApiError("Invalid GitHub username.", 400);
  }

  return value;
}

async function githubFetch<T>(path: string): Promise<T> {
  const token = process.env.GITHUB_TOKEN;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;

  try {
    response = await fetch(`${GITHUB_API}${path}`, {
      headers,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof GitHubApiError) throw error;

    if (
      error instanceof Error &&
      error.name === "TimeoutError"
    ) {
      throw new GitHubApiError(
        "GitHub request timed out. Try again.",
        504,
      );
    }

    throw new GitHubApiError(
      "Could not connect to GitHub.",
      502,
    );
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new GitHubApiError(
        "GitHub user not found.",
        404,
      );
    }

    if (
      response.status === 403 ||
      response.status === 429
    ) {
      const reset = response.headers.get(
        "x-ratelimit-reset",
      );

      const resetMessage = reset
        ? ` Try again after ${new Date(
            Number(reset) * 1000,
          ).toLocaleTimeString("en-US", {
            timeZone: "UTC",
            hour: "2-digit",
            minute: "2-digit",
            timeZoneName: "short",
          })}.`
        : " Please try again later.";

      throw new GitHubApiError(
        `GitHub rate limit or access restriction.${resetMessage}`,
        429,
      );
    }

    throw new GitHubApiError(
      "GitHub API request failed.",
      502,
    );
  }

  return (await response.json()) as T;
}

export async function getGitHubProfile(
  username: string,
): Promise<GitHubProfile> {
  const login = validateUsername(username);
  const encodedUsername = encodeURIComponent(login);

  const [user, repositories] = await Promise.all([
    githubFetch<GitHubUserResponse>(
      `/users/${encodedUsername}`,
    ),
    githubFetch<GitHubRepoResponse[]>(
      `/users/${encodedUsername}/repos?sort=updated&per_page=100&type=owner`,
    ),
  ]);

  return {
    username: user.login,
    name: user.name,
    bio: user.bio,
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    createdAt: user.created_at,
    profileUrl: user.html_url,
    avatarUrl: user.avatar_url,

    repositories: repositories.map((repo) => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      isFork: repo.fork,
      isArchived: repo.archived,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      url: repo.html_url,
    })),
  };
}
