
// import React, { useState } from 'react';
// import Navbar from './components/Navigationbar';
// import Banner from './components/Banner';
// import CardSection from './components/CardSection';
// import BookingOptions from './components/BookingOption';
// import Footer from './components/Footer';
// import { famousDestinations, famousExperiences } from './famousData';
// import FilterBar from './components/FilterBar';
// function getAllLocations(data) {
//   const locSet = new Set();



// function getAllTags(data) {
//   const tagSet = new Set();
//   data.forEach(item => item.tags.forEach(tag => tagSet.add(tag)));
//   return Array.from(tagSet).sort();
// }

// function getAllLocations(data) {
//   const locSet = new Set();
//   data.forEach(item => locSet.add(item.location));
//   return Array.from(locSet).sort();
// }

// function App() {
//   // Destinations filter state
//   const [selectedDestTags, setSelectedDestTags] = useState([]);
//   const [selectedDestLocation, setSelectedDestLocation] = useState('');
//   // Experiences filter state
//   const [selectedExpTags, setSelectedExpTags] = useState([]);
//   const [selectedExpLocation, setSelectedExpLocation] = useState('');

//   // Filtering logic (local, fallback if API not used)
//   const filteredDestinations = famousDestinations.filter(item =>
//     (selectedDestTags.length === 0 || selectedDestTags.every(tag => item.tags.includes(tag))) &&
//     (!selectedDestLocation || item.location === selectedDestLocation)
//   );

//   const filteredExperiences = famousExperiences.filter(item =>
//     (selectedExpTags.length === 0 || selectedExpTags.every(tag => item.tags.includes(tag))) &&
//     (!selectedExpLocation || item.location === selectedExpLocation)
//   );

//   // Handlers
//   const handleDestTagChange = (tag) => {
//     setSelectedDestTags(prev => prev.includes(tag)
//       ? prev.filter(t => t !== tag)
//       : [...prev, tag]
//     );
//   };
//   const handleExpTagChange = (tag) => {
//     setSelectedExpTags(prev => prev.includes(tag)
//       ? prev.filter(t => t !== tag)
//       : [...prev, tag]
//     );
//   };
//   const handleDestLocationChange = (e) => {
//     setSelectedDestLocation(e.target.value);
//     // TODO: API fetch logic will go here
//   };
//   const handleExpLocationChange = (e) => {
//     setSelectedExpLocation(e.target.value);
//     // TODO: API fetch logic will go here
//   };

//   return (
//     <div>
//       <Navbar />
//       <Banner />
//       {/* Destinations Filters */}
//       <FilterBar
//         tags={getAllTags(famousDestinations)}
//         selectedTags={selectedDestTags}
//         onChange={handleDestTagChange}
//       />
//       <div style={{ margin: '1rem 0' }}>
//         <label><strong>Filter by location:</strong> </label>
//         <select value={selectedDestLocation} onChange={handleDestLocationChange}>
//           <option value="">All</option>
//           {getAllLocations(famousDestinations).map(loc => (
//             <option key={loc} value={loc}>{loc}</option>
//           ))}
//         </select>
//       </div>
//       <CardSection
//         heading="Famous Destinations"
//         endpoint="destinations"
//         initialData={filteredDestinations}
//       />
//       {/* Experiences Filters */}
//       <FilterBar
//         tags={getAllTags(famousExperiences)}
//         selectedTags={selectedExpTags}
//         onChange={handleExpTagChange}
//       />
//       <div style={{ margin: '1rem 0' }}>
//         <label><strong>Filter by location:</strong> </label>
//         <select value={selectedExpLocation} onChange={handleExpLocationChange}>
//           <option value="">All</option>
//           {getAllLocations(famousExperiences).map(loc => (
//             <option key={loc} value={loc}>{loc}</option>
//           ))}
//         </select>
//       </div>
//       <CardSection
//         heading="Experiences in India"
//         endpoint="experiences"
//         initialData={filteredExperiences}
//       />
//       <BookingOptions />
//       <ChatBot />
//       <Footer />
//     </div>
//   );
// }

// export default App;
    
// );


import React, { useState, useEffect } from 'react';
import Navbar from './components/Navigationbar';
import { useRef } from 'react';
import Banner from './components/Banner';
import CardSection from './components/CardSection';
import BookingOptions from './components/BookingOption';
import Footer from './components/Footer';
import { famousDestinations, famousExperiences } from './famousData';
import FilterBar from './components/FilterBar';
import Chatbot from './components/Chatbot';

function getAllTags(data) {
  const tagSet = new Set();
  data.forEach(item => item.tags.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}

// function getAllLocations(data) {
//   const locSet = new Set();
//   data.forEach(item => locSet.add(item.location));
//   return Array.from(locSet).sort();
// }

function App() {
  // Section refs for scrolling
  const destSectionRef = useRef(null);
  const expSectionRef = useRef(null);
  const planSectionRef = useRef(null);

  // Destinations filter state
  const [selectedDestTags, setSelectedDestTags] = useState([]);
  const [selectedDestLocation, setSelectedDestLocation] = useState('');
  const [destApiData, setDestApiData] = useState(null);
  // Experiences filter state
  const [selectedExpTags, setSelectedExpTags] = useState([]);
  const [selectedExpLocation, setSelectedExpLocation] = useState('');


  // Fetch destinations from API when location changes
  useEffect(() => {
    if (selectedDestLocation) {
      const city = selectedDestLocation.split(',')[0].trim();
      fetch(`/api/destinations?city=${encodeURIComponent(city)}`)
        .then(res => res.json())
        .then(data => setDestApiData(Array.isArray(data) ? data : []))
        .catch(() => setDestApiData([]));
    } else {
      setDestApiData(null);
    }
  }, [selectedDestLocation]);

  // Filtering logic (case-insensitive, robust)
  const filteredDestinations = (destApiData || famousDestinations).filter(item => {
    const locationMatch = !selectedDestLocation ||
      (item.location && item.location.toLowerCase() === selectedDestLocation.toLowerCase()) ||
      (item.address && (
        (item.address.state && item.address.state.toLowerCase() === selectedDestLocation.toLowerCase()) ||
        (item.address.city && item.address.city.toLowerCase() === selectedDestLocation.toLowerCase())
      ));
    const tagMatch = selectedDestTags.length === 0 || (Array.isArray(item.tags) && selectedDestTags.every(tag => item.tags.includes(tag)));
    return locationMatch && tagMatch;
  });

  const filteredExperiences = famousExperiences.filter(item => {
    const locationMatch = !selectedExpLocation ||
      (item.location && item.location.toLowerCase() === selectedExpLocation.toLowerCase());
    const tagMatch = selectedExpTags.length === 0 || (Array.isArray(item.tags) && selectedExpTags.every(tag => item.tags.includes(tag)));
    return locationMatch && tagMatch;
  });

  // Handlers
  const handleDestTagChange = (tag) => {
    setSelectedDestTags(prev => prev.includes(tag)
      ? prev.filter(t => t !== tag)
      : [...prev, tag]
    );
  };
  const handleExpTagChange = (tag) => {
    setSelectedExpTags(prev => prev.includes(tag)
      ? prev.filter(t => t !== tag)
      : [...prev, tag]
    );
  };
  // const handleDestLocationChange = (e) => {
  //   setSelectedDestLocation(e.target.value);
  // };
  // const handleExpLocationChange = (e) => {
  //   setSelectedExpLocation(e.target.value);
  //   // TODO: API fetch logic will go here
  // };

  // Scroll handler for navbar
  const handleNavScroll = (section) => {
    if (section === 'destinations' && destSectionRef.current) destSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    if (section === 'experiences' && expSectionRef.current) expSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    if (section === 'plan' && planSectionRef.current) planSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <Navbar onNavScroll={handleNavScroll} />
      <Banner />
      {/* Destinations Filters */}
      <div ref={destSectionRef} />
      <FilterBar
        tags={getAllTags(famousDestinations)}
        selectedTags={selectedDestTags}
        onChange={handleDestTagChange}
      />
      {/* <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8"> */}
      <div className=''>
        <h2 className="text-3xl font-bold mb-4 text-left border-l-4 border-blue-500 pl-3">Famous Destinations</h2>
        <CardSection
          heading=""
          endpoint="destinations"
          initialData={filteredDestinations}
          selectedTags={selectedDestTags}
        />
      </div>
      {/* Experiences Filters */}
      <div ref={expSectionRef} />
      <FilterBar
        tags={getAllTags(famousExperiences)}
        selectedTags={selectedExpTags}
        onChange={handleExpTagChange}
      />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 mt-12">
        <h2 className="text-3xl font-bold mb-4 text-left border-l-4 border-green-500 pl-3">Experiences in India</h2>
        <CardSection
          heading=""
          endpoint="experiences"
          initialData={filteredExperiences}
          selectedTags={selectedExpTags}
        />
      </div>
      <div ref={planSectionRef} />
      <BookingOptions />
  <Chatbot />
  <Footer />
    </div>
  );
}

export default App;