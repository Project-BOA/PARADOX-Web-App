import Image from "next/image";
import { Inter } from "@next/font/google";

import { ref } from "firebase/database";
import { useList } from "react-firebase-hooks/database";
import styles from "@/styles/Home.module.css";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import {
  NextUIProvider,
  Container,
  Card,
  Row,
  Text,
  Col,
  Spacer,
  Button,
  Link,
  Grid,
  User,
  Navbar,
  Tooltip,
} from "@nextui-org/react";
import { theme } from "@/modules/theme.js";

const { database } = require("@/modules/firebase-config.js");

export default function Home({ user }) {
  const router = useRouter();

  async function getRoom(puzzleID) {
    const data = {
      puzzleID: puzzleID,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json ",
      },
      body: JSON.stringify(data),
    };

    console.log(options);

    const response = await fetch("api/room/create", options);
    const result = await response.json();
    if (result.status == "OK") {
      router.push({ pathname: "/room", query: { roomID: result.roomID } });
    } else {
      alert("Status: " + result.status);
    }
  }

  async function goToComments(puzzleID) {
    const data = {
      puzzleID: puzzleID,
    };

    router.push({ pathname: "/comment", query: { puzzleID: puzzleID } });
  }

  const GetComment = ({ puzzleID }) => {
    return (
      <Grid.Container
        css={{
          borderRadius: "14px",
          padding: "0.75rem",
          maxWidth: "330px",
        }}
      >
        <Row justify="center" align="center">
          <Text b>Confirm</Text>
        </Row>
        <Row>
          <Text>
            Are you sure you want to check the comments of this puzzle?, there
            could be possible spoilers for answers
          </Text>
        </Row>
        <Grid.Container justify="space-between" alignContent="center">
          <Grid>
            <Button size="sm" light>
              Cancel
            </Button>
          </Grid>
          <Grid>
            <Button
              size="sm"
              shadow
              color="error"
              onClick={(event) => {
                goToComments(puzzleID);
              }}
            >
              Check
            </Button>
          </Grid>
        </Grid.Container>
      </Grid.Container>
    );
  };

  function Puzzles() {
    const [snapshots, loading, error] = useList(ref(database, "puzzle/"));
    return (
      <>
        {error && (
          <Text h2 size={30} weight="bold" align="center">
            Error: {error}
          </Text>
        )}
        {loading && (
          <Text h2 size={30} align="center">
            Loading Puzzles...
          </Text>
        )}
        {!loading && snapshots && (
          <Container>
            <Row gap={1}>
              <Grid.Container gap={2} justify="center">
                {snapshots.map((snap, index) => {
                  var puzzleID = snap.key;
                  var puzzle = snap.val();
                  return (
                    <>
                      <Card
                        key={puzzleID}
                        css={{ w: "30em", h: "50vh", margin: "1em" }}
                      >
                        <Card.Header
                          css={{ marginLeft: "auto", marginRight: "auto" }}
                        >
                          <Col>
                            <Text
                              size={28}
                              weight="bold"
                              transform="uppercase"
                              color="black"
                            >
                              {puzzle.title}
                            </Text>
                            <Text
                              size={18}
                              weight="bold"
                              transform="uppercase"
                              color="black"
                            >
                              {puzzle.description}
                            </Text>
                          </Col>
                        </Card.Header>
                        <Card.Body css={{ p: 0 }}>
                          <Card.Image
                            src="/image/default_puzzle_image.png"
                            objectFit="cover"
                            width="100%"
                            height="100%"
                            alt="puzzle image"
                          />
                        </Card.Body>
                        <Card.Footer
                          isBlurred
                          css={{
                            position: "absolute",
                            bgBlur: "#0f111466",
                            borderTop: "$borderWeights$light solid $gray800",
                            bottom: 0,
                            zIndex: 1,
                          }}
                        >
                          <Row>
                            <Row justify="center">
                              <Button
                                flat
                                auto
                                rounded
                                css={{
                                  color: "#94f9f0",
                                  bg: "#94f9f026",
                                }}
                                onClick={(event) => {
                                  getRoom(puzzleID);
                                }}
                              >
                                <Text
                                  css={{ color: "inherit" }}
                                  size={12}
                                  weight="bold"
                                  transform="uppercase"
                                >
                                  Start
                                </Text>
                              </Button>
                              <Tooltip
                                trigger="click"
                                content={<GetComment puzzleID={puzzleID} />}
                              >
                                <Text
                                  css={{ color: "inherit" }}
                                  size={12}
                                  weight="bold"
                                  transform="uppercase"
                                >
                                  Comments
                                </Text>
                              </Tooltip>
                            </Row>
                          </Row>
                        </Card.Footer>
                      </Card>
                    </>
                  );
                })}
              </Grid.Container>
            </Row>
          </Container>
        )}
      </>
    );
  }

  return (
    <>
      <NextUIProvider theme={theme}>
        <Navbar isBordered variant="floating">
          <Navbar.Brand>
            <Link href="/">
              <Image
                width={188}
                height={75}
                src="/image/penrose-triangle-PARADOX-text.png"
                alt=" Logo"
                style={{ objectFit: "cover" }}
              />
            </Link>
          </Navbar.Brand>
          <Navbar.Content hideIn="xs" variant="highlight-rounded">
            <Navbar.Link href="/profile">Profile</Navbar.Link>
            <Navbar.Link href="/">Home</Navbar.Link>
            <Navbar.Link href="/instructions">Instruction</Navbar.Link>
          </Navbar.Content>
          <Navbar.Content>
            <Navbar.Item>
              <Text h6 align="right" size={25} color="black" css={{ m: 0 }}>
                <User src="/image/user_icon.png" name={user.username} />
              </Text>
            </Navbar.Item>
            <Navbar.Item>
              <Button auto flat as={Link} href="logout">
                Logout
              </Button>
            </Navbar.Item>
          </Navbar.Content>
        </Navbar>
        <Spacer y={1} />

        <Container>
          <Text h2 size={40} align="center" color="green" css={{ m: 0 }}>
            Welcome {user.username}! Check out these puzzles
          </Text>
        </Container>

        <Spacer y={1} />

        <Puzzles />
      </NextUIProvider>
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    if (req.session.user == undefined) {
      return {
        redirect: {
          permanent: false,
          destination: "login",
        },
      };
    }

    return {
      props: {
        user: req.session.user,
      },
    };
  },
  {
    cookieName: process.env.COOKIE_NAME,
    password: process.env.SESSION_PASSWORD,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
