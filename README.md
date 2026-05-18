# AI Coding Tutor

Chrome side-panel extension that gives Socratic hints on competitive-programming
problems. See [CLAUDE.md](./CLAUDE.md) for architecture and conventions.

## Prerequisites

- Java 17+
- Maven
- Node 18+
- An Anthropic API key

### Getting your Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to **Settings → API Keys**
4. Click **Create Key**, name it, and copy the value (starts with `sk-ant-...`)

## Quick Start

### Backend

```bash
cd backend
```

**Linux / macOS (Bash):**
```bash
ANTHROPIC_API_KEY=sk-ant-... mvn spring-boot:run
```

**Windows (PowerShell):**
```powershell
$env:ANTHROPIC_API_KEY="sk-ant-..."
mvn spring-boot:run
```

**Windows (CMD):**
```cmd
set ANTHROPIC_API_KEY=sk-ant-... && mvn spring-boot:run
```

### Extension (Node 18+)

```bash
cd extension
npm install
npm run build
```

Then load `extension/dist/` as an unpacked extension at `chrome://extensions`.
