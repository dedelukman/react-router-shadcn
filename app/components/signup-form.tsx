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
import { useState } from 'react';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') ?? '');
    const email = String(fd.get('email') ?? '');
    const password = String(fd.get('password') ?? '');
    const confirm = String(fd.get('confirm-password') ?? '');

    // Client-side validation
    if (!name || !email || !password || !confirm) {
      setError(t('signup.errors.fillAllFields'));
      setIsLoading(false);
      return;
    }

    if (password !== confirm) {
      setError(t('signup.errors.passwordMismatch'));
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(t('signup.errors.passwordLength'));
      setIsLoading(false);
      return;
    }

    try {
    await auth.signup(name, email, password);
    navigate('/app/dashboard', { replace: true });
  } catch (err: any) {
    // Error dari backend bisa berupa string "Email is already taken"
    const message = err.message;
    if (message === 'Email is already taken') {
      setError(t('signup.errors.emailAlreadyTaken'));
    } else {
      setError(t('signup.errors.registrationFailed'));
    }
  } finally {
    setIsLoading(false);
  }
  }

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className='flex flex-col items-center gap-1 text-center'>
          <h1 className='text-2xl font-bold'>{t('signup.title')}</h1>
          <p className='text-muted-foreground text-sm text-balance'>
            {t('signup.subtitle')}
          </p>
        </div>

        {error && (
          <div className='bg-destructive/15 text-destructive text-sm p-3 rounded-md'>
            {error}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor='name'>{t('signup.fullName')}</FieldLabel>
          <Input
            id='name'
            name='name'
            type='text'
            placeholder='John Doe'
            required
            disabled={isLoading}
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
            disabled={isLoading}
          />
          <FieldDescription>
            {t('signup.emailDescription')}
          </FieldDescription>
        </Field>
        
        <Field>
          <FieldLabel htmlFor='password'>{t('signup.password')}</FieldLabel>
          <Input 
            id='password' 
            name='password' 
            type='password' 
            required 
            disabled={isLoading}
            minLength={6}
          />
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
            disabled={isLoading}
            minLength={6}
          />
          <FieldDescription>{t('signup.confirmPasswordDescription')}</FieldDescription>
        </Field>
        
        <Field>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? t('signup.creatingAccount') : t('signup.submit')}
          </Button>
        </Field>
        
        <FieldSeparator>{t('signup.orContinue')}</FieldSeparator>
        
        <Field>
          <Button variant='outline' type='button' disabled={isLoading} className="w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 48 48"
            >
              {/* Google SVG icon */}
            </svg>
            {t('signup.google')}
          </Button>
          <FieldDescription className='px-6 text-center'>
            {t('signup.haveAccount')}{' '}
            <Link to="/login" className="text-primary hover:underline">
              {t('signup.signin')}
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}