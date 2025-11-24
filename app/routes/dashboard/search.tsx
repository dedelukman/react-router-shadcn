import * as React from 'react';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Link } from 'react-router';
import { Search, X, ArrowRight, Folder } from 'lucide-react';

const dashboardRoutes = [
  { label: 'Account', href: '/dashboard/account' },
  { label: 'Billing', href: '/dashboard/billing' },
  { label: 'Notifications', href: '/dashboard/notifications' },
  { label: 'Settings', href: '/dashboard/settings' },
  { label: 'Help / Get Help', href: '/dashboard/gethelp' },
  { label: 'Search', href: '/dashboard/search' },
];

export default function SearchPage() {
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const results = React.useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    
    return dashboardRoutes.filter((route) => {
      return (
        route.label.toLowerCase().includes(term) ||
        route.href.toLowerCase().includes(term)
      );
    });
  }, [query]);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Folder className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Menu Search
          </h1>
          <p className="text-muted-foreground">
            Cari menu dashboard dengan cepat
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-card rounded-lg border shadow-sm p-6 mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari menu (nama atau path)..."
                className="pl-10 border-foreground/20 focus:border-primary transition-colors"
              />
            </div>
            {query && (
              <Button
                variant="outline"
                onClick={clearSearch}
                className="border-foreground/20"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Search Info */}
          {query && (
            <div className="mt-3 text-sm text-muted-foreground">
              Ditemukan {results.length} menu untuk "{query}"
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          {!query ? (
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Mulai Pencarian
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Ketik di atas untuk mencari menu dashboard berdasarkan nama atau path URL.
              </p>
              
              {/* Quick Suggestions */}
              <div className="flex flex-wrap justify-center gap-2">
                {['Account', 'Billing', 'Settings', 'Help'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-primary/10 text-primary rounded-md text-sm font-medium hover:bg-primary/20 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Menu tidak ditemukan
              </h3>
              <p className="text-muted-foreground mb-4">
                Tidak ada menu yang cocok dengan "<span className="font-medium">{query}</span>".
              </p>
              <Button
                variant="outline"
                onClick={clearSearch}
                className="rounded-md"
              >
                Hapus Pencarian
              </Button>
            </div>
          ) : (
            <div className="p-1">
              <div className="space-y-2">
                {results.map((route) => (
                  <div
                    key={route.href}
                    className="group flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Folder className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {route.label}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {route.href}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={route.href}
                      className="flex items-center space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                      <span>Buka</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          Gunakan pencarian untuk menemukan menu dengan cepat
        </div>
      </div>
    </div>
  );
}