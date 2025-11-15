import * as React from 'react';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '~/components/ui/table';
import { Badge } from '~/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '~/components/ui/sheet';

type Priority = 'Low' | 'Normal' | 'High' | 'Critical';
type Category =
  | 'Bug/Error'
  | 'Feature Question'
  | 'Feature Request'
  | 'Account'
  | 'Payment'
  | 'Other';

type TicketStatus =
  | 'Open'
  | 'Responded'
  | 'Investigating'
  | 'Pending'
  | 'Done'
  | 'Closed';

type Ticket = {
  id: string;
  subject: string;
  category: Category | string;
  priority: Priority;
  description: string;
  attachment?: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
};

const defaultCategories: Category[] = [
  'Bug/Error',
  'Feature Question',
  'Feature Request',
  'Account',
  'Payment',
  'Other',
];

const defaultPriorities: Priority[] = ['Low', 'Normal', 'High', 'Critical'];

function formatDate(iso?: string) {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function priorityVariant(p: Priority) {
  switch (p) {
    case 'Low':
      return 'secondary';
    case 'Normal':
      return 'default';
    case 'High':
      return 'destructive';
    case 'Critical':
      return 'destructive';
    default:
      return 'default';
  }
}

export default function GetHelps() {
  const [tickets, setTickets] = React.useState<Ticket[]>(() => {
    // initial mock data
    const now = new Date().toISOString();
    return [
      {
        id: `T-${Date.now() - 100000}`,
        subject: 'Unable to log into my account',
        category: 'Account',
        priority: 'High',
        description:
          "I receive an error when trying to log in: 'Invalid credentials'",
        status: 'Investigating',
        createdAt: now,
        updatedAt: now,
      },
    ];
  });

  // form state
  const [subject, setSubject] = React.useState('');
  const [category, setCategory] = React.useState<Category | string>(
    defaultCategories[0]
  );
  const [priority, setPriority] = React.useState<Priority>('Normal');
  const [description, setDescription] = React.useState('');
  const [attachmentName, setAttachmentName] = React.useState<
    string | undefined
  >(undefined);
  const [error, setError] = React.useState<string | null>(null);
  const [info, setInfo] = React.useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(
    null
  );
  const [createOpen, setCreateOpen] = React.useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    setAttachmentName(f ? f.name : undefined);
  }

  function resetForm() {
    setSubject('');
    setCategory(defaultCategories[0]);
    setPriority('Normal');
    setDescription('');
    setAttachmentName(undefined);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!subject.trim()) {
      setError('Subject is required.');
      return;
    }

    const now = new Date().toISOString();
    const newTicket: Ticket = {
      id: `T-${Date.now()}`,
      subject: subject.trim(),
      category,
      priority,
      description: description.trim(),
      attachment: attachmentName,
      status: 'Open',
      createdAt: now,
      updatedAt: now,
    };

    setTickets((s) => [newTicket, ...s]);
    setInfo('Ticket submitted successfully.');
    resetForm();
    setCreateOpen(false);
  }

  function handleView(t: Ticket) {
    setSelectedTicket(t);
    setSheetOpen(true);
  }

  return (
    <div className='m-2 space-y-6'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='mb-1 text-lg font-medium'>My Tickets</h2>
            <p className='text-sm text-muted-foreground'>
              History of tickets you've created. Click "View Details" to open
              the full conversation.
            </p>
          </div>
          <div>
            <Button onClick={() => setCreateOpen(true)}>Create Ticket</Button>
          </div>
        </div>

        <div>
          <div className='rounded-md border p-4 shadow-sm'>
            <Table>
              <TableHeader>
                <tr>
                  <TableHead>ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {tickets.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.id}</TableCell>
                    <TableCell className='max-w-[200px] truncate'>
                      {t.subject}
                    </TableCell>
                    <TableCell>
                      <span className='text-sm'>{t.status}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={priorityVariant(t.priority) as any}>
                        {t.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(t.createdAt)}</TableCell>
                    <TableCell>{formatDate(t.updatedAt)}</TableCell>
                    <TableCell>
                      <div className='flex gap-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleView(t)}
                        >
                          View Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      {/* Create ticket sheet/modal */}
      <Sheet
        open={createOpen}
        onOpenChange={(v) => {
          setCreateOpen(v);
          if (!v) resetForm();
        }}
      >
        <SheetContent side='bottom'>
          <SheetHeader>
            <SheetTitle>Create New Ticket</SheetTitle>
            <SheetDescription>
              Fill out the form to submit a support ticket.
            </SheetDescription>
          </SheetHeader>

          <div className='p-4'>
            <form onSubmit={handleSubmit} className='space-y-3'>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  Subject / Title <span className='text-destructive'>*</span>
                </label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder='Example: Unable to checkout with card payment'
                />
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='mb-1 block text-sm font-medium'>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className='border-input h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm'
                  >
                    {defaultCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='mb-1 block text-sm font-medium'>
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className='border-input h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm'
                  >
                    {defaultPriorities.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium'>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  placeholder={`Reproduction steps:\n1. \n2. \n\nWhat did you expect to happen?\n\nWhat actually happened?\n\nAttach screenshots if available (optional).`}
                  className='w-full rounded-md border bg-transparent px-3 py-2 text-sm'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium'>
                  Attachment (optional)
                </label>
                <input onChange={handleFile} type='file' className='text-sm' />
                {attachmentName ? (
                  <div className='mt-1 text-sm text-muted-foreground'>
                    Selected: {attachmentName}
                  </div>
                ) : null}
              </div>

              {error ? (
                <div className='text-sm text-destructive'>{error}</div>
              ) : null}
              {info ? <div className='text-sm text-success'>{info}</div> : null}

              <div className='flex items-center gap-2'>
                <Button type='submit'>Submit Ticket</Button>
                <SheetClose>
                  <Button variant='outline' type='button' onClick={resetForm}>
                    Close
                  </Button>
                </SheetClose>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>

      {/* Ticket details sheet/modal */}
      <Sheet
        open={sheetOpen}
        onOpenChange={(v) => {
          setSheetOpen(v);
          if (!v) setSelectedTicket(null);
        }}
      >
        <SheetContent side='right'>
          <SheetHeader>
            <SheetTitle>Ticket Details</SheetTitle>
            <SheetDescription>
              Full details for the selected ticket
            </SheetDescription>
          </SheetHeader>

          <div className='p-4 space-y-3'>
            {selectedTicket ? (
              <>
                <div className='grid grid-cols-1 gap-2'>
                  <div>
                    <div className='text-xs text-muted-foreground'>ID</div>
                    <div className='font-medium'>{selectedTicket.id}</div>
                  </div>

                  <div>
                    <div className='text-xs text-muted-foreground'>Subject</div>
                    <div className='font-medium'>{selectedTicket.subject}</div>
                  </div>

                  <div className='flex gap-4'>
                    <div>
                      <div className='text-xs text-muted-foreground'>
                        Category
                      </div>
                      <div>{selectedTicket.category}</div>
                    </div>
                    <div>
                      <div className='text-xs text-muted-foreground'>
                        Priority
                      </div>
                      <Badge
                        variant={
                          priorityVariant(selectedTicket.priority) as any
                        }
                      >
                        {selectedTicket.priority}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <div className='text-xs text-muted-foreground'>Status</div>
                    <div>{selectedTicket.status}</div>
                  </div>

                  <div className='flex gap-4'>
                    <div>
                      <div className='text-xs text-muted-foreground'>
                        Created
                      </div>
                      <div>{formatDate(selectedTicket.createdAt)}</div>
                    </div>
                    <div>
                      <div className='text-xs text-muted-foreground'>
                        Updated
                      </div>
                      <div>{formatDate(selectedTicket.updatedAt)}</div>
                    </div>
                  </div>

                  <div>
                    <div className='text-xs text-muted-foreground'>
                      Description
                    </div>
                    <div className='whitespace-pre-wrap'>
                      {selectedTicket.description}
                    </div>
                  </div>

                  <div>
                    <div className='text-xs text-muted-foreground'>
                      Attachment
                    </div>
                    <div>{selectedTicket.attachment ?? 'None'}</div>
                  </div>
                </div>
              </>
            ) : (
              <div>No ticket selected</div>
            )}
          </div>

          <SheetFooter>
            <SheetClose>
              <Button variant='outline'>Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
