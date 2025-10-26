import { Link } from "react-router";

export default function Footer(){
      const currentYear = new Date().getFullYear();
    return (
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
    </footer>   )
}