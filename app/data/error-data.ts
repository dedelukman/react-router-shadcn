export interface ErrorPageConfig {
  code: number;
  title: string;
  message: string;
  description: string;
  showHomeButton: boolean;
  showContactButton: boolean;
  showRetryButton?: boolean;
}

export const errorData: Record<number, ErrorPageConfig> = {
  404: {
    code: 404,
    title: "Page Not Found",
    message: "Oops! The page you're looking for doesn't exist.",
    description: "The page you are trying to access might have been moved, deleted, or never existed. Please check the URL and try again.",
    showHomeButton: true,
    showContactButton: true,
    showRetryButton: false,
  },
  500: {
    code: 500,
    title: "Server Error",
    message: "Something went wrong on our end.",
    description: "We're experiencing some technical difficulties. Please try again in a few moments. If the problem persists, contact our support team.",
    showHomeButton: true,
    showContactButton: true,
    showRetryButton: true,
  },
  403: {
    code: 403,
    title: "Access Denied",
    message: "You don't have permission to access this page.",
    description: "This page is restricted. Please check your permissions or contact your administrator if you believe this is an error.",
    showHomeButton: true,
    showContactButton: true,
    showRetryButton: false,
  },
  401: {
    code: 401,
    title: "Unauthorized",
    message: "You need to be logged in to access this page.",
    description: "Please sign in to your account to continue. If you don't have an account, you can create one for free.",
    showHomeButton: false,
    showContactButton: false,
    showRetryButton: false,
  },
  503: {
    code: 503,
    title: "Service Unavailable",
    message: "We're down for maintenance.",
    description: "We're currently performing scheduled maintenance. We'll be back online shortly. Thank you for your patience.",
    showHomeButton: true,
    showContactButton: false,
    showRetryButton: true,
  },
} as const;