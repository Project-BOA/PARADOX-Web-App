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
  Image,
  Link,
  Grid,
} from "@nextui-org/react";

import { theme } from "@/modules/theme.js";

import { User, Lock } from "react-iconly";

export default function Login() {
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();

    const data = {
      username: event.target.username.value,
      password: event.target.password.value,
      website: true,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch("api/profile/login", options);
    const result = await response.json();
    if (result.status == "OK") {
      console.log("Sign in");
      router.push("/");
    } else {
      alert("Status: " + result.status);
    }
  }

  return (
    <NextUIProvider theme={theme}>
      <Spacer y={1} />
      <Row gap={1}>
        <Container>
          <Row>
            <Image
              height={192}
              src="/image/penrose-triangle-PARADOX.png"
              alt=" Logo"
              style={{ objectFit: "cover" }}
            />
          </Row>
        </Container>
      </Row>
      <Spacer y={2} />
      <Row gap={1}>
        <Card css={{ $$cardColor: "lightGreen", mw: "600px", margin: "auto" }}>
          <Card.Body>
            <Text h6 align="center" size={36} css={{ m: 0 }}>
              Login
            </Text>
            <Spacer y={2} />
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
                />
              </Row>

              <Spacer y={2} />

              <Row>
                <Lock set="bold" primaryColor="blueviolet" size="xlarge" />
                <Spacer />
                <Input.Password
                  size="xl"
                  fullWidth
                  id="password"
                  clearable
                  labelPlaceholder="Password"
                />
              </Row>

              <Spacer y={1.5} />

              <Grid.Container justify="center">
                <Grid>
                  <Col>
                    <Button
                      size="lg"
                      type="submit"
                      css={{
                        color: "$powder",
                        background: "$secondary",
                        "&:hover": {
                          background: "$powder",
                          color: "$secondary",
                        },
                      }}
                    >
                      Sign In
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
                        onPress={(event) => {
                          router.push("/register");
                        }}
                      >
                        Register
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
