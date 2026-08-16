//  server.js file 

require("dotenv").config();
const logger = require("./utils/logger");
const express = require("express");
const cors = require("cors");
const supabase = require("./config/supabase");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartOrderRoutes = require("./routes/cart-orderRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  logger.request(req);
  next();
});
app.use("/api", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartOrderRoutes);
app.use("/api", orderRoutes);

app.get("/", (req, res) => {
  res.send("Server Running");
});
app.get("/test-db", async (req, res) => {

  const { data, error } = await supabase
    .from("usersData")
    .select("*")
    .limit(1);

  if (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }

  res.status(200).json({
    success: true,
    message: "Supabase Connected Successfully ✅"
  });

});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.clear();
    logger.success("Backend Server Started");
    console.log("");
    logger.info(`Backend : http://localhost:${PORT}`);
    logger.info("Frontend : http://127.0.0.1:5500/first.html");
    console.log("");

});