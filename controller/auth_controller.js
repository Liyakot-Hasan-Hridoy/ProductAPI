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


   // GET ALL  USERS START============>>>>>>>>
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

  // GRT SINGLE USER

  // Add this method to your AuthController
static async getSingleUser(req, res) {
  try {
    const userId = req.params.userId;

    // Call a method in your AuthModel to get the single user by ID
    const user = await AuthModel.getSingleUser(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve the user" });
  }
}


  // GET ALL  USERS END============>>>>>>>>

  // GET ALL  USERS END============>>>>>>>>
  static async updateUser(req, res) {
    try {
      const userId = req.params.userId;

      upload.single('image')(req, res, async (error) => {
        if (error) {
          return res.status(400).json({ error: 'Image upload failed' });
        }

        const { name, email, phone, type, gender, occupation, address } = req.body;

        const existingUser = await AuthModel.updateUser(
          userId,
          name,
          email,
          phone,
          type,
          gender,
          occupation,
          req.file ? req.file.path : null,
          address
        );

        if (!existingUser) {
          return res.status(404).json({ error: 'User Not Found' });
        }

        if (req.file) {
          if (existingUser.image) {
            const imagePath = existingUser.image;

            fs.unlink(imagePath, (err) => {
              if (err) {
                console.error('Error Deleting Image:', err);
              }
            });
          }
        }

        res.status(200).json({
          success: 'User information updated successfully',
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update user information' });
    }
  }


  // Add this method to your AuthController
static async searchUsers(req, res) {
  try {
    // Get the search query parameter from the request
    const query =  req.query.query;    //?query= search query

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    // Call a method in your AuthModel to perform the search
    const users = await AuthModel.searchUsers(query);

    if (users.length==0) {
      return res.status(400).json('No User Found');
    }

    res.status(200).json({
      success: "Search successful",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to perform the search" });
  }
}


};

module.exports = AuthController;
