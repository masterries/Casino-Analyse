import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { GameDataContext } from '../App';

const NavMenu: React.FC = () => {
  const games = useContext(GameDataContext);

  const categories = [...new Set(games.map(game => game.category.name))];
  const providers = [...new Set(games.map(game => game.provider.name))];

  const [, setHoveredDropdown] = useState<string | null>(null);

  const handleMouseEnter = (dropdown: string) => {
    setHoveredDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    setHoveredDropdown(null);
  };

  const linkStyle = "px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700 hover:text-white transition-colors duration-200";
  const buttonStyle = "px-3 py-2 rounded-md text-sm font-medium text-white bg-transparent hover:bg-gray-700 hover:text-white transition-colors duration-200";

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-xl font-bold text-blue-500">Casino Analytics</span>
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/dashboard" className={linkStyle}>Dashboard</Link>
              <Link to="/categories" className={linkStyle}>Categories</Link>
              <Link to="/Gamelist" className={linkStyle}>Full Game List</Link>
              <Link to="/BonusCalculator" className={linkStyle}>Bonus Calculator</Link>
              <Link to="/potdatavisualization" className={linkStyle}>Pot Data Visualization</Link>
              <div 
                className="relative group"
                onMouseEnter={() => handleMouseEnter('categories')}
                onMouseLeave={handleMouseLeave}
              >
                <button className={buttonStyle}>
                  Game Categories
                </button>
                <div className="absolute left-0 mt-0 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                  <div className="py-2 mt-2 bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    {categories.map(category => (
                      <Link
                        key={category}
                        to={`/category/${category}`}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                        role="menuitem"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div 
                className="relative group"
                onMouseEnter={() => handleMouseEnter('providers')}
                onMouseLeave={handleMouseLeave}
              >
                <button className={buttonStyle}>
                  Providers
                </button>
                <div className="absolute left-0 mt-0 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                  <div className="py-2 mt-2 bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    {providers.map(provider => (
                      <Link
                        key={provider}
                        to={`/provider/${provider}`}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                        role="menuitem"
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
      </div>
    </nav>
  );
};

export default NavMenu;