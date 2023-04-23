import { ref, remove } from "firebase/database";

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
  await remove(ref(database, "users/" + username)).catch(() => {
    res.status(500).json({
      status: "ERROR",
    });
    return;
  });

  res.status(200).json({
    status: "OK",
  });
}
