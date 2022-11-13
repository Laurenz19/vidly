const customers = require('./routes/customers')
const movies = require('./routes/movies');
const express = require('express');
const app = express();

app.use(express.json());
app.use('/api/movies', movies);
app.use('/api/customers', customers)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));