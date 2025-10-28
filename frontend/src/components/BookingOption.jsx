
import React, { useState } from 'react';
import config from '../config';

const BookingOptions = () => {
  // State for flight booking
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [flightResults, setFlightResults] = useState([]);
  const [flightLoading, setFlightLoading] = useState(false);
  const [flightError, setFlightError] = useState("");

  // State for hotel booking
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [hotelResults, setHotelResults] = useState([]);
  const [hotelLoading, setHotelLoading] = useState(false);
  const [hotelError, setHotelError] = useState("");

  const handleFlightSearch = async () => {
    if (!from || !to) {
      setFlightError("Please enter both origin and destination");
      return;
    }

    setFlightLoading(true);
    setFlightError("");
    setFlightResults([]);
    
    try {
      const searchDate = new Date().toISOString().split('T')[0];  // Today's date
      console.log(`Searching flights from ${from} to ${to} on ${searchDate}`);
      
      const res = await fetch(`${config.apiUrl}/api/flights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          from: from.trim(), 
          to: to.trim(),
          date: searchDate
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        const errorData = data;
        if (errorData.suggestions) {
          setFlightError(
            <div>
              <p>{errorData.error}</p>
              <p className="mt-2">Available cities:</p>
              <ul className="list-disc ml-4 mt-1">
                {errorData.suggestions.map((city, idx) => (
                  <li key={idx} className="capitalize">{city}</li>
                ))}
              </ul>
            </div>
          );
        } else {
          throw new Error(data.error || "Failed to fetch flights");
        }
        return;
      }
      
      if (Array.isArray(data) && data.length > 0) {
        setFlightResults(data);
      } else {
        setFlightError("No flights found for the selected route and date");
      }
    } catch (error) {
      console.error("Flight search error:", error);
      setFlightError(error.message || "Failed to search flights. Please try again.");
    } finally {
      setFlightLoading(false);
    }
  };

  const handleHotelSearch = async () => {
    if (!destination) {
      setHotelError("Please enter a destination city");
      return;
    }

    if (!date) {
      setHotelError("Please select a check-in date");
      return;
    }

    setHotelLoading(true);
    setHotelError("");
    setHotelResults([]);
    
    try {
      console.log(`Searching hotels in ${destination} for ${date}`);
      const res = await fetch(`${config.apiUrl}/api/hotels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          destination: destination.trim().toUpperCase(), 
          date: date,
          adults: 1 // Default to 1 adult
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (data.suggestions) {
          setHotelError(
            <div>
              <p>{data.error}</p>
              <p className="mt-2">Try these cities:</p>
              <ul className="list-disc ml-4 mt-1">
                {data.suggestions.map((city, idx) => (
                  <li key={idx} className="capitalize">{city}</li>
                ))}
              </ul>
            </div>
          );
        } else {
          throw new Error(data.error || "Failed to fetch hotels");
        }
        return;
      }
      
      if (Array.isArray(data) && data.length > 0) {
        setHotelResults(data);
      } else {
        setHotelError(`No hotels available in ${destination} for the selected date`);
      }
    } catch (error) {
      console.error("Hotel search error:", error);
      setHotelError(error.message || "Failed to search hotels. Please try again.");
    } finally {
      setHotelLoading(false);
    }
  };

  return (
    <section className="bg-blue-50 p-6">
      <h2 className="text-2xl font-bold mb-4">Plan Your Travel</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Flight Booking */}
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">Flight Booking</h3>
          <div className="mb-2">
            <input
              type="text"
              placeholder="From City or Airport (e.g. Mumbai or BOM)"
              className="border p-2 w-full"
              value={from}
              onChange={e => setFrom(e.target.value)}
            />
            <div className="text-xs text-gray-500 mt-1">
              Enter city name or 3-letter airport code
            </div>
          </div>
          <div className="mb-2">
            <input
              type="text"
              placeholder="To City or Airport (e.g. Delhi or DEL)"
              className="border p-2 w-full"
              value={to}
              onChange={e => setTo(e.target.value)}
            />
            <div className="text-xs text-gray-500 mt-1">
              Enter city name or 3-letter airport code
            </div>
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleFlightSearch}
            disabled={flightLoading}
          >
            {flightLoading ? "Searching..." : "Search Flights"}
          </button>
          {flightError && <div className="text-red-500 mt-2">{flightError}</div>}
          {flightResults.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Results:</h4>
              <ul className="space-y-2">
                {flightResults.map((flight, idx) => (
                  <li key={idx} className="border p-2 rounded hover:bg-blue-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-lg">{flight.airline} {flight.flightNumber}</div>
                        <div className="text-md">{flight.from} → {flight.to}</div>
                        <div className="text-sm text-gray-600">Duration: {flight.duration}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-green-600">₹{Number(flight.price.INR).toLocaleString('en-IN')}</div>
                        <div className="text-sm text-gray-600">€{Number(flight.price.EUR).toLocaleString('en-EU')}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600 grid grid-cols-2 gap-2">
                      <div>Departure: {new Date(flight.departure).toLocaleString('en-IN')}</div>
                      <div>Arrival: {new Date(flight.arrival).toLocaleString('en-IN')}</div>
                      {flight.aircraft !== 'N/A' && <div>Aircraft: {flight.aircraft}</div>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Hotel Booking */}
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">Hotel Booking</h3>
          <div className="mb-2">
            <input
              type="text"
              placeholder="Enter city name (e.g. Mumbai, Delhi, Bangalore)"
              className="border p-2 w-full"
              value={destination}
              onChange={e => setDestination(e.target.value)}
            />
            <div className="text-xs text-gray-500 mt-1">
              You can enter any major Indian city name
            </div>
          </div>
          <div className="mb-2">
            <input
              type="date"
              className="border p-2 w-full"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
            <div className="text-xs text-gray-500 mt-1">
              Select your check-in date
            </div>
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleHotelSearch}
            disabled={hotelLoading}
          >
            {hotelLoading ? "Searching..." : "Search Hotels"}
          </button>
          {hotelError && <div className="text-red-500 mt-2">{hotelError}</div>}
          {hotelResults.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Results:</h4>
              <ul className="space-y-2">
                {hotelResults.map((hotel, idx) => (
                  <li key={idx} className="border p-2 rounded hover:bg-blue-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-lg">{hotel.name}</div>
                        {hotel.rating !== 'N/A' && (
                          <div className="text-sm text-gray-600">
                            Rating: {hotel.rating} ★
                          </div>
                        )}
                        <div className="text-gray-700 mt-1">{hotel.address}</div>
                      </div>
                      <div className="text-right">
                        {hotel.offers && hotel.offers.length > 0 ? (
                          <>
                            <div className="font-bold text-lg text-green-600">
                              ₹{Number(hotel.offers[0].price.inr.amount).toLocaleString('en-IN')}
                            </div>
                            <div className="text-sm text-gray-600">
                              {hotel.offers[0].price.original.currency} {Number(hotel.offers[0].price.original.amount).toLocaleString('en-EU')}
                            </div>
                            <div className="text-sm font-medium text-gray-800 mt-2">
                              {hotel.offers[0].room.type}
                            </div>
                            {hotel.offers[0].room.bedType && (
                              <div className="text-xs text-gray-600">
                                {hotel.offers[0].room.bedType}
                              </div>
                            )}
                            {hotel.offers[0].room.description && (
                              <div className="text-xs text-gray-500 mt-1">
                                {hotel.offers[0].room.description.length > 80 
                                  ? hotel.offers[0].room.description.substring(0, 80) + '...'
                                  : hotel.offers[0].room.description}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-gray-500">No offers available</div>
                        )}
                      </div>
                    </div>
                    {hotel.offers && hotel.offers.length > 1 && (
                      <div className="mt-2 text-sm text-blue-600">
                        +{hotel.offers.length - 1} more room types available
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingOptions;