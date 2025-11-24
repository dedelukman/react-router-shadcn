import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '~/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '~/components/ui/sheet';

import TicketTable from './ticket-table';
import CreateTicketForm from './create-ticket-form';
import TicketDetails from './ticket-details';
import type  { Ticket, Category, Priority } from './types';
import  {  defaultCategories } from './types';

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

        <TicketTable tickets={tickets} onView={handleView} />
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

          <CreateTicketForm
            onSubmit={handleSubmit}
            subject={subject}
            setSubject={setSubject}
            category={category}
            setCategory={setCategory}
            priority={priority}
            setPriority={setPriority}
            description={description}
            setDescription={setDescription}
            attachmentName={attachmentName}
            handleFile={handleFile}
            error={error}
            info={info}
            resetForm={resetForm}
          />
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

          <TicketDetails ticket={selectedTicket} />

          <SheetFooter>
            <SheetClose asChild>
              <Button variant='outline'>{t('gethelp.tickets.close')}</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}