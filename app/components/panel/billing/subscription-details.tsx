import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { useGetCurrentSubscriptionQuery } from '../../../store/api/subscription.api';

export default function SubscriptionDetails() {
  const { t } = useTranslation();
  const {
    data: subscription,
    isLoading,
    error,
  } = useGetCurrentSubscriptionQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('billing.subscription.details.title')}</CardTitle>
          <CardDescription>
            {t('billing.subscription.details.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='animate-pulse space-y-2'>
            <div className='h-4 bg-muted rounded w-1/4'></div>
            <div className='h-4 bg-muted rounded w-1/2'></div>
            <div className='h-4 bg-muted rounded w-1/3'></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('billing.subscription.details.title')}</CardTitle>
          <CardDescription>
            {t('billing.subscription.details.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>
            {error
              ? 'Failed to load subscription details.'
              : 'No active subscription found.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <Badge className='bg-green-100 text-green-800'>
            {t('billing.subscription.details.statuses.ACTIVE')}
          </Badge>
        );
      case 'INACTIVE':
        return (
          <Badge className='bg-gray-100 text-gray-800'>
            {t('billing.subscription.details.statuses.INACTIVE')}
          </Badge>
        );
      case 'CANCELED':
        return (
          <Badge className='bg-red-100 text-red-800'>
            {t('billing.subscription.details.statuses.CANCELED')}
          </Badge>
        );
      default:
        return <Badge variant='outline'>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('billing.subscription.details.title')}</CardTitle>
        <CardDescription>
          {t('billing.subscription.details.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 gap-4'>
          <div className='flex justify-between items-center'>
            <span className='font-medium'>
              {t('billing.subscription.details.plan')}:
            </span>
            <span>{subscription.plan}</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='font-medium'>
              {t('billing.subscription.details.status')}:
            </span>
            {getStatusBadge(subscription.status)}
          </div>
          <div className='flex justify-between items-center'>
            <span className='font-medium'>
              {t('billing.subscription.details.startDate')}:
            </span>
            <span>{new Date(subscription.startDate).toLocaleDateString()}</span>
          </div>
          {subscription.endDate && (
            <div className='flex justify-between items-center'>
              <span className='font-medium'>
                {t('billing.subscription.details.endDate')}:
              </span>
              <span>{new Date(subscription.endDate).toLocaleDateString()}</span>
            </div>
          )}
          <div className='flex justify-between items-center'>
            <span className='font-medium'>
              {t('billing.subscription.details.trial')}:
            </span>
            <span>
              {subscription.trial
                ? t('billing.subscription.details.yes')
                : t('billing.subscription.details.no')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
