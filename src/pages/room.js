import { NextUIProvider } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Container, Card, Row, Text, Col } from "@nextui-org/react";
import { Spacer, Link } from "@nextui-org/react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, remove, get } from "firebase/database";
import React, { useState } from "react";
import { useList, useListKeys } from "react-firebase-hooks/database";
import { useRouter } from "next/router";

var config = require("../modules/config.js");

const app = initializeApp(config.firebase);
const db = getDatabase(app);

export default function Room() {
  const router = useRouter();

  const roomID = router.query.roomID;

  if (process.browser) {
    if (roomID == undefined) {
      router.push("/app");
    }
  }

  const removePlayer = (event, roomID, player) => {
    remove(ref(db, "room/" + roomID + "/leaderboard/" + player));
    console.log("Room removed at ID: '" + roomID + " player at " + player);
    players.pop();
    if (players.length == 0) {
      router.push("/");
    }
  };

  const [snapshots, loading, error] = useListKeys(
    ref(db, "room/" + roomID + "/leaderboard")
  );

  var players = [];
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
                <Text h1 size={30}>
                  {error && <strong>Error: {error}</strong>}
                  {loading && <span>Loading Room...</span>}
                  {!loading && snapshots && (
                    <React.Fragment>
                      <span>
                        Players:{""}
                        <Spacer y={2.5} />
                        {snapshots.map((v) => {
                          if (!players.includes(v)) {
                            return (
                              <React.Fragment key={v}>
                                <Button
                                  align="center"
                                  color="error"
                                  style={{ margin: "auto" }}
                                  onPress={(event) =>
                                    removePlayer(event, roomID, v)
                                  }
                                >
                                  {v}
                                </Button>

                                <Spacer y={2.5} />
                              </React.Fragment>
                            );
                          }
                        })}
                      </span>
                    </React.Fragment>
                  )}
                </Text>

                <Button color={"secondary"}>
                  <Link href="/gameplay">START</Link>
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
