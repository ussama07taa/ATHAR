const http = require('http');

http.get('http://127.0.0.1:8000/admin/orders', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Find the Delete bulk action.
    const regex = /<[^>]+Delete selected[^>]+>|<[^>]+Supprimer la s[^>]+>/g;
    const matches = data.match(regex) || [];
    
    console.log(`Found ${matches.length} matches for delete button:`);
    matches.forEach(m => console.log(m));
    
    // Also extract the dropdown list it might be in.
    const start = data.indexOf('fi-ta-actions');
    if (start !== -1) {
      console.log('\nContext around fi-ta-actions:');
      console.log(data.substring(start, start + 2000));
    } else {
        console.log('\nCould not find fi-ta-actions');
    }
  });
});
