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
    { label: 'navigation.home', href: '/', type: 'link' as const },
    { label: 'navigation.about', href: '/about', type: 'link' as const },
    { label: 'navigation.services', href: '/services', type: 'link' as const },
    { label: 'navigation.blog', href: '/blog', type: 'link' as const },
    { label: 'navigation.contact', href: '/contact', type: 'link' as const },
  ],
  authMenu: {
    public: [
      { label: 'login.', href: '/login', type: 'button' as const, variant: 'ghost' as const },
      { label: 'signup.', href: '/signup', type: 'button' as const, variant: 'default' as const },
    ],
    private: [
      { label: 'dashboard.', href: '/app/dashboard', type: 'button' as const, variant: 'outline' as const },
  
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