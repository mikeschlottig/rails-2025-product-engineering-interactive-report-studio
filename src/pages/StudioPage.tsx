import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Hero } from '@/components/report/Hero';
import { HexagonCore } from '@/components/studio/HexagonCore';
import { DraggableAdapterCard, Adapter } from '@/components/studio/DraggableAdapterCard';
import { InspectorPanel } from '@/components/studio/InspectorPanel';
import { api } from '@/lib/api-client';
import { Bookmark } from '@shared/types';
const initialAdapters: Adapter[] = [
  { id: 'adapter-1', title: 'HTTP Controller', description: 'Handles web requests', type: 'driving', details: 'Receives input from users via HTTP. It translates web requests into application commands.', folderStructure: 'app/controllers/' },
  { id: 'adapter-2', title: 'Background Job', description: 'Async task processing', type: 'driving', details: 'Initiates application logic from a queue, independent of a user request.', folderStructure: 'app/jobs/' },
  { id: 'adapter-3', title: 'Database Repository', description: 'ActiveRecord persistence', type: 'driven', details: 'Implements data storage and retrieval logic, adapting the core to a specific database.', folderStructure: 'app/infrastructure/repositories/' },
  { id: 'adapter-4', title: 'Payment Gateway', description: 'Stripe/PayPal API', type: 'driven', details: 'Communicates with external services, translating application needs into API calls.', folderStructure: 'app/infrastructure/gateways/' },
  { id: 'adapter-5', title: 'Mailer', description: 'Sends emails', type: 'driven', details: 'Adapts the core application\'s notification requests to an email delivery service.', folderStructure: 'app/infrastructure/mailers/' },
];
const initialPorts: { id: string; content: Adapter | null }[] = Array.from({ length: 6 }, (_, i) => ({ id: `port-${i + 1}`, content: null }));
export default function StudioPage() {
  const [adapters, setAdapters] = useState(initialAdapters);
  const [ports, setPorts] = useState(initialPorts);
  const [activeAdapter, setActiveAdapter] = useState<Adapter | null>(null);
  const [selectedAdapter, setSelectedAdapter] = useState<Adapter | null>(null);
  const queryClient = useQueryClient();
  const sensors = useSensors(useSensor(PointerSensor));
  const saveArrangementMutation = useMutation({
    mutationFn: (arrangement: object) => api<Bookmark>('/api/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ title: 'Hexagonal Architecture Arrangement', data: arrangement }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success('Arrangement saved as a bookmark!');
    },
    onError: (error) => toast.error(`Failed to save: ${error.message}`),
  });
  const handleDragStart = (event: DragStartEvent) => {
    const adapter = event.active.data.current as Adapter;
    setActiveAdapter(adapter);
    setSelectedAdapter(adapter);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    if (over && activeAdapter) {
      const portIndex = ports.findIndex(p => p.id === over.id);
      if (portIndex !== -1) {
        setPorts(currentPorts => {
          const newPorts = [...currentPorts];
          newPorts[portIndex].content = activeAdapter;
          return newPorts;
        });
        setAdapters(currentAdapters => currentAdapters.filter(a => a.id !== activeAdapter.id));
      }
    }
    setActiveAdapter(null);
  };
  const handleSave = () => {
    const arrangement = ports.map(p => ({ port: p.id, adapter: p.content?.title || null }));
    saveArrangementMutation.mutate({ arrangement });
  };
  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
                <Link to="/explorer" className="transition-colors hover:text-foreground/80 text-foreground/60">Explorer</Link>
                <Link to="/studio" className="transition-colors text-foreground">Studio</Link>
                <Link to="/playground" className="transition-colors hover:text-foreground/80 text-foreground/60">Playground</Link>
                <Link to="/resources" className="transition-colors hover:text-foreground/80 text-foreground/60">Resources</Link>
              </nav>
            </div>
          </div>
        </header>
        <main>
          <Hero
            title="Architecture Studio"
            subtitle="Drag and drop adapters to visualize the Hexagonal Architecture pattern. Understand how to isolate your core domain from external concerns."
            ctaText="Start Building"
            ctaLink="#studio"
          />
          <div id="studio" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-16 md:py-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-3">
                  <h3 className="font-semibold mb-4">Available Adapters</h3>
                  <div className="space-y-4">
                    {adapters.map(adapter => (
                      <DraggableAdapterCard key={adapter.id} adapter={adapter} />
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-6 center">
                  <HexagonCore ports={ports} activeId={activeAdapter?.id ?? null} />
                </div>
                <div className="lg:col-span-3">
                  <InspectorPanel adapter={selectedAdapter} onSave={handleSave} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <DragOverlay>
        {activeAdapter ? <DraggableAdapterCard adapter={activeAdapter} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}