import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Hero } from '@/components/report/Hero';
import { TimelineItem } from '@/components/explorer/TimelineItem';
import { PatternModal, Pattern } from '@/components/explorer/PatternModal';
import { api } from '@/lib/api-client';
import { Bookmark } from '@shared/types';
import { Code, Layers, ShieldCheck, TestTube2, Factory, Ship, GitMerge } from 'lucide-react';
const patternsData: (Pattern & { icon: React.ReactNode; year: string })[] = [
  {
    id: 'service-objects',
    title: 'Service Objects',
    year: 'c. 2015-2025',
    icon: <Code className="w-5 h-5" />,
    description: 'Encapsulating business logic into single-purpose classes.',
    content: '<p>The Service Object pattern moves complex business logic out of controllers and models into dedicated, reusable classes. This improves testability and keeps your core MVC components clean and focused.</p>',
    codeSamples: [
      {
        label: 'Service Object',
        code: `class CreateSubscription
  def self.call(user, plan)
    # ... logic to create subscription
  end
end`,
      },
    ],
  },
  {
    id: 'hexagonal-architecture',
    title: 'Hexagonal Architecture',
    year: 'c. 2020-2025',
    icon: <Layers className="w-5 h-5" />,
    description: 'Isolating the core domain from external dependencies.',
    content: '<p>Also known as Ports and Adapters, this pattern decouples your application\'s core logic from external concerns like databases, APIs, or UI frameworks. This makes the core logic framework-agnostic and highly testable.</p>',
    codeSamples: [
      {
        label: 'Folder Structure',
        code: `app/
├── core/
│   └── billing/
│       ├── domain/
│       └── use_cases/
��── infrastructure/
    ├── repositories/
    └── gateways/`,
      },
    ],
  },
  {
    id: 'linting-standards',
    title: 'Linting Standards',
    year: 'c. 2022-2025',
    icon: <ShieldCheck className="w-5 h-5" />,
    description: 'Enforcing consistent code style across teams.',
    content: '<p>Strict, automated code style enforcement eliminates debates and ensures consistency. <strong>StandardRB</strong> provides a zero-configuration solution, while <strong>RuboCop Omakase</strong> offers the official Rails-blessed style.</p>',
    codeSamples: [
      {
        label: 'StandardRB',
        code: `# Gemfile
gem "standard", require: false`,
      },
      {
        label: 'RuboCop Omakase',
        code: `# Gemfile
gem "rubocop-rails-omakase", require: false`,
      },
    ],
  },
  {
    id: 'testing-frameworks',
    title: 'Testing Frameworks',
    year: 'c. 2010-2025',
    icon: <TestTube2 className="w-5 h-5" />,
    description: 'The ongoing debate between Minitest and RSpec.',
    content: '<p><strong>Minitest</strong> is the fast, simple default in Rails. <strong>RSpec</strong> is the expressive, BDD-style industry standard, favored for its readability and powerful mocking.</p>',
    codeSamples: [
      {
        label: 'Minitest',
        code: `class UserTest < ActiveSupport::TestCase
  test "the truth" do
    assert true
  end
end`,
      },
      {
        label: 'RSpec',
        code: `describe User do
  it "is valid" do
    expect(user).to be_valid
  end
end`,
      },
    ],
  },
];
export default function ExplorerPage() {
  const [activePattern, setActivePattern] = useState<Pattern | null>(null);
  const queryClient = useQueryClient();
  const { data: bookmarksData } = useQuery<{ items: Bookmark[] }>({
    queryKey: ['bookmarks'],
    queryFn: () => api('/api/bookmarks'),
  });
  const bookmarkedIds = new Set(bookmarksData?.items.map(b => b.title));
  const addBookmarkMutation = useMutation({
    mutationFn: (pattern: Pattern) => api<Bookmark>('/api/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ title: pattern.id, data: { title: pattern.title } }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success('Pattern bookmarked!');
    },
    onError: (error) => toast.error(`Failed to save bookmark: ${error.message}`),
  });
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
              <Link to="/explorer" className="transition-colors text-foreground">Explorer</Link>
              <Link to="/studio" className="transition-colors hover:text-foreground/80 text-foreground/60">Studio</Link>
              <Link to="/resources" className="transition-colors hover:text-foreground/80 text-foreground/60">Resources</Link>
            </nav>
          </div>
        </div>
      </header>
      <main>
        <Hero
          title="Pattern Explorer"
          subtitle="An interactive timeline of the architectural patterns and engineering standards shaping modern Ruby on Rails development."
          ctaText="Scroll to Begin"
          ctaLink="#timeline-start"
        />
        <div id="timeline-start" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-24">
            <div className="max-w-3xl mx-auto">
              <div className="relative flex flex-col items-center gap-12 md:gap-8 before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:h-full before:w-0.5 before:bg-border">
                {patternsData.map((pattern, index) => (
                  <TimelineItem
                    key={pattern.id}
                    item={pattern}
                    onClick={() => setActivePattern(pattern)}
                    isLeft={index % 2 === 0}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <PatternModal
        isOpen={!!activePattern}
        pattern={activePattern}
        onClose={() => setActivePattern(null)}
        onBookmark={(p) => addBookmarkMutation.mutate(p)}
        isBookmarked={!!activePattern && bookmarkedIds.has(activePattern.id)}
      />
    </div>
  );
}