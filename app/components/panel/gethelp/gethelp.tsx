import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

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
import type { Ticket, Category, Priority } from '../../../lib/types';
import { defaultCategories } from '../../../lib/types';
import {
  useGetTicketsQuery,
  useCreateTicketMutation,
  useGetCurrentUserQuery,
} from '../../../lib/api';

export default function GetHelps() {
  const { t } = useTranslation();

  // Get current user to detect user changes
  const { data: currentUser } = useGetCurrentUserQuery();

  // API hooks
  const {
    data: tickets = [],
    isLoading,
    error: apiError,
    refetch,
  } = useGetTicketsQuery();
  const [createTicketApi, { isLoading: isSubmitting }] =
    useCreateTicketMutation();

  // Refetch tickets when user changes (login/logout)
  React.useEffect(() => {
    console.log('[DEBUG] Current user changed:', currentUser?.id);
    refetch();
  }, [currentUser?.id, refetch]);

  // Debug logs
  React.useEffect(() => {
    console.log('[DEBUG] gethelp.tsx - tickets:', tickets);
    console.log('[DEBUG] gethelp.tsx - isLoading:', isLoading);
    console.log('[DEBUG] gethelp.tsx - apiError:', apiError);
  }, [tickets, isLoading, apiError]);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!subject.trim()) {
      const errorMsg = t('gethelp.tickets.error.subjectRequired');
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      const result = await createTicketApi({
        subject: subject.trim(),
        category,
        priority,
        description: description.trim(),
        attachment: attachmentName,
      }).unwrap();

      const successMsg = t('gethelp.tickets.success.ticketSubmitted');
      setInfo(successMsg);
      toast.success(successMsg, {
        description: `Ticket ID: ${result.code || result.id}`,
        duration: 4000,
      });

      // Reset form and close sheet
      resetForm();
      setCreateOpen(false);

      // Refetch tickets untuk update table
      setTimeout(() => {
        refetch();
      }, 500);
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || t('gethelp.tickets.error.failedToCreate');
      setError(errorMsg);
      toast.error('Failed to create ticket', {
        description: errorMsg,
        duration: 5000,
      });
    }
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
            <h2 className='mb-1 text-lg font-medium'>
              {t('gethelp.tickets.myTickets')}
            </h2>
            <p className='text-sm text-muted-foreground'>
              {t('gethelp.tickets.ticketHistory')}
            </p>
          </div>
          <div>
            <Button onClick={() => setCreateOpen(true)} disabled={isSubmitting}>
              {t('gethelp.tickets.createTicket')}
            </Button>
          </div>
        </div>

        {/* Debug: Show API error jika ada */}
        {apiError && (
          <div className='rounded-md bg-destructive/10 p-4 text-sm text-destructive space-y-2'>
            <div>
              <strong>API Error:</strong> {(apiError as any).status} -{' '}
              {(apiError as any).error || JSON.stringify(apiError)}
            </div>
            <div className='text-xs opacity-75'>
              <p>
                <strong>Check:</strong>
              </p>
              <ul className='list-disc list-inside ml-2 mt-1'>
                <li>Apakah backend running?</li>
                <li>Apakah endpoint `/tickets` atau `/api/tickets` sesuai?</li>
                <li>Lihat VITE_API_BASE_URL di `.env.local`</li>
                <li>Buka DevTools Console untuk debug logs</li>
              </ul>
            </div>
          </div>
        )}

        <TicketTable
          tickets={tickets}
          onView={handleView}
          isLoading={isLoading}
        />
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
            isSubmitting={isSubmitting}
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
