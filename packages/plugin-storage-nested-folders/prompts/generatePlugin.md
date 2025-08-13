## Context

1. Analyze @packages/payload/src/uploads/ to understand how payload stores files.
2. Analyze the plugin implemented in @packages/storage-s3/ as a reference to write a new plugin that stores files locally in a nested folder structure.
3. Analyze @test/storage-s3/ as a reference to understand how the storage-s3 plugin works.

## Requirements

1. use the same logic found in @packages/payload/src/uploads/ to sanitize, validate, security check filenames
2. filename should have a structure like this: {year}_{month}_{sanitizedFilename}\_{docId}.png using the creation year & month and docId
3. write all implementations inside @packages/plugin-storage-nested-folders/
4. before writing the file to destination folder, check if the folder already exists and create it if it doesn't
5. when retrieving a file, extract the folder structure by parsing the filename, use extracted {year} & {month} from filename as prefix to fetch the file from the upload.staticDir folder

## Objectives

1. Ability to store files locally in a nested folder structure using the creation year & month as the folder name.
2. Ability to retrieve files from a nested folder structure using the creation year & month as the folder name.
3. Ability to delete files from a nested folder structure using the creation year & month as the folder name.
4. Ability to update files from a nested folder structure using the creation year & month as the folder name.

## Example

### example folder structure:

```
root
├── 2023
│   └── 01
│       ├── 2023_01_example_1.png
├── 2022
│   └── 01
│       ├── 2022_01_example_3.png
└── 2021
  └── 01
    ├── 2021_01_example_4.png
```
