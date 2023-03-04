import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

var config = require("../../../Config.js");

const app = initializeApp(config.firebase);
const db = getDatabase(app);

export default async function handler(req, res) {
  // TODO:
  // validate input
  // verify roomID exists
  // verify user is in room
  // authenticate username

  var username = req.body.username;
  var answer = req.body.answer;
  var roomID = req.body.roomID;

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

  console.log(
    "User: '" +
      username +
      "' submitted answer: '" +
      answer +
      "' to room with ID: '" +
      roomID +
      "'"
  );

  // check answer
  var puzzleAnswer;
  await get(ref(db, "puzzle/" + room.puzzleID + "/answer"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        puzzleAnswer = snapshot.val();
      } else {
        console.log("No answer available");
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: "ERROR",
      });
      console.error(error);
    });

  if (answer == puzzleAnswer) {
    set(ref(db, "room/" + roomID + "/" + username), {
      score: room[username].score + 5,
    }).catch((error) => {
      res.status(500).json({
        status: "ERROR",
      });
      console.error(error);
    });
  }
  else{
    set(ref(db, "room/" + roomID + "/" + username), {
      score: room[username].score + 0,
    }).catch((error) => {
      res.status(500).json({
        status: "ERROR",
      });
      console.error(error);
    });
  }

  res.status(200).json({
    status: "OK",
    score: room[username].score,
    puzzleID: room.puzzleID,
  });
}
