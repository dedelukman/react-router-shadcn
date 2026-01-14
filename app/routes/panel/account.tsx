import { IconTrash } from '@tabler/icons-react';
import { useRef, useState, type ChangeEvent, useEffect } from 'react';
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
import {
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
} from '~/store/api';
import { API_BASE_URL } from '~/store/api/baseApi';
import { toast } from 'sonner';

export default function Page() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setfullName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Helper function to construct full image URL
  const getFullImageUrl = (url: string | null | undefined): string => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  // Fetch user data on component mount
  const { data: currentUser, refetch } = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();
  const [deleteAvatar, { isLoading: isDeleting }] = useDeleteAvatarMutation();

  useEffect(() => {
    if (currentUser) {
      setUserId(currentUser.id ?? null);
      setUsername(currentUser.username ?? '');
      // backend may use different keys for full name
      setfullName(
        (currentUser as any).fullName ?? (currentUser as any).full_name ?? ''
      );
      setEmail(currentUser.email ?? '');
      const avatarUrl = (currentUser as any).avatarUrl ?? '';
      setImageUrl(getFullImageUrl(avatarUrl));
    }
  }, [currentUser]);

  const handleImageUpload = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Preview the image locally
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await uploadAvatar(formData).unwrap();
        toast.success(t('profile.success.avatarUploaded'), {
          duration: 3000,
        });
        // Update imageUrl from response if available
        if ((response as any).avatarUrl) {
          setImageUrl(getFullImageUrl((response as any).avatarUrl));
        }
      } catch (err: any) {
        toast.error(t('profile.errors.avatarUploadFailed'), {
          duration: 3000,
        });
      }
    }
  };

  const handleImageDelete = async () => {
    try {
      await deleteAvatar().unwrap();
      setImageUrl('');
      toast.success(t('profile.success.avatarDeleted'), {
        duration: 3000,
      });
      try {
        await refetch();
      } catch {}
    } catch (err: any) {
      toast.error(t('profile.errors.avatarDeleteFailed'), {
        duration: 3000,
      });
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!username.trim()) e.username = t('profile.errors.usernameRequired');
    if (!fullName.trim()) e.fullName = t('profile.errors.fullNameRequired');
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      e.email = t('profile.errors.emailRequired');
    if ((newPassword || confirmPassword) && newPassword.length < 6)
      e.newPassword = t('profile.errors.passwordMinLength');
    if (newPassword !== confirmPassword)
      e.confirmPassword = t('profile.errors.passwordsMismatch');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !userId) return;

    setIsLoading(true);

    // Prepare data object sesuai dengan model User di backend
    const userData: Record<string, any> = {
      username: username.trim(),
      fullName: fullName.trim(), // atau fullName tergantung backend
      email: email.trim(),
      // Hanya kirim password jika ada perubahan
      ...(newPassword && { password: newPassword }),
    };

    try {
      await updateUser({ id: userId, body: userData }).unwrap();
      setNewPassword('');
      setConfirmPassword('');
      toast.success(t('profile.success.profileSaved'), {
        duration: 3000,
      });
      try {
        await refetch();
      } catch {}
    } catch (err: any) {
      const r = err?.data ?? err;
      if (typeof r === 'string') {
        if (r === 'USERNAME_ALREADY_TAKEN') {
          setErrors({ submit: t('profile.errors.usernameAlreadyTaken') });
        } else if (r === 'EMAIL_ALREADY_EXISTS') {
          setErrors({ submit: t('profile.errors.emailAlreadyTaken') });
        } else {
          setErrors({ submit: t('profile.errors.updateFailed') });
        }
      } else if (r?.errors) {
        const backendErrors: Record<string, string> = {};
        Object.keys(r.errors).forEach((key) => {
          backendErrors[key] = r.errors[key];
        });
        setErrors(backendErrors);
      } else if (r?.message) {
        setErrors({ submit: r.message });
      } else {
        setErrors({ submit: t('profile.errors.updateFailed') });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // Reset form ke data asli dari backend
    try {
      refetch();
    } catch {}
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  return (
    <div>
      <Card className='m-4 p-2'>
        <div className='flex justify-center items-center gap-2 px-1 py-1.5 text-left text-sm'>
          <Avatar className='w-30 h-30'>
            <AvatarImage src={imageUrl} alt='Profile' />
            <AvatarFallback className='rounded-full'>
              {(fullName || 'US').substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Button onClick={handleImageUpload} disabled={isUploading}>
            {isUploading
              ? t('profile.uploading')
              : imageUrl
                ? t('profile.changeImage')
                : t('profile.uploadImage')}
          </Button>
          {imageUrl && (
            <Button
              onClick={handleImageDelete}
              variant='destructive'
              className='bg-red-700 hover:bg-red-600'
              disabled={isDeleting}
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
                disabled={true}
              />
              <FieldError>{errors.username}</FieldError>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>{t('profile.fullName')}</FieldLabel>
            <FieldContent>
              <Input
                value={fullName}
                onChange={(ev) => setfullName(ev.target.value)}
                placeholder={t('profile.fullNamePlaceholder')}
                disabled={isLoading}
              />
              <FieldError>{errors.fullName}</FieldError>
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
              <Input
                value={confirmPassword}
                onChange={(ev) => setConfirmPassword(ev.target.value)}
                placeholder={t('profile.confirmPasswordPlaceholder')}
                type='password'
                className='mt-2'
                disabled={isLoading}
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
            <Button type='submit' disabled={isLoading}>
              {isLoading ? t('profile.saving') : t('profile.save')}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={handleReset}
              disabled={isLoading}
            >
              {t('profile.reset')}
            </Button>
          </div>
        </form>

        {errors.submit && (
          <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-md'>
            <p className='text-sm text-red-600'>{errors.submit}</p>
          </div>
        )}
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
