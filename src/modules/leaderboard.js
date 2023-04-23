import { Spacer, Text } from "@nextui-org/react";
import { Fragment } from "react";

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

function LeaderboardEntries({ entries }) {
  return leaderboardMapper(entries).map(({ name, score, position }) => {
    return (
      <Fragment key={name}>
        <Text h3 size={30} align="center">
          {position}. {name} - {score} points
        </Text>
        <Spacer y={2.5} />
      </Fragment>
    );
  });
}

function leaderboardMapper(entries) {
  // sort descending by score
  entries = entries.sort((a, b) => {
    return (b[1].score ?? b[1]) - (a[1].score ?? a[1]);
  });

  var players = [];
  var position = 1;
  var name;

  return entries.map((entry) => {
    name = entry[0];
    if (!players.includes(name)) {
      players.push(name);
      return {
        name,
        score: entry[1].score ?? entry[1],
        position: getOrdinal(position++),
      };
    }
  });
}

module.exports = {
  LeaderboardEntries,
  endRoom,
  leaderboardMapper,
  getOrdinal,
};
