const express = require("express");

const router = express.Router();

const {
    placeOrder
} = require("../controllers/cart-OrderController");

router.post("/place-order", placeOrder);

module.exports = router;