# Rails 2025: Product Engineering — Interactive Report & Studio

A high-end, interactive microsite that transforms comprehensive Rails 2025 research into a polished, explorable product. Featuring a visually rich hero section, structured long-form report, animated section cards with popout modal cards, scroll-driven reveal animations, hover micro-interactions, and progress disclosure blocks. Built on Cloudflare Workers with Durable Objects for persistence, it includes interactive studio tools like an Architecture Studio visualizer (hexagonal architecture explorer), Service-Object Playground (generate example Ruby service objects), and a lightweight Bookmarks/Annotations system.

This project demonstrates Ruby on Rails' evolution in 2025, focusing on product vs. data engineering, modern architecture patterns (Service Objects, Hexagonal Architecture), tooling (RuboCop Omakase vs. StandardRB, RSpec vs. Minitest), and case studies from Shopify, GitHub, and 37signals. The site is primarily informational but offers engaging interactions for deeper exploration.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mikeschlottig/rails-2025-product-engineering-interactive-report-studio)

## Features

- **Stunning Visual Design**: Modern UI with smooth animations, responsive layouts, and professional polish using shadcn/ui and Tailwind CSS.
- **Interactive Report**: Scrollable long-form content with animated cards, hover effects, and progress tracking.
- **Popout Modals**: Dynamic modal cards for deeper dives into topics like Service Objects, architecture patterns, and code examples.
- **Architecture Studio**: Drag-and-drop visualizer for hexagonal architecture, with exportable configurations.
- **Patterns Playground**: Client-side generator for Ruby service object templates, with copy-to-clipboard functionality.
- **Bookmarks & Annotations**: Persistent user interactions via Cloudflare Durable Objects, including save/load/delete for bookmarks and threaded discussions.
- **Explorer Timeline**: Scroll-driven animations and inline modals for architectural patterns and case studies.
- **Resources Section**: Downloadable cheat-sheets, references, and tooling recommendations.
- **Performance & Accessibility**: Optimized for all devices, with proper contrast, keyboard navigation, and reduced-motion support.

## Tech Stack

- **Frontend**: React 18, React Router, shadcn/ui, Tailwind CSS v3, Framer Motion (animations), Lucide React (icons), TanStack Query (data fetching), Sonner (toasts), Zustand (state management).
- **Backend**: Hono (routing), Cloudflare Workers (serverless), Durable Objects (persistent storage via IndexedEntity pattern).
- **Utilities**: TypeScript, Vite (build tool), Zod (validation), React Hook Form (forms), Recharts (charts).
- **Deployment**: Cloudflare Workers, Wrangler CLI.
- **Development**: Bun (package manager), ESLint (linting), Tailwind CSS Animate (micro-interactions).

## Quick Start

To get started quickly, clone the repository and follow the installation steps below. For one-click deployment to Cloudflare Workers, use the deploy button above.

## Installation

This project uses Bun as the package manager for faster performance. Ensure you have Bun installed (version 1.0+).

1. Clone the repository:
   ```
   git clone <your-repo-url>
   cd rails2025-showcase
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. Set up Cloudflare credentials (required for development and deployment):
   - Install Wrangler CLI: `bun add -D wrangler`
   - Login: `npx wrangler login`
   - Generate types: `bun run cf-typegen`

## Development

1. Start the development server:
   ```
   bun run dev
   ```
   The app will be available at `http://localhost:3000` (or the configured port).

2. Open a new terminal and run the worker in development mode:
   ```
   bun run wrangler dev
   ```
   This starts the Cloudflare Worker backend at `http://localhost:8787` (default). The frontend will proxy API calls automatically.

3. Make changes to the code in `src/` (frontend) or `worker/` (backend). Hot reloading is enabled for the frontend.

4. Lint the code:
   ```
   bun run lint
   ```

5. Build for production:
   ```
   bun run build
   ```

**Notes**:
- Do not modify `worker/core-utils.ts`, `wrangler.jsonc`, or bindings—these are managed by the template.
- API endpoints are under `/api/*` and use the `GlobalDurableObject` for storage.
- Seed data (e.g., demo users/chats) is auto-populated on first run via entities in `worker/entities.ts`.

## Usage Examples

### Frontend Development
- **Pages**: Edit routes in `src/main.tsx` using React Router. Current routes include Home (`/`), Report (`/report`), Explorer (`/explorer`), etc.
- **API Integration**: Use the `api` helper from `src/lib/api-client.ts` for type-safe calls, e.g.:
  ```tsx
  import { api } from '@/lib/api-client';
  const bookmarks = await api<{ items: Bookmark[]; next: string | null }>('/api/bookmarks');
  ```
- **State Management**: Use Zustand for local stores (primitive selectors only to avoid re-renders). Example in `src/pages/HomePage.tsx`.
- **Animations**: Leverage Framer Motion for scroll reveals and interactions, e.g., `motion.div` with `initial` and `whileInView` props.
- **UI Components**: Import shadcn/ui primitives, e.g., `import { Button, Card } from '@/components/ui/button'`.

### Backend Development
- **Routes**: Add endpoints in `worker/user-routes.ts` using Hono. Example for a new entity:
  ```ts
  app.post('/api/bookmarks', async (c) => {
    const { title, section } = await c.req.json();
    return ok(c, await BookmarkEntity.create(c.env, { id: crypto.randomUUID(), title, section }));
  });
  ```
- **Entities**: Extend `IndexedEntity` in `worker/entities.ts` for new storage types, e.g., `BookmarkEntity`.
- **Persistence**: All data is stored in a single Durable Object instance via CAS for atomicity.

### Interactive Features
- **Bookmarks**: Users can save annotations; data persists across sessions via `/api/bookmarks` endpoints.
- **Architecture Studio**: Drag cards using `@dnd-kit/core` to visualize hexagonal patterns; export as JSON.
- **Playground**: Select options (e.g., Result Monad) to generate Ruby code snippets; copy with `navigator.clipboard.writeText`.

## Deployment

Deploy to Cloudflare Workers for global edge distribution with Durable Objects for stateful persistence.

1. Build the frontend:
   ```
   bun run build
   ```

2. Deploy the worker:
   ```
   bun run deploy
   ```
   This bundles the worker and assets, deploying to your Cloudflare account.

3. For custom domains or environments:
   - Update `wrangler.jsonc` (name, compatibility_date).
   - Use `npx wrangler deploy --env production` for multi-environment setups.

The deployment includes automatic asset handling (SPA mode) and API proxying. Monitor logs and metrics via the Cloudflare dashboard.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mikeschlottig/rails-2025-product-engineering-interactive-report-studio)

## Contributing

Contributions are welcome! Please:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Ensure code follows the project's TypeScript and ESLint standards. Focus on visual excellence, performance, and avoiding infinite loops (see ZERO-TOLERANCE RULES in the codebase).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.