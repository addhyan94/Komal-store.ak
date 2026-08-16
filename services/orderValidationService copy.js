// orderValidationService.js file 

const {getProductById} = require("./productService");

async function validateProducts(order) {
    let calculatedTotal = 0;
    for (const item of order.items) {
        if (
            typeof item.product_id !== "number" ||
            item.product_id <= 0
        ) {
            return {
                success: false,
                message: "Invalid Product Id"
            };
        }
        const product = await getProductById(item.product_id);
        if (!product) {
            return {
                success: false,
                message: `Product Not Found (${item.product_id})`
            };
        }

        if (item.name !== product.name) {
            return {
                success: false,
                message: `Invalid Product Name (${item.product_id})`
            };
        }

        const actualPrice = product.offer
            ? Number(product.offer_price)
            : Number(product.price);

        if (Number(item.price) !== actualPrice) {
            return {
                success: false,
                message: `Price Tampered (${product.name})`
            };
        }

        calculatedTotal += actualPrice * item.qty;
    }

    return {
        success: true,
        total: calculatedTotal
    };
}

module.exports = {

    validateProducts

};