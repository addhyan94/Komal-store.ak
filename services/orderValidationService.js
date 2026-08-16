// orderValidationService.js file 

const { getProductById } = require("./productService");

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

        item.price = Number(product.price);

        item.offer_price = product.offer
            ? Number(product.offer_price)
            : Number(product.price);

        item.offer_type = product.offer
            ? product.offer_text
            : "";

        item.image_url = product.image_url;

        item.category = product.category;

        item.line_total = actualPrice * item.qty;

        calculatedTotal += item.line_total;

    }

    return {

        success: true,

        total: calculatedTotal

    };

}

module.exports = {

    validateProducts

};