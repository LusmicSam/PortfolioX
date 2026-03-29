import { NextResponse } from 'next/server';

export async function GET() {
  // Env var in .env.local is GIT_TOKEN
  const token = process.env.GIT_TOKEN;

  console.log("\n=== GitHub API Route ===");
  console.log("Token present:", !!token, token ? `(${token.slice(0, 8)}...)` : "(none)");

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-Cosmic-App'
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    // Fetch the user's repositories, sorted by recently updated
    const res = await fetch('https://api.github.com/users/LusmicSam/repos?sort=updated&per_page=30', {
      headers,
      next: { revalidate: 3600 }
    });

    console.log("GitHub API status:", res.status, res.statusText);
    console.log("Rate limit remaining:", res.headers.get('x-ratelimit-remaining'), "/", res.headers.get('x-ratelimit-limit'));

    if (!res.ok) {
      const errBody = await res.text();
      console.error("GitHub API error body:", errBody);
      throw new Error(`GitHub API responded with ${res.status}`);
    }

    const repos = await res.json();

    console.log(`\nFetched ${repos.length} repos:`);
    repos.forEach((r: any, i: number) => {
      console.log(
        `  [${String(i + 1).padStart(2)}] ${r.name.padEnd(35)} stars:${r.stargazers_count}  forks:${r.forks_count}  size:${r.size}  lang:${r.language ?? 'n/a'}  url:${r.html_url}`
      );
    });
    console.log("========================\n");

    // Map to the CommitEntry format expected by the WormholeTimeline
    const data = repos.map((repo: any) => ({
      title: repo.name,
      // Use stargazers_count + forks as a proxy for activity (size is disk kb, not commits)
      commitCount: repo.size,
      html_url: repo.html_url,
      description: repo.description || "",
      language: repo.language || null,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch GitHub timeline:", error);
    // Fallback data
    return NextResponse.json([
      { title: "portfolio-cosmic", commitCount: 156, html_url: "https://github.com/LusmicSam/portfolio-cosmic" },
      { title: "neural-engine-v2", commitCount: 89, html_url: "" },
      { title: "edge-inference-rt", commitCount: 204, html_url: "" },
      { title: "distributed-kv-store", commitCount: 312, html_url: "" },
      { title: "proctor-ai-core", commitCount: 118, html_url: "" },
      { title: "c-minus-compiler", commitCount: 65, html_url: "" },
    ]);
  }
}
