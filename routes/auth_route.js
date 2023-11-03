const authController = require("../controller/auth_controller");
const verifytoken = require("../middleware/auth_middleware");
const router = require("express").Router();

router.post("/register",authController.registerController);
router.post("/login",authController.logincontroller);
router.get('/users', authController.getAllUsers);
router.put('/updateuser/:userId',verifytoken, authController.updateUser);

 module.exports = router;