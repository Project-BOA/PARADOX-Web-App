import { NextUIProvider } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Container, Card, Row, Text, Col, Grid } from "@nextui-org/react";
import { Spacer, Link } from "@nextui-org/react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, remove, get } from "firebase/database";
import React, { useState } from "react";
import { useListKeys } from "react-firebase-hooks/database";
import { useRouter } from "next/router";

var config = require("@/modules/config.js");

const app = initializeApp(config.firebase);
const db = getDatabase(app);

export default function Room(data) {
  const router = useRouter();
  const { roomID } = router.query;

  function Room() {
    var players = [];
    const [snapshots, loading, error] = useListKeys(
      ref(db, "room/" + roomID + "/leaderboard")
    );
    const removePlayer = (event, roomID, player) => {
      remove(ref(db, "room/" + roomID + "/leaderboard/" + player));
      console.log("Room removed at ID: '" + roomID + " player at " + player);
      players.pop();
      if (players.length == 0) {
        router.push("/");
      }
    };
    return (
      <>
        {error && (
          <Text h2 size={30} weight="bold" align="center">
            Error: {error}
          </Text>
        )}
        {loading && (
          <Text h2 size={30} align="center">
            Loading Room...
          </Text>
        )}
        {!loading && snapshots && (
          <React.Fragment>
            <Text h2 size={30} align="center">
              Players
            </Text>
            <Spacer y={2.5} />
            {snapshots.map((v) => {
              if (!players.includes(v)) {
                players.push(v);
                return (
                  <React.Fragment key={v}>
                    <Button
                      align="center"
                      color="error"
                      style={{ margin: "auto", fontSize: "20px" }}
                      onPress={(event) => removePlayer(event, roomID, v)}
                    >
                      {v}
                    </Button>
                    <Spacer y={2.5} />
                  </React.Fragment>
                );
              }
            })}
          </React.Fragment>
        )}
      </>
    );
  }

  return (
    <NextUIProvider>
      <Container gap={0}>
        <Row gap={0}>
          <Col>
            <Card css={{ $$cardColor: "#CC083E" }}>
              <Card.Body>
                <Row>
                  <Col>
                    <Card>
                      <Card.Body>
                        <Text
                          h1
                          size={30}
                          css={{ m: 0 }}
                          weight="bold"
                          align="left"
                        >
                          {"Room ID: " + roomID}
                        </Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card>
                      <Card.Body>
                        <Text
                          h1
                          size={30}
                          css={{ m: 0 }}
                          weight="bold"
                          align="right"
                        >
                          {"Puzzle Name: " + data.title}
                        </Text>
                        <Text
                          h1
                          size={30}
                          css={{ m: 0 }}
                          weight="bold"
                          align="right"
                        >
                          {"Puzzle Name: " + data.puzzleType}
                        </Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <Button
                  onPress={(event) => {
                    router.push("/gameplay?roomID=" + roomID);
                  }}
                  color={"secondary"}
                >
                  Start
                </Button>
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
                <Room />
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
      title = "No Ttile";
      console.log("No puzzle piece available");
    }
  });
  console.log(title);
  return {
    props: { puzzleType, title }, // will be passed to the page component as props
  };
}
