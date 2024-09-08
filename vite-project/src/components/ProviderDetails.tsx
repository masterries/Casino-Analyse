import React, { useContext, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { GameDataContext, FilterContext } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GameFilters from './GameFilters';
import { useGameFilters } from '../hooks/useGameFilters';

const ProviderDetails: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const location = useLocation();
  const games = useContext(GameDataContext);
  const { filterState, setFilterState } = useContext(FilterContext);

  const providerGames = games.filter(game => game.provider.name === name);
  const filteredGames = useGameFilters(providerGames);

  // Initialize with the filter state from the dashboard if available
  useEffect(() => {
    if (location.state && location.state.filterState) {
      setFilterState(location.state.filterState);
    }
  }, [location.state, setFilterState]);

  const allTags = Array.from(new Set(providerGames.flatMap(game => game.tags.map(tag => tag.name))));
  const features = ['hasJackpot', 'isHd', 'hasFreespins', 'isWageringBonusAllowed'];

  const avgRTP = filteredGames.length > 0
    ? filteredGames.reduce((sum, game) => sum + (game.attributes.rtp || 0), 0) / filteredGames.length
    : 0;

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <Link to="/dashboard" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">&larr; Back to Dashboard</Link>
      <h1 className="text-4xl font-bold mb-6">{name} Provider Details</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Total Games</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold">{filteredGames.length}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Average RTP</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold">{avgRTP.toFixed(2)}%</p>
          </CardContent>
        </Card>
      </div>

      <GameFilters 
        allTags={allTags}
        selectedTags={filterState.selectedTags || []}
        setSelectedTags={(tags) => setFilterState({...filterState, selectedTags: tags})}
        features={features}
        selectedFeatures={filterState.selectedFeatures || []}
        setSelectedFeatures={(features) => setFilterState({...filterState, selectedFeatures: features})}
        sortOption={filterState.sortOption || 'default'}
        setSortOption={(option) => setFilterState({...filterState, sortOption: option})}
      />

      <Card className="bg-gray-800 text-white mt-6">
        <CardHeader>
          <CardTitle className="text-2xl">Games List ({filteredGames.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGames.map(game => (
              <Link 
                key={game.slug} 
                to={`/game/${game.slug}`} 
                className="block p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                <img src={game.thumbnail} alt={game.name} className="w-full h-32 object-cover rounded-md mb-2" />
                <h3 className="text-lg font-semibold">{game.name}</h3>
                <p className="text-sm text-gray-300">RTP: {game.attributes.rtp || 'N/A'}%</p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderDetails;