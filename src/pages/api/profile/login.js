import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

var config = require("../../../modules/config.js");

const app = initializeApp(config.firebase);
const db = getDatabase(app);

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
  await get(ref(db, "users/" + username))
    .then((snapshot) => {
      user = snapshot.toJSON();
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        status: "ERROR",
      });
    });

  if (user == null || user.password != password) {
    res.status(400).json({
      status: "Username or Password Incorrect",
    });
    return;
  }

  res.status(200).json({
    status: "OK",
    biography: user.biography,
  });
}
