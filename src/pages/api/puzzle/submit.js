import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update } from "firebase/database";
import { use } from "react";
var config = require("@/modules/config.js");

const app = initializeApp(config.firebase);
const db = getDatabase(app);

var Filter = require("bad-words"),
  filter = new Filter();
export default async function handler(req, res) {
  const comment = req.body.comment;
  const username = req.body.username;
  const puzzleID = req.body.puzzleID;

  if (filter.isProfane(comment)) {
    res.status(400).json({
      status: "Lets Keep it PG",
    });
    return;
  }

  if (comment.length > 100) {
    res.status(400).json({
      status: "Max Comment length is less than 100",
    });
    return;
  }

  const date = Date.now();

  await update(ref(db, "puzzle/" + puzzleID + "/comments/" + username), {
    comment: comment,
    commentedOn: date,
  }).catch((error) => {
    res.status(500).json({
      status: "ERROR with comment",
    });
    console.error(error);
  });
  console.log("comment is: " + puzzleID);

  res.status(200).json({
    status: "OK",
    comment: comment,
    username: username,
  });
}
