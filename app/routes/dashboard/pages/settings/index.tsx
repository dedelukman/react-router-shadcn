import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { useTranslation } from "react-i18next";
import CompanySettings from "./components/company-setting";
import WebsiteSettings from "./components/website-setting";



export default function Settings() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 m-4">
      <div>
        <h1 className="text-2xl font-semibold">{t("settings")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("settingsdetail")}
        </p>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="company">{t("companyinfo")}</TabsTrigger>
          <TabsTrigger value="website">Website Frontend</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <CompanySettings />
        </TabsContent>

        <TabsContent value="website">
          <WebsiteSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
