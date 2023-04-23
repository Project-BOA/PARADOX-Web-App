import { ref, get } from "firebase/database";
const bcrypt = require("bcryptjs");

const { database } = require("@/modules/firebase-config.js");

const validator = require("validator");

// wrapper for hashing new passwords
function hashPassword(plain_password) {
  return bcrypt.hashSync(plain_password, 12);
}

// authenticating username and hashed password
// if user authenticated return profile otherwise return false
async function auth(username, password) {
  if (username == undefined || password == undefined) {
    return false;
  }

  // sanitization checks

  // if username or password are not ascii
  if (!validator.isAscii(username) || !validator.isAscii(password)) {
    return false;
  }

  // trim whitespace
  username = username.trim();
  password = password.trim();

  var profile;
  await get(ref(database, "users/" + username))
    .then((snapshot) => {
      if (snapshot.exists()) {
        if (bcrypt.compareSync(password, snapshot.val().password)) {
          profile = snapshot.toJSON();
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });

  return profile ?? false;
}

// check if username exists
async function userExists(username) {
  var authenticated = false;

  if (username == null) {
    return authenticated;
  }

  // sanitization checks

  // if username or password are not ascii
  if (!validator.isAscii(username)) {
    return authenticated;
  }

  // trim whitespace
  username = username.trim();

  await get(ref(database, "users/" + username))
    .then((snapshot) => {
      if (snapshot.exists()) {
        authenticated = true;
      }
    })
    .catch((error) => {
      console.error(error);
    });

  return authenticated;
}

module.exports = {
  hashPassword,
  auth,
  userExists,
};
