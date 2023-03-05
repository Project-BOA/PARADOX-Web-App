import { NextUIProvider } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Container, Card, Row, Text, Col } from "@nextui-org/react";
import { Spacer, Link } from "@nextui-org/react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, remove, get } from "firebase/database";
import React from "react";
import { useList, useListKeys } from "react-firebase-hooks/database";
import { useRouter } from "next/router";

var config = require("../modules/config.js");

const app = initializeApp(config.firebase);
const db = getDatabase(app);

export default function Leaderboard() {
  const router = useRouter();
  const { roomID } = router.query;

  function Leaderboard() {
    var players = [];
    var position = 1;
    const [snapshots, loading, error] = useList(
      ref(db, "room/" + roomID + "/leaderboard")
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
          <React.Fragment>
            <Text h2 size={30} align="center">
              Leaderboard
            </Text>
            <Spacer y={2.5} />
            {snapshots
              .sort((a, b) => {
                if (a.val() < b.val()) return 1;
                if (a.val() > b.val()) return -1;
                return 0;
              })
              .map((snap, index) => {
                var name = snap.key;
                var score = snap.val();
                if (!players.includes(name)) {
                  players.push(name);
                  return (
                    <React.Fragment key={name}>
                      <Text h3 size={25}>
                        {position++}. {name} - {score} points
                      </Text>
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
      router.push("/app");
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
