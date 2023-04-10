import React from "react";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import {
  NextUIProvider,
  Container,
  Card,
  Row,
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

export default function Profile({ user }) {
  const router = useRouter();

  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };

  async function handleSubmitPass(event) {
    event.preventDefault();
    // Send the data to the server in JSON format.
    const data = JSON.stringify({
      username: user.username,
      password: event.target.password.value,
      newPassword: event.target.newPassword.value,
    });

    // API endpoint where we send form data.
    const endpoint = "/api/profile/edit";

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: data,
    };

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json();

    // redirect or display based on the result
    if (result.status == "OK") {
      router.push("/logout");
    } else {
      alert(result.status);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Send the data to the server in JSON format.
    const data = JSON.stringify({
      username: user.username,
      password: user.password,
      biography: event.target.biography.value,
      email: event.target.email.value,
    });

    // API endpoint where we send form data.
    const endpoint = "/api/profile/edit";

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: data,
    };

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json();

    // reload or display based on the result
    if (result.status == "OK") {
      router.reload();
    } else {
      alert(result.status);
    }
  }

  return (
    <>
      <NextUIProvider id="page-container" theme={theme}>
        <Container id="content-wrap">
          <Navigation page="profile" username={user.username} />

          <Spacer y={1} />
          <Row gap={1}>
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
                  <Text h4 align="center">
                    Profile Info
                  </Text>
                  <Grid.Container gap={2} justify="center">
                    <form
                      id="profile-info-form"
                      onSubmit={(event) => {
                        handleSubmit(event);
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
                        />
                      </Row>

                      <Grid.Container gap={1} justify="center">
                        <Grid>
                          <Button
                            auto
                            type="submit"
                            color="secondary"
                            css={{ marginLeft: "auto", marginRight: "auto" }}
                          >
                            Update
                          </Button>
                        </Grid>
                      </Grid.Container>
                    </form>
                  </Grid.Container>

                  <Link
                    auto
                    type="edit"
                    color="secondary"
                    onPress={handler}
                    css={{ marginLeft: "auto", marginRight: "auto" }}
                  >
                    Change Password
                  </Link>
                  <Modal
                    closeButton
                    aria-labelledby="modal-title"
                    open={visible}
                    onClose={closeHandler}
                  >
                    <form
                      onSubmit={(event) => {
                        handleSubmitPass(event);
                      }}
                    >
                      <Modal.Header>
                        <Text h4>Change Password</Text>
                      </Modal.Header>

                      <Modal.Body>
                        <Spacer y={0.1} />
                        <Row>
                          <Lock
                            set="bold"
                            aria-label="lock icon"
                            primaryColor="blueviolet"
                            size="xlarge"
                          />
                          <Input
                            fullWidth
                            id="password"
                            clearable
                            type={"password"}
                            labelPlaceholder="Password"
                          />
                        </Row>
                        <Spacer y={0.1} />

                        <Row>
                          <Lock
                            set="bold"
                            aria-label="lock icon"
                            primaryColor="blueviolet"
                            size="xlarge"
                          />
                          <Input
                            fullWidth
                            id="newPassword"
                            clearable
                            type={"password"}
                            labelPlaceholder="New Password"
                          />
                        </Row>
                      </Modal.Body>

                      <Modal.Footer justify="center">
                        <Button
                          auto
                          flat
                          css={{
                            color: "$buttonSecondary",
                            backgroundColor: "$buttonPrimary",
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
                          onPress={closeHandler}
                        >
                          Change
                        </Button>
                      </Modal.Footer>
                    </form>
                  </Modal>
                </Card.Body>
              </Card>
            </Card>

            <Card
              css={{
                marginRight: "auto",
                marginLeft: "auto",
                background: "$green",
                width: "50vw",
                padding: "1em",
              }}
            >
              <Card
                css={{
                  background: "$primary",
                }}
              >
                <Card.Body>
                  <Text h4 align="center">
                    Solved Puzzles
                  </Text>
                  Solved Puzzles:
                  {JSON.stringify(user.completedPuzzles)}
                  <Grid.Container gap={2} justify="center"></Grid.Container>
                </Card.Body>
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
  }, // -------------------- All boilerplate code for sessions ------------------------------------
  {
    cookieName: process.env.COOKIE_NAME,
    password: process.env.SESSION_PASSWORD,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
