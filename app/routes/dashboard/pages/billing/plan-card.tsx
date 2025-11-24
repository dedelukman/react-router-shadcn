import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import type { Plan } from './types';
import { PLANS } from './types';

interface PlanCardProps {
  selectedPlan: string;
  onPlanChange: (planId: string) => void;
  onUpdatePlan: () => void;
  onResetPlan: () => void;
}

export default function PlanCard({ 
  selectedPlan, 
  onPlanChange, 
  onUpdatePlan, 
  onResetPlan 
}: PlanCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{t('billing.subscription.title')}</CardTitle>
          <CardDescription>
            {t('billing.subscription.description')}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-3'>
          {PLANS.map((plan) => {
            const active = selectedPlan === plan.id;
            return (
              <PlanOption
                key={plan.id}
                plan={plan}
                active={active}
                onSelect={() => onPlanChange(plan.id)}
              />
            );
          })}
        </div>
      </CardContent>
      <CardFooter>
        <div className='flex items-center gap-2'>
          <Button onClick={onUpdatePlan}>
            {t('billing.subscription.updatePlan')}
          </Button>
          <Button variant='outline' onClick={onResetPlan}>
            {t('billing.subscription.reset')}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

interface PlanOptionProps {
  plan: Plan;
  active: boolean;
  onSelect: () => void;
}

function PlanOption({ plan, active, onSelect }: PlanOptionProps) {
  const { t } = useTranslation();

  return (
    <label
      className={
        `flex items-center justify-between gap-4 p-3 rounded-md border transition-colors cursor-pointer ` +
        (active
          ? 'bg-muted/10 border-primary'
          : 'hover:bg-muted/5 border-border')
      }
      onClick={onSelect}
    >
      <div>
        <div className='font-medium'>
          {t(`billing.subscription.plans.${plan.id}.name`)}
        </div>
        <div className='text-sm text-muted-foreground'>
          {t(`billing.subscription.plans.${plan.id}.desc`)}
        </div>
      </div>
      <div className='flex items-center gap-3'>
        <Badge variant='outline' className='text-sm'>
          {t(`billing.subscription.plans.${plan.id}.price`)}
        </Badge>
        <input
          type='radio'
          name='plan'
          value={plan.id}
          checked={active}
          onChange={onSelect}
          className='sr-only'
          aria-label={t(`billing.subscription.plans.${plan.id}.name`)}
        />
        <div
          className={
            active
              ? 'h-4 w-4 rounded-full bg-primary'
              : 'h-4 w-4 rounded-full border'
          }
          aria-hidden
        />
      </div>
    </label>
  );
}