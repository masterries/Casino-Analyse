import React, { useState } from 'react';

interface RTPWagerCalculatorProps {
  rtp: number;
  onClose: () => void;
}

const RTPWagerCalculator: React.FC<RTPWagerCalculatorProps> = ({ rtp, onClose }) => {
  const [betAmount, setBetAmount] = useState<number | string>('');
  const [wagerAmount, setWagerAmount] = useState<number | string>('');

  // Correct calculation: Wager = Bet / (1 - RTP / 100)
  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const bet = parseFloat(e.target.value);
    setBetAmount(e.target.value);
    if (!isNaN(bet) && bet > 0) {
      // Wager = bet / (1 - RTP / 100)
      const wager = bet / (1 - rtp / 100);
      setWagerAmount(wager.toFixed(2));
    } else {
      setWagerAmount('');
    }
  };

  // Correct calculation: Bet = Wager * (1 - RTP / 100)
  const handleWagerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const wager = parseFloat(e.target.value);
    setWagerAmount(e.target.value);
    if (!isNaN(wager) && wager > 0) {
      // Bet = wager * (1 - RTP / 100)
      const bet = wager * (1 - rtp / 100);
      setBetAmount(bet.toFixed(2));
    } else {
      setBetAmount('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg text-white w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">RTP Wager Calculator</h2>
        <p className="mb-4">RTP (Return to Player): {rtp}%</p>

        <div className="mb-4">
          <label className="block mb-2">Enter Bet Amount:</label>
          <input
            type="number"
            value={betAmount}
            onChange={handleBetChange}
            className="w-full p-2 bg-gray-700 rounded-md text-white"
            placeholder="Enter bet amount"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Calculated Wager Amount:</label>
          <input
            type="number"
            value={wagerAmount}
            onChange={handleWagerChange}
            className="w-full p-2 bg-gray-700 rounded-md text-white"
            placeholder="Calculated wager amount"
          />
        </div>

        <p className="text-sm text-gray-400 mb-4">
          Note: The wager is calculated based on the inverse relationship of RTP and represents the total amount needed to fully take advantage of the RTP.
        </p>

        <button
          className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RTPWagerCalculator;
