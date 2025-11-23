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

export default function WebsiteSettings() {
  const [siteName, setSiteName] = React.useState("");
  const [siteTagline, setSiteTagline] = React.useState("");
  const [siteDescription, setSiteDescription] = React.useState("");
  const [siteFaviconUrl, setSiteFaviconUrl] = React.useState("");
  const [websiteError, setWebsiteError] = React.useState("");

  function handleSaveWebsite(e: React.FormEvent) {
    e.preventDefault();
    setWebsiteError("");

    if (!siteName.trim()) {
      setWebsiteError("Site name is required.");
      return;
    }

    alert(`Website settings saved: ${siteName}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website Frontend Settings</CardTitle>
        <CardDescription>
          Configure your public website appearance and metadata.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSaveWebsite} className="space-y-4">
          <Field>
            <FieldLabel>Site Name</FieldLabel>
            <FieldContent>
              <Input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
              <FieldDescription>
                Displayed in browser title and meta tags.
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Tagline</FieldLabel>
            <FieldContent>
              <Input
                value={siteTagline}
                onChange={(e) => setSiteTagline(e.target.value)}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Site Description</FieldLabel>
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
            <FieldLabel>Favicon URL</FieldLabel>
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
            <Button type="submit">Save Website Settings</Button>
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
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
