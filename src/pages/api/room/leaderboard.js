import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

var config = require("../../../modules/config.js");

const app = initializeApp(config.firebase);
const db = getDatabase(app);

export default async function handler(req, res) {
  var roomID = req.body.roomID;

  if (roomID == null) {
    res.status(400).json({
      status: "Invalid input",
    });
    return;
  }

  var leaderboard;
  await get(ref(db, "room/" + roomId + "/leaderboard"), (snapshot) => {
    leaderboard = snapshot.toJSON();
  });

  if (leaderboard == null) {
    res.status(400).json({
      status: "Unknown puzzle ID",
    });
    return;
  }

  res.status(200).json({
    status: "OK",
    leaderboard: leaderboard,
  });
}