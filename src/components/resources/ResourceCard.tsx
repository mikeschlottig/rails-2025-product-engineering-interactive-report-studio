import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
interface Resource {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content?: string;
  link?: string;
}
interface ResourceCardProps {
  resource: Resource;
  onOpen: (resource: Resource) => void;
}
export function ResourceCard({ resource, onOpen }: ResourceCardProps) {
  const handleClick = () => {
    if (resource.content) {
      onOpen(resource);
    }
  };
  const cardContent = (
    <Card className="h-full flex flex-col bg-card/50 hover:bg-card/90 border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
      <CardHeader className="flex-row items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-secondary center flex-shrink-0 text-primary">{resource.icon}</div>
        <div>
          <CardTitle className="text-xl font-semibold">{resource.title}</CardTitle>
          <CardDescription className="mt-1">{resource.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="mt-auto pt-4">
        <Button asChild variant="link" className="p-0 text-orange-500 group">
          <span>
            {resource.link ? 'Read More' : 'View Details'}
            <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Button>
      </CardContent>
    </Card>
  );
  if (resource.link) {
    return <Link to={resource.link}>{cardContent}</Link>;
  }
  return <div onClick={handleClick}>{cardContent}</div>;
}