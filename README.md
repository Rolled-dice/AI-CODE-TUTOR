# AI Coding Tutor

Chrome side-panel extension that gives Socratic hints on competitive-programming
problems. See [CLAUDE.md](./CLAUDE.md) for architecture and conventions.

## Prerequisites

- Java 17+
- Maven
- Node 18+
- A Google Gemini API key

### Getting your Google Gemini API key

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **Create API Key**, select a project, and copy the value

## Quick Start

### Backend

```bash
cd backend
```

**Linux / macOS (Bash):**
```bash
GEMINI_API_KEY=your-key-here mvn spring-boot:run
```

**Windows (PowerShell):**
```powershell
$env:GEMINI_API_KEY="your-key-here"
mvn spring-boot:run
```

**Windows (CMD):**
```cmd
set GEMINI_API_KEY=your-key-here && mvn spring-boot:run
```

### Extension (Node 18+)

```bash
cd extension
npm install
npm run build
```

Then load `extension/dist/` as an unpacked extension at `chrome://extensions`.
