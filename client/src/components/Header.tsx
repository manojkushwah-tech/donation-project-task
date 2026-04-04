import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import Button from './Button';

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Our Story', href: '/about' },
    { name: 'Our Rooms', href: '/rooms' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <header
      className={cn(
        'fixed left-0 top-0 z-[9999] w-full transition-all duration-300',
        isSticky ? 'bg-white/80 shadow-sticky backdrop-blur-sm py-2' : 'bg-white/90 backdrop-blur-sm py-2'
      )}
    >
      <div className="container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 lg:w-1/4">
            <img
              src="https://www.shrinanusatidadi.com/_next/image?url=%2Fimages%2Flogo%2Flogo-dadi.png&w=256&q=75"
              alt="Nanu Sati Dadi"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden lg:flex flex-1 justify-center">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.href}
                    className={({ isActive }) =>
                      cn(
                        'text-sm md:text-base font-medium transition-colors',
                        isActive ? 'text-primary' : 'text-slate-700 hover:text-primary'
                      )
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Buttons */}
          <div className="hidden lg:flex items-center justify-end gap-4 lg:w-1/4">
            <Button href="#" className="px-4 py-2 text-sm">Seva Kare</Button>
            <Button href="#" className="px-4 py-2 text-sm">Monthly Recurring Seva</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-lg lg:hidden border-t border-slate-100"
          >
            <ul className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.href}
                    className={({ isActive }) =>
                      cn(
                        'block text-base font-medium transition-colors',
                        isActive ? 'text-primary' : 'text-slate-700 hover:text-primary'
                      )
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
              <div className="flex flex-col gap-3 pt-4">
                <a
                  href="#"
                  className="w-full text-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-white"
                >
                  Seva Kare
                </a>
                <a
                  href="#"
                  className="w-full text-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-white"
                >
                  Monthly Recurring Seva
                </a>
              </div>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
