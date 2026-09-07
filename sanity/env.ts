export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-10-28'

/**
 * Before the Sanity project exists there is no projectId. The gallery then
 * comes up empty rather than failing, so `pnpm dev` still runs.
 */
export const isSanityConfigured = Boolean(projectId)
