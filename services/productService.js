// productService.js file

const supabase = require("../config/supabase");

async function getProductById(id) {

    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("product_id", id)
        .eq("is_active", true)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
}

module.exports = {
    getProductById
};