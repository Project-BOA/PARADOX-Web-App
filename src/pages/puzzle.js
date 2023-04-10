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
  Grid,
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
  let now = new Date();

  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };

  const TimeDescription = () => {
    if (puzzle.puzzleType.toLowerCase() == "time") {
      return (
        <>
          <Text size={20} align="left" color="white" css={{ m: 0 }}>
            Amount of time you have to answer each puzzle piece is{" "}
            {puzzle.pieceTime.interval} seconds, and you will lose{" "}
            {puzzle.pieceTime.decrement} points every
            {puzzle.pieceTime.interval} seconds
          </Text>
        </>
      );
    } else {
      return (
        <>
          <Text size={20} align="left" color="white" css={{ m: 0 }}>
            Amount of time you have to answer each puzzle piece is{" "}
            {puzzle.pieceTime.interval} seconds.
          </Text>
        </>
      );
    }
  };

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
          <Text h2 size={30} weight="bold" align="center">
            Error: {error}
          </Text>
        )}
        {loading && (
          <Text h2 size={30} align="center">
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
                <div className="box">
                  <Text size={20} align="left" color="white" css={{ m: 0 }}>
                    {username} - {date}
                  </Text>

                  <Text>{comment}</Text>
                </div>
              </>
            );
          })}
      </>
    );
  }

  return (
    <>
      <NextUIProvider id="page-container" theme={theme}>
        <Container id="content-wrap">
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
                }}
              >
                <Text h4 align="center">
                  {puzzle.title} : {puzzle.puzzleType}
                </Text>
                <Col>
                  <Text h4 align="center">
                    Description
                  </Text>
                  <div className="box">
                    <TimeDescription />
                  </div>
                </Col>
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
                <Text h4 align="center">
                  Comments
                </Text>

                <Comments />

                <Button
                  type="edit"
                  color="secondary"
                  onPress={handler}
                  css={{ marginLeft: "auto", marginRight: "auto" }}
                >
                  Create
                </Button>

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
                  <form onSubmit={handleSubmit}>
                    <Modal.Header>
                      <Text h4>Add Comment</Text>
                    </Modal.Header>

                    <Spacer y={1} />

                    <Modal.Body>
                      <Text
                        size={18}
                        align="center"
                        color="green"
                        css={{ m: 0 }}
                      >
                        {user.username} - {}
                      </Text>

                      <Textarea
                        aria-label="Your comment"
                        placeholder="Enter your comments here."
                        id="comment"
                      />
                    </Modal.Body>

                    <Modal.Footer justify="center">
                      <Button
                        auto
                        flat
                        color="secondary"
                        onPress={closeHandler}
                      >
                        Cancel
                      </Button>
                      <Button auto color="secondary" type="submit">
                        Comment
                      </Button>
                    </Modal.Footer>
                  </form>
                </Modal>
              </Card>
            </Card>
          </Row>
        </Container>
        <Footer />
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

    var comments;
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
