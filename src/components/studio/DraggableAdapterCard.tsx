import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
export interface Adapter {
  id: string;
  title: string;
  description: string;
  type: 'driving' | 'driven';
  details: string;
  folderStructure: string;
}
interface DraggableAdapterCardProps {
  adapter: Adapter;
  isDragging?: boolean;
}
export function DraggableAdapterCard({ adapter, isDragging }: DraggableAdapterCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: adapter.id,
    data: adapter,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className={cn("cursor-grab active:cursor-grabbing transition-shadow", isDragging && "shadow-2xl z-50 opacity-75")}>
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          <div {...listeners} className="p-2 text-muted-foreground">
            <GripVertical />
          </div>
          <div>
            <CardTitle className="text-base">{adapter.title}</CardTitle>
            <CardDescription className="text-xs">{adapter.description}</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}