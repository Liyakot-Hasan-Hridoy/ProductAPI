const database = require("../../config/dbconnection");


class productModel {

    static async createProduct(productname, price, description, countity, image, subcatagory, catagory) {
        return new Promise((resolve, reject) => {
            database.query(
                "INSERT INTO product (productname, price, description, countity, image, subcatagory, catagory) VALUES(?,?,?,?,?,?,?)",
                [productname, price, description, countity, image, subcatagory, catagory],
                (error, result) => {
                    if (!error) {
                        resolve(result.insertId); // Resolve with the user ID
                    } else {
                        reject(error); // Reject with the error
                    }
                }
            );
        });
    };



}

module.exports = productModel;