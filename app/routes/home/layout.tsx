import { Outlet } from 'react-router';
import Footer from './components/footer';
import { Navbar } from './components/nav-bar';

export default function LayoutHome() {
  return (
    <main>
      <Navbar />
      <Outlet />
      <Footer />
    </main>
  );
}
