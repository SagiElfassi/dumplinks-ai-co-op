import React, { useState, useEffect, useRef } from 'react';
import type { User } from '../types';
import { UserMenu } from './UserMenu';

interface HeaderProps {
    user: User;
    onLogout: () => void;
    onManageAccount: () => void;
    onDeleteAccount: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onManageAccount, onDeleteAccount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
      {/* Logo */}
      <div className="flex items-center">
        <span className="text-xl font-bold text-primary uppercase tracking-tighter font-['Space_Grotesk']">
          DUMPLINKS
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 mr-2">
          <a className="text-primary font-bold border-b-2 border-primary py-1 font-['Space_Grotesk'] text-sm">
            My Dumps
          </a>
          <a className="text-zinc-500 font-medium hover:text-primary transition-colors duration-200 py-1 font-['Space_Grotesk'] text-sm cursor-pointer">
            My Collections
          </a>
        </nav>

        {/* Notification bell */}
        <button className="text-zinc-700 hover:text-primary transition-colors active:scale-95 p-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
        </button>

        {/* User avatar */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(prev => !prev)}
            className="w-9 h-9 rounded-full bg-zinc-200 border-2 border-zinc-200 overflow-hidden hover:border-primary transition-colors focus:outline-none"
          >
            {user.profilePictureUrl ? (
              <img src={user.profilePictureUrl} alt={user.name || user.email} className="w-full h-full object-cover" />
            ) : (
              <span className="flex items-center justify-center w-full h-full text-sm font-bold text-zinc-700">
                {(user.name || user.email || '?').charAt(0).toUpperCase()}
              </span>
            )}
          </button>
          {isMenuOpen && (
            <UserMenu
              user={user}
              onLogout={onLogout}
              onManageAccount={() => { setIsMenuOpen(false); onManageAccount(); }}
              onDeleteAccount={() => { setIsMenuOpen(false); onDeleteAccount(); }}
            />
          )}
        </div>
      </div>
    </header>
  );
};
