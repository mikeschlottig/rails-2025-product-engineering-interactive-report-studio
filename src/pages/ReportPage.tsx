import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Hero } from '@/components/report/Hero';
import { SectionCard } from '@/components/report/SectionCard';
import { ModalCard } from '@/components/report/ModalCard';
import { ProgressDisclosure } from '@/components/report/ProgressDisclosure';
import { reportSections } from '@/data/report-sections';
import { api } from '@/lib/api-client';
import { Bookmark, ReportSection } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
export default function ReportPage() {
  const [activeModalSection, setActiveModalSection] = useState<ReportSection | null>(null);
  const queryClient = useQueryClient();
  const { data: bookmarksData, isLoading: isLoadingBookmarks } = useQuery<{ items: Bookmark[] }>({
    queryKey: ['bookmarks'],
    queryFn: () => api('/api/bookmarks'),
  });
  const bookmarks = bookmarksData?.items ?? [];
  const bookmarkedIds = new Set(bookmarks.map(b => b.title));
  const addBookmarkMutation = useMutation({
    mutationFn: (newBookmark: Partial<Bookmark>) => api<Bookmark>('/api/bookmarks', {
      method: 'POST',
      body: JSON.stringify(newBookmark),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success('Bookmark saved!');
    },
    onError: (error) => {
      toast.error(`Failed to save bookmark: ${error.message}`);
    },
  });
  const handleBookmark = (section: ReportSection, note?: string) => {
    addBookmarkMutation.mutate({ title: section.id, note, data: { title: section.title } });
  };
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
              <Link to="/report" className="transition-colors text-foreground">Report</Link>
              <Link to="/explorer" className="transition-colors hover:text-foreground/80 text-foreground/60">Explorer</Link>
              <Link to="/studio" className="transition-colors hover:text-foreground/80 text-foreground/60">Studio</Link>
              <Link to="/resources" className="transition-colors hover:text-foreground/80 text-foreground/60">Resources</Link>
            </nav>
          </div>
        </div>
      </header>
      <main>
        <Hero
          title={<>The Full Report</>}
          subtitle="A comprehensive analysis of the Ruby on Rails ecosystem in 2025. Dive into architecture, best practices, and the case studies defining a new era of product engineering."
          ctaText="Start Reading"
          ctaLink="#conclusion"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-8">
                <div className="space-y-16 md:space-y-24">
                  {isLoadingBookmarks ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                      </div>
                    ))
                  ) : (
                    reportSections.map((section) => (
                      <SectionCard
                        key={section.id}
                        section={section}
                        onOpenModal={setActiveModalSection}
                        onBookmark={handleBookmark}
                        isBookmarked={bookmarkedIds.has(section.id)}
                      />
                    ))
                  )}
                </div>
              </div>
              <aside className="hidden lg:block lg:col-span-4">
                <ProgressDisclosure sections={reportSections} />
              </aside>
            </div>
          </div>
        </div>
      </main>
      <ModalCard
        isOpen={!!activeModalSection}
        section={activeModalSection}
        onClose={() => setActiveModalSection(null)}
        onBookmark={handleBookmark}
        isBookmarked={!!activeModalSection && bookmarkedIds.has(activeModalSection.id)}
      />
    </div>
  );
}