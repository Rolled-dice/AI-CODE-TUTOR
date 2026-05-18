# AI Coding Tutor

Chrome side-panel extension that gives Socratic hints on competitive-programming
problems. See [CLAUDE.md](./CLAUDE.md) for architecture and conventions.

## Quick Start

**Backend** (Java 17+, Maven):
```bash
cd backend
ANTHROPIC_API_KEY=sk-ant-... mvn spring-boot:run
```

**Extension** (Node 18+):
```bash
cd extension
npm install
npm run build
```

Then load `extension/dist/` as an unpacked extension at `chrome://extensions`.
