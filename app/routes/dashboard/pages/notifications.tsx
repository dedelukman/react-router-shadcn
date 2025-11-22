import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Checkbox } from '~/components/ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from '~/components/ui/sheet';
import { toast } from 'sonner';
import {
  IconSearch,
  IconTrash,
  IconArchive,
  IconMail,
  IconStar,
  IconBell,
} from '@tabler/icons-react';

type Notification = {
  id: string;
  title: string;
  body?: string;
  date: string;
  favorite?: boolean;
  archived?: boolean;
  read?: boolean;
};

const SAMPLE: Notification[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `n-${i}`,
  title: `Notification ${i + 1}`,
  body: `This is the detail for notification ${i + 1}.`,
  date: new Date(Date.now() - i * 1000 * 60 * 60).toLocaleString(),
  favorite: i % 5 === 0,
  archived: i % 7 === 0,
  read: i % 3 === 0,
}));

export default function Page() {
  const [items, setItems] = React.useState<Notification[]>(() => {
    try {
      const raw = localStorage.getItem('app_notifications');
      return raw ? (JSON.parse(raw) as Notification[]) : SAMPLE;
    } catch {
      return SAMPLE;
    }
  });

  const [query, setQuery] = React.useState('');
  const [tab, setTab] = React.useState<'all' | 'favorites' | 'archived'>('all');

  // selection for bulk actions
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // modal state for delete confirmation (uses Sheet)
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmMode, setConfirmMode] = React.useState<'single' | 'bulk'>(
    'single'
  );
  const [targetId, setTargetId] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      localStorage.setItem('app_notifications', JSON.stringify(items));
      // notify other listeners in same tab
      window.dispatchEvent(new Event('app_notifications_changed'));
    } catch {}
  }, [items]);

  // Listen for updates coming from other parts of the app (popover or other tabs)
  React.useEffect(() => {
    function handleUpdate() {
      try {
        const raw = localStorage.getItem('app_notifications');
        const parsed = raw ? (JSON.parse(raw) as Notification[]) : SAMPLE;
        // update only when different
        const a = JSON.stringify(parsed || []);
        const b = JSON.stringify(items || []);
        if (a !== b) setItems(parsed);
      } catch {
        // ignore
      }
    }

    function onStorage(e: StorageEvent) {
      if (e.key === 'app_notifications') handleUpdate();
    }

    window.addEventListener('app_notifications_changed', handleUpdate);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('app_notifications_changed', handleUpdate);
      window.removeEventListener('storage', onStorage);
    };
  }, [items]);

  const counts = React.useMemo(() => {
    // 'All' shows all notifications (including archived)
    const all = items.filter((i) => !i.archived).length;
    const fav = items.filter((i) => i.favorite && !i.archived).length;
    const archived = items.filter((i) => i.archived).length;
    const unread = items.filter((i) => !i.read && !i.archived).length;
    return { all, fav, archived, unread };
  }, [items]);

  function toggleFavorite(id: string) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, favorite: !it.favorite } : it))
    );
    toast.success('Toggled favorite');
  }

  function toggleArchive(id: string) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, archived: !it.archived } : it))
    );
    toast('Archived state updated');
  }

  function toggleRead(id: string) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, read: !it.read } : it))
    );
    toast('Read state updated');
  }

  function openDeleteConfirmSingle(id: string) {
    setTargetId(id);
    setConfirmMode('single');
    setConfirmOpen(true);
  }

  function openDeleteConfirmBulk() {
    setTargetId(null);
    setConfirmMode('bulk');
    setConfirmOpen(true);
  }

  function toggleSelectOne(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  function performDelete() {
    if (confirmMode === 'single' && targetId) {
      setItems((prev) => prev.filter((it) => it.id !== targetId));
      setSelectedIds((s) => s.filter((id) => id !== targetId));
      toast.success('Notification deleted');
    }

    if (confirmMode === 'bulk') {
      setItems((prev) => prev.filter((it) => !selectedIds.includes(it.id)));
      setSelectedIds([]);
      toast.success(`${selectedIds.length} notification(s) deleted`);
    }

    setConfirmOpen(false);
  }

  function bulkMarkRead() {
    setItems((prev) =>
      prev.map((it) =>
        selectedIds.includes(it.id) ? { ...it, read: true } : it
      )
    );
    toast.success(`${selectedIds.length} notification(s) marked read`);
    setSelectedIds([]);
  }

  const filtered = items
    .filter((it) => {
      if (tab === 'favorites') return it.favorite && !it.archived;
      if (tab === 'archived') return it.archived;
      if (tab === 'all') return !it.archived;
      // 'all' should include everything
      return true;
    })
    .filter((it) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        it.title.toLowerCase().includes(q) ||
        (it.body || '').toLowerCase().includes(q)
      );
    });

  return (
    <div className='m-2 space-y-4'>
      <Card>
        <CardHeader className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <IconBell className='size-5' />
            <div>
              <CardTitle>Notifications</CardTitle>
              <div className='text-sm text-muted-foreground'>
                You have <strong>{counts.all}</strong> notifications{' '}
                <span className='ml-2 text-sm'>
                  <Badge variant='secondary'>{counts.unread} unread</Badge>
                </span>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-2'>
              <Input
                placeholder='Search notifications'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className='max-w-sm'
                spellCheck={false}
              />
              <Button variant='ghost' aria-label='Search'>
                <IconSearch />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className='mb-4'>
            <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
              <TabsList>
                <TabsTrigger value='all'>
                  All <Badge className='ml-2'>{counts.all}</Badge>
                </TabsTrigger>
                <TabsTrigger value='favorites'>
                  Favorites <Badge className='ml-2'>{counts.fav}</Badge>
                </TabsTrigger>
                <TabsTrigger value='archived'>
                  Archived <Badge className='ml-2'>{counts.archived}</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className='mb-4 flex items-center justify-between'>
            <div />
            <div className='flex items-center gap-2'>
              <Checkbox
                checked={
                  filtered.length > 0 && selectedIds.length === filtered.length
                    ? true
                    : selectedIds.length > 0 &&
                        selectedIds.length < filtered.length
                      ? 'indeterminate'
                      : false
                }
                onCheckedChange={() => {
                  if (
                    filtered.length > 0 &&
                    selectedIds.length === filtered.length
                  )
                    setSelectedIds([]);
                  else setSelectedIds(filtered.map((f) => f.id));
                }}
                aria-label='Select all'
              />
              <Button
                variant='ghost'
                onClick={() => bulkMarkRead()}
                disabled={selectedIds.length === 0}
                aria-label='Mark selected read'
              >
                <IconMail />
              </Button>
              <Button
                variant='ghost'
                onClick={() => openDeleteConfirmBulk()}
                disabled={selectedIds.length === 0}
                aria-label='Delete selected'
              >
                <IconTrash />
              </Button>
            </div>
          </div>

          <div className='grid gap-3'>
            {filtered.length === 0 ? (
              <div className='text-sm text-muted-foreground'>
                No notifications
              </div>
            ) : (
              filtered.map((n) => (
                <div
                  key={n.id}
                  className='flex items-start justify-between gap-4 rounded-md border p-3'
                >
                  <div className='flex items-start gap-3'>
                    <Checkbox
                      checked={selectedIds.includes(n.id)}
                      onCheckedChange={() => toggleSelectOne(n.id) as any}
                      aria-label={`Select ${n.title}`}
                    />
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <div className='font-medium'>{n.title}</div>
                        <div className='text-xs text-muted-foreground'>
                          {n.date}
                        </div>
                      </div>
                      {n.body && (
                        <div className='text-sm text-muted-foreground mt-1'>
                          {n.body}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='flex flex-col items-end gap-2'>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        aria-label={n.read ? 'Mark unread' : 'Mark read'}
                        onClick={() => toggleRead(n.id)}
                      >
                        <IconMail
                          className={n.read ? 'opacity-50' : 'text-primary'}
                        />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        aria-label={n.favorite ? 'Unfavorite' : 'Favorite'}
                        onClick={() => toggleFavorite(n.id)}
                      >
                        <IconStar
                          className={n.favorite ? 'text-yellow-500' : ''}
                        />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        aria-label={n.archived ? 'Unarchive' : 'Archive'}
                        onClick={() => toggleArchive(n.id)}
                      >
                        <IconArchive 
                         className={n.archived ? 'opacity-50' : ''}
                        />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        aria-label='Delete'
                        onClick={() => openDeleteConfirmSingle(n.id)}
                      >
                        <IconTrash />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Sheet open={confirmOpen} onOpenChange={setConfirmOpen}>
        <SheetContent side='bottom'>
          <SheetHeader>
            <SheetTitle>Confirm delete</SheetTitle>
            <SheetDescription>
              {confirmMode === 'bulk' ? (
                <>
                  This will delete {selectedIds.length} notification(s). This
                  action cannot be undone.
                </>
              ) : (
                <>
                  This will delete the selected notification. This action cannot
                  be undone.
                </>
              )}
            </SheetDescription>
          </SheetHeader>
          <div className='p-4'>
            <div className='flex gap-2 justify-end'>
              <Button variant='outline' onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button onClick={performDelete} variant='destructive'>
                Delete
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
