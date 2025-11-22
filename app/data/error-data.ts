export interface ErrorPageConfig {
  code: number;
  titleKey: string;
  messageKey: string;
  descriptionKey: string;
  showHomeButton: boolean;
  showContactButton: boolean;
  showRetryButton?: boolean;
}

export const errorData: Record<number, ErrorPageConfig> = {
  404: {
    code: 404,
    titleKey: "error.title.404",
    messageKey: "error.message.404",
    descriptionKey: "error.description.404",
    showHomeButton: true,
    showContactButton: true,
    showRetryButton: false
  },

  500: {
    code: 500,
    titleKey: "error.title.500",
    messageKey: "error.message.500",
    descriptionKey: "error.description.500",
    showHomeButton: true,
    showContactButton: true,
    showRetryButton: true
  },

  403: {
    code: 403,
    titleKey: "error.title.403",
    messageKey: "error.message.403",
    descriptionKey: "error.description.403",
    showHomeButton: true,
    showContactButton: true,
    showRetryButton: false
  },

  401: {
    code: 401,
    titleKey: "error.title.401",
    messageKey: "error.message.401",
    descriptionKey: "error.description.401",
    showHomeButton: false,
    showContactButton: false,
    showRetryButton: false
  },

  503: {
    code: 503,
    titleKey: "error.title.503",
    messageKey: "error.message.503",
    descriptionKey: "error.description.503",
    showHomeButton: true,
    showContactButton: false,
    showRetryButton: true
  }
} as const;