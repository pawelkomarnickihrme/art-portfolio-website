'use client'

import { visionTool } from '@sanity/vision'
import { plPLLocale } from '@sanity/locale-pl-pl'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

export default defineConfig({
  name: 'default',
  title: 'sanka',
  basePath: '/studio',
  projectId: projectId!,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    plPLLocale(),
    // GROQ playground — developer tool, kept out of the artist's Studio.
    ...(process.env.NODE_ENV === 'development'
      ? [visionTool({ defaultApiVersion: apiVersion })]
      : []),
  ],
  // Everything is a singleton reached from the sidebar, so no "new document" button.
  document: {
    newDocumentOptions: () => [],
  },
})
