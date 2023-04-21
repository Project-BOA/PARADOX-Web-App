import React from "react";
import { initializeApp } from "firebase/app";
import { ref, get, update, getDatabase } from "firebase/database";
import { withIronSessionSsr } from "iron-session/next";
import { useList } from "react-firebase-hooks/database";
import { useRouter } from "next/router";
import {
  NextUIProvider,
  Container,
  Text,
  Row,
  Col,
  Card,
  Spacer,
  Button,
  Textarea,
  Modal,
} from "@nextui-org/react";
import { theme } from "@/themes/theme.js";

const { config } = require("@/modules/firebase-config.js");
const app = initializeApp(config);
const database = getDatabase(app);

const { Navigation } = require("@/components/Navigation.js");
const { Footer } = require("@/components/Footer.js");

export default function Puzzle({ user, puzzle }) {
  const router = useRouter();
  const { puzzleID } = router.query;

  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);
  const closeHandler = () => setVisible(false);

  const TimeDescription = () => {
    if (puzzle.puzzleType.toLowerCase() == "time") {
      return (
        <>
          <Text size={20} align="center">
            Amount of time you have to answer each puzzle piece is{" "}
            {puzzle.pieceTime.interval} seconds, and you will lose{" "}
            {puzzle.pieceTime.decrement} points every{" "}
            {puzzle.pieceTime.interval} seconds
          </Text>
        </>
      );
    } else {
      return (
        <>
          <Text size={20} align="center">
            Amount of time you have to answer each puzzle piece is{" "}
            {puzzle.pieceTime.interval} seconds.
          </Text>
        </>
      );
    }
  };

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

  function CreateCommentModal() {
    return (
      <Modal
        closeButton
        flat
        aria-label="modal-comments-creation"
        open={visible}
        onClose={closeHandler}
        css={{
          color: "$green",
          background: "$green",
          padding: "1em",
        }}
      >
        <Card
          css={{
            color: "$green",
            background: "$green",
          }}
        >
          <Card
            css={{
              background: "$primary",
            }}
          >
            <form onSubmit={handleSubmit}>
              <Modal.Header>
                <Text h4>Add Comment</Text>
              </Modal.Header>

              <Modal.Body>
                <Text size={20} align="left">
                  {user.username} &#x2022;{" "}
                  {new Date().toLocaleDateString("en-IE")}
                </Text>
                <Textarea
                  id="comment"
                  fullWidth
                  minRows={2}
                  placeholder="Enter your comments here..."
                  aria-label="Your comment"
                />
              </Modal.Body>

              <Modal.Footer justify="center">
                <Button
                  auto
                  bordered
                  css={{
                    color: "$buttonPrimary",
                    borderColor: "$buttonPrimary",
                  }}
                  onPress={closeHandler}
                >
                  Cancel
                </Button>
                <Button
                  auto
                  css={{
                    color: "$buttonSecondary",
                    backgroundColor: "$buttonPrimary",
                  }}
                  type="submit"
                >
                  Comment
                </Button>
              </Modal.Footer>
            </form>
          </Card>
        </Card>
      </Modal>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const data = {
      comment: event.target.comment.value,
      username: user.username,
      puzzleID: puzzleID,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch("api/puzzle/submit", options);
    const result = await response.json();

    if (result.status == "OK") {
      closeHandler();
    } else {
      alert("Status: " + result.status);
    }
  }

  function Comments() {
    const [snapshots, loading, error] = useList(
      ref(database, "comments/" + puzzleID)
    );
    return (
      <>
        {error && (
          <Text h2 size={25} align="center">
            Error: {error}
          </Text>
        )}
        {loading && (
          <Text h2 size={25} align="center">
            Loading Comments...
          </Text>
        )}
        {!loading &&
          snapshots &&
          snapshots.map((snap) => {
            var username = snap.key;
            var comment = snap.val().comment;
            var date = new Date(snap.val().commentedOn).toLocaleDateString(
              "en-IE"
            );

            return (
              <>
                <Col>
                  <Text size={20} align="left">
                    {username} &#x2022; {date}
                  </Text>
                  <Spacer x={1} />
                  <Textarea
                    id="comment"
                    fullWidth
                    minRows={2}
                    readOnly
                    value={comment}
                    aria-label={username + " commented on " + date}
                  />
                </Col>
                <Spacer y={1} />
              </>
            );
          })}
        {!loading && snapshots.length == 0 && (
          <Text align="center" size={25}>
            There are no comments for this puzzle yet...
          </Text>
        )}
      </>
    );
  }

  return (
    <>
      <NextUIProvider theme={theme}>
        <div id="page-container">
          <div id="content-wrap">
            <Container>
              <Navigation page="comment" username={user.username} />

              <Spacer y={1} />

              <Row gap={1}>
                <Card
                  css={{
                    width: "auto",
                    background: "$green",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Card
                    css={{
                      width: "40vw",
                      background: "$primary",
                      margin: "1em",
                      padding: "1em",
                    }}
                  >
                    <Row>
                      <Col>
                        <Text h4 size={40} align="center">
                          {puzzle.title} :{" "}
                          {puzzle.puzzleType.charAt(0).toUpperCase() +
                            puzzle.puzzleType.slice(1).toLowerCase()}
                        </Text>
                        <TimeDescription />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Text size={35} h4 align="center">
                          Description
                        </Text>
                        <Spacer y={1} />
                        <Textarea
                          readOnly
                          fullWidth
                          minRows={10}
                          value={puzzle.description}
                        />
                        <Spacer y={1} />
                        <Button
                          onPress={() => {
                            getRoom(puzzleID);
                          }}
                          css={{
                            marginLeft: "auto",
                            marginRight: "auto",
                            color: "$buttonSecondary",
                            backgroundColor: "$buttonPrimary",
                            fontWeight: "bold",
                          }}
                        >
                          Play Now
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </Card>

                <Card
                  css={{
                    width: "auto",
                    background: "$green",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Card
                    css={{
                      width: "40vw",
                      background: "$primary",
                      margin: "1em",
                    }}
                  >
                    <Row>
                      <Col>
                        <Text h4 size={40} align="center">
                          Comments
                        </Text>
                      </Col>
                    </Row>
                    <Comments />
                    <Spacer y={1} />
                    <Button
                      type="edit"
                      onPress={handler}
                      css={{
                        marginLeft: "auto",
                        marginRight: "auto",
                        color: "$buttonSecondary",
                        backgroundColor: "$buttonPrimary",
                      }}
                    >
                      Create
                    </Button>
                    <Spacer y={1} />
                    <CreateCommentModal />
                  </Card>
                </Card>
              </Row>
            </Container>
          </div>
          <Footer />
        </div>
      </NextUIProvider>
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, query }) {
    if (req.session.user == undefined) {
      return {
        redirect: {
          permanent: false,
          destination: "login",
        },
      };
    }

    const id = query.puzzleID;

    var puzzle;
    await get(ref(database, "puzzle/" + id)).then((snapshot) => {
      if (snapshot.exists()) {
        puzzle = snapshot.toJSON();
      } else {
        console.log("No Piece available");
      }
    });

    var comments = "No Comments";
    await get(ref(database, "comments/" + id)).then((snapshot) => {
      if (snapshot.exists()) {
        comments = snapshot.toJSON();
      } else {
        // create comment table
        update(ref(database, "comments/" + id), {});
      }
    });

    return {
      props: {
        user: req.session.user,
        comments: comments,
        id: id,
        puzzle: puzzle,
      },
    };
  }, // -------------------- All boilerplate code for sessions ------------------------------------
  {
    cookieName: process.env.COOKIE_NAME,
    password: process.env.SESSION_PASSWORD,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
