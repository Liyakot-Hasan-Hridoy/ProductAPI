const productController = require("../controller/product_controller");
const verifytoken = require("../../middleware/auth_middleware");
const router = require("express").Router();

router.post("/store",verifytoken,productController.ProductController);


module.exports = router;