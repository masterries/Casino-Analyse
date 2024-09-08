import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GameFilters from './GameFilters'; // Make sure the path is correct

export interface Game {
  slug: string;
  name: string;
  provider: { name: string; thumbnail: string };
  category: { name: string };
  isWageringBonusAllowed: boolean;
  attributes: {
    hasJackpot: boolean | null;
    isHd: boolean | null;
    hasFreespins: boolean | null;
    rtp: number | null;
  };
  tags: Array<{ slug: string; name: string }>;
}

const GamesDashboard: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>('');
  const [visibleGames, setVisibleGames] = useState<Game[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(9);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/masterries/Casino-Analyse/main/data/gamesData.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setGames(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching game data:', error);
        setError('Failed to load game data. Please try again later.');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let filteredGames = games.filter(game => {
      const tagMatch = selectedTags.length === 0 || game.tags.some(tag => selectedTags.includes(tag.name));
      const featureMatch = selectedFeatures.length === 0 || selectedFeatures.every(feature => {
        if (feature === 'isWageringBonusAllowed') return game.isWageringBonusAllowed;
        return game.attributes[feature as keyof typeof game.attributes] === true;
      });
      return tagMatch && featureMatch;
    });

    // Apply sorting
    if (sortOption) {
      filteredGames.sort((a, b) => {
        switch (sortOption) {
          case 'rtp':
            return (b.attributes.rtp || 0) - (a.attributes.rtp || 0);
          case 'name':
            return a.name.localeCompare(b.name);
          case 'provider':
            return a.provider.name.localeCompare(b.provider.name);
          default:
            return 0;
        }
      });
    }

    setVisibleGames(filteredGames.slice(0, visibleCount));
  }, [games, selectedTags, selectedFeatures, sortOption, visibleCount]);

  const loadMoreGames = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
      setVisibleCount(prevCount => prevCount + 9);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', loadMoreGames);
    return () => window.removeEventListener('scroll', loadMoreGames);
  }, [loadMoreGames]);

  useEffect(() => {
    if (dashboardRef.current) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      dashboardRef.current.style.paddingRight = `${scrollbarWidth}px`;
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const allTags = Array.from(new Set(games.flatMap(game => game.tags.map(tag => tag.name))));
  const features = ['hasJackpot', 'isHd', 'hasFreespins', 'isWageringBonusAllowed'];

  return (
    <div ref={dashboardRef} className="bg-gray-900 text-white min-h-screen overflow-y-scroll">
      <div className="p-4">
        <h1 className="text-4xl font-bold mb-6">Full Game List</h1>

        <GameFilters 
          allTags={allTags}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          features={features}
          selectedFeatures={selectedFeatures}
          setSelectedFeatures={setSelectedFeatures}
          setSortOption={setSortOption}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleGames.length > 0 ? (
            visibleGames.map(game => (
              <Link key={game.slug} to={`/game/${game.slug}`} className="block">
                <Card className="bg-gray-800 text-white">
                  <CardHeader>
                    <CardTitle className="text-xl">{game.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img src={game.provider.thumbnail} alt={game.name} className="mb-2 rounded" />
                    <p className="text-sm">Provider: {game.provider.name}</p>
                    <p className="text-sm">Category: {game.category.name}</p>
                    <p className="text-sm">RTP: {game.attributes.rtp || 'N/A'}%</p>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div>No games match the selected filters.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamesDashboard;