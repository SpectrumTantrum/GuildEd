/**
 * GET /api/search — Bookshelf resource search (Person 6 integration wrapper)
 * Provides search results for the bookshelf panel.
 * Uses pre-cached demo data for reliability; can proxy to P3's FastAPI if available.
 *
 * Query: ?topics=binary+search,arrays&per_topic=3
 */
import { NextRequest, NextResponse } from "next/server";

interface Resource {
  title: string;
  url: string;
  snippet: string;
  score: number;
  content_type: "article" | "video" | "book";
  source: string;
  topic: string;
}

// Pre-cached demo resources for reliable demo
const DEMO_RESOURCES: Resource[] = [
  {
    title: "Binary Search Algorithm — GeeksforGeeks",
    url: "https://www.geeksforgeeks.org/binary-search/",
    snippet: "Binary Search is a searching algorithm used in a sorted array by repeatedly dividing the search interval in half.",
    score: 0.95,
    content_type: "article",
    source: "GeeksforGeeks",
    topic: "binary search",
  },
  {
    title: "Binary Search in 100 Seconds — Fireship",
    url: "https://www.youtube.com/watch?v=MFhxShGxHWc",
    snippet: "Learn binary search algorithm in 100 seconds with visual animations and code examples.",
    score: 0.92,
    content_type: "video",
    source: "YouTube",
    topic: "binary search",
  },
  {
    title: "Introduction to Algorithms — CLRS Chapter on Sorting",
    url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
    snippet: "The definitive textbook on algorithms covering sorting, searching, graph algorithms, and more.",
    score: 0.88,
    content_type: "book",
    source: "MIT Press",
    topic: "sorting algorithms",
  },
  {
    title: "Visualizing Sorting Algorithms — VisuAlgo",
    url: "https://visualgo.net/en/sorting",
    snippet: "Interactive visualization of sorting algorithms including bubble sort, merge sort, and quicksort.",
    score: 0.90,
    content_type: "article",
    source: "VisuAlgo",
    topic: "sorting algorithms",
  },
  {
    title: "Data Structures: Linked Lists — CS50",
    url: "https://www.youtube.com/watch?v=2T-A_GFuoTo",
    snippet: "Harvard CS50 lecture on linked lists, memory allocation, and pointer operations.",
    score: 0.91,
    content_type: "video",
    source: "YouTube",
    topic: "linked lists",
  },
  {
    title: "Recursion and Backtracking — Khan Academy",
    url: "https://www.khanacademy.org/computing/computer-science/algorithms/recursive-algorithms/a/recursion",
    snippet: "An intuitive introduction to recursive algorithms with visual examples and practice problems.",
    score: 0.89,
    content_type: "article",
    source: "Khan Academy",
    topic: "recursion",
  },
  {
    title: "Understanding Arrays — freeCodeCamp",
    url: "https://www.freecodecamp.org/news/data-structures-101-arrays-a-visual-introduction-for-beginners-7f013bcc355a/",
    snippet: "A visual beginner's guide to arrays, including operations, time complexity, and common patterns.",
    score: 0.87,
    content_type: "article",
    source: "freeCodeCamp",
    topic: "arrays",
  },
  {
    title: "Neural Networks Explained — 3Blue1Brown",
    url: "https://www.youtube.com/watch?v=aircAruvnKk",
    snippet: "Beautiful visual explanation of neural networks, backpropagation, and gradient descent.",
    score: 0.96,
    content_type: "video",
    source: "YouTube",
    topic: "neural networks",
  },
];

export async function GET(request: NextRequest) {
  const topicsParam = request.nextUrl.searchParams.get("topics") ?? "";
  const perTopic = parseInt(request.nextUrl.searchParams.get("per_topic") ?? "3", 10);
  const topics = topicsParam.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);

  // Try P3's FastAPI server if available
  const p3Url = process.env.P3_SCRAPER_URL;
  if (p3Url && topics.length > 0) {
    try {
      const res = await fetch(
        `${p3Url}/bookshelf?topics=${encodeURIComponent(topics.join(","))}&per_topic=${perTopic}`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ resources: data.resources ?? data, source: "p3-scraper" });
      }
    } catch {
      // Fall through to demo data
    }
  }

  // Filter demo resources by topic relevance
  let results: Resource[];
  if (topics.length > 0) {
    results = DEMO_RESOURCES.filter((r) =>
      topics.some((t) => r.topic.includes(t) || r.title.toLowerCase().includes(t) || r.snippet.toLowerCase().includes(t))
    );
  } else {
    results = DEMO_RESOURCES;
  }

  // Sort by score, limit
  results.sort((a, b) => b.score - a.score);
  results = results.slice(0, perTopic * Math.max(topics.length, 1));

  return NextResponse.json({ resources: results, source: "demo-cache" });
}
