
import { getGitHubProfile, GitHubApiError } from "@/lib/github";
import { generateRoast } from "@/lib/roast";

// export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    message: "Roast route is working",
  });
}

export async function POST(_request, { params }) {
  try {
    const { username } = await params;

    const profile = await getGitHubProfile(username);
    const roast = await generateRoast(profile);

    return Response.json({
      profile: {
        username: profile.username,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        profileUrl: profile.profileUrl,
      },
      roast,
    });
  } catch (error) {
    if (error instanceof GitHubApiError) {
      return Response.json(
        { error: error.message },
        { status: error.status },
      );
    }

    console.error("Roast generation failed:", error);

    return Response.json(
      { error: "Couldn't generate the roast. Try again." },
      { status: 502 },
    );
  }
}
