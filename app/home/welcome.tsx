import { Link } from "react-router";
import { Navbar } from "~/components/nav-bar";
import { Button } from "~/components/ui/button";


export default function Welcome() {
      const currentYear = new Date().getFullYear();

  return (
    <main className="">
      <Navbar />
      <div className="flex-1">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to Your Brand
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          We create amazing digital experiences that help your business grow and succeed.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/signup">
            <Button>Get Started</Button>
          </a>
          <a href="/about">
            <Button variant="outline">Learn More</Button>
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature cards here */}
          </div>
        </div>
      </section>
    </div>

    {/* Footer */}
     <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">L</span>
            </div>
            <span className="font-semibold">Your Brand</span>
          </div>

          {/* Links */}
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            © {currentYear} Your Brand. All rights reserved.
          </div>
        </div>
      </div>
    </footer>

    </main>
  );
}
