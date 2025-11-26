## Developer build notes

Use these steps to set up and build the project locally. These are the commands that worked for the repository structure in this workspace.

1. Install root dependencies (optional but recommended):

```powershell
npm install
```

2. Build the UI package (from the repository root):

```powershell
cd packages/ui
npm install
npm run build
cd ../..
```

3. Build the minimal template (local demo):

```powershell
cd templates/minimal
npm install
npm run build
cd ../..
```

4. Run the minimal demo locally for development (hot reload):

```powershell
cd templates/minimal
npm run dev
```

Troubleshooting notes
- If `npm run build:ui` or `npm start` in the root fails, try running the install/build commands directly inside `packages/ui` and `templates/minimal` as shown above.
- Some generated `.js`/.d.ts files are committed for convenience; if you regenerate them locally, ensure they match before committing.
- If you encounter permission or lockfile issues on Windows, remove `node_modules` and re-run `npm install`, or try `npm ci` if you have a lockfile and want a clean install.

Optional: regenerate type declarations
- If you need to regenerate `.d.ts` files, run the build for the package that produces them (often the TypeScript build step inside each package). Confirm output matches the committed files before committing.
