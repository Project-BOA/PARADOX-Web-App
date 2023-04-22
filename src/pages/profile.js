import React from "react";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import {
  NextUIProvider,
  Card,
  Container,
  Row,
  Col,
  Text,
  Spacer,
  Button,
  Input,
  Link,
  Grid,
  Modal,
} from "@nextui-org/react";

import { theme } from "@/themes/theme.js";

import { Lock, Message, Document } from "react-iconly";

const { Navigation } = require("@/components/Navigation.js");
const { Footer } = require("@/components/Footer.js");

import { initializeApp } from "firebase/app";
import { ref, get, getDatabase } from "firebase/database";
import ReactDomServer from "react-dom/server";

const { config } = require("@/modules/firebase-config.js");
const app = initializeApp(config);
const database = getDatabase(app);
export default function Profile({ user, completedPuzzles }) {
  const router = useRouter();

  const [visible, setVisible] = React.useState(false);
  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);

  const SolvedEntry = () => {
    return (
      <Row align="justify">
        <Col>
          <Text size={20} p className="puzzleTitle"></Text>
        </Col>
        <Col align="center">
          <Text size={20} p className="date"></Text>
        </Col>
        <Col align="center">
          <Text size={20} p className="points"></Text>
        </Col>
      </Row>
    );
  };

  var solvedPuzzleList;
  function SolvedPuzzleList({ solved }) {
    if (typeof window !== "undefined") {
      const List = require("list.js");

      var values = Object.entries(solved).map((entry) => {
        return {
          puzzleTitle: entry[0],
          date: new Date(entry[1].completedOn).toLocaleDateString(),
          points: entry[1].points,
        };
      });

      var options = {
        valueNames: ["puzzleTitle", "date", "points"],
        item: ReactDomServer.renderToString(SolvedEntry(values)),
      };

      solvedPuzzleList = new List("solvedPuzzles", options, values);
    }

    return <></>;
  }

  function ChangePasswordModal() {
    return (
      <Modal
        closeButton
        aria-labelledby="modal-change-password"
        open={visible}
        onClose={closeModal}
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
            <form
              onSubmit={(event) => {
                postEdit(event);
              }}
            >
              <Modal.Header>
                <Text h4>Enter Password</Text>
              </Modal.Header>

              <Modal.Body>
                <Row>
                  <Lock
                    set="bold"
                    aria-label="lock icon"
                    primaryColor="blueviolet"
                    size="xlarge"
                  />
                  <Spacer />
                  <Input
                    fullWidth
                    id="password"
                    clearable
                    type={"password"}
                    labelPlaceholder="Password"
                    minLength={3}
                  />
                </Row>
              </Modal.Body>

              <Modal.Footer justify="center">
                <Button
                  auto
                  bordered
                  css={{
                    color: "$buttonPrimary",
                    borderColor: "$buttonPrimary",
                  }}
                  onPress={closeModal}
                >
                  Cancel
                </Button>
                <Button
                  auto
                  type="submit"
                  css={{
                    color: "$buttonSecondary",
                    backgroundColor: "$buttonPrimary",
                  }}
                >
                  Update
                </Button>
              </Modal.Footer>
            </form>
          </Card>
        </Card>
      </Modal>
    );
  }

  async function postEdit(event) {
    event.preventDefault();

    // Send the data to the server in JSON format.
    const data = {
      username: user.username,
      password: event.target.password.value,
      biography: document.getElementById("biography").value,
      email: document.getElementById("email").value,
      newPassword: document.getElementById("newPassword").value,
    };

    // API endpoint where we send form data.
    const endpoint = "/api/profile/edit";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data, (key, value) => {
        if (/^\s*$/.test(value)) {
          return undefined;
        }
        return value;
      }),
    };

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json();

    // redirect or display based on the result
    if (result.status == "OK") {
      setVisible(false);
      if (data.newPassword || !/^\s*$/.test(data.newPassword)) {
        router.push("/logout");
        document.getElementById("newPassword").value = "";
      }
    } else {
      alert(result.status);
    }
  }

  return (
    <>
      <NextUIProvider theme={theme}>
        <Navigation page="profile" username={user.username} />
        <div id="page-container">
          <div id="content-wrap">
            <Spacer y={1} />
            <Row>
              <Col>
                <Card
                  css={{
                    marginRight: "auto",
                    marginLeft: "auto",
                    background: "$green",
                    width: "40vw",
                    padding: "1em",
                  }}
                >
                  <Card
                    css={{
                      background: "$primary",
                    }}
                  >
                    <Card.Body>
                      <Text h4 size={30} align="center">
                        Profile Info
                      </Text>
                      <Spacer y={1} />

                      <Grid.Container gap={2} justify="center">
                        <form
                          id="profile-info-form"
                          onSubmit={(event) => {
                            event.preventDefault();
                            openModal(event);
                          }}
                        >
                          <Row>
                            <Message
                              set="bold"
                              aria-label="email icon"
                              primaryColor="blueviolet"
                              size="xlarge"
                            />
                            <Spacer />
                            <Input
                              fullWidth
                              id="email"
                              clearable
                              initialValue={user.email}
                              minLength={3}
                              maxLength={255}
                            />
                          </Row>
                          <Spacer y={1} />
                          <Row>
                            <Document
                              set="bold"
                              aria-label="biography icon"
                              primaryColor="blueviolet"
                              size="xlarge"
                            />

                            <Spacer />
                            <Input
                              fullWidth
                              id="biography"
                              clearable
                              initialValue={user.biography}
                              maxLength={50}
                            />
                          </Row>
                          <Spacer y={1} />

                          <Row>
                            <Lock
                              set="bold"
                              aria-label="lock icon"
                              primaryColor="blueviolet"
                              size="xlarge"
                            />
                            <Spacer />

                            <Input
                              fullWidth
                              id="newPassword"
                              clearable
                              type={"password"}
                              labelPlaceholder="New Password here..."
                              minLength={3}
                            />
                          </Row>

                          <Grid.Container gap={1} justify="center">
                            <Grid>
                              <Button
                                auto
                                type="submit"
                                css={{
                                  color: "$buttonSecondary",
                                  background: "$buttonPrimary",
                                  marginLeft: "auto",
                                  marginRight: "auto",
                                }}
                              >
                                Update
                              </Button>
                            </Grid>
                          </Grid.Container>
                        </form>
                      </Grid.Container>
                    </Card.Body>
                  </Card>
                </Card>
              </Col>

              <Col>
                <Card
                  css={{
                    marginRight: "auto",
                    marginLeft: "auto",
                    background: "$green",
                    width: "45vw",
                    padding: "1em",
                  }}
                >
                  <Card
                    css={{
                      background: "$primary",
                    }}
                  >
                    <Card.Body>
                      <Text h4 size={30} align="center">
                        Solved Puzzles
                      </Text>
                      <Spacer y={1} />

                      <div id="solvedPuzzles">
                        <Row>
                          <Input
                            fullWidth
                            className="search"
                            placeholder="Search"
                          />
                        </Row>
                        <Spacer y={1} />
                        <Row align="justify">
                          <Col>
                            <button class="sort" data-sort="puzzleTitle">
                              <Text
                                weight="bold"
                                size={25}
                                css={{ m: 0, color: "$link" }}
                              >
                                Title
                              </Text>
                            </button>
                          </Col>
                          <Col align="center">
                            <button class="sort" data-sort="date">
                              <Text
                                weight="bold"
                                size={25}
                                css={{ m: 0, color: "$link" }}
                              >
                                Completed on
                              </Text>
                            </button>
                          </Col>
                          <Col align="center">
                            <button class="sort" data-sort="points">
                              <Text
                                weight="bold"
                                size={25}
                                css={{ m: 0, color: "$link" }}
                              >
                                Points
                              </Text>
                            </button>
                          </Col>
                        </Row>
                        <ul class="list"></ul>
                        <SolvedPuzzleList solved={completedPuzzles} />
                      </div>
                      <Grid.Container gap={2} justify="center"></Grid.Container>
                    </Card.Body>
                  </Card>
                </Card>
              </Col>
            </Row>
            <ChangePasswordModal />
          </div>

          <Footer />
        </div>
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
    var completedPuzzles;
    await get(ref(database, "users/" + req.session.user.username + "/solved"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          completedPuzzles = snapshot.toJSON();
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return {
      props: {
        user: req.session.user,
        completedPuzzles: completedPuzzles,
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
