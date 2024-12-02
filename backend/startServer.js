const app = require('./server'); // Import the app from server.js
const PORT = process.env.PORT || 5000; // Use PORT from environment variables or default to 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
