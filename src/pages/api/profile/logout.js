import { ref, update } from "firebase/database";

const { auth } = require("@/modules/authentication.js");
const { database } = require("@/modules/firebase-config.js");

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

  res.status(200).json({
    status: username + " logged out",
  });
  return;
}
