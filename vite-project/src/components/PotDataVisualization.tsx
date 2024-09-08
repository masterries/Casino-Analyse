import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChart, Line, Brush } from 'recharts';
import Plot from 'react-plotly.js'; // Add this line after creating custom types

interface Winner {
  username: string;
  contributionAmount: number;
  totalWon: number;
  betCount: number;
}

interface PotData {
  hash: string;
  status: string;
  startDate: number;
  finishDate: number;
  winners: WinnerData[];
  amount: string;
  rewards: {
    money: {
      amount: string;
      symbol: string;
      payAmount: string;
      paySymbol: string;
    }[];
  };
}

interface WinnerData {
  user: {
    username: string;
    avatar: string;
    xp: string;
    level: number;
    rank: string;
  };
  contributionAmount: string;
  totalWon: number;
}

const PotDataVisualization: React.FC = () => {
  const [topWinners, setTopWinners] = useState<Winner[]>([]);
  const [winningAmountsOverTime, setWinningAmountsOverTime] = useState<any[]>([]);
  const [betAmountByHour, setBetAmountByHour] = useState<any[]>([]);
  const [showOutliers, setShowOutliers] = useState(true); // State for the outlier toggle
  const [betRangeProbabilities, setBetRangeProbabilities] = useState<{ [key: string]: number }>({}); // State for bet range probabilities

  useEffect(() => {
    const fetchPotData = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/masterries/Casino-Analyse/main/data/potData.json'
        );
        const data = await response.json();
        processPotData(data);

        // Calculate bet range probabilities in relation to total bets
        const betRangeProbs = calculateBetRangeProbabilitiesInRelationToTotal(data);
        setBetRangeProbabilities(betRangeProbs);
      } catch (error) {
        console.error('Error fetching pot data:', error);
      }
    };

    fetchPotData();
  }, []);

  const processPotData = (data: PotData[]) => {
    const winnerMap: { [key: string]: { totalWon: number; contributionAmount: number; betCount: number } } = {};
    const winningAmounts: { date: string; amount: number }[] = [];
    const betAmountsHourly: { hour: number; betAmount: number; date: string }[] = [];

    data.forEach((pot) => {
      const date = new Date(pot.finishDate * 1000).toLocaleDateString();
      const hour = new Date(pot.finishDate * 1000).getHours();
      const amount = parseFloat(pot.amount);

      winningAmounts.push({ date, amount });

      pot.winners.forEach((winner) => {
        const contributionAmount = parseFloat(winner.contributionAmount);
        betAmountsHourly.push({ hour, betAmount: contributionAmount, date });

        const totalWon = pot.rewards.money.reduce((sum: number, reward) => {
          return reward.symbol === 'USD' ? sum + parseFloat(reward.amount) : sum;
        }, 0);

        if (winnerMap[winner.user.username]) {
          winnerMap[winner.user.username].contributionAmount += contributionAmount;
          winnerMap[winner.user.username].totalWon += totalWon;
          winnerMap[winner.user.username].betCount += 1;
        } else {
          winnerMap[winner.user.username] = {
            contributionAmount,
            totalWon,
            betCount: 1,
          };
        }
      });
    });

    const winnersArray = Object.keys(winnerMap).map((username) => ({
      username,
      contributionAmount: winnerMap[username].contributionAmount,
      totalWon: winnerMap[username].totalWon,
      betCount: winnerMap[username].betCount,
    }));

    winnersArray.sort((a, b) => b.totalWon - a.totalWon);

    setTopWinners(winnersArray.slice(0, 10));
    setWinningAmountsOverTime(winningAmounts);
    setBetAmountByHour(betAmountsHourly);
  };
  const calculateBetRangeProbabilitiesInRelationToTotal = (potData: PotData[]) => {
    const betRanges: { [key: string]: { totalBets: number; totalWins: number } } = {
        '0-5k': { totalBets: 0, totalWins: 0 },
        '5-10k': { totalBets: 0, totalWins: 0 },
        '10-20k': { totalBets: 0, totalWins: 0 },
        '20-30k': { totalBets: 0, totalWins: 0 },
        '30k+': { totalBets: 0, totalWins: 0 },
      };
  
    let totalBetsOverall = 0;  // Track total number of bets
  
    potData.forEach((pot) => {
      pot.winners.forEach((winner) => {
        const betAmount = parseFloat(winner.contributionAmount);  // Parse contributionAmount as a float
        const wonAmount = parseFloat(pot.amount);  // Get the amount won (use pot.amount if reward is USD)
  
        totalBetsOverall++;  // Increment total bets across all ranges
  
        console.log(`Processing Winner: ${winner.user.username}`);
        console.log(`Bet Amount: ${betAmount}, Won Amount: ${wonAmount}`);
  
        // Check bet amount and increment corresponding bet range counters
        if (betAmount <= 5000) {
          betRanges['0-5k'].totalBets++;
          if (wonAmount > 0) {
            betRanges['0-5k'].totalWins++;
            console.log(`Winner in 0-5k range: ${winner.user.username}`);
          }
        } else if (betAmount <= 10000) {
          betRanges['5-10k'].totalBets++;
          if (wonAmount > 0) {
            betRanges['5-10k'].totalWins++;
            console.log(`Winner in 5-10k range: ${winner.user.username}`);
          }
        } else if (betAmount <= 20000) {
          betRanges['10-20k'].totalBets++;
          if (wonAmount > 0) {
            betRanges['10-20k'].totalWins++;
            console.log(`Winner in 10-20k range: ${winner.user.username}`);
          }
        } else if (betAmount <= 30000) {
          betRanges['20-30k'].totalBets++;
          if (wonAmount > 0) {
            betRanges['20-30k'].totalWins++;
            console.log(`Winner in 20-30k range: ${winner.user.username}`);
          }
        } else {
          betRanges['30k+'].totalBets++;
          if (wonAmount > 0) {
            betRanges['30k+'].totalWins++;
            console.log(`Winner in 30k+ range: ${winner.user.username}`);
          }
        }
      });
    });
  
    // Log the final betRanges object
    console.log('Final Bet Ranges:', betRanges);
    console.log('Total Bets Overall:', totalBetsOverall);
  
    // Calculate win probabilities for each range in relation to the total bets
    const probabilitiesInRelationToTotal: { [key: string]: number } = {};
    for (const range in betRanges) {
      const { totalWins } = betRanges[range];
      probabilitiesInRelationToTotal[range] = totalBetsOverall > 0 ? (totalWins / totalBetsOverall) * 100 : 0;  // Calculate win probability in relation to total bets
    }
  
    console.log('Calculated Probabilities in Relation to Total Bets:', probabilitiesInRelationToTotal);
  
    return probabilitiesInRelationToTotal;
  };

  const removeOutliers = (data: number[]): number[] => {
    const sortedData = [...data].sort((a, b) => a - b);
    const q95Index = Math.floor(sortedData.length * 0.95); // 95th percentile index
    const q95Value = sortedData[q95Index];
    return data.filter((value) => value <= q95Value);
  };
  
  const renderPlotlyBoxplot = () => {
    const betsByHour = betAmountByHour.reduce((acc: any, entry) => {
      if (!acc[entry.hour]) acc[entry.hour] = [];
      acc[entry.hour].push(entry.betAmount);
      return acc;
    }, {});
  
    const plotData = Object.keys(betsByHour).map((hour) => ({
      type: 'box' as const, // Explicitly define the 'box' type to satisfy TypeScript
      y: showOutliers ? betsByHour[hour] : removeOutliers(betsByHour[hour]), // Conditionally show or remove outliers
      name: `${hour}:00`,
      boxpoints: showOutliers ? 'outliers' : false,  // Show outliers only if the toggle is active
      jitter: 0.5,
      marker: { color: 'rgba(255, 165, 0, 0.8)' },
      line: { width: 2, color: 'rgba(0, 128, 255, 1)' },
      fillcolor: 'rgba(0, 128, 255, 0.3)',
    }));
  
    return (
      <Plot
        data={plotData as Plotly.Data[]} // Explicitly cast plotData to Plotly.Data[]
        layout={{
          title: {
            text: 'Bet Amounts by Hour',
            font: { color: 'white', size: 24 },
          },
          yaxis: {
            title: { text: 'Bet Amount', font: { color: 'white' } },
            zeroline: false,
            gridcolor: 'rgba(255,255,255,0.1)',
            tickfont: { color: 'white' },
          },
          xaxis: {
            title: { text: 'Hour', font: { color: 'white' } },
            tickangle: -45,
            tickfont: { color: 'white' },
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          boxmode: 'group',
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          font: { color: 'white' },
        }}
        style={{ width: '100%', height: '500px' }}
      />
    );
  };
  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Pot Data Visualization</h1>

      {/* Toggle to show or remove outliers */}
      <div className="mb-6">
        <label className="text-lg font-semibold mr-4">Show Outliers</label>
        <input
          type="checkbox"
          checked={showOutliers}
          onChange={() => setShowOutliers(!showOutliers)}
        />
      </div>

      {/* Top Winners */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Top Winners by Contribution, Amount Won, and Bet Frequency</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={topWinners}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" stroke="#ffffff" />
            <YAxis type="category" dataKey="username" stroke="#ffffff" />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalWon" fill="#82ca9d" name="Amount Won (USD)" />
            <Bar dataKey="contributionAmount" fill="#8884d8" name="Contribution Amount (Invested)" />
            <Bar dataKey="betCount" fill="#ffc658" name="Bet Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Winning Amounts Over Time with Zoom Feature */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Winning Amounts Over Time (Zoomable)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={winningAmountsOverTime} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Brush dataKey="date" height={30} stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bet Range Probabilities */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Bet Range Win Probabilities</h2>
        <ul>
          {Object.keys(betRangeProbabilities).map((range) => (
            <li key={range}>
              Bet Range {range}: {betRangeProbabilities[range].toFixed(2)}%
            </li>
          ))}
        </ul>
      </div>

      {/* Plotly Boxplot: Bet Amount by Hour */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Plotly Boxplot: Bet Amount by Hour per Day</h2>
        {renderPlotlyBoxplot()}
      </div>
    </div>
  );
};

export default PotDataVisualization;
