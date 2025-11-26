import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { SheetClose } from '~/components/ui/sheet';
import type  { Category, Priority } from '../../../lib/types';
import   {  defaultCategories, defaultPriorities } from '../../../lib/types';

interface CreateTicketFormProps {
  onSubmit: (e: React.FormEvent) => void;
  subject: string;
  setSubject: (subject: string) => void;
  category: Category | string;
  setCategory: (category: Category | string) => void;
  priority: Priority;
  setPriority: (priority: Priority) => void;
  description: string;
  setDescription: (description: string) => void;
  attachmentName: string | undefined;
  handleFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
  info: string | null;
  resetForm: () => void;
}

export default function CreateTicketForm({
  onSubmit,
  subject,
  setSubject,
  category,
  setCategory,
  priority,
  setPriority,
  description,
  setDescription,
  attachmentName,
  handleFile,
  error,
  info,
  resetForm,
}: CreateTicketFormProps) {
  const { t } = useTranslation();

  const getTranslatedValue = (type: 'priorities' | 'categories', value: string) => {
    return t(`${type}.${value}`, { defaultValue: value });
  };

  return (
    <div className='p-4'>
      <form onSubmit={onSubmit} className='space-y-3'>
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
          <SheetClose asChild>
            <Button variant='outline' type='button' onClick={resetForm}>
              {t('gethelp.tickets.close')}
            </Button>
          </SheetClose>
        </div>
      </form>
    </div>
  );
}