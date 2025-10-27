
import React, { useEffect, useState, useRef } from 'react';
import { fetchDestinations, fetchExperiences } from '../../api';
import Card from './Card';

const DEFAULT_CITY = 'Delhi'; // You can make this dynamic or prop-based


const CardSection = ({ heading, endpoint, initialData = [], searchQuery = '', filterPlace = '', filterInterest = '', selectedTags = [] }) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch from API only if searching or filtering


// Only set initialData on first mount
const isFirstRender = useRef(true);
useEffect(() => {
  if (isFirstRender.current) {
    setData(initialData);
    isFirstRender.current = false;
  }
  // eslint-disable-next-line
}, []);

// Fetch from API if searching or filtering
useEffect(() => {
  if (!searchQuery && !filterPlace && !filterInterest) return;
  setLoading(true);
  setError("");
  const fetchData = async () => {
    try {
      let result = [];
      if (endpoint === 'destinations') {
        result = await fetchDestinations({ city: filterPlace || searchQuery || DEFAULT_CITY });
      } else if (endpoint === 'experiences') {
        result = await fetchExperiences({ city: filterPlace || searchQuery || DEFAULT_CITY });
      }
      // Optionally filter by interest if needed
      if (filterInterest) {
        result = result.filter(item =>
          (item.kinds || '').toLowerCase().includes(filterInterest.toLowerCase())
        );
      }
      setData(result);
    } catch (err) {
      setError('Failed to fetch data');
    }
    setLoading(false);
  };
  fetchData();
}, [endpoint, searchQuery, filterPlace, filterInterest]);

  // Filter data by selected tags (all tags must be present in item.tags)
  const filteredData = Array.isArray(data) && selectedTags.length > 0
    ? data.filter(item =>
        Array.isArray(item.tags) && selectedTags.every(tag => item.tags.includes(tag))
      )
    : data;

  return (
    <section className="px-2 py-6 sm:px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{heading}</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex flex-wrap justify-center gap-6">
        {Array.isArray(filteredData) && filteredData.length > 0 ? (
          filteredData.map((item, idx) => (
            <Card
              key={idx}
              title={item.name}
              image={item.image}
              description={item.description}
            />
          ))
        ) : !loading && (
          <div className="text-gray-500">No data found.</div>
        )}
      </div>
    </section>
  );
};

export default CardSection;
