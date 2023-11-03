const AuthModel = require("../model/auth_model");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the destination folder for storing uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

class AuthController {
  static async registerController(req, res) {
    // Use upload.single("image") as middleware to handle file upload
    try {
      upload.single("image")(req, res, async (error) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "File upload failed" });
        }
  
        var name = req.body.name;
        var email = req.body.email;
        var phone = req.body.phone;
        var password = req.body.password;
        var type = req.body.type;
        var gender = req.body.gender;
        var occupation = req.body.occupation;
  
        // Check if a file is included in the request
        if (!req.file) {
          return res.status(400).json({ error: "Image file is required" });
        }
  
        var image = req.file.filename; // Store the uploaded image filename
  
        var userId = await AuthModel.createUser(
          name,
          email,
          phone,
          password,
          type,
          gender,
          occupation,
          image
        );
  
        console.log(userId);
  
        res.status(200).json({
          success: "Register and Image Upload Successful",
          data: {
            id: userId,
            name,
            email,
            phone,
            type,
            gender,
            occupation,
            image,
          },
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = AuthController;
