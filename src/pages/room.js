import { Modal, NextUIProvider } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

import {
  createTheme,
  Container,
  Card,
  Row,
  Text,
  Col,
  Grid,
} from "@nextui-org/react";
import { Spacer, Link } from "@nextui-org/react";

import { getDatabase, ref, onValue, remove, get } from "firebase/database";
import React, { useState } from "react";
import { useListKeys } from "react-firebase-hooks/database";
import { useRouter } from "next/router";

import { theme } from "@/themes/theme.js";

const { database } = require("@/modules/firebase-config.js");

export default function Room(data) {
  const router = useRouter();
  const { roomID } = router.query;

  //Modal functionality
  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
  };

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

  function Room() {
    var players = [];
    const [snapshots, loading, error] = useListKeys(
      ref(database, "room/" + roomID + "/leaderboard")
    );
    const removePlayer = (event, roomID, player) => {
      remove(ref(database, "room/" + roomID + "/leaderboard/" + player));
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
            <Text h2 size={30} color="#17706E" align="center">
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
                      color="#F7F7EE"
                      style={{
                        color: "#F7F7EE",
                        margin: "auto",
                        fontSize: "20px",
                        backgroundColor: "#FB7813",
                      }}
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
    <NextUIProvider theme={theme}>
      <Container gap={0}>
        <Row gap={0}>
          <Col>
            <Card variant="bordered" css={{ $$cardColor: "#17706E" }}>
              <Card.Body>
                <Row>
                  <Col>
                    <Container>
                      <Card.Body>
                        <Text
                          h1
                          size={30}
                          css={{ m: 0 }}
                          weight="bold"
                          align="left"
                          color="#F7F7EE"
                        >
                          {data.title}
                        </Text>
                      </Card.Body>
                    </Container>
                  </Col>
                  <Col>
                    <Container>
                      <Text
                        h1
                        size={30}
                        css={{ m: 0 }}
                        weight="bold"
                        align="center"
                        color="#F7F7EE"
                      >
                        {"Room ID: " + roomID}
                      </Text>
                    </Container>
                  </Col>
                  <Col>
                    <Container>
                      <Card.Body>
                        <Text
                          h1
                          size={30}
                          css={{ m: 0 }}
                          weight="bold"
                          align="right"
                          color="#F7F7EE"
                        >
                          {"Type: " + data.puzzleType}
                        </Text>
                      </Card.Body>
                    </Container>
                  </Col>
                </Row>
                <Container>
                  <Button
                    onPress={(event) => {
                      router.push("/gameplay?roomID=" + roomID);
                    }}
                    size="lg"
                    css={{
                      color: "#17706E",
                      fontSize: "35px",
                      backgroundColor: "#FB7813",
                      marginInline: "auto",
                    }}
                  >
                    Start
                  </Button>
                  <React.Fragment>
                    <Button onPress={handler}>End</Button>
                    <Modal
                      closeButton
                      aria-labelledby="modal-title"
                      open={visible}
                      onClose={closeHandler}
                    >
                      {" "}
                      <Modal.Header>
                        <Text id="modal-title" size={18}>
                          Are you sure you want to end the room?
                        </Text>
                      </Modal.Header>
                      <Modal.Footer justify="center">
                        <Button auto flat color="error" onPress={closeHandler}>
                          Exit
                        </Button>
                        <Button
                          auto
                          onPress={(event) => {
                            endRoom();
                            closeHandler();
                          }}
                        >
                          Leave
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </React.Fragment>
                </Container>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Spacer y={1} />
        <Row gap={1}>
          <Col></Col>
          <Col>
            <Card css={{ $$cardColor: "#B6EB7A" }}>
              <Card.Body>
                <Room />
              </Card.Body>
            </Card>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </NextUIProvider>
  );
}

export async function getServerSideProps(context) {
  var puzzleID;

  if (context.query.roomID == undefined) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  await get(ref(database, "room/" + context.query.roomID + "/puzzleID")).then(
    (snapshot) => {
      puzzleID = snapshot.val();
    }
  );

  var puzzleType = "None";
  await get(ref(database, "puzzle/" + puzzleID + "/puzzleType")).then(
    (snapshot) => {
      if (snapshot.exists()) {
        puzzleType = snapshot.val();
      } else {
        console.log("No puzzle type available");
      }
    }
  );

  var title;

  await get(ref(database, "puzzle/" + puzzleID + "/title")).then((snapshot) => {
    if (snapshot.exists()) {
      title = snapshot.val();
    } else {
      title = "No Ttile";
      console.log("No puzzle piece available");
    }
  });
  console.log(title);

  puzzleType = puzzleType.toUpperCase();

  return {
    props: { puzzleType, title }, // will be passed to the page component as props
  };
}
