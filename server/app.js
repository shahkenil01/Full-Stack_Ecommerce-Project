const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv/config');

app.use(cors({
  origin: [
    'https://e-commerce-best.netlify.app', // client
    'https://e-commerce-admin-master.netlify.app' // admin
  ],
  credentials: false,
}));

app.options('*', cors());

//middleware
app.use(bodyParser.json());

//Routes
const categoryRoutes = require('./routes/categories');
const subCatSchema = require('./routes/subCat');
const productRoutes = require('./routes/products');
const productRamRoutes = require('./routes/productRam');
const productWeightRoutes = require('./routes/productWeight');
const productSizeRoutes = require('./routes/productSize');
const uploadRoutes = require('./routes/upload');

app.use(`/api/category`, categoryRoutes);
app.use(`/api/subCat`, subCatSchema);
app.use(`/api/products`, productRoutes);
app.use('/api/rams', productRamRoutes);
app.use('/api/weights', productWeightRoutes);
app.use('/api/sizes', productSizeRoutes);
app.use('/api/cloudinary', uploadRoutes);

// Database
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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
