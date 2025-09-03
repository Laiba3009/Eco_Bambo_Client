const fs = require('fs');

// Function to add tutorial content for a new product
function addTutorialContent(productHandle, tutorialData) {
  try {
    // Read existing database
    const databasePath = 'data/tutorial-database.json';
    const database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));
    
    // Add new tutorial data
    database[productHandle] = tutorialData;
    
    // Save updated database
    fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));
    
    console.log(`✅ Tutorial content added for: ${productHandle}`);
    return true;
  } catch (error) {
    console.error('❌ Error adding tutorial content:', error);
    return false;
  }
}

// Example usage:
// addTutorialContent('new-product-handle', {
//   video: { url: '...', title: '...' },
//   steps: [...],
//   promotions: [...]
// });

module.exports = { addTutorialContent };
