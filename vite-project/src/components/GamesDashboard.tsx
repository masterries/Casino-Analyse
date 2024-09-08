import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GameFilters from './GameFilters';
import { GameDataContext, FilterContext } from '../App';
import { useGameFilters } from '../hooks/useGameFilters';

const GamesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const games = useContext(GameDataContext);
  const { filterState, setFilterState } = useContext(FilterContext);
  const filteredGames = useGameFilters(games);
  const [visibleGames, setVisibleGames] = useState(filteredGames.slice(0, 9));
  const [visibleCount, setVisibleCount] = useState(9);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleGames(filteredGames.slice(0, visibleCount));
  }, [filteredGames, visibleCount]);


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

  const providerData = Object.entries(
    filteredGames.reduce((acc, game) => {
      if (!acc[game.provider.name]) {
        acc[game.provider.name] = { count: 0, totalRTP: 0 };
      }
      acc[game.provider.name].count += 1;
      acc[game.provider.name].totalRTP += game.attributes.rtp || 0;
      return acc;
    }, {} as Record<string, { count: number; totalRTP: number }>)
  )
    .map(([name, { count, totalRTP }]) => ({ 
      name, 
      averageRTP: totalRTP / count,
      count 
    }))
    .sort((a, b) => b.averageRTP - a.averageRTP)
    .slice(0, 5);

  const categoryData = Object.entries(
    filteredGames.reduce((acc, game) => {
      acc[game.category.name] = (acc[game.category.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const gamesWithValidRTP = filteredGames.filter(game => game.attributes.rtp && game.attributes.rtp > 0);
  const avgRTP = gamesWithValidRTP.reduce((sum, game) => sum + (game.attributes.rtp || 0), 0) / gamesWithValidRTP.length;

  const volatilityCounts = filteredGames.reduce((acc, game) => {
    if (game.attributes.volatility) {
      acc[game.attributes.volatility] = (acc[game.attributes.volatility] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const handleProviderClick = (data: any) => {
    navigate(`/provider/${encodeURIComponent(data.name)}`, { state: { filterState } });
  };

  const allTags = Array.from(new Set(games.flatMap(game => game.tags.map(tag => tag.name))));
  const features = ['hasJackpot', 'isHd', 'hasFreespins', 'isWageringBonusAllowed'];

  return (
    <div ref={dashboardRef} className="bg-gray-900 text-white min-h-screen overflow-y-scroll">
      <div className="p-4">
        <h1 className="text-4xl font-bold mb-6">Games Analytics Dashboard</h1>

        <GameFilters 
  allTags={allTags}
  selectedTags={filterState.selectedTags || []}
  setSelectedTags={(tags) => setFilterState({...filterState, selectedTags: tags})}
  features={features}
  selectedFeatures={filterState.selectedFeatures || []}
  setSelectedFeatures={(features) => setFilterState({...filterState, selectedFeatures: features})}
  sortOption={filterState.sortOption || ''}
  setSortOption={(option) => setFilterState({...filterState, sortOption: option})}
/>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 text-white p-4 rounded">
            <h2 className="text-2xl font-bold mb-2">Total Games</h2>
            <p className="text-5xl font-bold">{filteredGames.length}</p>
          </div>
          
          <div className="bg-gray-800 text-white p-4 rounded">
            <h2 className="text-2xl font-bold mb-2">Average RTP</h2>
            <p className="text-5xl font-bold">{avgRTP.toFixed(2)}%</p>
          </div>
          
          <div className="bg-gray-800 text-white p-4 rounded col-span-1 lg:col-span-2">
            <h2 className="text-2xl font-bold mb-2">Top Providers by Average RTP</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={providerData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                  <XAxis dataKey="name" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#333', color: '#fff' }}
                    formatter={(value, name) => [Number(value).toFixed(2) + '%', name === 'averageRTP' ? 'Average RTP' : 'Game Count']}
                  />
                  <Bar dataKey="averageRTP" fill="#8884d8" onClick={handleProviderClick} cursor="pointer" />
                  <Bar dataKey="count" fill="#82ca9d" onClick={handleProviderClick} cursor="pointer" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-gray-800 text-white p-4 rounded">
            <h2 className="text-2xl font-bold mb-2">Game Categories</h2>
            <div className="h-80">
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
            </div>
          </div>
          
          <div className="bg-gray-800 text-white p-4 rounded">
            <h2 className="text-2xl font-bold mb-2">Volatility Distribution</h2>
            {Object.entries(volatilityCounts).map(([volatility, count]) => (
              <div key={volatility} className="flex justify-between items-center mb-2">
                <span className="capitalize text-lg">{volatility}</span>
                <span className="font-bold text-lg">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleGames.map(game => (
            <Card key={game.slug} className="bg-gray-800 text-white">
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamesDashboard;