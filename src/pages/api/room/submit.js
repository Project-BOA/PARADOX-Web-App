import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

var config = require("../../../modules/config.js");

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

  // get the room as a JSON object
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
    var puzzleAnswers;
    await get(ref(db, "puzzle/" + room.puzzleID + "/answers"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          puzzleAnswers = snapshot.toJSON();
        } else {
          res.status(500).json({
            status: "No answer available",
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          status: "ERROR",
        });
        console.error(error);
      });
  } else {
    // check answer
    var puzzleAnswer;
    await get(ref(db, "puzzle/" + room.puzzleID + "/answer"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          puzzleAnswer = snapshot.val();
        } else {
          res.status(500).json({
            status: "No answer available",
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          status: "ERROR",
        });
        console.error(error);
      });
  }
  if (puzzleType == "time") {
    if (answer == puzzleAnswer) {
      set(
        ref(db, "room/" + roomID + "/leaderboard/" + username),
        room.leaderboard[username] + room.points
      ).catch((error) => {
        res.status(500).json({
          status: "ERROR",
        });
        console.error(error);
      });
    }
  } else if (puzzleType == "single") {
    if (answer == puzzleAnswer) {
      set(
        ref(db, "room/" + roomID + "/leaderboard/" + username),
        room.leaderboard[username] + 100
      ).catch((error) => {
        res.status(500).json({
          status: "ERROR",
        });
        console.error(error);
      });
    }
  } else if (puzzleType == "multi") {
    //user can guess any answer at any time
    //wrong answers reduce points
    if (answer == puzzleAnswers.overall) {
      set(
        ref(db, "room/" + roomID + "/leaderboard/" + username),
        room.leaderboard[username] + 100
      ).catch((error) => {
        res.status(500).json({
          status: "ERROR",
        });
        console.error(error);
      });
    }
  }

  res.status(200).json({
    status: "OK",
    score: room.leaderboard[username],
    puzzleID: room.puzzleID,
  });
}
