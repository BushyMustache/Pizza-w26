// Import the express module
import express from 'express';

// Create an express application
const app = express();

// Define a port number where server will listen
const PORT = 3000;

// Enable static file serving
app.use(express.static('public'));

// Define our main root ('/')
app.get('/', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/home.html`);
});

// Start server and listen on designative port
app.listen(PORT, () => {
    console.log(`Server is gloriously at 
        http://localhost:${PORT}`);
});