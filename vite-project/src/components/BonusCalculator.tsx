import React, { useState, useEffect } from 'react';

interface Calculation {
  baseAmount: number;
  bonusAmount: number;
  multiplier: number;
  rtp: number;
}

const BonusCalculator: React.FC = () => {
  const [baseAmount, setBaseAmount] = useState<number | string>('');
  const [bonusAmount, setBonusAmount] = useState<number | string>('');
  const [multiplier, setMultiplier] = useState<number | string>('');
  const [rtp, setRtp] = useState<number>(99); // default RTP
  const [savedCalculations, setSavedCalculations] = useState<Calculation[]>([]);

  // Load saved calculations from local storage on component mount
  useEffect(() => {
    const storedCalculations = localStorage.getItem('savedCalculations');
    if (storedCalculations) {
      setSavedCalculations(JSON.parse(storedCalculations));
    }
  }, []);

  // Save a new calculation to local storage
  const saveCalculation = () => {
    const calculation: Calculation = {
      baseAmount: parseFloat(baseAmount as string),
      bonusAmount: parseFloat(bonusAmount as string),
      multiplier: parseFloat(multiplier as string),
      rtp,
    };
    const updatedCalculations = [...savedCalculations, calculation];
    setSavedCalculations(updatedCalculations);
    localStorage.setItem('savedCalculations', JSON.stringify(updatedCalculations));
  };

  // Load a selected calculation from the saved list
  const loadCalculation = (calculation: Calculation) => {
    setBaseAmount(calculation.baseAmount);
    setBonusAmount(calculation.bonusAmount);
    setMultiplier(calculation.multiplier);
    setRtp(calculation.rtp);
  };

  // Clear saved calculations
  const clearSavedCalculations = () => {
    setSavedCalculations([]);
    localStorage.removeItem('savedCalculations');
  };

  // Calculation functions
  const calculateWagerAmount = (): number => {
    const bonus = parseFloat(bonusAmount as string);
    const multi = parseFloat(multiplier as string);
    if (!isNaN(bonus) && !isNaN(multi)) {
      return bonus * multi;
    }
    return 0;
  };

  const calculateLostAmount = (wagerAmount: number): number => {
    const effectiveRtp = 1 - rtp / 100; // Inverted RTP for loss percentage
    return wagerAmount * effectiveRtp;
  };

  const calculateFactorLoss = (netResult: number): number => {
    const base = parseFloat(baseAmount as string);
    if (!isNaN(netResult) && base > 0) {
      return netResult / base;
    }
    return 0;
  };

  const wagerAmount = calculateWagerAmount();
  const lostAmount = calculateLostAmount(wagerAmount);
  const netResult = parseFloat(bonusAmount as string) - lostAmount;
  const factorLoss = calculateFactorLoss(netResult);

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Bonus Calculator</h1>

      {/* Input Fields */}
      <div className="mb-4">
        <label className="block mb-2">Base Amount (e.g. 30 USD):</label>
        <input
          type="number"
          value={baseAmount}
          onChange={(e) => setBaseAmount(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded-md text-white"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Received Bonus Amount (e.g. 54 USD):</label>
        <input
          type="number"
          value={bonusAmount}
          onChange={(e) => setBonusAmount(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded-md text-white"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Multiplier (e.g. 67x):</label>
        <input
          type="number"
          value={multiplier}
          onChange={(e) => setMultiplier(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded-md text-white"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">RTP (Default 99%):</label>
        <input
          type="number"
          value={rtp}
          onChange={(e) => setRtp(parseFloat(e.target.value))}
          className="w-full p-2 bg-gray-700 rounded-md text-white"
        />
      </div>

      {/* Save Calculation Button */}
      <button
        onClick={saveCalculation}
        className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg mb-4"
      >
        Save Calculation
      </button>

      {/* Display Saved Calculations */}
      {savedCalculations.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Saved Calculations</h2>
          <ul className="list-disc pl-5">
            {savedCalculations.map((calculation, index) => (
              <li key={index}>
                <button
                  className="text-blue-400 hover:underline"
                  onClick={() => loadCalculation(calculation)}
                >
                  Base: {calculation.baseAmount}, Bonus: {calculation.bonusAmount}, Multiplier: {calculation.multiplier}, RTP: {calculation.rtp}%
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={clearSavedCalculations}
            className="bg-red-600 hover:bg-red-700 p-2 mt-4 rounded-lg"
          >
            Clear All Saved Calculations
          </button>
        </div>
      )}

      {/* Calculated Results */}
      <div className="mt-6">
        <p className="text-lg">Wager Amount to Get Bonus: <strong>{wagerAmount.toFixed(2)}</strong> USD</p>
        <p className="text-lg">Net Result from Wager: <strong>{netResult.toFixed(2)}</strong> USD</p>
        <p className="text-lg">Factor Loss: <strong>{factorLoss.toFixed(2)}</strong></p>
      </div>
    </div>
  );
};

export default BonusCalculator;
