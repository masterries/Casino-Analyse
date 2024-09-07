import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [visibleGames, setVisibleGames] = useState<Game[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(9); // Initially load 9 games

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
    setVisibleGames(games.slice(0, visibleCount)); // Update the visible games based on scroll
  }, [games, visibleCount]);

  // Infinite scroll logic
  const loadMoreGames = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
      setVisibleCount(prevCount => prevCount + 9); // Load 9 more games
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', loadMoreGames);
    return () => window.removeEventListener('scroll', loadMoreGames);
  }, [loadMoreGames]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Unique tags and features for filtering
  const allTags = Array.from(new Set(games.flatMap(game => game.tags.map(tag => tag.name))));
  const features = ['hasJackpot', 'isHd', 'hasFreespins', 'isWageringBonusAllowed'];

  // Filtered games

  const handleTagChange = (tag: string) => {
    setSelectedTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]));
  };

  const handleFeatureChange = (feature: string) => {
    setSelectedFeatures(prev => (prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]));
  };

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Games Analytics Dashboard</h1>

      {/* Filters */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Filter by Tags</h2>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagChange(tag)}
              className={`px-3 py-1 rounded-full ${selectedTags.includes(tag) ? 'bg-blue-600' : 'bg-gray-700'} text-sm`}
            >
              {tag}
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-semibold mt-4">Filter by Features</h2>
        <div className="flex flex-wrap gap-2">
          {features.map(feature => (
            <button
              key={feature}
              onClick={() => handleFeatureChange(feature)}
              className={`px-3 py-1 rounded-full ${selectedFeatures.includes(feature) ? 'bg-blue-600' : 'bg-gray-700'} text-sm`}
            >
              {feature}
            </button>
          ))}
        </div>
      </div>

      {/* Filtered Games List with Infinite Scroll and Linking */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleGames.length > 0 ? (
          visibleGames.map(game => (
            <Link key={game.slug} to={`/game/${game.slug}`} className="block"> {/* Add Link to the game details page */}
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
  );
};

export default GamesDashboard;
