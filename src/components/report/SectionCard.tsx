import { motion, Variants } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, MessageSquare, Eye } from 'lucide-react';
import { ReportSection } from '@shared/types';
import { useInView } from 'react-intersection-observer';
interface SectionCardProps {
  section: ReportSection;
  onOpenModal: (section: ReportSection) => void;
  onBookmark: (section: ReportSection) => void;
  isBookmarked: boolean;
}
export function SectionCard({ section, onOpenModal, onBookmark, isBookmarked }: SectionCardProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        ease: 'easeOut' 
      } 
    },
  };
  const readTime = Math.ceil((section.fullContent?.split(' ').length ?? 200) / 200);
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={cardVariants}>
      <Card id={section.id} className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 border-border/50">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl md:text-3xl font-semibold tracking-tight">{section.title}</CardTitle>
              <CardDescription className="mt-2 text-base text-muted-foreground">{readTime} min read</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-lg leading-relaxed text-pretty">{section.excerpt}</p>
          <div className="mt-6 flex items-center gap-2 flex-wrap">
            <Button onClick={() => onOpenModal(section)}>
              <Eye className="mr-2 h-4 w-4" /> Read More
            </Button>
            <Button variant="outline" onClick={() => onOpenModal(section)}>
              <MessageSquare className="mr-2 h-4 w-4" /> Annotate
            </Button>
            <Button variant={isBookmarked ? "secondary" : "outline"} onClick={() => onBookmark(section)}>
              <Bookmark className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} /> {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}