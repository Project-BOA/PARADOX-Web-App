import { initializeApp } from "firebase/app";
import { ref, update } from "firebase/database";
import { withIronSessionApiRoute } from "iron-session/next";

const { database } = require("@/modules/firebase-config.js");
const bcrypt = require("bcrypt");

export default async function handler(req, res) {
  var username = req.body.username;
  username = username.trim();

  update(ref(database, "users/" + username), {
    loggedIn: false,
  });

  res.status(200).json({
    status: username + " logged out",
  });
  return;
}
