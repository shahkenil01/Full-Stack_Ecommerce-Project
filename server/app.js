const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

app.use(cors());
app.options('*', cors());

//middleware
app.use(bodyParser.json());

//Routes
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const uploadRoutes = require('./routes/upload');

app.use(`/api/category`, categoryRoutes);
app.use(`/api/products`, productRoutes);
app.use('/api/cloudinary', uploadRoutes);

// Database
mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log('Database Connection is ready...');
    //Server
    app.listen(process.env.PORT, () => {
      console.log(`server is running http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
