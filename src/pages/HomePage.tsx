import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CodeXml, Layers3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { Hero } from '@/components/report/Hero';
const features = [
  {
    icon: <BookOpen className="w-8 h-8 text-orange-500" />,
    title: 'In-Depth Report',
    description: 'Explore the full 2025 analysis on Ruby on Rails, from architecture to engineering standards.',
    link: '/report',
    cta: 'Read the Report',
  },
  {
    icon: <Layers3 className="w-8 h-8 text-indigo-500" />,
    title: 'Architecture Studio',
    description: 'Visually experiment with Hexagonal Architecture and see how modern Rails apps are built for scale.',
    link: '/studio',
    cta: 'Open the Studio',
  },
  {
    icon: <CodeXml className="w-8 h-8 text-green-500" />,
    title: 'Pattern Explorer',
    description: 'An interactive journey through key patterns like Service Objects, modular monoliths, and more.',
    link: '/explorer',
    cta: 'Start Exploring',
  },
];
export function HomePage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <ThemeToggle className="fixed top-4 right-4" />
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
              <Link to="/resources" className="transition-colors hover:text-foreground/80 text-foreground/60">Resources</Link>
            </nav>
          </div>
        </div>
      </header>
      <main>
        <Hero
          title={
            <>
              The State of <span className="text-gradient">Ruby on Rails</span> in 2025
            </>
          }
          subtitle="An interactive report and studio exploring modern architecture, engineering standards, and the ecosystem that powers the world's most ambitious products."
          ctaText="Explore the Report"
          ctaLink="/report"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-24 lg:py-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col bg-card/50 hover:bg-card/90 border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardHeader className="flex-row items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-secondary center flex-shrink-0">{feature.icon}</div>
                      <div>
                        <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                        <CardDescription className="mt-1">{feature.description}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="mt-auto pt-4">
                      <Button asChild variant="link" className="p-0 text-orange-500 group">
                        <Link to={feature.link}>
                          {feature.cta}
                          <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Built with ❤️ at Cloudflare. An interactive report by the Cloudflare Special Projects Team.</p>
            <p>&copy; {new Date().getFullYear()} Rails 2025 Showcase. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
      <Toaster richColors closeButton />
    </div>
  );
}