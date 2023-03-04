import { NextUIProvider } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Container, Card, Row, Text, Col } from "@nextui-org/react";
import { Input, Spacer, Link } from "@nextui-org/react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, remove, get } from "firebase/database";
import React, { useState } from "react";
import { useList, useListKeys } from "react-firebase-hooks/database";

var config = require("../modules/config.js");

const app = initializeApp(config.firebase);
const db = getDatabase(app);

export default function Home() {
  var roomID = "TESTI";

  const removePlayer = (event, roomID, player) => {
    remove(ref(db, "room/" + roomID + "/leaderboard/" + player));
    console.log("Room removed at ID: '" + roomID + " player at " + player);
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
                  {roomID}
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
                <p>
                  {error && <strong>Error: {error}</strong>}
                  {loading && <span>List: Loading...</span>}
                  {!loading && snapshots && (
                    <React.Fragment>
                      <span>
                        Players:{""}
                        {snapshots.map((v) => {
                          if (players.includes(v) == false) {
                            players.push(v);
                            return (
                              <React.Fragment>
                                <Button
                                  color="error"
                                  onClick={(event) =>
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
                </p>

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
