// Import the express module
import express from 'express';

// Import the mysql2 module
import mysql2 from 'mysql2';

// Import the dotenv module
import dotenv from 'dotenv';

// Import the validateForm function
import {validateForm} from './validation.js';

// Load environment variables from .env
dotenv.config();

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

// Create a pool (bucket) of database connections
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

// Database test route
app.get('/db-test', async(req, res) => {
    try {
        const pizza_orders = await pool.query('SELECT * FROM orders');
        res.send(pizza_orders[0]);
    } catch (err) {
        console.log('Database error: ', err);
    }
});

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
app.post('/submit-order', async (req, res) => {

    const order = req.body;

    // Validate the form submission
    const valid = validateForm(order);
    if (!valid.isValid) {
        console.log(valid);
        res.render('home', {errors: valid.errors});
        return;
    }
    
    // Create a JSON object to store the order data
    // (fname, lname, email, size, method, toppings)
    const params = [
        order.fname,
        order.lname,
        order.email,
        order.size,
        order.method,
        Array.isArray(order.toppings) ? order.toppings.join(", ") : none
    ];

    // Insert a new order into the database
    const sql = `INSERT INTO orders (fname, lname, email,
                 size, method, toppings)
                 VALUES (?, ?, ?, ?, ?, ?)`;

    const result = await pool.execute(sql, params);
    console.log("Order inserted with ID: ", result[0].insertId);

    res.render('confirmation', { order });
});

// Admin route
app.get('/admin', async (req, res) => {

    // Read all orders from the database
    // Newest first
    let sql = "SELECT * FROM orders ORDER BY timestamp DESC";
    const orders = await pool.query(sql);
    console.log(orders);

    res.render('admin', { orders: orders[0] });
});

// Start server and listen on designative port
app.listen(PORT, () => {
    console.log(`Server is gloriously at 
        http://localhost:${PORT}`);
});