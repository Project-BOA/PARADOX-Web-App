import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
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
} from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

export default function Login() {
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();

    const data = {
      username: event.target.username.value,
      password: event.target.password.value,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    console.log(options);

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
    <NextUIProvider>
      <Spacer y={1} />
      <Row gap={1}>
        <Container>
          <Text h6 align="center" size={30} color="black" css={{ m: 0 }}>
            Welcome to PARADOX
          </Text>
        </Container>
      </Row>
      <Spacer y={2} />
      <Row gap={1}>
        <Card css={{ $$cardColor: "$colors$primary" }}>
          <Card.Body>
            <Text h6 align="center" size={24} color="white" css={{ m: 0 }}>
              Login
            </Text>
            <Spacer y={1} />
            <form onSubmit={handleSubmit}>
              <Input
                fullWidth
                id="username"
                clearable
                labelPlaceholder="Username"
              />
              <Spacer y={1.5} />
              <Input.Password
                fullWidth
                id="password"
                clearable
                labelPlaceholder="Password"
              />
              <Spacer y={1.5} />
              <Grid.Container justify="center">
                <Grid>
                  <Row>
                    <Button
                      auto
                      type="submit"
                      color="secondary"
                      css={{ marginLeft: "auto", marginRight: "auto" }}
                    >
                      Login
                    </Button>
                    <Spacer />
                    <Button
                      auto
                      color="secondary"
                      onPress={(event) => {
                        router.push("/register");
                      }}
                    >
                      Register
                    </Button>
                  </Row>
                </Grid>
                <Spacer y={0} />
              </Grid.Container>
            </form>
            <Spacer x={1} />
            <Link
              href="#forgot"
              block
              color="secondary"
              css={{ marginLeft: "auto", marginRight: "auto" }}
            >
              Forgot password?
            </Link>
          </Card.Body>
        </Card>
      </Row>
    </NextUIProvider>
  );
}
