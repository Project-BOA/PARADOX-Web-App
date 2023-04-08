import React from "react";
import { Inter } from "@next/font/google";
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
  Modal,
  User,
  Navbar,
} from "@nextui-org/react";

import { theme } from "@/themes/theme.js";

import { Lock, Message, Document } from "react-iconly";

const { hashPassword } = require("@/modules/authentication.js");
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
      password: hashPassword(event.target.password.value),
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

    // redirect based on the result
    if (result.status == "OK") {
      router.push("/profile");
    } else {
      alert(result.status);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const biography = document.getElementById("biography").value;

    // Send the data to the server in JSON format.
    const data = JSON.stringify({
      username: user.username,
      password: user.password,
      biography,
      email,
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

    // redirect based on the result
    if (result.status == "OK") {
      router.push("/profile");
    } else {
      alert(result.status);
    }
  }

  return (
    <>
      <NextUIProvider theme={theme}>
        <Navigation username={user.username} />

        <Spacer y={1} />

        <Container>
          <Row gap={1}>
            <Card css={{ $$cardColor: "$colors$primary" }}>
              <Card.Body>
                <Text h4 align="center">
                  Profile Info
                </Text>
                <Grid.Container gap={2} justify="center">
                  <form id="profile-info-form" onSubmit={handleSubmit}>
                    <Row>
                      <Message
                        set="bold"
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
                  <form onSubmit={handleSubmitPass}>
                    <Modal.Header>
                      <Text h4>Change Password</Text>
                    </Modal.Header>

                    <Modal.Body>
                      <Row>
                        <Lock
                          set="bold"
                          primaryColor="blueviolet"
                          size="xlarge"
                        />
                        <Spacer />
                        <Input
                          fullWidth
                          id="newPassword"
                          clearable
                          type={"password"}
                          labelPlaceholder="newPassword"
                        />
                      </Row>
                      <Row>
                        <Lock
                          set="bold"
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
                        />
                      </Row>
                    </Modal.Body>

                    <Modal.Footer justify="center">
                      <Button auto flat color="error" onPress={closeHandler}>
                        Cancel
                      </Button>
                      <Button auto onPress={closeHandler}>
                        Change
                      </Button>
                    </Modal.Footer>
                  </form>
                </Modal>
              </Card.Body>
            </Card>
            <Card css={{ $$cardColor: "$colors$primary" }}>
              <Card.Body>
                <Text h4 align="center">
                  Solved Puzzles
                </Text>
                Solved Puzzles:
                {JSON.stringify(user.completedPuzzles)}
                <Grid.Container gap={2} justify="center"></Grid.Container>
              </Card.Body>
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
