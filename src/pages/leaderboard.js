import { NextUIProvider } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Container, Card, Row, Text, Col } from "@nextui-org/react";
import { Spacer } from "@nextui-org/react";
import {
  Button,
  Card,
  Col,
  Container,
  NextUIProvider,
  Row,
  Spacer,
  Text,
} from "@nextui-org/react";
import { getDatabase, ref, get, update } from "firebase/database";

import { useRouter } from "next/router";

const { firebaseApp } = require("@/modules/config.js"),
  db = getDatabase(firebaseApp);


export default function Leaderboard(data) {
  const router = useRouter();
  const { roomID } = router.query;

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

  var title;
  await get(ref(db, "puzzle/" + puzzleID + "/title")).then((snapshot) => {
    if (snapshot.exists()) {
      title = snapshot.val();
    } else {
      console.log("No puzzle type available");
    }
  });

  var players = [];
  const date = Date.now();

  for (var player in leaderboard) {
    players.push([player, leaderboard[player].score ?? leaderboard[player]]);

    await get(ref(db, "users/" + player + "/solved/" + title)).then(
      async (snapshot) => {
        if (!snapshot.exists()) {
          await update(ref(db, "users/" + player + "/solved/" + title), {
            completedOn: date,
            points: leaderboard[player].score ?? leaderboard[player],
          });
        }
      }
    );
  }

  players.sort(function (a, b) {
    return b[1] - a[1];
  });

  return { props: { players } };
}
