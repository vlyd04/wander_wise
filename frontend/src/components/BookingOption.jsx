import React from 'react';

const BookingOptions = () => {
  return (
    <section className="bg-blue-50 p-6">
      <h2 className="text-2xl font-bold mb-4">Plan Your Travel</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">Flight Booking</h3>
          <input type="text" placeholder="From" className="border p-2 w-full mb-2" />
          <input type="text" placeholder="To" className="border p-2 w-full mb-2" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Search Flights</button>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">Hotel Booking</h3>
          <input type="text" placeholder="Destination" className="border p-2 w-full mb-2" />
          <input type="date" className="border p-2 w-full mb-2" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Search Hotels</button>
        </div>
      </div>
    </section>
  );
};

export default BookingOptions;