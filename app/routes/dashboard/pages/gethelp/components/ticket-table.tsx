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
import type  { Ticket } from './types';
import { formatDate, priorityVariant } from './utils';

interface TicketTableProps {
  tickets: Ticket[];
  onView: (ticket: Ticket) => void;
}

export default function TicketTable({ tickets, onView }: TicketTableProps) {
  const { t } = useTranslation();

  const getTranslatedValue = (type: 'priorities' | 'categories' | 'statuses', value: string) => {
    return t(`${type}.${value}`, { defaultValue: value });
  };

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