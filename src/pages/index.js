import { ref } from "firebase/database";
import { useList } from "react-firebase-hooks/database";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import {
  NextUIProvider,
  Card,
  Row,
  Text,
  Col,
  Button,
  Grid,
  Tooltip,
} from "@nextui-org/react";
import { theme } from "@/themes/theme.js";

const { database } = require("@/modules/firebase-config.js");
const { Navigation } = require("@/components/Navigation.js");
const { Footer } = require("@/components/Footer.js");

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

    const response = await fetch("api/room/create", options);
    const result = await response.json();
    if (result.status == "OK") {
      router.push({ pathname: "/room", query: { roomID: result.roomID } });
    } else {
      alert("Status: " + result.status);
    }
  }

  const GetComment = ({ puzzleID }) => {
    return (
      <Grid.Container
        css={{
          color: "$primary",
          borderRadius: "18px",
          padding: "1rem",
          maxWidth: "330px",
        }}
      >
        <Row justify="center" align="center">
          <Text weight="bold" size={"$lg"}>
            Confirm
          </Text>
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
              onClick={() => {
                router.push({
                  pathname: "/comment",
                  query: { puzzleID: puzzleID },
                });
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
          <Row gap={1}>
            <Grid.Container gap={2} justify="center">
              {snapshots.map((snap) => {
                var puzzleID = snap.key;
                var puzzle = snap.val();
                return (
                  <>
                    <Card
                      isHoverable
                      isPressable
                      onPress={() => {
                        getRoom(puzzleID);
                      }}
                      css={{
                        width: "auto",
                        background: "$green",
                        margin: "1em",
                      }}
                    >
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
                        <Card.Body css={{ p: 0, border: "#17706E" }}>
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
                          <Row justify="center">
                            <Tooltip
                              trigger="click"
                              color={"primary"}
                              content={<GetComment puzzleID={puzzleID} />}
                            >
                              <Button
                                size="lg"
                                auto
                                css={{
                                  color: "$buttonSecondary",
                                  backgroundColor: "$buttonPrimary",
                                }}
                              >
                                Details
                              </Button>
                            </Tooltip>
                          </Row>
                        </Card.Footer>
                      </Card>
                    </Card>
                  </>
                );
              })}
            </Grid.Container>
          </Row>
        )}
      </>
    );
  }

  return (
    <>
      <NextUIProvider theme={theme}>
        <Navigation page="puzzles" username={user.username} />
        <Puzzles />
        <Footer />
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
