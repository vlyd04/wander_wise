import React from 'react';

const Navbar = ({ onNavScroll }) => {
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        Incredible India
      </h1>
      <ul className="flex gap-6">
        <li className="hover:text-blue-500 cursor-pointer" onClick={() => onNavScroll('destinations')}>Destinations</li>
        <li className="hover:text-blue-500 cursor-pointer" onClick={() => onNavScroll('experiences')}>Experiences</li>
        <li className="hover:text-blue-500 cursor-pointer" onClick={() => onNavScroll('plan')}>Plan My Trip</li>
      </ul>
    </nav>
  );
};

export default Navbar;