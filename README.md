# Podman Desktop Stats Plugin

A Podman Desktop extension that provides real-time container and host system statistics monitoring.

## Features

- **Per-Container Metrics**: CPU usage, memory consumption, network I/O, block I/O, and process counts
- **Host System Overview**: CPU usage, memory utilization, core count, and uptime
- **Real-Time Updates**: Configurable refresh interval (1-60 seconds)
- **Clean Dashboard UI**: Built with Svelte 5 and Tailwind CSS
- **Zero Configuration**: Works out of the box with Podman 4.x and 5.x

## Installation

### Quick Install (Recommended)

Use the provided installation script:

```bash
# Clone and build
git clone https://github.com/yourusername/podman-desktop-stats-plugin.git
cd podman-desktop-stats-plugin
npm install

# Package for Podman Desktop
./install-extension.sh
```

Then in **Podman Desktop**:
1. Go to **Extensions**
2. Click **Install from file...**
3. Select: `packages/backend/podman-desktop-stats-1.0.0.tar`
4. Click **Install**

### Manual Installation

1. Clone and install dependencies:
```bash
git clone https://github.com/yourusername/podman-desktop-stats-plugin.git
cd podman-desktop-stats-plugin
npm install
```

2. Build and package:
```bash
npm run build
cd packages/backend
podman build -t localhost/podman-desktop-stats:1.0.0 -f Containerfile .
podman save localhost/podman-desktop-stats:1.0.0 -o podman-desktop-stats-1.0.0.tar
```

3. Install in Podman Desktop:
   - Open Podman Desktop
   - Go to **Extensions**
   - Click **Install from file...**
   - Select the `.tar` file created above

## Development

### Prerequisites

- Node.js 20+
- npm 10+
- Podman Desktop 1.0+

### Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Type checking
npm run typecheck

# Lint code
npm run lint

# Format code
npm run format

# Build all packages
npm run build

# Watch mode (auto-rebuild)
npm run watch
```

### Project Structure

```
podman-desktop-stats-plugin/
├── packages/
│   ├── shared/          # Shared types and utilities
│   ├── backend/         # Extension backend (Node.js)
│   └── frontend/        # Dashboard UI (Svelte 5)
├── docs/                # Architecture and development specs
└── .github/workflows/   # CI/CD pipeline
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run backend tests only
npx vitest run packages/backend packages/shared

# Run frontend tests only
cd packages/frontend && npm test
```

## Architecture

This extension follows hexagonal architecture with clear separation of concerns:

- **Adapters**: Port/adapter pattern for Podman Desktop API and Node.js OS module
- **Collectors**: Stats collection for containers and host system
- **Orchestration**: Stats manager with configurable polling
- **RPC Bridge**: Backend-to-frontend communication via postMessage
- **Frontend**: Reactive Svelte stores and components

For detailed architecture information, see [docs/ARCHITECTURE-1_0_0.md](docs/ARCHITECTURE-1_0_0.md).

## Configuration

Configure the refresh interval in Podman Desktop settings:

1. Go to **Settings** → **Extensions** → **Container Stats**
2. Set **Refresh Interval** (1-60 seconds, default: 3s)
3. Changes apply immediately

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Workflow

- All code changes require tests (TDD approach)
- Coverage target: > 80% global
- Follow TypeScript strict mode
- Use conventional commits
- Ensure `npm run lint` passes
- Ensure `npm test` passes

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

- **Issues**: https://github.com/yourusername/podman-desktop-stats-plugin/issues
- **Discussions**: https://github.com/yourusername/podman-desktop-stats-plugin/discussions
- **Podman Desktop Docs**: https://podman-desktop.io/docs

## Acknowledgments

Built with:
- [Podman Desktop Extension API](https://podman-desktop.io/docs/extensions)
- [Svelte 5](https://svelte.dev/)
- [Vite](https://vitejs.dev/)
- [Vitest](https://vitest.dev/)
- [TypeScript](https://www.typescriptlang.org/)
