import { initializeApp } from "firebase/app";
import { getDatabase, ref, remove } from "firebase/database";

var config = require("@/modules/config.js");

const app = initializeApp(config.firebase);
const db = getDatabase(app);

export default async function create(req, res) {
  // TODO
  // Validate input to only allow roomID values
  // add authentication to who is allowed to destroy room
  var roomID = req.body.roomID;

  remove(ref(db, "room/" + roomID));

  console.log("Room removed at ID: '" + roomID + "'");

  res.status(200).json({
    status: "OK",
  });
}
