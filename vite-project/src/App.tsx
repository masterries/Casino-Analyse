import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavMenu from './components/NavMenu';
import LandingPage from './components/LandingPage';
import GamesDashboard from './components/GamesDashboard';
import ProviderDetails from './components/ProviderDetails';
import GameDetails from './components/GameDetails';

interface Game {
  slug: string;
  name: string;
  externalId: string | null;
  provider: {
    slug: string;
    name: string;
    order: number;
    visibility: number;
    isNew: boolean;
    thumbnail: string;
  };
  category: {
    slug: string;
    name: string;
    visibility: number;
  };
  hasDemo: boolean | null;
  isWageringBonusAllowed: boolean;
  isAvailableInCountry: boolean;
  thumbnail: string;
  isEnabled: boolean;
  isFavorite: boolean;
  isNew: boolean;
  isSystem: boolean;
  attributes: {
    hasJackpot: boolean | null;
    isHd: boolean | null;
    volatility: string | null;
    devices: string[] | null;
    hasFreespins: boolean | null;
    rtp: number | null;
    lines: number | null;
    multiplier: number | null;
    isNew: boolean;
    isSystem: boolean;
    customUrl: string | null;
    type: string | null;
  };
  tags: Array<{
    slug: string;
    name: string;
    order: number;
    image: string | null;
  }>;
}

export const GameDataContext = createContext<Game[]>([]);

const App: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/masterries/Casino-Analyse/main/data/gamesData.json');
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error('Error fetching game data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router basename="/Casino-Analyse">
      <GameDataContext.Provider value={games}>
        <div className="flex flex-col min-h-screen bg-gray-900">
          <NavMenu />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<GamesDashboard />} />
              <Route path="/provider/:name" element={<ProviderDetails />} />
              <Route path="/game/:slug" element={<GameDetails />} />
              {/* Add more routes for categories and other pages */}
            </Routes>
          </main>
        </div>
      </GameDataContext.Provider>
    </Router>
  );
};

export default App;