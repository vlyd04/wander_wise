import React from 'react';

const Banner = () => {
  return (
    <div className="relative h-[100vh] bg-cover bg-center" style={{ backgroundImage: 'url(./banner.avif)' }}>
      <div className="absolute inset-0  bg-opacity-50 flex items-center justify-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center">Discover the Beauty of India</h2>
      </div>
    </div>
  );
};

export default Banner;
