const AuthModel = require("../model/auth_model");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const secret = "secret";
const fs = require("fs");
const path = require("path");

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

  // SINE UP USERS START============>>>>>>>>
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
        var address = req.body.address;

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
          image,
          address
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
            address
          },
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
  // SINE UP USERS END============>>>>>>>>

  // LOGIN USERS START============>>>>>>>>
  static async logincontroller(req, res) {
    try {

      var email = req.body.email;
      var password = req.body.password;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" })
      };

      const user = await AuthModel.login(email, password);


      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        secret, // Replace with your secret key
        { expiresIn: "1h" } // Set the token expiration time
      );

      res.status(200).json({
        success: "Login successful",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          type: user.type,
          gender: user.gender,
          occupation: user.occupation,
          image: user.image,
          address: user.address,
          token: token,
        }
      });

    } catch (error) {
      console.log(error);
    }
  }

  // LOGIN USERS END============>>>>>>>>

  // Add this method to your AuthController
  static async getAllUsers(req, res) {
    try {
      const users = await AuthModel.getAllUsers(); // Create this method in your AuthModel

      res.status(200).json({
        success: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve users" });
    }
  }

  static async updateUser(req, res) {

    try {

      upload.single("image")(req, res, async (error) => {


        upload.single("image")(req, res, async (err) => {
          if (err) {
            return res.status(400).json({ error: "Image upload faild" });
          }

          const userId = req.params.userId;
          const { name, email, phone, type, gender, occupation, address } = req.body;

          const existinguser = await AuthModel.updateUser(
            userId,
            {
              name,
              email,
              phone,
              type,
              gender,
              occupation,
              image,
              address,
            }
          );

          if (!existinguser) {
            return res.status(404).json({ error: "User Not Found" });
          }

          if (req.file) {

            if (existinguser.image) {
              const imagePath = existinguser.image;

              fs.unlink(imagePath, (err) => {
                if (err) {
                  console.error("Error Deleting Image:", err);
                }
              });

            }

            existinguser.image = req.file.path;
            existinguser.image = null;
          }

          res.status(200).json({
            success: 'User information updated successfully',
            existinguser,
          });

        });

      });

    } catch (error) {

      console.error(error);
      res.status(500).json({ error: 'Failed to update user information' });

    }
  }


};

module.exports = AuthController;
