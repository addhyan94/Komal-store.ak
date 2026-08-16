// cart-OrderController.js file 
const logger = require("../utils/logger");
const fs = require("fs");
const path = require("path");
const { sendOrderMail } = require("../utils/mailService-server");
const validateOrder = require("../utils/validateOrder");
const supabase = require("../config/supabase");

const {
    validateProducts
} = require("../services/orderValidationService");

function saveOrder(order) {

    const filePath = path.join(__dirname, "..", "orders.json");

    let orders = [];

    try {

        if (fs.existsSync(filePath)) {

            const text = fs.readFileSync(filePath, "utf8");

            orders = text ? JSON.parse(text) : [];

        }

    } catch {

        orders = [];

    }

    orders.unshift(order);

    fs.writeFileSync(
        filePath,
        JSON.stringify(orders, null, 2)
    );

}

async function placeOrder(req, res) {

    const order = req.body;

    const error = validateOrder(order);

    if (error) {

        logger.error(error);

        return res.status(400).json({
            success: false,
            message: error
        });

    }
    try {

        logger.success("Place Order Request Received");
        const check = await validateProducts(order);

        if (!check.success) {
            logger.error(check.message);
            return res.status(400).json({
                success: false,
                message: check.message
            });
        }
        order.total = check.total;
        order.id = generateOrderId(order.user.user_id);

        logger.info("Order Data Loaded");
        saveOrder(order);
        logger.success("Order Saved");

        console.log("STEP-1");
        sendOrderMail(order).catch(err => {
            logger.error("Mail Send Failed (but order was saved):", err.message);
            console.error("MAIL ERROR:");
            console.error(err);
        });

        console.log("STEP-1.5 - Email queued in background");

        res.status(200).json({
            success: true,
            message: "Order Placed Successfully"
        });

        console.log("STEP-2 - Response sent to client");

    } catch (err) {

        logger.error(err.stack || err.message);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

}

function generateOrderId(userId) {

    const filePath = path.join(__dirname, "..", "orders.json");

    let orders = [];

    try {

        if (fs.existsSync(filePath)) {

            const text = fs.readFileSync(filePath, "utf8");

            orders = text ? JSON.parse(text) : [];

        }

    } catch {

        orders = [];

    }

    const userOrders = orders.filter(
        o => o.user.user_id === userId
    );

    const next = userOrders.length + 1;

    return `${userId}-${String(next).padStart(3, "0")}`;
}

module.exports = {
    placeOrder
};