import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Game {
  name: string;
  provider: { name: string };
  category: { name: string };
  attributes: {
    rtp: number | null;
    volatility: string | null;
  };
  tags: { name: string }[];
}

const GamesDashboard: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    fetch('/data/gamesData.json')
      .then(response => response.json())
      .then(data => setGames(data));
  }, []);

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

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Games Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Games</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{games.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Average RTP</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{avgRTP.toFixed(2)}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={providerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Game Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
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
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Volatility Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(volatilityCounts).map(([volatility, count]) => (
              <div key={volatility} className="flex justify-between items-center mb-2">
                <span className="capitalize">{volatility}</span>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GamesDashboard;