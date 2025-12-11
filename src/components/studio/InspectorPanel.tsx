import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Adapter } from './DraggableAdapterCard';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import copy from 'copy-to-clipboard';
import { toast } from 'sonner';
interface InspectorPanelProps {
  adapter: Adapter | null;
  onSave: () => void;
}
export function InspectorPanel({ adapter, onSave }: InspectorPanelProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (adapter?.folderStructure) {
      copy(adapter.folderStructure);
      setCopied(true);
      toast.success('Folder structure copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>{adapter ? adapter.title : 'Inspector'}</CardTitle>
        <CardDescription>{adapter ? adapter.description : 'Drag an adapter to a port to see details.'}</CardDescription>
      </CardHeader>
      <CardContent>
        {adapter ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{adapter.details}</p>
            <div>
              <h4 className="font-semibold mb-2">Example Structure</h4>
              <div className="relative">
                <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto text-xs">
                  <code>{adapter.folderStructure}</code>
                </pre>
                <Button size="icon" variant="ghost" className="absolute top-2 right-2 text-gray-400 hover:text-white" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button onClick={onSave} className="w-full btn-gradient">Save Arrangement</Button>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Select an adapter to inspect.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}