import { ref, set, get, update } from "firebase/database";

const { database } = require("@/modules/firebase-config.js");
var Filter = require("bad-words"),
  filter = new Filter();
export default async function handler(req, res) {
  // TODO:
  // validate input
  // verify roomID exists
  // verify user is in room
  // authenticate username

  var username = req.body.username;
  var answer = req.body.answer;
  var roomID = req.body.roomID;

  if (filter.isProfane(answer)) {
    res.status(400).json({
      status: "Lets Keep it PG",
    });
    return;
  }

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

  answer = answer.toLowerCase();

  // get the room as a JSON object
  var room;
  await get(ref(database, "room/" + roomID))
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
  await get(ref(database, "puzzle/" + room.puzzleID + "/puzzleType"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        puzzleType = snapshot.val().toUpperCase();
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

  // check answer
  if (puzzleType == "MULTI") {
    var puzzleAnswers;
    await get(ref(database, "puzzle/" + room.puzzleID + "/answers"))
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
    await get(ref(database, "puzzle/" + room.puzzleID + "/answer"))
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

  if (puzzleType == "TIME") {
    if (answer == puzzleAnswer.toLowerCase()) {
      set(
        ref(database, "room/" + roomID + "/leaderboard/" + username),
        room.leaderboard[username] + room.points
      ).catch((error) => {
        res.status(500).json({
          status: "ERROR",
        });
        console.error(error);
      });
    }
  } else if (puzzleType == "SINGLE") {
    if (answer == puzzleAnswer.toLowerCase()) {
      set(
        ref(database, "room/" + roomID + "/leaderboard/" + username),
        room.leaderboard[username] + 100
      ).catch((error) => {
        res.status(500).json({
          status: "ERROR",
        });
        console.error(error);
      });
    }
  } else if (puzzleType == "MULTI") {
    if (!room.leaderboard[username].hasOwnProperty("solved")) {
      room.leaderboard[username].solved = {};
    }

    if (!room.leaderboard[username].solved.hasOwnProperty(answer)) {
      if (answer == puzzleAnswers.overall.toLowerCase()) {
        room.leaderboard[username].solved[answer] = answer;
        set(
          ref(database, "room/" + roomID + "/leaderboard/" + username + "/"),
          {
            score: room.leaderboard[username].score + 100,
            solved: room.leaderboard[username].solved,
          }
        ).catch((error) => {
          res.status(500).json({
            status: "ERROR with Multi Puzzle",
          });
        });
      } else {
        if (puzzleAnswers.partial.hasOwnProperty(answer)) {
          room.leaderboard[username].solved[answer] =
            puzzleAnswers.partial[answer];

          set(
            ref(database, "room/" + roomID + "/leaderboard/" + username + "/"),
            {
              score:
                room.leaderboard[username].score +
                puzzleAnswers.partial[answer],
              solved: room.leaderboard[username].solved,
            }
          ).catch((error) => {
            res.status(500).json({
              status: "ERROR with answer",
            });
            console.error(error);
          });
        } else {
          var score = room.leaderboard[username].score;
          score -= 50;
          if (score <= 0) {
            score = 0;
          }
          room.leaderboard[username].score = score;
          update(
            ref(database, "room/" + roomID + "/leaderboard/" + username + "/"),
            {
              score: (room.leaderboard[username].score = score),
            }
          ).catch((error) => {
            res.status(500).json({
              status: "ERROR with answer",
            });
            console.error(error);
          });
        }
      }
    }
  }

  res.status(200).json({
    status: "OK - " + puzzleType,
    score: room.leaderboard[username],
    puzzleID: room.puzzleID,
  });
}
