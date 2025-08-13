## prompt

first analyze the entire codebase, then focus on @packages/payload/src/uploads/ to find where filename field get defined and what type of validation is run against it.

# Analysis of Filename Handling in Payload CMS Uploads

This document analyzes how the `filename` field is defined, generated, and validated within the `@packages/payload/src/uploads/**` directory of the Payload CMS codebase.

## Filename Field Definition

The `filename` field is defined as a base field for all upload collections in `packages/payload/src/uploads/getBaseFields.ts`. Its configuration is as follows:

```typescript
const filename: Field = {
  name: 'filename',
  type: 'text',
  admin: {
    disableBulkEdit: true,
    hidden: true,
    readOnly: true,
  },
  index: true,
  label: ({ t }) => t('upload:fileName'),
}
```

Key characteristics of the `filename` field are:

- **Type**: It is a `text` field.
- **Admin UI**: It is `hidden` and `readOnly` in the admin interface, meaning users cannot directly modify it.
- **Database**: It is `indexed` to ensure efficient querying. By default, it is also set to be `unique` to prevent filename collisions at the database level. This uniqueness constraint can be disabled by setting `upload.filenameCompoundIndex` in the collection configuration.

## Filename Generation and Sanitization

The process of generating and sanitizing a filename for an uploaded file is primarily handled in `packages/payload/src/uploads/generateFileData.ts`. The process is as follows:

1.  **Initial Filename**: The original filename is taken from the uploaded file (`req.file.name`).

2.  **Sanitization**: The filename is sanitized using the `sanitize-filename` library. This removes characters that are not allowed in filenames on various operating systems. The sanitization is applied to the base name of the file (without the extension).

    ```typescript
    const baseFilename = sanitize(file.name.substring(0, file.name.lastIndexOf('.')) || file.name)
    ```

3.  **Uniqueness Check**: After sanitization, the system ensures the filename is unique to prevent overwriting existing files. This is done in `packages/payload/src/uploads/getSafeFilename.ts`. The function `getSafeFileName` checks for collisions in both the database (using `docWithFilenameExists`) and the file system (using `fileExists`).

4.  **Incrementing on Collision**: If a filename collision is detected, the filename is incremented with a numeric suffix (e.g., `my-image-1.png`, `my-image-2.png`). This is handled by the `incrementName` function in the same file.

5.  **Final Filename**: The resulting safe and unique filename is then stored in the `fileData.filename` property, which is ultimately saved to the database.

The `imageResizer.ts` file also uses `sanitize-filename` when creating filenames for different image sizes, ensuring that derived image files also have safe names.

## Validation and Security

Several layers of validation and security checks are applied to the filename throughout the upload and file serving process:

1.  **MIME Type and Extension Validation**: In `packages/payload/src/uploads/checkFileRestrictions.ts`, the file's MIME type and extension are validated against a list of restricted types. While this doesn't directly validate the filename, it uses the filename's extension as part of the validation process, preventing the upload of potentially malicious file types.

2.  **Path Traversal Prevention**: A critical security check is in place to prevent path traversal attacks. In `packages/payload/src/uploads/checkFileAccess.ts`, when a file is requested, the code explicitly checks if the filename contains `../` or `..\`. If it does, a `Forbidden` error is thrown, preventing access to files outside of the intended directory. A similar check exists in `generateFileData.ts` when retrieving a file for editing.

    ```typescript
    if (filename.includes('../') || filename.includes('..\')) {
      throw new Forbidden(req.t)
    }
    ```

3.  **Safe Filename Parsing**: In the multipart processing logic (`packages/payload/src/uploads/fetchAPI-multipart/utilities.ts`), the `parseFileName` function provides an additional layer of sanitization. It can truncate filenames to 255 characters and remove characters based on a regex if the `safeFileNames` option is enabled.

## Conclusion

The `filename` field in Payload CMS is handled with a strong emphasis on security and robustness. The system employs a multi-layered approach to ensure that filenames are safe, unique, and do not introduce security vulnerabilities.

- The `filename` is defined as a read-only, unique, and indexed field.
- Filenames are sanitized to remove illegal characters.
- A robust mechanism is in place to prevent filename collisions by incrementing filenames.
- Critical security checks, such as path traversal prevention, are implemented to protect the file system.
- File uploads are also restricted by MIME type and extension, adding another layer of security.

This comprehensive approach to filename management ensures the integrity and security of the file upload functionality in Payload CMS.
