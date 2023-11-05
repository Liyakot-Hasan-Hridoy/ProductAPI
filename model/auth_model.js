const database = require("../config/dbconnection");

class AuthModel {
  static async createUser(name, email, phone, password, type, gender, occupation, image, address) {
    return new Promise((resolve, reject) => {
      database.query(
        "INSERT INTO users (name, email, phone, password, type, gender, occupation, image, address) VALUES(?,?,?,?,?,?,?,?,?)",
        [name, email, phone, password, type, gender, occupation, image, address],
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

  
  static async login(email, password) {
    return new Promise((resolve, reject) => {
      database.query(
        "SELECT id, name, email, phone, type, gender, occupation, image, address FROM users WHERE email = ? AND password = ?",
        [email, password],
        (error, results) => {
          if (!error) {
            if (results.length > 0) {
              resolve(results[0]); // Resolve with the user data
            } else {
              resolve(null); // Resolve with null if no user is found
            }
          } else {
            reject(error); // Reject with the error
          }
        }
      );
    });
  }

  // Add this method to your AuthModel
static async getAllUsers() {
  return new Promise((resolve, reject) => {
    database.query(
      "SELECT id, name, email, phone, type, gender, occupation, image, address FROM users",
      (error, results) => {
        if (!error) {
          resolve(results); // Resolve with the list of users
        } else {
          reject(error); // Reject with the error
        }
      }
    );
  });
}


// Add this method to your AuthModel
static async getSingleUser(userId) {
  return new Promise((resolve, reject) => {
    database.query(
      "SELECT id, name, email, phone, type, gender, occupation, image, address FROM users WHERE id = ?",
      [userId],
      (error, results) => {
        if (!error) {
          if (results.length > 0) {
            resolve(results[0]); // Resolve with the single user data
          } else {
            resolve(null); // Resolve with null if no user is found
          }
        } else {
          reject(error); // Reject with the error
        }
      }
    );
  });
}


static async updateUser(userId, name, email, phone, type, gender, occupation, image, address) {
  return new Promise((resolve, reject) => {
    database.query(
      "UPDATE users SET name = ?, email = ?, phone = ?, type = ?, gender = ?, occupation = ?, image = ?, address = ? WHERE id = ?",
      [name, email, phone, type, gender, occupation, image, address, userId],
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
  });
}


// Add this method to your AuthModel
static async searchUsers(query) {
  return new Promise((resolve, reject) => {
    database.query(
      "SELECT id, name, email, phone, type, gender, occupation, image, address FROM users WHERE name LIKE ? OR email LIKE ? OR occupation LIKE ?",
      [`%${query}%`, `%${query}%`, `%${query}%`],
      (error, results) => {
        if (!error) {
          resolve(results);
        } else {
          reject(error);
        }
      }
    );
  });
}


  
}

module.exports = AuthModel;
