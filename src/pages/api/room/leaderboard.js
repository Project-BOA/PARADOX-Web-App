import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

var config = require("../../../modules/config.js");

const app = initializeApp(config.firebase);
const db = getDatabase(app);

export default async function handler(req, res) {
  // TODO:
  // verify room exists
  // validate input

  var roomID = req.body.roomID;

  if (roomID == null) {
    res.status(400).json({
      status: "Invalid input",
    });
    return;
  }

  var leaderboard = [];
  await get(ref(db, "room/" + roomID + "/leaderboard"))
    .then((snapshot) => {
      leaderboard = Object.entries(snapshot.toJSON())
        .sort((a, b) => {
          if (a[1] < b[1]) return 1;
          if (a[1] > b[1]) return -1;
          return 0;
        })
        .map((entry, index) => ({
          position: index + 1,
          name: entry[0],
          score: entry[1],
        }));
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        status: "ERROR",
      });
    });

  if (leaderboard == null) {
    res.status(400).json({
      status: "Unknown Room ID",
    });
  }

  res.status(200).json({
    status: "OK",
    leaderboard: leaderboard,
  });
}
