
import { Home, Mail, RefreshCw, AlertCircle, Server, Lock, WifiOff } from 'lucide-react';
import type { ErrorPageConfig } from '~/data/error-data';
import { Button } from './ui/button';
import { Link } from 'react-router';

interface ErrorLayoutProps {
  errorConfig: ErrorPageConfig;
  illustration?: React.ReactNode;
  onRetry?: () => void;
}

export function ErrorLayout({ errorConfig, illustration, onRetry }: ErrorLayoutProps) {
  const getErrorIcon = () => {
    switch (errorConfig.code) {
      case 404:
        return <AlertCircle className="h-16 w-16 text-muted-foreground" />;
      case 500:
        return <Server className="h-16 w-16 text-muted-foreground" />;
      case 403:
      case 401:
        return <Lock className="h-16 w-16 text-muted-foreground" />;
      case 503:
        return <WifiOff className="h-16 w-16 text-muted-foreground" />;
      default:
        return <AlertCircle className="h-16 w-16 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-md w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8 flex justify-center">
          {illustration || getErrorIcon()}
        </div>

        {/* Error Code */}
        <div className="text-6xl font-bold text-foreground mb-4">
          {errorConfig.code}
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-foreground mb-4">
          {errorConfig.title}
        </h1>

        {/* Error Message */}
        <p className="text-lg text-muted-foreground mb-4">
          {errorConfig.message}
        </p>

        {/* Error Description */}
        <p className="text-sm text-muted-foreground mb-8">
          {errorConfig.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {errorConfig.showHomeButton && (
            <Button asChild>
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          )}
          
          {errorConfig.showRetryButton && onRetry && (
            <Button variant="outline" onClick={onRetry} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
          
          {errorConfig.showContactButton && (
            <Button variant="outline" asChild>
              <Link to="/contact" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Support
              </Link>
            </Button>
          )}

          {/* Special case for 401 - Show login button */}
          {errorConfig.code === 401 && (
            <Button asChild>
              <Link to="/login" className="flex items-center gap-2">
                Sign In
              </Link>
            </Button>
          )}
        </div>

        {/* Additional Help Text for 401 */}
        {errorConfig.code === 401 && (
          <p className="text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}