import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '~/components/ui/table';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import type { Ticket } from '../../../lib/types';
import { formatDate, priorityVariant } from '../../../lib/utils';

interface TicketTableProps {
  tickets: Ticket[];
  onView: (ticket: Ticket) => void;
  isLoading?: boolean;
}

export default function TicketTable({
  tickets,
  onView,
  isLoading = false,
}: TicketTableProps) {
  const { t } = useTranslation();

  const getTranslatedValue = (
    type: 'priorities' | 'categories' | 'statuses',
    value: string
  ) => {
    return t(`${type}.${value}`, { defaultValue: value });
  };

  if (isLoading) {
    return (
      <div className='rounded-md border p-4 shadow-sm'>
        <div className='space-y-2'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='h-12 rounded bg-muted animate-pulse' />
          ))}
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className='rounded-md border p-4 shadow-sm'>
        <div className='text-center py-8'>
          <p className='text-muted-foreground'>
            {t('gethelp.tickets.noTickets')}
          </p>
        </div>
      </div>
    );
  }

  return (
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
              <TableCell>{ticket.code || ticket.id}</TableCell>
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
                    onClick={() => onView(ticket)}
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
  );
}
