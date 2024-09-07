import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GameDataContext } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProviderDetails: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const games = useContext(GameDataContext);

  const providerGames = games.filter(game => game.provider.name === name);

  const avgRTP = providerGames.reduce((sum, game) => sum + (game.attributes.rtp || 0), 0) / providerGames.length;

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <Link to="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">&larr; Back to Dashboard</Link>
      <h1 className="text-4xl font-bold mb-6">{name} Provider Details</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Total Games</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold">{providerGames.length}</p>
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

      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Games List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providerGames.map(game => (
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