import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-[#0f172a] text-white flex flex-col min-h-screen">
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center px-4 max-w-4xl">
          <h1 className="text-6xl font-bold mb-6">Casino Slots RTP Dashboard</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Unlock the secrets of casino slot machine return-to-player (RTP) rates. Explore
            top-performing slots and game categories to maximize your winnings.
          </p>
          <Link 
            to="/dashboard" 
            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Explore RTP Data
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;