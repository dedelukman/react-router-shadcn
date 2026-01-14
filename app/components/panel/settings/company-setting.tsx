import * as React from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '~/components/ui/card';
import { Field, FieldLabel, FieldContent } from '~/components/ui/field';
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar';
import { useTranslation } from 'react-i18next';
import {
  useGetCurrentCompanyQuery,
  useUpdateCompanyMutation,
  useUploadLogoMutation,
} from '../../../store/api';
import { toast } from 'sonner';
import { API_BASE_URL } from '~/store/api/baseApi';

export default function CompanySettings() {
  const { t } = useTranslation();

  const [logoUrl, setLogoUrl] = React.useState('');
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

  const logoFileRef = React.useRef<HTMLInputElement>(null);

  // Helper function to construct full image URL
  const getFullImageUrl = (url: string | null | undefined): string => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  const { data: currentCompany, refetch } = useGetCurrentCompanyQuery(
    undefined,
    { refetchOnMountOrArgChange: true }
  );
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();
  const [uploadLogo, { isLoading: isUploading }] = useUploadLogoMutation();

  function handleLogoUpload() {
    logoFileRef.current?.click();
  }

  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void
  ) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);

      // Upload to server
      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await uploadLogo(formData).unwrap();
        toast.success(t('settings.company.success.logoUploaded'), {
          duration: 3000,
        });
        // Update imageUrl from response if available
        if ((response as any).logo) {
          setLogoUrl(getFullImageUrl((response as any).logo));
        }
      } catch (err: any) {
        toast.error(t('settings.company.errors.logoUploadFailed'), {
          duration: 3000,
        });
      }
    }
  }

  function handleSaveCompany(e: React.FormEvent) {
    e.preventDefault();
    setCompanyError('');
    if (!companyName.trim()) {
      setCompanyError(`${t('settings.company.error')}`);
      return;
    }

    // prepare payload
    const payload: Record<string, any> = {
      name: companyName.trim(),
      address: companyAddress.trim(),
      city: companyCity.trim(),
      postalCode: companyPostal.trim(),
      phone: companyPhone.trim(),
      email: companyEmail.trim(),
      latitude: companyLatitude || undefined,
      longitude: companyLongitude || undefined,
      altitude: companyAltitude || undefined,
    };

    (async () => {
      try {
        const id = currentCompany?.id ?? 0;
        await updateCompany({ id, body: payload }).unwrap();
        try {
          await refetch();
        } catch {}
        toast.success(`${t('settings.company.saved')} ${companyName}`, {
          duration: 3000,
        });
      } catch (err) {
        console.error('Update company failed', err);
        setCompanyError(
          (t('settings.company.updateFailed') as string) || 'Update failed'
        );
      }
    })();
  }

  React.useEffect(() => {
    if (currentCompany) {
      setCompanyName(currentCompany.name ?? '');
      setCompanyAddress(currentCompany.address ?? '');
      setCompanyCity(currentCompany.city ?? '');
      setCompanyPostal((currentCompany as any).postalCode ?? '');
      setCompanyPhone(currentCompany.phone ?? '');
      setCompanyEmail(currentCompany.email ?? '');
      setCompanyLatitude(String((currentCompany as any).latitude ?? ''));
      setCompanyLongitude(String((currentCompany as any).longitude ?? ''));
      setCompanyAltitude(String((currentCompany as any).altitude ?? ''));
      // Set logo from currentCompany
      const logoUrl = currentCompany.logo ?? '';
      setLogoUrl(getFullImageUrl(logoUrl));
    }
  }, [currentCompany]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.company.title')}</CardTitle>
        <CardDescription>{t('settings.company.description')}</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSaveCompany} className='space-y-4'>
          {/* Logo */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium'>
              {t('settings.company.logo')}
            </label>

            <div className='flex items-center gap-4'>
              <Avatar className='h-16 w-16'>
                <AvatarImage src={logoUrl} alt='Logo' />
                <AvatarFallback>Logo</AvatarFallback>
              </Avatar>
              <Button
                type='button'
                onClick={handleLogoUpload}
                disabled={isUploading}
              >
                {isUploading
                  ? t('settings.company.uploading')
                  : logoUrl
                    ? t('settings.company.changeLogo')
                    : t('settings.company.uploadLogo')}
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
            <FieldLabel> {t('settings.company.name')}</FieldLabel>
            <FieldContent>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel> {t('settings.company.address')}</FieldLabel>
            <FieldContent>
              <Input
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
              />
            </FieldContent>
          </Field>

          <div className='grid grid-cols-2 gap-4'>
            <Field>
              <FieldLabel>{t('settings.company.city')}</FieldLabel>
              <FieldContent>
                <Input
                  value={companyCity}
                  onChange={(e) => setCompanyCity(e.target.value)}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel> {t('settings.company.postalCode')}</FieldLabel>
              <FieldContent>
                <Input
                  value={companyPostal}
                  onChange={(e) => setCompanyPostal(e.target.value)}
                />
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel> {t('settings.company.phone')}</FieldLabel>
            <FieldContent>
              <Input
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel> {t('settings.company.email')}</FieldLabel>
            <FieldContent>
              <Input
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
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
                  type='number'
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Longitude</FieldLabel>
              <FieldContent>
                <Input
                  value={companyLongitude}
                  onChange={(e) => setCompanyLongitude(e.target.value)}
                  type='number'
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Altitude</FieldLabel>
              <FieldContent>
                <Input
                  value={companyAltitude}
                  onChange={(e) => setCompanyAltitude(e.target.value)}
                  type='number'
                />
              </FieldContent>
            </Field>
          </div>

          {companyError && (
            <div className='text-sm text-destructive'>{companyError}</div>
          )}

          <div className='flex gap-2 pt-4'>
            <Button type='submit'> {t('save')}</Button>
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
              {t('clear')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
