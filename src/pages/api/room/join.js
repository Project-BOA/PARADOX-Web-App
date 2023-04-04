import { getDatabase, ref, set, get } from "firebase/database";

const { firebaseApp } = require("@/modules/config.js"),
  db = getDatabase(firebaseApp);

export default async function create(req, res) {
  // TODO:
  // validate input
  // verify roomID exists
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
