import { IconTrash } from '@tabler/icons-react';
import { useRef, useState, type ChangeEvent } from 'react';
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
  const [imageUrl, seImageUrl] = useState('');
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
        seImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleImageDelete = () => {
    seImageUrl('');
  };
  const validate = () => {
    const e: Record<string, string> = {};
    if (!username.trim()) e.username = 'Username is required';
    if (!fullname.trim()) e.fullname = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      e.email = 'Valid email is required';
    if ((newPassword || confirmPassword) && newPassword.length < 6)
      e.newPassword = 'Password must be at least 6 characters';
    if (newPassword !== confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // TODO: send to backend / persist
    // For now we'll just log the values
    console.log({ username, fullname, email, newPassword, imageUrl });
    alert('Profile saved (local) — implement server call to persist changes');
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
            {imageUrl ? 'Change Image' : 'Upload Image'}
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
            <FieldLabel>Username</FieldLabel>
            <FieldContent>
              <Input
                value={username}
                onChange={(ev) => setUsername(ev.target.value)}
                placeholder='Your username'
              />
              <FieldError>{errors.username}</FieldError>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Full name</FieldLabel>
            <FieldContent>
              <Input
                value={fullname}
                onChange={(ev) => setFullname(ev.target.value)}
                placeholder='Your full name'
              />
              <FieldError>{errors.fullname}</FieldError>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Email</FieldLabel>
            <FieldContent>
              <Input
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                placeholder='you@example.com'
                type='email'
              />
              <FieldDescription>
                We'll use this email for account notifications.
              </FieldDescription>
              <FieldError>{errors.email}</FieldError>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Change Password</FieldLabel>
            <FieldContent>
              <Input
                value={newPassword}
                onChange={(ev) => setNewPassword(ev.target.value)}
                placeholder='New password'
                type='password'
              />
              <Input
                value={confirmPassword}
                onChange={(ev) => setConfirmPassword(ev.target.value)}
                placeholder='Confirm new password'
                type='password'
                className='mt-2'
              />
              <FieldDescription>
                Leave blank to keep your current password.
              </FieldDescription>
              <FieldError>
                {errors.newPassword || errors.confirmPassword}
              </FieldError>
            </FieldContent>
          </Field>

          <div className='flex items-center gap-2'>
            <Button type='submit'>Save</Button>
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
              Reset
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
