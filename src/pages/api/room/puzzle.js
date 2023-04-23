import { ref, get } from "firebase/database";

const { database } = require("@/modules/firebase-config.js");

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

  var puzzleID;
  await get(ref(database, "room/" + roomID + "/puzzleID"))
    .then((snapshot) => {
      puzzleID = snapshot.val();
    })
    .catch((error) => {
      res.status(500).json({
        status: "ERROR",
      });
      console.error(error);
    });

  var puzzle;
  await get(ref(database, "puzzle/" + puzzleID))
    .then((snapshot) => {
      puzzle = snapshot.toJSON();
    })
    .catch((error) => {
      res.status(500).json({
        status: "ERROR",
      });
      console.error(error);
    });

  res.status(200).json({
    status: "OK",
    puzzle: puzzle,
  });
}
