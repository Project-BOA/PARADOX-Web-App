import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

var config = require("@/modules/config.js");

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

  var room;
  await get(ref(db, "room/" + roomID))
    .then((snapshot) => {
      if (snapshot.exists()) {
        room = snapshot.toJSON();
      } else {
        console.log("Room does not exist");
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: "ERROR",
      });
      console.error(error);
    });
  var puzzleType;
  await get(ref(db, "puzzle/" + room.puzzleID + "/puzzleType"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        puzzleType = snapshot.val();
      } else {
        res.status(500).json({
          status: "No puzzle type available",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: "ERROR",
      });
      console.error(error);
    });

  if (puzzleType == "multi") {
    set(ref(db, "room/" + roomID + "/leaderboard/" + username), { score: 0 });
  } else {
    set(ref(db, "room/" + roomID + "/leaderboard/" + username), 0);
  }

  res.status(200).json({
    status: "OK",
    score: 0,
  });
}
