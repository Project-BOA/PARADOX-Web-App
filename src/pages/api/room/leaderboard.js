import { ref, get } from "firebase/database";

const { database } = require("@/modules/firebase-config.js");

const { leaderboardMapper } = require("@/modules/leaderboard");

export default async function handler(req, res) {
  var roomID = req.body.roomID;

  if (roomID == null) {
    res.status(400).json({
      status: "Invalid request body",
    });
    return;
  }

  // match first 5 uppercase letters with with regex
  var validation = roomID.match(/[A-Z0-9]{5}?/);
  if (validation == null) {
    res.status(400).json({
      status: "Invalid RoomID",
    });
    return;
  } else {
    roomID = validation[0]; // first matched substring
  }

  var leaderboard;
  await get(ref(database, "room/" + roomID + "/leaderboard"))
    .then((snapshot) => {
      leaderboard = leaderboardMapper(Object.entries(snapshot.toJSON()));
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
