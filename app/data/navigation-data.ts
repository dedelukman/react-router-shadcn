export interface MenuItem {
  label: string;
  href: string;
  type: 'link' | 'button';
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'destructive';
  icon?: string; // Untuk icon jika diperlukan
  requiresAuth?: boolean;
  children?: MenuItem[]; // Untuk dropdown menu
}

export const navigationData = {
  site: {
    name: 'Your Brand',
    logo: {
      text: 'L',
      image: '/logo.png', // Opsional: path ke gambar logo
    },
  },
  mainMenu: [
    { label: 'Home', href: '/', type: 'link' as const },
    { label: 'About', href: '/about', type: 'link' as const },
    { label: 'Services', href: '/services', type: 'link' as const },
    { label: 'Blog', href: '/blog', type: 'link' as const },
    { label: 'Contact', href: '/contact', type: 'link' as const },
  ],
  authMenu: {
    public: [
      { label: 'Login', href: '/login', type: 'button' as const, variant: 'ghost' as const },
      { label: 'Sign Up', href: '/signup', type: 'button' as const, variant: 'default' as const },
    ],
    private: [
      { label: 'Dashboard', href: '/dashboard', type: 'button' as const, variant: 'outline' as const },
      { label: 'Profile', href: '/profile', type: 'button' as const, variant: 'ghost' as const },
    ],
  },
  footerMenu: [
    // Bisa ditambahkan menu untuk footer
  ],
} as const;

// Helper function untuk mendapatkan menu berdasarkan state auth
export const getAuthMenu = (isAuthenticated: boolean = false) => {
  return isAuthenticated 
    ? navigationData.authMenu.private 
    : navigationData.authMenu.public;
};