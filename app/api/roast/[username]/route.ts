
import { getGitHubProfile, GitHubApiError } from "@/lib/github";
import { generateRoast } from "@/lib/roast";
import { roastLimiter } from "@/lib/rate-limit";
import { request } from "https";

// export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    message: "Roast route is working",
  });
}



export async function POST(_request, { params }) {
  try {



    const { username } = await params;


    const forwardedFor = _request.headers.get("x-forwarded-for");
    const ip =
      forwardedFor?.split(",")[0]?.trim() ||
      _request.headers.get("x-real-ip") ||
      "unknown";

    const { success, reset } = await roastLimiter.limit(ip);

    if (!success) {
      return Response.json(
        {
          error: "Too many roast attempts! Take a break and try again.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.max(1, Math.ceil((reset - Date.now()) / 1000))
            ),
          },
        }
      );
    }


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
