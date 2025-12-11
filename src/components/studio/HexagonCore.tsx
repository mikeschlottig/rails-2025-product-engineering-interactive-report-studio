import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Adapter, DraggableAdapterCard } from './DraggableAdapterCard';
import React from 'react';
interface HexagonPortProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  isOver: boolean;
  style?: React.CSSProperties;
}
function HexagonPort({ id, children, className, isOver, style }: HexagonPortProps) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "absolute w-36 h-24 flex items-center justify-center transition-all duration-300 rounded-md border-2 border-dashed border-transparent",
        isOver ? 'bg-primary/20 scale-105 border-primary' : 'bg-secondary/50',
        className
      )}
      style={{ ...style, transform: 'translate(-50%, -50%)' }}
    >
      <div className="text-center p-2">{children}</div>
    </div>
  );
}
interface HexagonCoreProps {
  ports: { id: string; content: Adapter | null }[];
  activeId: string | null;
}
export function HexagonCore({ ports, activeId }: HexagonCoreProps) {
  const portPositions = [
    { id: 'port-1', top: '0%', left: '50%' },
    { id: 'port-2', top: '25%', left: '100%' },
    { id: 'port-3', top: '75%', left: '100%' },
    { id: 'port-4', top: '100%', left: '50%' },
    { id: 'port-5', top: '75%', left: '0%' },
    { id: 'port-6', top: '25%', left: '0%' },
  ];
  return (
    <div className="relative w-64 h-72 md:w-80 md:h-96 mx-auto">
      <div
        className="absolute inset-0 bg-secondary flex items-center justify-center"
        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
      >
        <div className="text-center">
          <h3 className="font-bold text-lg">Core Domain</h3>
          <p className="text-sm text-muted-foreground">Pure Ruby Logic</p>
        </div>
      </div>
      {portPositions.map(({ id, top, left }) => {
        const port = ports.find(p => p.id === id);
        const content = port?.content;
        return (
          <HexagonPort
            key={id}
            id={id}
            isOver={activeId === id}
            className="transform"
            style={{ top, left }}
          >
            {content ? (
              <DraggableAdapterCard adapter={content} />
            ) : (
              <span className="text-xs text-muted-foreground">Port {id.split('-')[1]}</span>
            )}
          </HexagonPort>
        );
      })}
    </div>
  );
}