const database = require("../config/dbconnection");

class AuthModel {
  static async createUser(name, email, phone, password, type, gender, occupation, image) {
    return new Promise((resolve, reject) => {
      database.query(
        "INSERT INTO users (name, email, phone, password, type, gender, occupation, image) VALUES(?,?,?,?,?,?,?,?)",
        [name, email, phone, password, type, gender, occupation, image],
        (error, result) => {
          if (!error) {
            resolve(result.insertId); // Resolve with the user ID
          } else {
            reject(error); // Reject with the error
          }
        }
      );
    });
  }
}

module.exports = AuthModel;
