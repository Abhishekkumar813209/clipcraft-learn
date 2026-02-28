import { useState, useRef, useEffect } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface QuickCreateSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  items: { id: string; name: string; icon?: string }[];
  createLabel: string;
  onCreate: (name: string) => Promise<string>;
}

export function QuickCreateSelect({
  value,
  onValueChange,
  placeholder,
  disabled,
  items,
  createLabel,
  onCreate,
}: QuickCreateSelectProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCreating) {
      // Small delay to let the DOM render
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCreating]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    try {
      const id = await onCreate(newName.trim());
      onValueChange(id);
      toast.success(`"${newName.trim()}" created!`);
      setNewName('');
      setIsCreating(false);
    } catch (err) {
      toast.error('Failed to create');
    } finally {
      setLoading(false);
    }
  };

  if (isCreating) {
    return (
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          placeholder={`New ${createLabel.toLowerCase()}...`}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); handleCreate(); }
            if (e.key === 'Escape') { setIsCreating(false); setNewName(''); }
          }}
          className="bg-background border-input flex-1"
          disabled={loading}
        />
        <Button size="icon" variant="default" onClick={handleCreate} disabled={!newName.trim() || loading}>
          <Check className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => { setIsCreating(false); setNewName(''); }}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="bg-background border-input">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-popover border-border">
        {items.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.icon ? `${item.icon} ${item.name}` : item.name}
          </SelectItem>
        ))}
        {!disabled && (
          <>
            <SelectSeparator />
            <div
              className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-primary"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsCreating(true);
              }}
            >
              <Plus className="w-4 h-4 absolute left-2" />
              Create new {createLabel.toLowerCase()}
            </div>
          </>
        )}
      </SelectContent>
    </Select>
  );
}
