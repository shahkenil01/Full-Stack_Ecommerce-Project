const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const TempOrder = require('./models/tempOrder'); // ✅ import model
const PORT = process.env.PORT || 4000;

// ✅ CORS
app.use(cors({
  origin: [
    'https://e-commerce-best.netlify.app', // client
    'https://e-commerce-admin-master.netlify.app', // admin
    'http://localhost:3000', // localhost admin
    'http://localhost:3005' // localhost client
  ],
  credentials: true,
}));
app.options('*', cors());

// ✅ Middleware
app.use(bodyParser.json());

// ✅ TEMP SAVE route (important)
app.post("/save-temp", async (req, res) => {
  try {
    const { token, cartItems, formFields } = req.body;
    if (!token || !cartItems || !formFields) {
      return res.status(400).json({ error: "Missing token/cart/form" });
    }

    await TempOrder.findOneAndUpdate(
      { token },
      { cartItems, formFields },
      { upsert: true }
    );

    res.status(200).json({ msg: "saved to db" });
  } catch (e) {
    res.status(500).json({ error: "failed to save temp" });
  }
});

// ✅ All Routes
const categoryRoutes = require('./routes/categories');
const subCatSchema = require('./routes/subCat');
const productRoutes = require('./routes/products');
const productRamRoutes = require('./routes/productRam');
const productWeightRoutes = require('./routes/productWeight');
const productSizeRoutes = require('./routes/productSize');
const uploadRoutes = require('./routes/upload');
const userRoutes = require('./routes/user');
const cartRoutes = require('./routes/Cart');
const orderRoutes = require("./routes/order");
const favoriteRoutes = require('./routes/favorite');
const reviewRoutes = require('./routes/review');
const cashfreeRoute = require('./routes/cashfree');
const homeBannerRoutes = require('./routes/homeBanner');

app.use(`/api/category`, categoryRoutes);
app.use(`/api/subCat`, subCatSchema);
app.use(`/api/products`, productRoutes);
app.use('/api/rams', productRamRoutes);
app.use('/api/weights', productWeightRoutes);
app.use('/api/sizes', productSizeRoutes);
app.use('/api/cloudinary', uploadRoutes);
app.use('/api/User', userRoutes);
app.use('/api/cart', cartRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/favorite', favoriteRoutes);
app.use("/api/reviews", reviewRoutes);
app.use('/api/cashfree', cashfreeRoute);
app.use('/api/homeBanner', homeBannerRoutes); 

// ✅ DB Connection & Server
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Database Connection is ready...');
    app.listen(PORT, () => {
      console.log(`server is running http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
