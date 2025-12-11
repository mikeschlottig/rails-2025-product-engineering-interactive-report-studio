import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Database, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
interface HeroProps {
  title: React.ReactNode;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}
export function Hero({ title, subtitle, ctaText, ctaLink }: HeroProps) {
  const floatingIconVariants = {
    float: {
      y: [0, -8, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };
  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom mask-gradient" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-24 md:py-32 lg:py-40 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tighter text-foreground leading-tight">
              {title}
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground text-pretty">
              {subtitle}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex justify-center"
          >
            <Button asChild size="lg" className="btn-gradient group text-lg px-8 py-6 shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300">
              <Link to={ctaLink}>
                {ctaText}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
      <motion.div variants={floatingIconVariants} animate="float" style={{ transitionDelay: '0.2s' }} className="absolute top-1/4 left-1/4 w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full center text-orange-500 opacity-50 hidden lg:flex">
        <Code className="w-6 h-6" />
      </motion.div>
      <motion.div variants={floatingIconVariants} animate="float" style={{ transitionDelay: '0.5s' }} className="absolute top-1/3 right-1/4 w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full center text-indigo-500 opacity-50 hidden lg:flex">
        <Layers className="w-6 h-6" />
      </motion.div>
      <motion.div variants={floatingIconVariants} animate="float" style={{ transitionDelay: '0.8s' }} className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full center text-green-500 opacity-50 hidden lg:flex">
        <Database className="w-6 h-6" />
      </motion.div>
    </div>
  );
}