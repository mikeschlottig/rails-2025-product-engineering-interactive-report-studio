import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Hero } from '@/components/report/Hero';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, CaseSensitive, Wrench, Github, Building, Signal } from 'lucide-react';
const resourcesData = {
  cheatsheets: [
    {
      id: 'service-object-cheatsheet',
      title: 'Service Object Cheatsheet',
      description: 'Quick reference for the Callable pattern.',
      icon: <Book className="w-8 h-8" />,
      content: '<h2>Key Principles</h2><p>Single responsibility, explicit inputs/outputs, and framework agnostic.</p>',
    },
  ],
  caseStudies: [
    {
      id: 'shopify-case-study',
      title: 'Shopify: Modular Monolith',
      description: 'How the world\'s largest Rails app scales.',
      icon: <Building className="w-8 h-8" />,
      link: '/report#case-studies',
    },
    {
      id: 'github-case-study',
      title: 'GitHub: Continuous Modernization',
      description: 'Upgrading Rails weekly at massive scale.',
      icon: <Github className="w-8 h-8" />,
      link: '/report#case-studies',
    },
    {
      id: '37signals-case-study',
      title: '37signals: Deployment Pioneers',
      description: 'From AWS to bare-metal with Kamal.',
      icon: <Signal className="w-8 h-8" />,
      link: '/report#case-studies',
    },
  ],
  tooling: [
    {
      id: 'standardrb-tool',
      title: 'StandardRB',
      description: 'Zero-configuration Ruby style guide.',
      icon: <Wrench className="w-8 h-8" />,
      content: '<h3>Gemfile</h3><pre><code>gem "standard", require: false</code></pre>',
    },
    {
      id: 'rspec-tool',
      title: 'RSpec',
      description: 'BDD testing framework for Ruby.',
      icon: <CaseSensitive className="w-8 h-8" />,
      content: '<h3>Gemfile</h3><pre><code>gem "rspec-rails"</code></pre>',
    },
  ],
};
type Resource = typeof resourcesData.cheatsheets[0];
export default function ResourcesPage() {
  const [activeResource, setActiveResource] = useState<Resource | null>(null);
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
              <Link to="/playground" className="transition-colors hover:text-foreground/80 text-foreground/60">Playground</Link>
              <Link to="/resources" className="transition-colors text-foreground">Resources</Link>
            </nav>
          </div>
        </div>
      </header>
      <main>
        <Hero
          title="Resources & Downloads"
          subtitle="A curated collection of cheat-sheets, case studies, and tooling recommendations from the 2025 Rails report."
          ctaText="Browse Collection"
          ctaLink="#resources"
        />
        <div id="resources" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-24">
            <Tabs defaultValue="caseStudies" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="caseStudies">Case Studies</TabsTrigger>
                <TabsTrigger value="tooling">Tooling</TabsTrigger>
                <TabsTrigger value="cheatsheets">Cheat-sheets</TabsTrigger>
              </TabsList>
              <TabsContent value="caseStudies">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {resourcesData.caseStudies.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <ResourceCard resource={item} onOpen={() => setActiveResource(item)} />
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="tooling">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {resourcesData.tooling.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <ResourceCard resource={item} onOpen={() => setActiveResource(item)} />
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="cheatsheets">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {resourcesData.cheatsheets.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <ResourceCard resource={item} onOpen={() => setActiveResource(item)} />
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Dialog open={!!activeResource} onOpenChange={(open) => !open && setActiveResource(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeResource?.title}</DialogTitle>
            <DialogDescription>{activeResource?.description}</DialogDescription>
          </DialogHeader>
          <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: activeResource?.content ?? '' }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}