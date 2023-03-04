import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

var config = require("../../Config.js");

const app = initializeApp(config.firebase);
const db = getDatabase(app);

var randomstring = require("randomstring");

export default async function create(req, res) {
  // TODO:
  // validate input
  // verify puzzle exists
  // check roomID does not already exist
  var puzzleID = req.body.puzzleID;
  var roomID = randomstring.generate(5).toUpperCase();

  console.log("Room Created with ID: '" + roomID + "'");

  set(ref(db, "room/" + roomID), {
    puzzleID: puzzleID,
  });

  res.status(200).json({
    status: "OK",
    roomID: roomID,
  });
}
