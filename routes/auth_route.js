const authController = require("../controller/auth_controller");
const router = require("express").Router();

router.post("/register",authController.registerController);

 module.exports = router;