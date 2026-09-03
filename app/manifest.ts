import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sentence Lab",
    short_name: "Sentence Lab",
    description: "Explore and practice the structure of English sentences.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f7f6",
    theme_color: "#0f6b5b",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
