import { NextUIProvider } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Container, Card, Row, Text, Col } from "@nextui-org/react";
import { Spacer, Link } from "@nextui-org/react";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  get,
  push,
  update,
  set,
} from "firebase/database";
import React from "react";
import { useList, useListKeys } from "react-firebase-hooks/database";
import { useRouter } from "next/router";

var config = require("@/modules/config.js");

const app = initializeApp(config.firebase);
const db = getDatabase(app);

export default function Leaderboard(data) {
  const router = useRouter();
  const { roomID } = router.query;

  // function Leaderboard() {
  //   var players = [];
  //   var position = 1;

  //   const [snapshots, loading, error] = useList(
  //     ref(db, "room/" + roomID + "/leaderboard")
  //   );
  //   return (
  //     <>
  //       {error && (
  //         <Text h2 size={30} weight="bold" align="center">
  //           Error: {error}
  //         </Text>
  //       )}
  //       {loading && (
  //         <Text h2 size={30} align="center">
  //           Loading Leaderboard...
  //         </Text>
  //       )}
  //       {!loading && snapshots && (
  //         <React.Fragment>
  //           <Text h2 size={30} align="center">
  //             Leaderboard
  //           </Text>
  //           <Spacer y={2.5} />
  //           {snapshots
  //             .sort((a, b) => {
  //               var scoreA = a.val();
  //               var scoreB = b.val();
  //               if (a.hasChild("score")) {
  //                 scoreA = scoreA.score;
  //                 scoreB = scoreB.score;
  //               }
  //               if (scoreA < scoreB) return 1;
  //               if (scoreA > scoreB) return -1;
  //               return 0;
  //             })
  //             .map((snap, index) => {
  //               var name = snap.key;
  //               var score = snap.val();
  //               if (snap.hasChild("score")) {
  //                 score = score.score;
  //               }
  //               console.log(score);
  //               if (!players.includes(name)) {
  //                 players.push(name);
  //                 return (
  //                   <React.Fragment key={name}>
  //                     <Text h3 size={25} align="center">
  //                       {position++}. {name} - {score} points
  //                     </Text>
  //                     <Spacer y={2.5} />
  //                   </React.Fragment>
  //                 );
  //               }
  //             })}
  //         </React.Fragment>
  //       )}
  //     </>
  //   );
  // }

  function Leaderboard() {
    var position = 1;
    var check = [];

    return data.players.map((item, index) => {
      var name = data.players[index][0];
      var score = data.players[index][1];

      if (!check.includes(name)) {
        check.push(name);

        return (
          <React.Fragment key={name}>
            <Text h3 size={25} align="center">
              {position++}. {name} - {score} points
            </Text>
            <Spacer y={2.5} />
          </React.Fragment>
        );
      }
    });
  }

  async function endRoom() {
    const data = {
      roomID: roomID,
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

  return (
    <NextUIProvider>
      <Container gap={0}>
        <Row gap={1}>
          <Col>
            <Card css={{ $$cardColor: "#CC083E" }}>
              <Card.Body>
                <Text h1 size={60} css={{ m: 0 }} weight="bold" align="center">
                  {"Room ID: " + roomID}
                </Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Spacer y={1} />
        <Row gap={1}>
          <Col>
            <Card css={{ $$cardColor: "#00764F" }}></Card>
          </Col>
          <Col>
            <Card css={{ $$cardColor: "#00764F" }}>
              <Card.Body>
                <Leaderboard />
                <Button
                  onPress={(event) => {
                    endRoom();
                  }}
                >
                  End
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card css={{ $$cardColor: "#00764F" }}></Card>
          </Col>
        </Row>
      </Container>
    </NextUIProvider>
  );
}

export async function getServerSideProps(context) {
  if (context.query.roomID == undefined) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
  var leaderboard;
  await get(ref(db, "room/" + context.query.roomID + "/leaderboard")).then(
    (snapshot) => {
      leaderboard = snapshot.val();
    }
  );
  var puzzleID;

  await get(ref(db, "room/" + context.query.roomID + "/puzzleID")).then(
    (snapshot) => {
      puzzleID = snapshot.val();
    }
  );
  var puzzleType;
  await get(ref(db, "puzzle/" + puzzleID + "/puzzleType")).then((snapshot) => {
    if (snapshot.exists()) {
      puzzleType = snapshot.val();
    } else {
      console.log("No puzzle type available");
    }
  });

  var title;
  await get(ref(db, "puzzle/" + puzzleID + "/title")).then((snapshot) => {
    if (snapshot.exists()) {
      title = snapshot.val();
    } else {
      console.log("No puzzle type available");
    }
  });

  var players = [];
  const date = new Date();
  const currentDate = date.toLocaleDateString();

  if (puzzleType == "multi") {
    for (var player in leaderboard) {
      players.push([player, leaderboard[player].score]);

      await update(ref(db, "users/" + player + "/solved/" + title), {
        completedOn: currentDate,
        points: leaderboard[player].score,
      });
    }
  } else {
    for (var player in leaderboard) {
      players.push([player, leaderboard[player]]);
      await update(ref(db, "users/" + player + "/solved/" + title), {
        completedOn: currentDate,
        points: leaderboard[player],
      });

      console.log(player);
    }
  }

  players.sort(function (a, b) {
    return a[1] - b[1];
  });

  players = players.reverse();

  return { props: { players } };
}
