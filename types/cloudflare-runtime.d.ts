// The Sites worker runtime supplies these globals at build/deploy time.
// Keeping a narrow local declaration makes strict TypeScript checks work in
// editors and CI without adding a second runtime dependency to the MVP.
declare module "cloudflare:workers" {
  export const env: Readonly<{ DB?: D1Database } & Record<string, unknown>>;
}

type Fetcher = {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
};

interface D1Database {
  readonly [key: string]: unknown;
}
