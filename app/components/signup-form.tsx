import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '~/lib/auth';
import { useTranslation } from 'react-i18next';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const auth = useAuth();
  const navigate = useNavigate();
  const {t} = useTranslation();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') ?? '');
    const email = String(fd.get('email') ?? '');
    const password = String(fd.get('password') ?? '');
    const confirm = String(fd.get('confirm-password') ?? '');
    if (!email || !password || password !== confirm) {
      alert('Please provide matching passwords and an email');
      return;
    }
    const ok = await auth.signup(name, email, password);
    if (ok) navigate('/dashboard');
  }

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className='flex flex-col items-center gap-1 text-center'>
          <h1 className='text-2xl font-bold'> {t('signup.title')}</h1>
          <p className='text-muted-foreground text-sm text-balance'>
            {t('signup.subtitle')}
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor='name'>{t('signup.fullName')}</FieldLabel>
          <Input
            id='name'
            name='name'
            type='text'
            placeholder='John Doe'
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor='email'>{t('signup.email')}</FieldLabel>
          <Input
            id='email'
            name='email'
            type='email'
            placeholder={t('signup.emailPlaceholder')}
            required
          />
          <FieldDescription>
           {t('signup.emailDescription')}
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor='password'>{t('signup.password')}</FieldLabel>
          <Input id='password' name='password' type='password' required />
          <FieldDescription>
           {t('signup.passwordDescription')}
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor='confirm-password'>{t('signup.confirmPassword')}</FieldLabel>
          <Input
            id='confirm-password'
            name='confirm-password'
            type='password'
            required
          />
          <FieldDescription>{t('signup.confirmPasswordDescription')}</FieldDescription>
        </Field>
        <Field>
           <Button type="submit">{t('signup.submit')}</Button>
        </Field>
         <FieldSeparator>{t('signup.orContinue')}</FieldSeparator>
        <Field>
          <Button variant='outline' type='button'>
          
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 48 48"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.2C12.46 13.04 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.08 24.55c0-1.57-.14-3.09-.39-4.55H24v9.02h12.46c-.54 2.96-2.2 5.46-4.7 7.16l7.43 5.77C43.83 37.76 46.08 31.73 46.08 24.55z"
    />
    <path
      fill="#FBBC05"
      d="M10.54 28.42A14.5 14.5 0 0 1 9.5 24c0-1.53.26-3 .74-4.42l-7.98-6.2A23.86 23.86 0 0 0 0 24c0 3.84.88 7.47 2.44 10.68l8.1-6.26z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.9-5.83l-7.43-5.77C29.82 38.34 27.05 39.5 24 39.5c-6.28 0-11.6-4-13.46-9.64l-8.1 6.26C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
  {t('signup.google')}
</Button>
          <FieldDescription className='px-6 text-center'>
            {t('signup.haveAccount')}{' '}
            <Link to="/login">{t('signup.signin')}</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
