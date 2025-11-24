import * as React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Field, FieldLabel, FieldContent, FieldDescription } from "~/components/ui/field";
import { useTranslation } from "react-i18next";

export default function WebsiteSettings() {
  const [siteName, setSiteName] = React.useState("");
  const [siteTagline, setSiteTagline] = React.useState("");
  const [siteDescription, setSiteDescription] = React.useState("");
  const [siteFaviconUrl, setSiteFaviconUrl] = React.useState("");
  const [websiteError, setWebsiteError] = React.useState("");
  const {t} = useTranslation();

  function handleSaveWebsite(e: React.FormEvent) {
    e.preventDefault();
    setWebsiteError("");

    if (!siteName.trim()) {
      setWebsiteError(`${t("settings.website.error")}`);
      return;
    }

    alert(`${t("settings.website.saved")}  ${siteName}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.website.title")}</CardTitle>
        <CardDescription>
          {t("settings.website.description")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSaveWebsite} className="space-y-4">
          <Field>
            <FieldLabel>{t("settings.website.name")}</FieldLabel>
            <FieldContent>
              <Input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
              <FieldDescription>
               {t("settings.website.nameDescription")}
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>{t("settings.website.tagline")}</FieldLabel>
            <FieldContent>
              <Input
                value={siteTagline}
                onChange={(e) => setSiteTagline(e.target.value)}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>{t("settings.website.descriptionField")}</FieldLabel>
            <FieldContent>
              <textarea
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                rows={4}
                className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>{t("settings.website.favicon")}</FieldLabel>
            <FieldContent>
              <Input
                value={siteFaviconUrl}
                onChange={(e) => setSiteFaviconUrl(e.target.value)}
              />
            </FieldContent>
          </Field>

          {websiteError && (
            <div className="text-sm text-destructive">{websiteError}</div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit">{t("save")}</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSiteName("");
                setSiteTagline("");
                setSiteDescription("");
                setSiteFaviconUrl("");
              }}
            >
              {t("clear")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
