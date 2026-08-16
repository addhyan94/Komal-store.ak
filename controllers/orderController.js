//  OrderComtroller.js file 

const supabase = require("../config/supabase");

async function getMyOrders(req, res) {

    try {
        const { userId } = req.params;
        const { data: orders, error: orderError } = await supabase
            .from("myorders")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (orderError) {
            throw orderError;
        }
        if (!orders || orders.length === 0) {

            return res.status(200).json({
                success: true,
                orders: []
            });

        }
        for (const order of orders) {
            const { data: items, error: itemError } = await supabase
                .from("order_items")
                .select("*")
                .eq("order_id", order.order_id);

            if (itemError) {
                throw itemError;
            }
            order.items = items || [];
        }
        return res.status(200).json({
            success: true,
            orders
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch orders."
        });
    }
}

module.exports = {
    getMyOrders
};