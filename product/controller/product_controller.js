const productModel = require("../model/product_model");
const multer = require("multer");
const fs = require("fs");
const path = require("path");


// IMAGE VALIDATION
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/productimage"); // Specify the destination folder for storing uploaded files
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });


class productController {
    static async ProductController(req, res) {
        // Use upload.single("image") as middleware to handle file upload
        try {
            upload.single("image")(req, res, async (error) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: "File upload failed" });
                }

                var productname = req.body.productname; // Move this line here
                if (!productname || productname.trim() === '') {
                    return res.status(400).json({ error: "Product name is required" });
                }

                var price = req.body.price;
                var description = req.body.description;
                var countity = req.body.countity;
                var subcatagory = req.body.subcatagory;
                var catagory = req.body.catagory;

                // Check if a file is included in the request
                if (!req.file) {
                    return res.status(400).json({ error: "Image file is required" });
                }

                var image = req.file.filename; // Store the uploaded image filename

                var productId = await productModel.createProduct(
                    productname,
                    price,
                    description,
                    countity,
                    image,
                    subcatagory,
                    catagory
                );

                console.log(productId);

                res.status(200).json({
                    success: "Store and Image Upload Successful",
                    data: {
                        productId,
                        productname,
                        price,
                        description,
                        countity,
                        image,
                        subcatagory,
                        catagory
                    },
                });
            });
        } catch (error) {
            console.log(error);
        }
    }
}


module.exports = productController;