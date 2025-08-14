import type { CollectionConfig } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const NestedFoldersAdapter: CollectionConfig = {
  slug: 'nested-folders-adapter',
  upload: {
    staticDir: path.resolve(dirname, 'test/uploads/adapter'),
  },
  fields: [],
  hooks: {
    beforeOperation: [],
    beforeChange: [],
  },
}
