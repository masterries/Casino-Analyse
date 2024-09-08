import { useState, useEffect, useContext } from 'react';
import { FilterContext, GameDataContext, Game } from '../App';

export const useGameFilters = (initialGames: Game[]) => {
  const { filterState } = useContext(FilterContext);
  const [filteredGames, setFilteredGames] = useState(initialGames);

  useEffect(() => {
    let result = initialGames;

    if (Array.isArray(filterState.selectedTags) && filterState.selectedTags.length > 0) {
      result = result.filter(game => 
        game.tags.some(tag => filterState.selectedTags.includes(tag.name))
      );
    }

    if (Array.isArray(filterState.selectedFeatures) && filterState.selectedFeatures.length > 0) {
      result = result.filter(game => 
        filterState.selectedFeatures.every(feature => {
          if (feature === 'isWageringBonusAllowed') return game.isWageringBonusAllowed;
          return game.attributes[feature as keyof typeof game.attributes] === true;
        })
      );
    }

    if (filterState.sortOption) {
      result.sort((a, b) => {
        switch (filterState.sortOption) {
          case 'rtp':
            return (b.attributes.rtp || 0) - (a.attributes.rtp || 0);
          case 'name':
            return a.name.localeCompare(b.name);
          case 'provider':
            return a.provider.name.localeCompare(b.provider.name);
          default:
            return 0;
        }
      });
    }

    setFilteredGames(result);
  }, [initialGames, filterState]);

  return filteredGames;
};