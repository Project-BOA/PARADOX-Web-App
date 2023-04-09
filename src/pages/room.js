import { NextUIProvider } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Container, Card, Row, Text, Col } from "@nextui-org/react";
import { Spacer, Link } from "@nextui-org/react";

import { getDatabase, ref, onValue, remove, get } from "firebase/database";
import React from "react";
import { useListKeys } from "react-firebase-hooks/database";
import { useRouter } from "next/router";
import { Footer } from "@/components/Footer";
import { theme } from "@/themes/theme.js";

const { database } = require("@/modules/firebase-config.js");

export default function Room({ roomID, title, puzzleType }) {
  const router = useRouter();

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
            <Text h2 size={30} color="#8A2BE2" align="center">
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
            <Card css={{ $$cardColor: "#17706E" }}>
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
                          {title}
                        </Text>
                      </Card.Body>
                    </Container>
                  </Col>
                  <Col>
                    <Container>
                      <Spacer y={1} />

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
                          {"Type: " + puzzleType}
                        </Text>
                      </Card.Body>
                    </Container>
                  </Col>
                </Row>

                {/* <Container>
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
                  <Button
                    onPress={(event) => {
                      endRoom();
                    }}
                  >
                    End
                  </Button>
                </Container> */}

                {/* <Row>
                  <Col>
                    <Button
                      css={{
                        color: "#17706E",
                        backgroundColor: "#BB2297",
                      }}
                      onPress={(event) => {
                        endRoom();
                      }}
                    >
                      End
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      onPress={(event) => {
                        router.push("/gameplay?roomID=" + roomID);
                      }}
                      size="lg"
                      css={{
                        color: "#17706E",
                        backgroundColor: "#BB2297",
                        marginInline: "auto",
                      }}
                    >
                      Start
                    </Button>
                  </Col>
                </Row> */}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Spacer y={1} />
        <Row gap={1}>
          <Col></Col>
          <Col>
            <Card css={{ $$cardColor: "#90EE90" }}>
              <Card.Body>
                <Room />
              </Card.Body>
            </Card>
          </Col>
          <Col></Col>
        </Row>
      </Container>
      <Container id="footer">
        <Footer />
      </Container>
    </NextUIProvider>
  );
}

export async function getServerSideProps(context) {
  var puzzleID;
  var roomID = context.query.roomID;

  if (roomID == undefined) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  roomID = roomID.toUpperCase();

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
      title = "No Title";
      console.log("No puzzle piece available");
    }
  });
  console.log(title);

  puzzleType = puzzleType.toUpperCase();

  return {
    props: { roomID, puzzleType, title }, // will be passed to the page component as props
  };
}
