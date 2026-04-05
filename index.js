// Render Deployment Entry Point
// Safely navigate into the backend directory so that local path resolutions and .env work perfectly
process.chdir(__dirname + '/backend');
require('./backend/server.js');
