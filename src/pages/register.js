import { useRouter } from "next/router";

import * as React from "react";

import {
  NextUIProvider,
  Container,
  Card,
  Row,
  Text,
  Col,
  Spacer,
  Input,
  Button,
  Link,
  Grid,
  Image,
} from "@nextui-org/react";

import { theme } from "@/themes/theme.js";

import { User, Lock, Message, Document } from "react-iconly";

export default function Register() {
  const router = useRouter();

  // Handle the submit for the form
  async function handleSubmit(event) {
    event.preventDefault();

    // Send the data to the server in JSON format.
    const data = JSON.stringify({
      username: event.target.username.value,
      password: event.target.password.value,
      biography: event.target.bio.value,
      email: event.target.email.value,
    });

    // API endpoint where we send form data.
    const endpoint = "/api/profile/register";

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
      router.push("/");
    } else {
      alert(result.status);
    }
  }

  return (
    <NextUIProvider theme={theme}>
      <Spacer y={1} />
      <Row gap={1}>
        <Image
          height={192}
          src="/image/penrose-triangle-PARADOX.png"
          alt=" Logo"
          style={{ objectFit: "cover" }}
        />
      </Row>
      <Spacer y={2.5} />
      <Row gap={1}>
        <Card css={{ $$cardColor: "lightGreen", mw: "600px", margin: "auto" }}>
          <Card.Body>
            <Text h6 align="center" size={36} css={{ m: 0 }}>
              Register
            </Text>
            <Spacer y={2.5} />
            <form onSubmit={handleSubmit}>
              <Row>
                <User set="bold" primaryColor="blueviolet" size="xlarge" />
                <Spacer />
                <Input
                  size="xl"
                  fullWidth
                  id="username"
                  clearable
                  labelPlaceholder="Username"
                  minLength={3}
                  maxLength={10}
                />
              </Row>
              <Spacer y={2} />
              <Row>
                <Lock set="bold" primaryColor="blueviolet" size="xlarge" />
                <Spacer />
                <Input
                  size="xl"
                  fullWidth
                  id="password"
                  clearable
                  type={"password"}
                  labelPlaceholder="Password"
                  minLength={3}
                />
              </Row>

              <Spacer y={2} />

              <Row>
                <Message set="bold" primaryColor="blueviolet" size="xlarge" />
                <Spacer />
                <Input
                  size="xl"
                  fullWidth
                  id="email"
                  clearable
                  labelPlaceholder="Email"
                />
              </Row>

              <Spacer y={2} />

              <Row>
                <Document set="bold" primaryColor="blueviolet" size="xlarge" />

                <Spacer />
                <Input
                  size="xl"
                  fullWidth
                  id="bio"
                  clearable
                  labelPlaceholder="Biography"
                />
              </Row>

              <Spacer y={2.5} />

              <Grid.Container justify="center">
                <Grid>
                  <Col>
                    <Button color="secondary" size="lg" type="submit">
                      Register
                    </Button>
                    <Spacer />
                    <Text align="center" size={20}>
                      or{" "}
                      <Link
                        css={{
                          marginLeft: "auto",
                          marginRight: "auto",
                          fontWeight: "bold",
                        }}
                        href="/login"
                      >
                        Back
                      </Link>
                    </Text>
                  </Col>
                </Grid>
              </Grid.Container>
            </form>
          </Card.Body>
        </Card>
      </Row>
    </NextUIProvider>
  );
}
