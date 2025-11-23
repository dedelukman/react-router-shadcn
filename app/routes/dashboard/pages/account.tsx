import { IconTrash } from '@tabler/icons-react';
import { useRef, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldDescription,
  FieldError,
} from '~/components/ui/field';

export default function Page() {
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState('');
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setImageUrl('');
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!username.trim()) e.username = t('profile.errors.usernameRequired');
    if (!fullname.trim()) e.fullname = t('profile.errors.fullNameRequired');
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      e.email = t('profile.errors.emailRequired');
    if ((newPassword || confirmPassword) && newPassword.length < 6)
      e.newPassword = t('profile.errors.passwordMinLength');
    if (newPassword !== confirmPassword)
      e.confirmPassword = t('profile.errors.passwordsMismatch');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // TODO: send to backend / persist
    // For now we'll just log the values
    console.log({ username, fullname, email, newPassword, imageUrl });
    alert(t('profile.success.profileSaved'));
    setNewPassword('');
    setConfirmPassword('');
    // optionally keep username/email but clear fullname on save
    // setUsername('');
    // setEmail('');
    // clear fullname input
    setFullname('');
  };

  return (
    <div>
      <Card className='m-4 p-2'>
        <div className='flex justify-center items-center gap-2  px-1 py-1.5 text-left text-sm'>
          <Avatar className='w-30 h-30 '>
            <AvatarImage src={imageUrl} alt='@shadcn' />
            <AvatarFallback className='rounded-full'>CN</AvatarFallback>
          </Avatar>
          <Button onClick={handleImageUpload}>
            {imageUrl ? t('profile.changeImage') : t('profile.uploadImage')}
          </Button>
          {imageUrl && (
            <Button
              onClick={handleImageDelete}
              className='bg-red-700 hover:bg-red-600'
            >
              <IconTrash />
            </Button>
          )}
        </div>
        {/* Account form */}
        <form onSubmit={handleSave} className='mt-4 grid gap-4'>
          <Field>
            <FieldLabel>{t('profile.username')}</FieldLabel>
            <FieldContent>
              <Input
                value={username}
                onChange={(ev) => setUsername(ev.target.value)}
                placeholder={t('profile.usernamePlaceholder')}
              />
              <FieldError>{errors.username}</FieldError>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>{t('profile.fullName')}</FieldLabel>
            <FieldContent>
              <Input
                value={fullname}
                onChange={(ev) => setFullname(ev.target.value)}
                placeholder={t('profile.fullNamePlaceholder')}
              />
              <FieldError>{errors.fullname}</FieldError>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>{t('profile.email')}</FieldLabel>
            <FieldContent>
              <Input
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                placeholder={t('profile.emailPlaceholder')}
                type='email'
              />
              <FieldDescription>
                {t('profile.emailDescription')}
              </FieldDescription>
              <FieldError>{errors.email}</FieldError>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>{t('profile.changePassword')}</FieldLabel>
            <FieldContent>
              <Input
                value={newPassword}
                onChange={(ev) => setNewPassword(ev.target.value)}
                placeholder={t('profile.newPasswordPlaceholder')}
                type='password'
              />
              <Input
                value={confirmPassword}
                onChange={(ev) => setConfirmPassword(ev.target.value)}
                placeholder={t('profile.confirmPasswordPlaceholder')}
                type='password'
                className='mt-2'
              />
              <FieldDescription>
                {t('profile.passwordDescription')}
              </FieldDescription>
              <FieldError>
                {errors.newPassword || errors.confirmPassword}
              </FieldError>
            </FieldContent>
          </Field>

          <div className='flex items-center gap-2'>
            <Button type='submit'>{t('profile.save')}</Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                // reset local edits (not image)
                setUsername('');
                setEmail('');
                setNewPassword('');
                setConfirmPassword('');
                setErrors({});
              }}
            >
              {t('profile.reset')}
            </Button>
          </div>
        </form>
      </Card>
      {/* Hidden file input */}
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        accept='image/*'
        className='hidden'
      />
    </div>
  );
}