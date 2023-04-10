import { Spacer, Text } from "@nextui-org/react";
import { useList } from "react-firebase-hooks/database";
import { Fragment } from "react";
import { initializeApp } from "firebase/app";
import { ref, getDatabase } from "firebase/database";
import { useRouter } from "next/router";

const { config } = require("@/modules/firebase-config.js");
const app = initializeApp(config);
const database = getDatabase(app);

function getOrdinal(n) {
  let ord = "th";

  if (n % 10 == 1 && n % 100 != 11) {
    ord = "st";
  } else if (n % 10 == 2 && n % 100 != 12) {
    ord = "nd";
  } else if (n % 10 == 3 && n % 100 != 13) {
    ord = "rd";
  }

  return n + ord;
}

async function endRoom(router, roomID) {
  const data = {
    roomID,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch("api/room/remove", options);
  const result = await response.json();
  if (result.status == "OK") {
    router.push("/");
  } else {
    alert("Status: " + result.status);
  }
}

function LeaderboardEntries({ roomID }) {
  const [snapshots, loading, error] = useList(
    ref(database, "room/" + roomID + "/leaderboard")
  );

  return (
    <>
      {error && (
        <Text h2 size={30} weight="bold" align="center">
          Error: {error}
        </Text>
      )}
      {loading && (
        <Text h2 size={30} align="center">
          Loading Leaderboard...
        </Text>
      )}
      {!loading && snapshots && (
        <Fragment>
          <Text h2 size={30} align="center">
            Leaderboard
          </Text>
          <Spacer y={2.5} />
          {snapshots.map((snap) => {
            return [snap.key, snap.val().score ?? snap.val()];
          })}
        </Fragment>
      )}
    </>
  );
}

function LeaderboardMapper({ entries }) {
  var players = [];
  var position = 1;

  return entries.map((entry) => {
    var name = entry[0];
    var score = entry[1];
    if (!players.includes(name)) {
      players.push(name);
      return (
        <Fragment key={name}>
          <Text h3 size={30} align="center">
            {getOrdinal(position++)}. {name} - {score} points
          </Text>
          <Spacer y={2.5} />
        </Fragment>
      );
    }
  });
}

module.exports = {
  LeaderboardMapper,
  LeaderboardEntries,
  endRoom,
};
