import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export interface Game {
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

const GamesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const providerData = Object.entries(
    games.reduce((acc, game) => {
      acc[game.provider.name] = (acc[game.provider.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const categoryData = Object.entries(
    games.reduce((acc, game) => {
      acc[game.category.name] = (acc[game.category.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const avgRTP = games.reduce((sum, game) => sum + (game.attributes.rtp || 0), 0) / games.length;

  const volatilityCounts = games.reduce((acc, game) => {
    if (game.attributes.volatility) {
      acc[game.attributes.volatility] = (acc[game.attributes.volatility] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const handleProviderClick = (data: any) => {
    navigate(`/provider/${encodeURIComponent(data.name)}`);
  };

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Games Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Total Games</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold">{games.length}</p>
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
        
        <Card className="bg-gray-800 text-white col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">Top Providers</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={providerData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff' }} />
                <Bar dataKey="value" fill="#8884d8" onClick={handleProviderClick} cursor="pointer" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Game Categories</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Volatility Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(volatilityCounts).map(([volatility, count]) => (
              <div key={volatility} className="flex justify-between items-center mb-2">
                <span className="capitalize text-lg">{volatility}</span>
                <span className="font-bold text-lg">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GamesDashboard;