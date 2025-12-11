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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

export default function Page() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch user data on component mount
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      // Get current user from API
      const response = await fetch(`${API_BASE_URL}user/me`, {
        credentials: 'include', // Ini penting untuk mengirim cookies
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUserId(userData.id);
        setUsername(userData.username || '');
        setFullname(userData.fullname || userData.fullName || '');
        setEmail(userData.email || '');
        // Jika ada avatar/image dari backend
        setImageUrl(userData.avatar || userData.imageUrl || '');
      } else if (response.status === 401) {
        // Redirect to login if not authenticated
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !userId) return;
    
    setIsLoading(true);
    
    // Prepare data object sesuai dengan model User di backend
    const userData: Record<string, any> = {
      username: username.trim(),
      fullname: fullname.trim(), // atau fullName tergantung backend
      email: email.trim(),
      // Hanya kirim password jika ada perubahan
      ...(newPassword && { password: newPassword }),
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ini penting untuk mengirim cookies
        body: JSON.stringify(userData),
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        
        // Update state dengan data terbaru dari backend
        setUsername(updatedUser.username || '');
        setFullname(updatedUser.fullname || updatedUser.fullName || '');
        setEmail(updatedUser.email || '');
        
        // Clear password fields
        setNewPassword('');
        setConfirmPassword('');
        
        alert(t('profile.success.profileSaved'));
      } else if (response.status === 401) {
        // Session expired, redirect to login
        window.location.href = '/login';
      } else {
        const errorData = await response.json();
        
        // Handle validation errors dari backend
        if (errorData.errors) {
          const backendErrors: Record<string, string> = {};
          Object.keys(errorData.errors).forEach(key => {
            backendErrors[key] = errorData.errors[key];
          });
          setErrors(backendErrors);
        } else if (errorData.message) {
          setErrors({ submit: errorData.message });
        } else {
          setErrors({ submit: t('profile.errors.updateFailed') });
        }
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setErrors({ submit: t('profile.errors.updateFailed') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // Reset form ke data asli dari backend
    fetchCurrentUser();
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
              {fullname.substring(0, 2).toUpperCase() || 'US'}
            </AvatarFallback>
          </Avatar>
          <Button onClick={handleImageUpload}>
            {imageUrl ? t('profile.changeImage') : t('profile.uploadImage')}
          </Button>
          {imageUrl && (
            <Button
              onClick={handleImageDelete}
              variant="destructive"
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
                disabled={isLoading}
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
                disabled={isLoading}
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