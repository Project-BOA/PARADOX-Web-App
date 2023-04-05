import { getDatabase, ref, get, remove } from "firebase/database";

const { database } = require("@/modules/firebase-config.js");
const bcrypt = require("bcrypt");

export default async function handler(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if (username == null || password == null) {
    res.status(400).json({
      status: "Invalid input",
    });
    return;
  }

  var user;
  await get(ref(database, "users/" + username))
    .then((snapshot) => {
      user = snapshot.toJSON();
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        status: "ERROR",
      });
    });

  if (user == null || !bcrypt.compareSync(password, user.password)) {
    res.status(400).json({
      status: "Username or Password Incorrect",
    });
    return;
  }

  // after authentication remove user
  remove(ref(database, "users/" + username));

  res.status(200).json({
    status: "OK",
  });
}
