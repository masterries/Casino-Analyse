import React, { useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GameDataContext } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RTPWagerCalculator from './RTPWagerCalculator';

const GameDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const games = useContext(GameDataContext);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);

  const game = games.find(g => g.slug === slug);

  if (!game) {
    return <div className="text-white">Game not found</div>;
  }

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      {/* Back Link */}
      <Link to={`/provider/${game.provider.name}`} className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
        &larr; Back to {game.provider.name} Games
      </Link>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Game Thumbnail */}
        <div className="md:w-1/3">
          <img src={game.thumbnail} alt={game.name} className="w-full rounded-lg shadow-lg" />
        </div>

        {/* Game Information */}
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-4">{game.name}</h1>
          <p className="text-xl mb-4">Provider: {game.provider.name}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* RTP Card */}
            <Card className="bg-gray-800 text-white cursor-pointer" onClick={() => setShowCalculator(true)}>
              <CardHeader>
                <CardTitle>RTP (Return to Player)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{game.attributes.rtp}%</p>
                <p className="text-sm text-gray-400">Higher is better for players</p>
              </CardContent>
            </Card>

            {/* Max Multiplier Card */}
            <Card className="bg-gray-800 text-white">
              <CardHeader>
                <CardTitle>Max Multiplier</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{game.attributes.multiplier}x</p>
                <p className="text-sm text-gray-400">Maximum potential win multiplier</p>
              </CardContent>
            </Card>
          </div>

          {/* Game Features Card */}
          <Card className="bg-gray-800 text-white mb-6">
            <CardHeader>
              <CardTitle>Game Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside">
                <li>Category: {game.category.name}</li>
                {game.attributes.isHd && <li>HD Graphics</li>}
                {game.attributes.hasJackpot && <li>Jackpot Available</li>}
                {game.attributes.hasFreespins && <li>Free Spins Feature</li>}
                {game.attributes.volatility && <li>Volatility: {game.attributes.volatility}</li>}
                {game.attributes.lines && <li>Paylines: {game.attributes.lines}</li>}
                {game.isNew && <li>New Release</li>}
                {game.isWageringBonusAllowed && <li>Eligible for Wagering Bonus</li>}
              </ul>
            </CardContent>
          </Card>

          {/* Tags Section */}
          {game.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {game.tags.map(tag => (
                  <span key={tag.slug} className="px-3 py-1 bg-blue-600 rounded-full text-sm text-white">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Game Strategy Card */}
          <Card className="bg-gray-800 text-white">
            <CardHeader>
              <CardTitle>Game Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {game.name} offers an RTP of {game.attributes.rtp}%, which is considered{' '}
                {(game.attributes.rtp ?? 0) > 96 ? 'above average' : 'average'} for online casino games.
                With a maximum multiplier of {game.attributes.multiplier}x, there's potential for significant wins.
              </p>
              <p className="mt-2">
                {game.attributes.volatility 
                  ? `This game has ${game.attributes.volatility} volatility, meaning ${
                      game.attributes.volatility === 'high' ? 'less frequent but potentially larger wins' : 'more frequent but typically smaller wins'
                    }.`
                  : 'The volatility of this game is not specified, so be prepared for varying win frequencies and sizes.'}
              </p>
              <p className="mt-2">
                Remember to set a budget and stick to it. Enjoy the game responsibly!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {showCalculator && (
        <RTPWagerCalculator
          rtp={game.attributes.rtp ?? 0}
          onClose={() => setShowCalculator(false)}
        />
      )}
    </div>
  );
};

export default GameDetails;
