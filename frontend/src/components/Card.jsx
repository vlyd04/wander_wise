import React from 'react';

const Card = ({ title, image, description }) => (
  <div className="w-64 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition">
    <img src={image} alt={title} className="w-full h-40 object-cover" />
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <span className="text-blue-500 hover:underline cursor-pointer flex items-center">
        Explore More <span className="ml-2">➔</span>
      </span>
    </div>
  </div>
);

export default Card;

// import React from 'react';

// const Card = ({ title, image, description, link }) => (
//   <div className="w-64 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition">
//     <img src={image} alt={title} className="w-full h-40 object-cover" />
//     <div className="p-4">
//       <h3 className="text-lg font-semibold mb-2">{title}</h3>
//       <p className="text-sm text-gray-600 mb-2">{description}</p>
//       {link && (
//         <a
//           href={link}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-blue-500 hover:underline flex items-center"
//         >
//           Book Now <span className="ml-2">➔</span>
//         </a>
//       )}
//     </div>
//   </div>
// );

// export default Card;
