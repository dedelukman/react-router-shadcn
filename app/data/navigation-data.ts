import {
  IconDashboard,
  IconListDetails,
  IconChartBar,
  IconFolder,
  IconUsers,
  IconSettings,
  IconHelp,
  IconSearch,
  IconDatabase,
  IconReport,
  IconFileWord,
  IconNotification,
} from '@tabler/icons-react';

export interface AppNavItem {
  /** i18n key */
  label: string;
  /** Navigation URL - if null → dropdown/section only */
  href?: string | null;
  /** Lucide/Tabler icon component */
  icon?: any;
  /** Variant for buttons (Navbar usage) */
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'destructive';
  /** Button or Link — Navbar mobile usage */
  type?: 'link' | 'button';
  /** Show only if logged in or logged out */
  requiresAuth?: boolean;
  /** Expandable sidebar menu */
  children?: AppNavItem[];
  /** Role-based restrictions (future support) */
  roles?: string[];
}

export const navigationData: {
  site: {
    name: string;
    logo: {
      text: string;
      image?: string;
    };
  };
  menu: {
    main: AppNavItem[];
    auth: {
      public: AppNavItem[];
      private: AppNavItem[];
    };
    sidebar: {
      main: AppNavItem[];
      secondary: AppNavItem[];
      documents: AppNavItem[];
      user: {
        name: string;
        avatar: string;
        email: string;
        menu: AppNavItem[]; // <-- here unified
      };
    };
  };
} = {
  site: {
    name: 'Your Brand',
    logo: {
      text: 'L',
      image: '/logo.png',
    },
  },
  menu: {
    main: [
      { label: 'navigation.home', href: '/', type: 'link' },
      { label: 'navigation.about', href: '/about', type: 'link' },
      { label: 'navigation.services', href: '/services', type: 'link' },
      { label: 'navigation.blog', href: '/blog', type: 'link' },
      { label: 'navigation.contact', href: '/contact', type: 'link' },
    ],
    auth: {
      public: [
        { label: 'login', href: '/login', type: 'button', variant: 'ghost' },
        {
          label: 'signup',
          href: '/signup',
          type: 'button',
          variant: 'default',
        },
      ],
      private: [
        {
          label: 'app.dashboard',
          href: '/app/dashboard',
          type: 'button',
          variant: 'outline',
        },
      ],
    },
    sidebar: {
      main: [
        {
          label: 'app.dashboard',
          href: '/app/dashboard',
          icon: IconDashboard,
        },
        {
          label: 'lifecycle',
          href: '#',
          icon: IconListDetails,
        },
        {
          label: 'analytics',
          href: '#',
          icon: IconChartBar,
        },
        {
          label: 'projects',
          href: '#',
          icon: IconFolder,
        },
        {
          label: 'team',
          href: '#',
          icon: IconUsers,
        },
      ],
      secondary: [
        {
          label: 'app.settings',
          href: '/app/settings',
          icon: IconSettings,
        },
        {
          label: 'app.gethelp',
          href: '/app/gethelp',
          icon: IconHelp,
        },
        {
          label: 'app.search',
          href: '/app/search',
          icon: IconSearch,
        },
      ],
      documents: [
        {
          label: 'dataLibrary',
          href: '#',
          icon: IconDatabase,
        },
        {
          label: 'reports',
          href: '#',
          icon: IconReport,
        },
        {
          label: 'wordAssistant',
          href: '#',
          icon: IconFileWord,
        },
      ],
      user: {
        name: 'John Doe',
        avatar: '/avatars/johndoe.jpg',
        email: 'd@emi.com',
        menu: [
          { label: 'app.account', href: '/app/account', icon: IconSettings },
          { label: 'app.billing', href: '/app/billing', icon: IconSettings },
          {
            label: 'app.notifications',
            href: '/app/notifications',
            icon: IconNotification,
          },
        ],
      },
    },
  },
};

export const getAuthMenu = (isAuthenticated: boolean = false) => {
  return isAuthenticated
    ? navigationData.menu.auth.private
    : navigationData.menu.auth.public;
};
