import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { initializeApp } from "firebase/app";
import { getStorage, getDownloadURL, listAll, ref } from "firebase/storage";
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
  Input,
  Link,
  Grid,
  User,
  Navbar,
} from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  async function getRoom(puzzleID) {
    const data = {
      puzzleID: puzzleID,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

  return (
    <>
      <NextUIProvider>
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
            <Navbar.Link href="/">Puzzle</Navbar.Link>
            <Navbar.Link href="/leaderboard">LeaderBoard</Navbar.Link>
          </Navbar.Content>
          <Navbar.Content>
            <Navbar.Item>
              <Text h6 align="right" size={25} color="white" css={{ m: 0 }}>
                <User src="/image/user_icon.png" name="Benji" />
              </Text>
            </Navbar.Item>
          </Navbar.Content>
        </Navbar>

        <Spacer y={1} />

        <Container>
          <Row gap={1}>
            <Card css={{ $$cardColor: "$colors$primary" }}>
              <Card.Body>
                <Grid.Container gap={2} justify="center">
                  <Card css={{ w: "25%", h: "400px" }}>
                    <Card.Header
                      css={{ marginLeft: "auto", marginRight: "auto" }}
                    >
                      <Col>
                        <Text
                          size={16}
                          weight="bold"
                          transform="uppercase"
                          color="black"
                        >
                          Title
                        </Text>
                        <Text
                          size={12}
                          weight="bold"
                          transform="uppercase"
                          color="black"
                        >
                          Description
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
                        <Col>
                          <Row>
                            <Col span={3}>
                              <Card.Image
                                src="/image/penrose-triangle-PARADOX-text.png"
                                css={{ bg: "black", br: "50%" }}
                                height={40}
                                width={40}
                                alt="PARADOX app icon"
                              />
                            </Col>
                            <Col>
                              <Text color="#d1d1d1" size={12}>
                                PARADOX App
                              </Text>
                            </Col>
                          </Row>
                        </Col>
                        <Col>
                          <Row justify="flex-end">
                            <Button
                              flat
                              auto
                              rounded
                              css={{ color: "#94f9f0", bg: "#94f9f026" }}
                              onClick={(event) => {
                                getRoom("T45");
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
                          </Row>
                        </Col>
                      </Row>
                    </Card.Footer>
                  </Card>
                  <Spacer x={4} />
                </Grid.Container>
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </NextUIProvider>
    </>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      puzzles: [
        { title: "Test", puzzleID: "Test", description: "Test" },
        { title: "", puzzleID: "", description: "" },
        { title: "", puzzleID: "", description: "" },
      ],
    }, // will be passed to the page component as props
  };
}

// export const getServerSideProps = withIronSessionSsr(
//   async function getServerSideProps({ req }) {
//     if (req.session.user == undefined) {
//       return {
//         redirect: {
//           permanent: false,
//           destination: "login",
//         },
//       };
//     }

//     return {
//       props: {
//         user: req.session.user,
//       },
//     };
//   }, // -------------------- All boilerplate code for sessions ------------------------------------
//   {
//     cookieName: process.env.COOKIE_NAME,
//     password: process.env.SESSION_PASSWORD,
//     cookieOptions: {
//       secure: process.env.NODE_ENV === "production",
//     },
//   }
// );
