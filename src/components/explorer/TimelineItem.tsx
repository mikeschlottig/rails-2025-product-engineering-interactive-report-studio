import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
interface TimelineItemProps {
  item: {
    icon: React.ReactNode;
    year: string;
    title: string;
    description: string;
  };
  onClick: () => void;
  isLeft?: boolean;
}
export function TimelineItem({ item, onClick, isLeft = false }: TimelineItemProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  const variants = {
    hidden: { opacity: 0, x: isLeft ? -100 : 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };
  return (
    <div ref={ref} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
      <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary bg-background group-hover:bg-primary transition-colors duration-300 absolute left-1/2 -translate-x-1/2 md:group-odd:left-auto md:group-odd:right-1/2 md:group-odd:-translate-x-0 md:group-odd:translate-x-1/2 md:group-even:left-1/2 md:group-even:-translate-x-1/2 z-10 text-primary group-hover:text-primary-foreground">
        {item.icon}
      </div>
      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={variants} className="w-full md:w-[calc(50%-2.5rem)]">
        <Card className="shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader>
            <div className="text-sm text-muted-foreground font-medium">{item.year}</div>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="link" className="p-0 text-orange-500 group/link" onClick={onClick}>
              Learn More
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}