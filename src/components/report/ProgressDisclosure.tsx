import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { ReportSection } from '@shared/types';
import { cn } from '@/lib/utils';
interface ProgressDisclosureProps {
  sections: ReportSection[];
}
export function ProgressDisclosure({ sections }: ProgressDisclosureProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );
    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });
    return () => {
      sections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el) observer.unobserve(el);
      });
    };
  }, [sections]);
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  return (
    <div className="sticky top-24">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="border rounded-lg p-4 bg-card/50"
      >
        <h3 className="font-semibold mb-2">On this page</h3>
        <Progress value={scaleX.get() * 100} className="mb-4 h-1" />
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  'text-left text-sm w-full px-2 py-1.5 rounded-md transition-colors',
                  activeSection === section.id
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-accent/50'
                )}
              >
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}