const database = require("../../config/dbconnection");

class ProductModel {

  // CREATE PRODUCT
  static async createProduct(productname, price, description, quantity, image, subcategory, category) {
    return new Promise((resolve, reject) => {
      database.query(
        "INSERT INTO product (productname, price, description, quantity, image, subcategory, category) VALUES (?,?,?,?,?,?,?)",
        [productname, price, description, quantity, image, subcategory, category],
        (error, result) => {
          if (!error) {
            console.log(result);
            resolve(result.insertId);
            // Resolve with the product ID
          } else {
            console.log(error);
            reject(error); // Reject with the error
          }
        }
      );
    });
  } // CREATE PRODUCT


   // GET PRODUCT
  static async getAllProduct() {
    return new Promise((resolve, reject) => {
      database.query(
        "SELECT id, productname, price, description, quantity, image, subcategory, category FROM product",
        (error, results) => {
          if (!error) {
            resolve(results);
          } else {
            reject(error);
          }
        }
      );
    });
  }// GET PRODUCT


  // GET CAREGORY
  static async getAllCategories() {
    return new Promise((resolve, reject) => {
      database.query(
        "SELECT DISTINCT category FROM product",
        (error, results) => {
          if (!error) {
            const categories = results.map((row) => ({ category: row.category }));
            resolve(categories);
          } else {
            reject(error);
          }
        }
      );
    });
  }// GET CAREGORY


  // GET SEARFH  CAREGORY
  static async getallcategory() {
    return new Promise((resolve, reject) => {
      database.query(
        "SELECT id, name FROM category",
        (error, results) => {
          if (!error) {
            resolve(results);
          } else {
            reject(error);
          }
        }
      );
    });
  }// GET SEARFH  CAREGORY


  //  UPDATE PRODUCT START============>>>>>>>>
static async updateProduct(id, productname, price, description, quantity, image, subcategory, category) {
  return new Promise((resolve, reject) => {
    // console.log("Before database query");
    database.query(
      "UPDATE product SET productname = ?, price = ?, description = ?, quantity = ?, image = ?, subcategory = ?, category = ? WHERE id = ?",
      [productname, price, description, quantity, image, subcategory, category, id],
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    // console.log("After database query");
  });
}//  UPDATE PRODUCT END============>>>>>>>>


}

module.exports = ProductModel;
