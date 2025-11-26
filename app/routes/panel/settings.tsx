import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import CompanySettings from '../../components/panel/settings/company-setting';
import WebsiteSettings from '../../components/panel/settings/website-setting';

export default function Settings() {
  const { t } = useTranslation();

  return (
    <div className='space-y-6 m-4'>
      <Tabs defaultValue='company' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='company'>
            {t('settings.company.info')}
          </TabsTrigger>
          <TabsTrigger value='website'>
            {t('settings.website.info')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value='company'>
          <CompanySettings />
        </TabsContent>

        <TabsContent value='website'>
          <WebsiteSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
