# Futura Chron V1 - Build Instructions

To generate the **DMG installer** for macOS, follow these steps on your local machine:

### 1. Prerequisites
- **Node.js**: Ensure you have Node.js installed (v18 or higher recommended). Download from [nodejs.org](https://nodejs.org/).
- **Terminal**: Open your terminal (or Command Prompt/PowerShell).

### 2. Setup Project Folder
1. Create a new folder on your computer named `FuturaChron`.
2. Copy all the files from this environment into that folder, maintaining the directory structure:
   - `index.html`
   - `index.tsx`
   - `App.tsx`
   - `types.ts`
   - `main.js`
   - `package.json`
   - `metadata.json`
   - `MANUAL.md` (New: Read this for usage instructions!)
   - `components/InputGroup.tsx`
   - `services/geminiService.ts`

### 3. Install Dependencies
In your terminal, navigate to your project folder and run:
```bash
npm install
```
*Note: This command "locates" and downloads Electron and Electron Builder automatically using the `package.json` file.*

### 4. Build the DMG
To package the application as a macOS installer (.dmg), run:
```bash
npm run dist
```
Once the process finishes, you will find a `dist/` folder containing **Futura Chron V1.dmg**.

### 5. Running the App (Development)
If you want to test the app without building the installer:
```bash
npm start
```

---
**Learning More**: Check out `MANUAL.md` for a full breakdown of the features and a YouTube-ready script for your channel.

**Note on API Key**: The app requires `process.env.API_KEY` to be set in your environment for the AI features to function.
