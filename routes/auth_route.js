const authController = require("../controller/auth_controller");
const verifytoken = require("../middleware/auth_middleware");
const router = require("express").Router();

router.post("/register",authController.registerController);
router.post("/login",authController.logincontroller);
router.get('/users',verifytoken, authController.getAllUsers);
router.get("/user/:userId", verifytoken, authController.getSingleUser);
router.put('/updateuser/:userId',verifytoken, authController.updateUser);
router.get("/search", authController.searchUsers);

 module.exports = router;