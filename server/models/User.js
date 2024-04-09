const mysql = require('mysql2/promise');

class User {
  constructor(id, username, email, bio, profileImageUrl) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.bio = bio;
    this.profileImageUrl = profileImageUrl;
  }

  static async findById(user_id) {
    try {
      const [rows] = await mysql.execute('SELECT * FROM users WHERE user_id = ?', [user_id]);
      if (rows.length === 0) {
        return null;
      }
      return new User(rows[0].id, rows[0].username, rows[0].email, rows[0].bio, rows[0].profileImage);
    } catch (error) {
      console.error(error);
      throw error; // Re-throw for error handling in controller
    }
  }
}

module.exports = User