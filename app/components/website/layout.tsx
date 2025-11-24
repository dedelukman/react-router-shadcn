import { Outlet } from 'react-router';
import Footer from './footer';
import { Navbar } from './nav-bar';

export default function LayoutHome() {
  return (
    <main>
      <Navbar />
      <Outlet />
      <Footer />
    </main>
  );
}
