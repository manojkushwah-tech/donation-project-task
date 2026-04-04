import React from 'react';
import { Facebook, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const links = [
    { name: 'Privacy', href: '/privacy-policy' },
    { name: 'Our Story', href: '/about' },
    { name: 'Our Rooms', href: '/rooms' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Refund Policy', href: '/refund-policy' },
    { name: 'Shipping Policy', href: '/shipping-policy' },
    { name: 'Terms & Conditions', href: '/terms-and-conditions' },
  ];

  return (
    <footer className="bg-white border-t border-slate-100 py-16">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          <Link to="/">
            <img
              src="https://www.shrinanusatidadi.com/_next/image?url=%2Fimages%2Flogo%2Flogo-dadi.png&w=256&q=75"
              alt="Logo"
              className="h-24 w-auto mb-6 rounded-full"
              referrerPolicy="no-referrer"
            />
          </Link>
          <p className="text-slate-500 max-w-md mb-8 italic">म्हारी नानू सती दादी माँ</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-10">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm text-slate-600 hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <hr className="w-full border-slate-100 mb-10" />
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-slate-500">
              © Copyright 2026. All Rights Reserved.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.facebook.com/people/Dalmia-Kuldevi-Nanu-Sati-Sohasara/61560080062979" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-400 hover:text-primary transition-colors"
              >
                <Facebook size={24} />
              </a>
              <a 
                href="https://www.youtube.com/channel/UCVNLqmWhfeRzxyjxkm7xUIg" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-400 hover:text-primary transition-colors"
              >
                <Youtube size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
