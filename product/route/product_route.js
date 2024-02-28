const productController = require("../controller/product_controller");
const verifytoken = require("../../middleware/auth_middleware");
const router = require("express").Router();

router.post("/store",verifytoken,productController.productController);
router.get("/getproduct",verifytoken,productController.getAllProduct);
router.get("/getallcategories", verifytoken, productController.getAllCategories);
router.get("/getcategory",verifytoken,productController.getcategory);
router.put('/updateproduct/:productId',verifytoken, productController.updateproduct);




module.exports = router;