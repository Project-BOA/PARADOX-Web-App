import { ref, get } from "firebase/database";
import { compareSync, hashSync } from "bcrypt";
const { database } = require("@/modules/firebase-config.js");

// wrapper for hashing new passwords
function hashPassword(plain_password) {
  return hashSync(plain_password, 12);
}

// authenticating username and password
async function auth(username, password) {
  var authenticated = false;

  if (username == null || password == null) {
    return authenticated;
  }

  await get(ref(database, "users/" + username))
    .then((snapshot) => {
      if (snapshot.exists()) {
        if (compareSync(password, snapshot.val().password)) {
          authenticated = true;
        }
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
};
