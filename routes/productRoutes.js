// product routers.js file
const express = require("express");
const router = express.Router();
const {
    getAllProducts,
    getSingleProduct
} = require("../controllers/productController");

console.log(getAllProducts);
console.log(getSingleProduct);

router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

module.exports = router;