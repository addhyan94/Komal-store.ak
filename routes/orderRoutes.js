// order.Routers.js file

const express = require("express");
const router = express.Router();
const {
    getMyOrders
} = require("../controllers/orderController");

router.get("/onlymyorders/:userId", getMyOrders);

module.exports = router;