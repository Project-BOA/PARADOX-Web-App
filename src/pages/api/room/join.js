import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

var config = require("../../../modules/config.js");

const app = initializeApp(config.firebase);
const db = getDatabase(app);

export default async function create(req, res) {
  // TODO:
  // validate input
  // verify roomID exists
  // check if user already in room
  // authenticate username

  var username = req.body.username;
  var roomID = req.body.roomID;

  console.log("User: '" + username + "' joined room with ID: '" + roomID + "'");

  set(ref(db, "room/" + roomID + "/leaderboard"), {
    username: 0,
  });

  res.status(200).json({
    status: "OK",
    score: 0,
  });
}