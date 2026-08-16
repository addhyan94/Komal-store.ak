function validateOrder(order) {

    if (!order) {
        return "Order Data Missing";
    }

    if (!order.user) {
        return "User Data Missing";
    }

    if (
        typeof order.user.user_id !== "number" ||
        order.user.user_id <= 0
    ) {
        return "Invalid User Id";
    }

    if (
        !order.user.name ||
        !order.user.phone ||
        !order.user.address
    ) {
        return "User Details Missing";
    }

    if (!Array.isArray(order.items)) {
        return "Items Must Be Array";
    }

    if (order.items.length === 0) {
        return "Cart Empty";
    }

    if (order.items.length > 25) {
        return "Maximum 25 Products Allowed";
    }

    for (const item of order.items) {

        if (typeof item.qty !== "number") {
            return "Invalid Quantity";
        }

        if (item.qty < 1) {
            return "Quantity Must Be Greater Than 0";
        }

        if (item.qty > 12) {
            return `Maximum Quantity Allowed is 12 (${item.name})`;
        }

    }

    if (typeof order.total !== "number") {
        return "Invalid Total";
    }

    return null;
}

module.exports = validateOrder;