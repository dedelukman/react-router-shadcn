import * as React from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  
  const [tickets, setTickets] = React.useState<Ticket[]>(() => {
    const now = new Date().toISOString();
    return [
      {
        id: `T-${Date.now() - 100000}`,
        subject: 'Unable to access account settings',
        category: 'Account',
        priority: 'High',
        description: 'Whenever I try to access my account settings, I receive an error message saying "Access Denied". Please assist.',
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
      setError(t('gethelp.tickets.error.subjectRequired'));
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
    setInfo(t('gethelp.tickets.success.ticketSubmitted'));
    resetForm();
    setCreateOpen(false);
  }

  function handleView(ticket: Ticket) {
    setSelectedTicket(ticket);
    setSheetOpen(true);
  }

  // Helper function to get translated values
  const getTranslatedValue = (type: 'priorities' | 'categories' | 'statuses', value: string) => {
    return t(`${type}.${value}`, { defaultValue: value });
  };

  return (
    <div className='m-5 space-y-6'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='mb-1 text-lg font-medium'>{t('gethelp.tickets.myTickets')}</h2>
            <p className='text-sm text-muted-foreground'>
              {t('gethelp.tickets.ticketHistory')}
            </p>
          </div>
          <div>
            <Button onClick={() => setCreateOpen(true)}>
              {t('gethelp.tickets.createTicket')}
            </Button>
          </div>
        </div>

        <div>
          <div className='rounded-md border p-4 shadow-sm'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('gethelp.tickets.id')}</TableHead>
                  <TableHead>{t('gethelp.tickets.subject')}</TableHead>
                  <TableHead>{t('gethelp.tickets.status')}</TableHead>
                  <TableHead>{t('gethelp.tickets.priority')}</TableHead>
                  <TableHead>{t('gethelp.tickets.created')}</TableHead>
                  <TableHead>{t('gethelp.tickets.updated')}</TableHead>
                  <TableHead>{t('gethelp.tickets.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell className='max-w-[200px] truncate'>
                      {ticket.subject}
                    </TableCell>
                    <TableCell>
                      <span className='text-sm'>
                        {getTranslatedValue('statuses', ticket.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={priorityVariant(ticket.priority) as any}>
                        {getTranslatedValue('priorities', ticket.priority)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                    <TableCell>{formatDate(ticket.updatedAt)}</TableCell>
                    <TableCell>
                      <div className='flex gap-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleView(ticket)}
                        >
                          {t('gethelp.tickets.viewDetails')}
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

      {/* Create ticket sheet */}
      <Sheet
        open={createOpen}
        onOpenChange={(v) => {
          setCreateOpen(v);
          if (!v) resetForm();
        }}
      >
        <SheetContent side='bottom'>
          <SheetHeader>
            <SheetTitle>{t('gethelp.tickets.createNewTicket')}</SheetTitle>
            <SheetDescription>
              {t('gethelp.tickets.fillFormDescription')}
            </SheetDescription>
          </SheetHeader>

          <div className='p-4'>
            <form onSubmit={handleSubmit} className='space-y-3'>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  {t('gethelp.tickets.subjectTitle')} <span className='text-destructive'>*</span>
                </label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={t('gethelp.tickets.placeholder.subject')}
                />
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='mb-1 block text-sm font-medium'>
                    {t('gethelp.tickets.category')}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className='border-input h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm'
                  >
                    {defaultCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {getTranslatedValue('categories', cat)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='mb-1 block text-sm font-medium'>
                    {t('gethelp.tickets.priority')}
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className='border-input h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm'
                  >
                    {defaultPriorities.map((pri) => (
                      <option key={pri} value={pri}>
                        {getTranslatedValue('priorities', pri)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium'>
                  {t('gethelp.tickets.description')}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  placeholder={t('gethelp.tickets.placeholder.description')}
                  className='w-full rounded-md border bg-transparent px-3 py-2 text-sm'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium'>
                  {t('gethelp.tickets.attachmentOptional')}
                </label>
                <input onChange={handleFile} type='file' className='text-sm' />
                {attachmentName ? (
                  <div className='mt-1 text-sm text-muted-foreground'>
                    {t('gethelp.tickets.selected')}: {attachmentName}
                  </div>
                ) : null}
              </div>

              {error ? (
                <div className='text-sm text-destructive'>{error}</div>
              ) : null}
              {info ? <div className='text-sm text-success'>{info}</div> : null}

              <div className='flex items-center gap-2'>
                <Button type='submit'>{t('gethelp.tickets.submitTicket')}</Button>
                <SheetClose>
                  <Button variant='outline' type='button' onClick={resetForm}>
                    {t('gethelp.tickets.close')}
                  </Button>
                </SheetClose>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>

      {/* Ticket details sheet */}
      <Sheet
        open={sheetOpen}
        onOpenChange={(v) => {
          setSheetOpen(v);
          if (!v) setSelectedTicket(null);
        }}
      >
        <SheetContent side='right'>
          <SheetHeader>
            <SheetTitle>{t('gethelp.tickets.ticketDetails')}</SheetTitle>
            <SheetDescription>
              {t('gethelp.tickets.fullDetails')}
            </SheetDescription>
          </SheetHeader>

          <div className='p-4 space-y-3'>
            {selectedTicket ? (
              <>
                <div className='grid grid-cols-1 gap-2'>
                  <div>
                    <div className='text-xs text-muted-foreground'>{t('gethelp.tickets.id')}</div>
                    <div className='font-medium'>{selectedTicket.id}</div>
                  </div>

                  <div>
                    <div className='text-xs text-muted-foreground'>{t('gethelp.tickets.subject')}</div>
                    <div className='font-medium'>{selectedTicket.subject}</div>
                  </div>

                  <div className='flex gap-4'>
                    <div>
                      <div className='text-xs text-muted-foreground'>
                        {t('gethelp.tickets.category')}
                      </div>
                      <div>{getTranslatedValue('categories', selectedTicket.category)}</div>
                    </div>
                    <div>
                      <div className='text-xs text-muted-foreground'>
                        {t('gethelp.tickets.priority')}
                      </div>
                      <Badge
                        variant={
                          priorityVariant(selectedTicket.priority) as any
                        }
                      >
                        {getTranslatedValue('priorities', selectedTicket.priority)}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <div className='text-xs text-muted-foreground'>{t('gethelp.tickets.status')}</div>
                    <div>{getTranslatedValue('statuses', selectedTicket.status)}</div>
                  </div>

                  <div className='flex gap-4'>
                    <div>
                      <div className='text-xs text-muted-foreground'>
                        {t('gethelp.tickets.created')}
                      </div>
                      <div>{formatDate(selectedTicket.createdAt)}</div>
                    </div>
                    <div>
                      <div className='text-xs text-muted-foreground'>
                        {t('gethelp.tickets.updated')}
                      </div>
                      <div>{formatDate(selectedTicket.updatedAt)}</div>
                    </div>
                  </div>

                  <div>
                    <div className='text-xs text-muted-foreground'>
                      {t('gethelp.tickets.description')}
                    </div>
                    <div className='whitespace-pre-wrap'>
                      {selectedTicket.description}
                    </div>
                  </div>

                  <div>
                    <div className='text-xs text-muted-foreground'>
                      {t('gethelp.tickets.attachmentOptional')}
                    </div>
                    <div>{selectedTicket.attachment ?? t('gethelp.tickets.none')}</div>
                  </div>
                </div>
              </>
            ) : (
              <div>{t('gethelp.tickets.noTicketSelected')}</div>
            )}
          </div>

          <SheetFooter>
            <SheetClose>
              <Button variant='outline'>{t('gethelp.tickets.close')}</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}