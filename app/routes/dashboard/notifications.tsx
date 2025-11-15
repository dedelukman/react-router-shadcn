import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import {
  IconSearch,
  IconTrash,
  IconArchive,
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
};

const SAMPLE: Notification[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `n-${i}`,
  title: `Notification ${i + 1}`,
  body: `This is the detail for notification ${i + 1}.`,
  date: new Date(Date.now() - i * 1000 * 60 * 60).toLocaleString(),
  favorite: i % 5 === 0,
  archived: i % 7 === 0,
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

  React.useEffect(() => {
    try {
      localStorage.setItem('app_notifications', JSON.stringify(items));
    } catch {}
  }, [items]);

  const counts = React.useMemo(() => {
    const all = items.length;
    const fav = items.filter((i) => i.favorite && !i.archived).length;
    const archived = items.filter((i) => i.archived).length;
    return { all, fav, archived };
  }, [items]);

  function toggleFavorite(id: string) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, favorite: !it.favorite } : it))
    );
  }

  function toggleArchive(id: string) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, archived: !it.archived } : it))
    );
  }

  function deleteItem(id: string) {
    if (!window.confirm('Hapus notifikasi ini?')) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  const filtered = items
    .filter((it) => {
      if (tab === 'favorites') return it.favorite && !it.archived;
      if (tab === 'archived') return it.archived;
      return !it.archived;
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
                You have <strong>{counts.all}</strong> notifications
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

                  <div className='flex flex-col items-end gap-2'>
                    <div className='flex items-center gap-2'>
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
                        <IconArchive />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        aria-label='Delete'
                        onClick={() => deleteItem(n.id)}
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
    </div>
  );
}
