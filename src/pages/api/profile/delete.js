import { getDatabase, ref, get, remove } from "firebase/database";

const { database } = require("@/modules/firebase-config.js");
const { auth } = require("@/modules/authentication.js");

export default async function handler(req, res) {
  // authentication
  var username = req.body.username;
  var password = req.body.password;

  // check authentication
  var user = await auth(username, password);

  if (user == false) {
    res.status(400).json({
      status: "Incorrect Username or Password",
    });
    return;
  }

  // ================ after authentication ================

  // after authentication remove user
  remove(ref(database, "users/" + username));

  res.status(200).json({
    status: "OK",
  });
}
