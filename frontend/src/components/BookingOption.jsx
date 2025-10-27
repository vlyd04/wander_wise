
import React, { useState } from 'react';

const BASE_URL = "http://localhost:5000";

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
    setFlightLoading(true);
    setFlightError("");
    setFlightResults([]);
    console.log("Flight search:", { from, to });
    try {
      const res = await fetch(`${BASE_URL}/api/flights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: from.trim().toUpperCase(), to: to.trim().toUpperCase() })
      });
      const data = await res.json();
      if (res.ok) {
        setFlightResults(data);
      } else {
        setFlightError(data.error || "Error fetching flights");
      }
    } catch (err) {
      setFlightError("Network error");
    }
    setFlightLoading(false);
  };

  const handleHotelSearch = async () => {
    setHotelLoading(true);
    setHotelError("");
    setHotelResults([]);
    try {
      const res = await fetch(`${BASE_URL}/api/hotels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, date })
      });
      const data = await res.json();
      if (res.ok) {
        setHotelResults(data);
      } else {
        setHotelError(data.error || "Error fetching hotels");
      }
    } catch (err) {
      setHotelError("Network error");
    }
    setHotelLoading(false);
  };

  return (
    <section className="bg-blue-50 p-6">
      <h2 className="text-2xl font-bold mb-4">Plan Your Travel</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Flight Booking */}
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">Flight Booking</h3>
          <input
            type="text"
            placeholder="From (IATA code, e.g. DEL)"
            className="border p-2 w-full mb-2"
            value={from}
            onChange={e => setFrom(e.target.value)}
          />
          <input
            type="text"
            placeholder="To (IATA code, e.g. BOM)"
            className="border p-2 w-full mb-2"
            value={to}
            onChange={e => setTo(e.target.value)}
          />
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
                {flightResults.map((f, idx) => (
                  <li key={idx} className="border p-2 rounded">
                    <div><b>{f.airline} {f.flightNumber}</b>: {f.from} → {f.to}</div>
                    <div>Departure: {f.departure}</div>
                    <div>Arrival: {f.arrival}</div>
                    <div>Price: ₹{f.price}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Hotel Booking */}
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">Hotel Booking</h3>
          <input
            type="text"
            placeholder="Destination (IATA code, e.g. DEL)"
            className="border p-2 w-full mb-2"
            value={destination}
            onChange={e => setDestination(e.target.value)}
          />
          <input
            type="date"
            className="border p-2 w-full mb-2"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
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
                {hotelResults.map((h, idx) => (
                  <li key={idx} className="border p-2 rounded">
                    <div><b>{h.name}</b> ({h.city})</div>
                    <div>Address: {h.address}</div>
                    <div>Offers: {h.offers.length}</div>
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