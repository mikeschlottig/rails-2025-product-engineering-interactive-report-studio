import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Hero } from '@/components/report/Hero';
import { ServiceGenerator } from '@/components/playground/ServiceGenerator';
export default function PlaygroundPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <ThemeToggle className="fixed top-4 right-4 z-50" />
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500" />
              <span className="font-bold font-display text-xl">Rails 2025</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link to="/report" className="transition-colors hover:text-foreground/80 text-foreground/60">Report</Link>
              <Link to="/explorer" className="transition-colors hover:text-foreground/80 text-foreground/60">Explorer</Link>
              <Link to="/studio" className="transition-colors hover:text-foreground/80 text-foreground/60">Studio</Link>
              <Link to="/playground" className="transition-colors text-foreground">Playground</Link>
              <Link to="/resources" className="transition-colors hover:text-foreground/80 text-foreground/60">Resources</Link>
            </nav>
          </div>
        </div>
      </header>
      <main>
        <Hero
          title="Patterns Playground"
          subtitle="Interactively generate Ruby Service Object code. Toggle patterns and options to see how modern Rails business logic is structured."
          ctaText="Start Generating"
          ctaLink="#generator"
        />
        <div id="generator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-24">
            <ServiceGenerator />
          </div>
        </div>
      </main>
    </div>
  );
}