import Image from "next/image";
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
  User,
  Navbar,
} from "@nextui-org/react";

import { theme } from "@/themes/theme.js";

const { Navigation } = require("@/components/Navigation.js");
const { Footer } = require("@/components/Footer.js");

export default function Profile({ user }) {
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();

    // Send the data to the server in JSON format.
    const data = JSON.stringify({
      username: user.username,
      password: event.target.password.value,
      newPassword: event.target.newPassword.value,
      biography: event.target.biography.value,
      //email: event.target.email.value,
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
                  Email/Bio Info
                </Text>
                <Grid.Container gap={2} justify="center">
                  <Spacer x={4} />
                  <form onSubmit={handleSubmit}>
                    <Input
                      fullWidth
                      id="email"
                      clearable
                      labelPlaceholder="Email"
                    />
                    <Spacer y={1.5} />
                    <Input
                      fullWidth
                      id="biography"
                      clearable
                      labelPlaceholder="Biography"
                    />
                    <Spacer y={1.5} />
                    <Grid.Container gap={1} justify="center">
                      <Grid>
                        <Button
                          auto
                          type="submit"
                          color="secondary"
                          css={{ marginLeft: "auto", marginRight: "auto" }}
                        >
                          Submit
                        </Button>
                      </Grid>
                    </Grid.Container>
                  </form>
                </Grid.Container>
              </Card.Body>
            </Card>
            <Card css={{ $$cardColor: "$colors$primary" }}>
              <Card.Body>
                <Text h4 align="center">
                  Change Password
                </Text>
                <Grid.Container gap={2} justify="center">
                  <Spacer x={4} />
                  <form onSubmit={handleSubmit}>
                    <Input
                      fullWidth
                      id="newPassword"
                      clearable
                      type={"password"}
                      labelPlaceholder="newPassword"
                    />
                    <Spacer y={1.5} />

                    <Input
                      fullWidth
                      id="password"
                      clearable
                      type={"password"}
                      labelPlaceholder="Password"
                    />

                    <Spacer y={1.5} />
                    <Grid.Container gap={1} justify="center">
                      <Grid>
                        <Button
                          auto
                          type="submit"
                          color="secondary"
                          css={{ marginLeft: "auto", marginRight: "auto" }}
                        >
                          Submit
                        </Button>
                      </Grid>
                    </Grid.Container>
                  </form>
                </Grid.Container>
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
