import type { CollectionConfig } from 'payload'

import { status as httpStatus } from 'http-status'
import path from 'path'
import { fileURLToPath } from 'url'

import { streamFile } from './streamFile.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

function getCurrentYearMonth() {
  const date = new Date()
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  return {
    year,
    month,
  }
}

function extractDateFromName(name: string) {
  const [year, month] = name.split('_')
  return {
    year,
    month,
  }
}

const baseStaticDir = path.resolve(dirname, 'test/uploads/mediaNested')
const { year, month } = getCurrentYearMonth()
const staticDir = `${baseStaticDir}/${year}/${month}`

export const NestedFoldersByDate: CollectionConfig = {
  slug: 'nested-folders-by-date',
  upload: {
    staticDir,
    handlers: [
      (req, { params }) => {
        console.log('custom handler')

        const { filename } = params

        const { year, month } = extractDateFromName(filename)

        const filePath = `${baseStaticDir}/${year}/${month}/${filename}`

        const data = streamFile(filePath)

        return new Response(data, {
          status: httpStatus.OK,
        })
      },
    ],
  },
  fields: [],
  hooks: {
    beforeOperation: [
      ({ req, operation }) => {
        console.log('beforeOperation', operation, req.file)

        if (operation === 'create' && req.file) {
          const { year, month } = getCurrentYearMonth()
          req.file.name = `${year}_${month}_${req.file.name}`
        }
      },
    ],
    beforeChange: [
      ({ data }) => {
        console.log('beforeChange', data)
        // const nameDate = nameWithDate(data.filename)
        // data.filename = nameDate
        return data
      },
    ],
  },
}
