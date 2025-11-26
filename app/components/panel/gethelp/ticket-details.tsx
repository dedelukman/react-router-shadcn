import { useTranslation } from 'react-i18next';
import { Badge } from '~/components/ui/badge';
import type  { Ticket } from '../../../lib/types';
import { formatDate, priorityVariant } from '../../../lib/utils';

interface TicketDetailsProps {
  ticket: Ticket | null;
}

export default function TicketDetails({ ticket }: TicketDetailsProps) {
  const { t } = useTranslation();

  const getTranslatedValue = (type: 'priorities' | 'categories' | 'statuses', value: string) => {
    return t(`${type}.${value}`, { defaultValue: value });
  };

  if (!ticket) {
    return <div>{t('gethelp.tickets.noTicketSelected')}</div>;
  }

  return (
    <div className='p-4 space-y-3'>
      <div className='grid grid-cols-1 gap-2'>
        <div>
          <div className='text-xs text-muted-foreground'>{t('gethelp.tickets.id')}</div>
          <div className='font-medium'>{ticket.id}</div>
        </div>

        <div>
          <div className='text-xs text-muted-foreground'>{t('gethelp.tickets.subject')}</div>
          <div className='font-medium'>{ticket.subject}</div>
        </div>

        <div className='flex gap-4'>
          <div>
            <div className='text-xs text-muted-foreground'>
              {t('gethelp.tickets.category')}
            </div>
            <div>{getTranslatedValue('categories', ticket.category)}</div>
          </div>
          <div>
            <div className='text-xs text-muted-foreground'>
              {t('gethelp.tickets.priority')}
            </div>
            <Badge variant={priorityVariant(ticket.priority) as any}>
              {getTranslatedValue('priorities', ticket.priority)}
            </Badge>
          </div>
        </div>

        <div>
          <div className='text-xs text-muted-foreground'>{t('gethelp.tickets.status')}</div>
          <div>{getTranslatedValue('statuses', ticket.status)}</div>
        </div>

        <div className='flex gap-4'>
          <div>
            <div className='text-xs text-muted-foreground'>
              {t('gethelp.tickets.created')}
            </div>
            <div>{formatDate(ticket.createdAt)}</div>
          </div>
          <div>
            <div className='text-xs text-muted-foreground'>
              {t('gethelp.tickets.updated')}
            </div>
            <div>{formatDate(ticket.updatedAt)}</div>
          </div>
        </div>

        <div>
          <div className='text-xs text-muted-foreground'>
            {t('gethelp.tickets.description')}
          </div>
          <div className='whitespace-pre-wrap'>
            {ticket.description}
          </div>
        </div>

        <div>
          <div className='text-xs text-muted-foreground'>
            {t('gethelp.tickets.attachmentOptional')}
          </div>
          <div>{ticket.attachment ?? t('gethelp.tickets.none')}</div>
        </div>
      </div>
    </div>
  );
}