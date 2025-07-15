import React from 'react';
import Navbar from './components/Navigationbar';
import Banner from './components/Banner';
import CardSection from './components/CardSection';
import BookingOptions from './components/BookingOption';
import Footer from './components/Footer';
import ChatBot from './components/Chatbot';

function App() {
  return (
    <div>
      <Navbar />
      <Banner />
      <CardSection heading="Famous Destinations" endpoint="destinations" />
      <CardSection heading="Experiences in India" endpoint="experiences" />
      <BookingOptions />
      <ChatBot/>
      <Footer />
    </div>
  );
}

export default App;
