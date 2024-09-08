import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { GameDataContext } from '../App';
import Draggable from 'react-draggable';
import BonusCalculator from './BonusCalculator';

const NavMenu: React.FC = () => {
  const games = useContext(GameDataContext);
  const categories = [...new Set(games.map(game => game.category.name))];
  const providers = [...new Set(games.map(game => game.provider.name))];

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCalculatorVisible, setCalculatorVisible] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCalculator = () => {
    setCalculatorVisible(!isCalculatorVisible);
  };

  const linkStyle = "block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700 transition-colors duration-200";
  const buttonStyle = "px-3 py-2 rounded-md text-sm font-medium text-white bg-transparent hover:bg-gray-700 transition-colors duration-200";

  return (
    <>
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-500">Casino Analytics</Link>
            </div>
            <div className="flex lg:hidden">
              {/* Mobile Hamburger Button */}
              <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                </svg>
              </button>
            </div>
            <div className="hidden lg:flex space-x-4">
              <Link to="/dashboard" className={linkStyle}>Dashboard</Link>
              <Link to="/categories" className={linkStyle}>Categories</Link>
              <Link to="/Gamelist" className={linkStyle}>Full Game List</Link>
              <Link to="/potdatavisualization" className={linkStyle}>Pot Data Visualization</Link>
              
              {/* Add link for calculator */}
              <button
                onClick={toggleCalculator}
                className={buttonStyle}
              >
                Bonus Calculator
              </button>

              {/* Dropdown Menus */}
              <div
                className="relative group"
                onMouseEnter={() => setCalculatorVisible('categories')}
                onMouseLeave={() => setCalculatorVisible(null)}
              >
                <button className={buttonStyle}>Game Categories</button>
                <div className="absolute left-0 mt-0 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                  <div className="py-2 mt-2 bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    {categories.map(category => (
                      <Link
                        key={category}
                        to={`/category/${category}`}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="relative group"
                onMouseEnter={() => setCalculatorVisible('providers')}
                onMouseLeave={() => setCalculatorVisible(null)}
              >
                <button className={buttonStyle}>Providers</button>
                <div className="absolute left-0 mt-0 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                  <div className="py-2 mt-2 bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 dropdown-scroll">
                    {providers.map(provider => (
                      <Link
                        key={provider}
                        to={`/provider/${provider}`}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                      >
                        {provider}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/dashboard" className={linkStyle} onClick={toggleMobileMenu}>Dashboard</Link>
              <Link to="/categories" className={linkStyle} onClick={toggleMobileMenu}>Categories</Link>
              <Link to="/Gamelist" className={linkStyle} onClick={toggleMobileMenu}>Full Game List</Link>
              <Link to="/BonusCalculator" className={linkStyle} onClick={toggleMobileMenu}>Bonus Calculator</Link>
              <Link to="/potdatavisualization" className={linkStyle} onClick={toggleMobileMenu}>Pot Data Visualization</Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default NavMenu;
