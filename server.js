require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());

app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.post("/place-order", async (req, res) => {

  try {

    const order = req.body;

    let orders = [];

    if (fs.existsSync("orders.json")) {
      orders = JSON.parse(
        fs.readFileSync("orders.json", "utf8")
      );
    }

    orders.unshift(order);

    fs.writeFileSync(
      "orders.json",
      JSON.stringify(orders, null, 2)
    );

    const productsText = order.items
      .map(item =>
        `${item.name} | Qty: ${item.qty} | ₹${item.price}`
      )
      .join("\n");

    const emailText = `
🛒 NEW ORDER RECEIVED

Order ID: ${order.id}
--------------------------------
CUSTOMER DETAILS-

Name: ${order.user.name}
Phone: ${order.user.phone}
Address: ${order.user.address}
--------------------------------
PRODUCTS->
${productsText}
--------------------------------
TOTAL = ₹${order.total}
`;

    await transporter.sendMail({
      from: `"Komal Chand Store Website" <${process.env.EMAIL_USER}>`,
      to: process.env.SHOP_EMAIL,
      subject: `🛒 New Order #${order.id}`,
      text: emailText
    });

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server running on port ${process.env.PORT || 3000}`
  );
});
