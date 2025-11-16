import * as React from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '~/components/ui/card';
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldDescription,
  FieldError,
} from '~/components/ui/field';
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar';

export default function Settings() {
  // Logo Tab State
  const [logoUrl, setLogoUrl] = React.useState('');
  const [logoError, setLogoError] = React.useState('');

  // Company Tab State
  const [companyName, setCompanyName] = React.useState('');
  const [companyAddress, setCompanyAddress] = React.useState('');
  const [companyCity, setCompanyCity] = React.useState('');
  const [companyPostal, setCompanyPostal] = React.useState('');
  const [companyPhone, setCompanyPhone] = React.useState('');
  const [companyEmail, setCompanyEmail] = React.useState('');
  const [companyLatitude, setCompanyLatitude] = React.useState('');
  const [companyLongitude, setCompanyLongitude] = React.useState('');
  const [companyAltitude, setCompanyAltitude] = React.useState('');
  const [companyError, setCompanyError] = React.useState('');

  // Website Frontend Tab State
  const [siteName, setSiteName] = React.useState('');
  const [siteTagline, setSiteTagline] = React.useState('');
  const [siteDescription, setSiteDescription] = React.useState('');
  const [siteFaviconUrl, setSiteFaviconUrl] = React.useState('');
  const [websiteError, setWebsiteError] = React.useState('');

  // File input refs
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
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleSaveCompany(e: React.FormEvent) {
    e.preventDefault();
    setCompanyError('');
    if (!companyName.trim()) {
      setCompanyError('Company name is required.');
      return;
    }
    alert(
      `Company saved: ${companyName}, ${companyAddress}, ${companyCity} ${companyPostal}`
    );
  }

  function handleSaveWebsite(e: React.FormEvent) {
    e.preventDefault();
    setWebsiteError('');
    if (!siteName.trim()) {
      setWebsiteError('Site name is required.');
      return;
    }
    alert(`Website settings saved: ${siteName} - ${siteTagline}`);
  }

  return (
    <div className='space-y-6 m-4'>
      <div>
        <h1 className='text-2xl font-semibold'>Settings</h1>
        <p className='text-sm text-muted-foreground'>
          Manage your application settings: branding, company info, and website
          frontend.
        </p>
      </div>

      <Tabs defaultValue='logo' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='company'>Company</TabsTrigger>
          <TabsTrigger value='website'>Website Frontend</TabsTrigger>
        </TabsList>

        {/* Company Tab */}
        <TabsContent value='company' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Company Information & Logo</CardTitle>
              <CardDescription>
                Update your company details, contact information, and logo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveCompany} className='space-y-4'>
                {/* Logo */}
                <div className='space-y-2'>
                  <label className='block text-sm font-medium'>
                    Company Logo
                  </label>
                  <div className='flex items-center gap-4'>
                    <Avatar className='h-16 w-16'>
                      <AvatarImage src={logoUrl} alt='Logo' />
                      <AvatarFallback>Logo</AvatarFallback>
                    </Avatar>
                    <Button type='button' onClick={handleLogoUpload}>
                      {logoUrl ? 'Change Logo' : 'Upload Logo'}
                    </Button>
                  </div>
                  <input
                    ref={logoFileRef}
                    type='file'
                    accept='image/*'
                    onChange={(e) => handleFileChange(e, setLogoUrl)}
                    className='hidden'
                  />
                </div>

                <Field>
                  <FieldLabel>Company Name</FieldLabel>
                  <FieldContent>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder='Your company name'
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Address</FieldLabel>
                  <FieldContent>
                    <Input
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      placeholder='Street address'
                    />
                  </FieldContent>
                </Field>

                <div className='grid grid-cols-2 gap-4'>
                  <Field>
                    <FieldLabel>City</FieldLabel>
                    <FieldContent>
                      <Input
                        value={companyCity}
                        onChange={(e) => setCompanyCity(e.target.value)}
                        placeholder='City'
                      />
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel>Postal Code</FieldLabel>
                    <FieldContent>
                      <Input
                        value={companyPostal}
                        onChange={(e) => setCompanyPostal(e.target.value)}
                        placeholder='Postal code'
                      />
                    </FieldContent>
                  </Field>
                </div>

                <Field>
                  <FieldLabel>Phone</FieldLabel>
                  <FieldContent>
                    <Input
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      placeholder='Phone number'
                      type='tel'
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <FieldContent>
                    <Input
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      placeholder='Company email'
                      type='email'
                    />
                  </FieldContent>
                </Field>

                <div className='grid grid-cols-3 gap-4'>
                  <Field>
                    <FieldLabel>Latitude</FieldLabel>
                    <FieldContent>
                      <Input
                        value={companyLatitude}
                        onChange={(e) => setCompanyLatitude(e.target.value)}
                        placeholder='-6.2088'
                        type='number'
                        step='0.0001'
                      />
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel>Longitude</FieldLabel>
                    <FieldContent>
                      <Input
                        value={companyLongitude}
                        onChange={(e) => setCompanyLongitude(e.target.value)}
                        placeholder='106.8456'
                        type='number'
                        step='0.0001'
                      />
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel>Altitude</FieldLabel>
                    <FieldContent>
                      <Input
                        value={companyAltitude}
                        onChange={(e) => setCompanyAltitude(e.target.value)}
                        placeholder='0'
                        type='number'
                        step='0.01'
                      />
                    </FieldContent>
                  </Field>
                </div>

                {companyError && (
                  <div className='text-sm text-destructive'>{companyError}</div>
                )}

                <div className='flex gap-2 pt-4'>
                  <Button type='submit'>Save Company Info</Button>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                      setLogoUrl('');
                      setCompanyName('');
                      setCompanyAddress('');
                      setCompanyCity('');
                      setCompanyPostal('');
                      setCompanyPhone('');
                      setCompanyEmail('');
                      setCompanyLatitude('');
                      setCompanyLongitude('');
                      setCompanyAltitude('');
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Website Frontend Tab */}
        <TabsContent value='website' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Website Frontend Settings</CardTitle>
              <CardDescription>
                Configure your public website appearance and metadata.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveWebsite} className='space-y-4'>
                <Field>
                  <FieldLabel>Site Name</FieldLabel>
                  <FieldContent>
                    <Input
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      placeholder='Your website name'
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
                      placeholder='e.g., Fast and reliable solutions'
                    />
                    <FieldDescription>
                      Short description shown in headers.
                    </FieldDescription>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Site Description</FieldLabel>
                  <FieldContent>
                    <textarea
                      value={siteDescription}
                      onChange={(e) => setSiteDescription(e.target.value)}
                      placeholder='Full description for SEO meta tags'
                      rows={4}
                      className='w-full rounded-md border bg-transparent px-3 py-2 text-sm'
                    />
                    <FieldDescription>
                      Used for SEO and social media sharing.
                    </FieldDescription>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Favicon URL</FieldLabel>
                  <FieldContent>
                    <Input
                      value={siteFaviconUrl}
                      onChange={(e) => setSiteFaviconUrl(e.target.value)}
                      placeholder='https://example.com/favicon.ico'
                    />
                    <FieldDescription>
                      URL to your website favicon.
                    </FieldDescription>
                  </FieldContent>
                </Field>

                {websiteError && (
                  <div className='text-sm text-destructive'>{websiteError}</div>
                )}

                <div className='flex gap-2 pt-4'>
                  <Button type='submit'>Save Website Settings</Button>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                      setSiteName('');
                      setSiteTagline('');
                      setSiteDescription('');
                      setSiteFaviconUrl('');
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
