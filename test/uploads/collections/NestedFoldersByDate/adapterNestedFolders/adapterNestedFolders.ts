import type {
  Adapter,
  GeneratedAdapter,
  HandleUpload,
} from '@payloadcms/plugin-cloud-storage/types'
import type { CollectionConfig } from 'payload'

import { status as httpStatus } from 'http-status'

import { streamFile } from '../streamFile.js'

export const adapterNestedFolders: Adapter = ({
  collection,
  prefix = '',
}: {
  collection: CollectionConfig
  prefix?: string
}): GeneratedAdapter => {
  return {
    name: 'nestedFolders',
    clientUploads: false,
    // generateURL: generateURLNestedFolders,
    handleDelete: handleDeleteNestedFolders,
    handleUpload: handleUploadNestedFolders,
    staticHandler: () => {
      const filePath =
        '/Users/ale/Projects/Personal/payloadcms-develop/test/uploads/collections/NestedFoldersByDate/test/uploads/mediaNested/2025/8/Screenshot 2025-08-06 at 11.55.16.png'

      const data = streamFile(filePath)

      return new Response(data, {
        status: httpStatus.OK,
      })
    },
  }
}

const generateURLNestedFolders = () => {
  return 'foo/bar/baz'
}

const handleUploadNestedFolders: HandleUpload = async ({
  file,
  data,
  collection,
  req,
  clientUploadContext,
}) => {}

const handleDeleteNestedFolders = async () => {}

function nameWithDate(name: string) {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  return `${year}/${month}/${name}`
}
