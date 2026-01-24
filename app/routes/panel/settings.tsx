import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import CompanySettings from '../../components/panel/settings/company-setting';
import WebsiteSettings from '../../components/panel/settings/website-setting';
import { RequirePermission } from '~/lib/RequirePermission';
import { RequireRole } from '~/lib/RequireRole';

export default function Settings() {
  const { t } = useTranslation();

  return ( <RequirePermission permission="SETTING_VIEW">
        <div className='space-y-6 m-4'>
      <Tabs defaultValue='company' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='company'>
            {t('settings.company.info')}
          </TabsTrigger>
          <RequireRole allow={["SUPER_ADMIN"]}>
 <TabsTrigger value='website'>
            {t('settings.website.info')}
          </TabsTrigger>
           </RequireRole>
         
        </TabsList>

        <TabsContent value='company'>
          <CompanySettings />
        </TabsContent>

        <RequireRole allow={["SUPER_ADMIN"]}>
          <TabsContent value='website'>
          <WebsiteSettings />
        </TabsContent>
           </RequireRole>
       
      </Tabs>
    </div>
      </RequirePermission>
    
  );
}
