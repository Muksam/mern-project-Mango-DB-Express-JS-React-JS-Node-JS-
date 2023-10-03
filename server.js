const express = require('express');
const app = express();
const connectDB = require('./config/db');
app.get('/', (req, res) => res.send('API is running'));

//Database connection
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

//Define router
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const Port = process.env.Port || 5000;
app.listen(Port, () => console.log(`Server is running in ${Port}`));
