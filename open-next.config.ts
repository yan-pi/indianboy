import { defineCloudflareConfig } from '@opennextjs/cloudflare'
// Uncomment when R2 bucket is set up
// import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  // Uncomment when R2 bucket is set up for ISR/caching
  // incrementalCache: r2IncrementalCache,
})
