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
} from "~/components/ui/field";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { useTranslation } from "react-i18next";

export default function CompanySettings() {
  const { t } = useTranslation();

  const [logoUrl, setLogoUrl] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [companyAddress, setCompanyAddress] = React.useState("");
  const [companyCity, setCompanyCity] = React.useState("");
  const [companyPostal, setCompanyPostal] = React.useState("");
  const [companyPhone, setCompanyPhone] = React.useState("");
  const [companyEmail, setCompanyEmail] = React.useState("");
  const [companyLatitude, setCompanyLatitude] = React.useState("");
  const [companyLongitude, setCompanyLongitude] = React.useState("");
  const [companyAltitude, setCompanyAltitude] = React.useState("");
  const [companyError, setCompanyError] = React.useState("");

  const logoFileRef = React.useRef<HTMLInputElement>(null);

  function handleLogoUpload() {
    logoFileRef.current?.click();
  }

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void
  ) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  function handleSaveCompany(e: React.FormEvent) {
    e.preventDefault();
    setCompanyError("");

    if (!companyName.trim()) {
      setCompanyError(`${t("settings.company.error")}`);
      return;
    }

    alert(`${t("settings.company.title")} ${companyName}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.company.title")}</CardTitle>
        <CardDescription>{t("settings.company.description")}</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSaveCompany} className="space-y-4">
          {/* Logo */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {t("settings.company.logo")}
            </label>

            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={logoUrl} alt="Logo" />
                <AvatarFallback>Logo</AvatarFallback>
              </Avatar>
              <Button type="button" onClick={handleLogoUpload}>
                {logoUrl ? t("settings.company.changeLogo") : t("settings.company.uploadLogo") }
              </Button>
            </div>

            <input
              ref={logoFileRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setLogoUrl)}
              className="hidden"
            />
          </div>

          <Field>
            <FieldLabel> {t("settings.company.name")}</FieldLabel>
            <FieldContent>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel> {t("settings.company.address")}</FieldLabel>
            <FieldContent>
              <Input
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
              />
            </FieldContent>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>{t("settings.company.city")}</FieldLabel>
              <FieldContent>
                <Input
                  value={companyCity}
                  onChange={(e) => setCompanyCity(e.target.value)}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel> {t("settings.company.postalCode")}</FieldLabel>
              <FieldContent>
                <Input
                  value={companyPostal}
                  onChange={(e) => setCompanyPostal(e.target.value)}
                />
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel> {t("settings.company.phone")}</FieldLabel>
            <FieldContent>
              <Input
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel> {t("settings.company.email")}</FieldLabel>
            <FieldContent>
              <Input
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                type="email"
              />
            </FieldContent>
          </Field>

          <div className="grid grid-cols-3 gap-4">
            <Field>
              <FieldLabel>Latitude</FieldLabel>
              <FieldContent>
                <Input
                  value={companyLatitude}
                  onChange={(e) => setCompanyLatitude(e.target.value)}
                  type="number"
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Longitude</FieldLabel>
              <FieldContent>
                <Input
                  value={companyLongitude}
                  onChange={(e) => setCompanyLongitude(e.target.value)}
                  type="number"
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Altitude</FieldLabel>
              <FieldContent>
                <Input
                  value={companyAltitude}
                  onChange={(e) => setCompanyAltitude(e.target.value)}
                  type="number"
                />
              </FieldContent>
            </Field>
          </div>

          {companyError && (
            <div className="text-sm text-destructive">{companyError}</div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit"> {t("save")}</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setLogoUrl("");
                setCompanyName("");
                setCompanyAddress("");
                setCompanyCity("");
                setCompanyPostal("");
                setCompanyPhone("");
                setCompanyEmail("");
                setCompanyLatitude("");
                setCompanyLongitude("");
                setCompanyAltitude("");
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
