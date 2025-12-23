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
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldDescription,
} from "~/components/ui/field";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  useGetWebsiteQuery,
  useUpdateWebsiteMutation,
} from "../../../store/api";

export default function WebsiteSettings() {
  const { t } = useTranslation();

  // Core
  const [siteName, setSiteName] = React.useState("");
  const [siteTagline, setSiteTagline] = React.useState("");
  const [siteDescription, setSiteDescription] = React.useState("");

  // SEO
  const [metaTitle, setMetaTitle] = React.useState("");
  const [metaDescription, setMetaDescription] = React.useState("");
  const [metaKeywords, setMetaKeywords] = React.useState("");

  // Contact
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");

  const [websiteError, setWebsiteError] = React.useState("");

  const { data: website, refetch } = useGetWebsiteQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updateWebsite, { isLoading }] = useUpdateWebsiteMutation();

  function handleSaveWebsite(e: React.FormEvent) {
    e.preventDefault();
    setWebsiteError("");

    if (!siteName.trim()) {
      setWebsiteError(t("settings.website.error"));
      return;
    }

    const payload = {
      name: siteName.trim(),
      tagline: siteTagline.trim(),
      description: siteDescription.trim(),
      metaTitle: metaTitle.trim(),
      metaDescription: metaDescription.trim(),
      metaKeywords: metaKeywords.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
    };

    (async () => {
      try {
        await updateWebsite({ body: payload }).unwrap();
        await refetch();
        toast.success(t("settings.website.saved"), { duration: 3000 });
      } catch (err) {
        console.error("Update website failed", err);
        setWebsiteError(
          (t("settings.website.updateFailed") as string) || "Update failed"
        );
      }
    })();
  }

  React.useEffect(() => {
    if (website) {
      setSiteName(website.name ?? "");
      setSiteTagline(website.tagline ?? "");
      setSiteDescription(website.description ?? "");
      setMetaTitle(website.metaTitle ?? "");
      setMetaDescription(website.metaDescription ?? "");
      setMetaKeywords(website.metaKeywords ?? "");
      setEmail(website.email ?? "");
      setPhone(website.phone ?? "");
      setAddress(website.address ?? "");
    }
  }, [website]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.website.title")}</CardTitle>
        <CardDescription>
          {t("settings.website.description")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSaveWebsite} className="space-y-6">
          {/* Core */}
          <Field>
            <FieldLabel>{t("settings.website.name")}</FieldLabel>
            <FieldContent>
              <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} />
              <FieldDescription>
                {t("settings.website.nameDescription")}
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>{t("settings.website.tagline")}</FieldLabel>
            <FieldContent>
              <Input value={siteTagline} onChange={(e) => setSiteTagline(e.target.value)} />
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

          {/* SEO */}
          <Field>
            <FieldLabel>{t("settings.website.metaTitle")}</FieldLabel>
            <FieldContent>
              <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>{t("settings.website.metaDescription")}</FieldLabel>
            <FieldContent>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={3}
                className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>{t("settings.website.metaKeywords")}</FieldLabel>
            <FieldContent>
              <Input value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} />
            </FieldContent>
          </Field>

          {/* Contact */}
          <Field>
            <FieldLabel>{t("settings.website.email")}</FieldLabel>
            <FieldContent>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>{t("settings.website.phone")}</FieldLabel>
            <FieldContent>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>{t("settings.website.address")}</FieldLabel>
            <FieldContent>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
              />
            </FieldContent>
          </Field>

          {websiteError && (
            <div className="text-sm text-destructive">{websiteError}</div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {t("save")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => refetch()}
            >
              {t("reset")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
