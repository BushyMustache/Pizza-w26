// Import the express module
import express from 'express';

// Create an express application
const app = express();

// Define a port number where server will listen
const PORT = 3000;

// Enable static file serving
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// "Middleware" that allows express to read
// form data and store it in req.body
app.use(express.urlencoded({ extended: true }));

// Create a temporary array to store orders
const orders = [];

// Define our main root ('/')
app.get('/', (req, res) => {
    res.render('home');
});

// Contact Route
app.get('/contact-us', (req, res) => {
    res.render('contact');
});

// Confirmation route
app.get('/thank-you', (req, res) => {
    res.render('confirmation');
});

// Submit order route
app.post('/submit-order', (req, res) => {
    
    // Create a JSON object to store the order data
    const order = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        method: req.body.method,
        toppings: req.body.toppings,
        size: req.body.size,
        comment: req.body.comment ? req.body.comment : "none",
        timestamp: new Date()
    };

    // Add order object to orders array
    orders.push(order);
    
    res.render('confirmation', { order });
});

// Admin route
app.get('/admin', (req, res) => {
    res.render('admin', { orders });
});

// Start server and listen on designative port
app.listen(PORT, () => {
    console.log(`Server is gloriously at 
        http://localhost:${PORT}`);
});