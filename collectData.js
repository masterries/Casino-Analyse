async function fetchAllGames() {
  let allGames = [];
  let page = 1;
  const limit = 30;
  const baseUrl = 'https://tower.bet/api/external-casino/games';

  while (true) {
    const url = `${baseUrl}?page=${page}&limit=${limit}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        allGames = allGames.concat(data.data);
        console.log(`Fetched page ${page}, total games: ${allGames.length}`);
        page++;

        // Wait for 5 seconds before fetching the next page
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        console.log('No more data available. Finished fetching.');
        break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      break;
    }
  }

  // Once all the data is fetched, download it as a JSON file
  downloadJSON(allGames, 'gamesData.json');
  return allGames;
}

// Function to download JSON as a file
function downloadJSON(data, filename) {
  const jsonData = JSON.stringify(data, null, 2); // Convert to pretty JSON format
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Usage
fetchAllGames().then(games => {
  console.log(`Total games collected: ${games.length}`);
  // 'games' array will contain all the fetched games
});
