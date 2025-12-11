import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
interface HexagonPortProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  isOver: boolean;
}
function HexagonPort({ id, children, className, isOver }: HexagonPortProps) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "absolute w-1/2 h-1/2 flex items-center justify-center transition-all duration-300",
        isOver ? 'bg-primary/20 scale-105' : 'bg-secondary/50',
        className
      )}
    >
      <div className="text-center">{children}</div>
    </div>
  );
}
interface HexagonCoreProps {
  ports: { id: string; content: React.ReactNode }[];
  activeId: string | null;
}
export function HexagonCore({ ports, activeId }: HexagonCoreProps) {
  return (
    <div className="relative w-96 h-[277px] mx-auto my-12" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
      <div className="absolute inset-0 bg-secondary flex items-center justify-center">
        <div className="text-center">
          <h3 className="font-bold text-lg">Core Domain</h3>
          <p className="text-sm text-muted-foreground">Pure Ruby Logic</p>
        </div>
      </div>
      {/* This is a simplified layout for ports. A more complex one would use transforms. */}
      <HexagonPort id="port-1" isOver={activeId === 'port-1'} className="top-0 left-1/4">
        {ports.find(p => p.id === 'port-1')?.content}
      </HexagonPort>
      <HexagonPort id="port-2" isOver={activeId === 'port-2'} className="top-1/4 right-0">
        {ports.find(p => p.id === 'port-2')?.content}
      </HexagonPort>
      <HexagonPort id="port-3" isOver={activeId === 'port-3'} className="bottom-1/4 right-0">
        {ports.find(p => p.id === 'port-3')?.content}
      </HexagonPort>
      <HexagonPort id="port-4" isOver={activeId === 'port-4'} className="bottom-0 left-1/4">
        {ports.find(p => p.id === 'port-4')?.content}
      </HexagonPort>
      <HexagonPort id="port-5" isOver={activeId === 'port-5'} className="bottom-1/4 left-0">
        {ports.find(p => p.id === 'port-5')?.content}
      </HexagonPort>
      <HexagonPort id="port-6" isOver={activeId === 'port-6'} className="top-1/4 left-0">
        {ports.find(p => p.id === 'port-6')?.content}
      </HexagonPort>
    </div>
  );
}