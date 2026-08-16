// productComtroller.js file 

const supabase = require("../config/supabase");
const logger = require("../utils/logger");

async function getAllProducts(req, res) {
    try {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("is_active", true)
            .order("product_id", { ascending: true });

        if (error) throw error;
        console.log(data);

        return res.status(200).json({
            success: true,
            products: data
        });

    } catch (err) {

        logger.error(err.message);

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

}

async function getSingleProduct(req, res) {

    try {

        const { id } = req.params;
        const product = await getProductById(id);
        if (!data) {

            return res.status(404).json({
                success: false,
                message: "Product not found."
            });

        }
        logger.info(`product Opend : ${id}`)
        return res.status(200).json({
            success: true,
            product: data
        });

    } catch (err) {

        logger.error(err.message);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

module.exports = {
    getAllProducts,
    getSingleProduct
};