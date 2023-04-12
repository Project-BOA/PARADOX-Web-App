import { ref, set, get } from "firebase/database";

const { database } = require("@/modules/firebase-config.js");

export default async function create(req, res) {
  // TODO:
  // check if user already in room
  // authenticate username

  var username = req.body.username;
  var roomID = req.body.roomID;

  if (username == null || roomID == null) {
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

  var room;
  await get(ref(database, "room/" + roomID))
    .then((snapshot) => {
      if (snapshot.exists()) {
        room = snapshot.toJSON();
      } else {
        res.status(404).json({
            status: "Room does not exist",
          });
            return
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: "ERROR",
      });
        console.error(error);
        return
        
    });
  var puzzleType;
  await get(ref(database, "puzzle/" + room.puzzleID + "/puzzleType"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        puzzleType = snapshot.val();
      } else {
        res.status(500).json({
          status: "No puzzle type available",
        });
          return
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: "ERROR",
      });
        console.error(error);
        return
        
    });

  if (puzzleType == "multi") {
    set(ref(database, "room/" + roomID + "/leaderboard/" + username), {
      score: 0,
    });
  } else {
    set(ref(database, "room/" + roomID + "/leaderboard/" + username), 0);
  }

  res.status(200).json({
    status: "OK",
    score: 0,
  });
}
