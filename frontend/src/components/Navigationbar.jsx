import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">Incredible India</h1>
      <ul className="flex gap-6">
        <li className="hover:text-blue-500 cursor-pointer">Destinations</li>
        <li className="hover:text-blue-500 cursor-pointer">Experiences</li>
        <li className="hover:text-blue-500 cursor-pointer">Plan Your Trip</li>
      </ul>
    </nav>
  );
};

export default Navbar;