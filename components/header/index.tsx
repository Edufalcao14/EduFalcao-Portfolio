"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NavItem } from './nav-item';
import { Button } from "@/components/button";
import { HiArrowNarrowRight, HiMenu, HiX } from 'react-icons/hi';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Resume', href: '/resume' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' }
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 h-24 flex items-center transition-all duration-300 ${isScrolled ? 'md:backdrop-blur-[5px] md:bg-gray/50' : ''}`}>
      <div className="container lg:p-0 mx-auto sm:px-6 flex justify-between items-center font-mono">

        {/* Logo */}
        <Link href="/">
          <Image
            width={58}
            height={49}
            src="/images/logo.svg"
            alt="logo falcao Dev" />
        </Link>

        {/* Hamburger Menu Button for Small Screens */}
        <div className="sm:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
            aria-label="Toggle menu">
            {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className={`flex-1 flex lg:justify-end justify-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out sm:static sm:bg-transparent sm:translate-x-0 sm:flex sm:items-center sm:gap-10`}>
          <div className="flex flex-col sm:flex-row items-center gap-10 sm:gap-10 mt-24 sm:mt-0 sm:mr-6">
            {/* Close Button inside Menu for Mobile */}
            <button
              className="absolute top-4 right-4 text-white focus:outline-none sm:hidden"
              onClick={toggleMenu}
              aria-label="Close menu">
              <HiX size={24} />
            </button>

            {NAV_ITEMS.map((item, index) => (
              <NavItem
                key={index}
                label={item.label}
                href={item.href}
                onClick={handleLinkClick}
              />
            ))}
            <Link href="/contact" onClick={handleLinkClick}>
              <Button className="text-white font-mono rounded-md flex items-center justify-center space-x-2 shadow-button">
                Hire me
                <HiArrowNarrowRight size={18} />
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};
