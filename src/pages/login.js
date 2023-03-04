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

  async function handleSubmit(event){
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

    const response = await fetch("api/login", options);
    const result = await response.json();
    if (result.status == "OK") {
      router.push("/");
    } else {
      alert("Status: " + result.status);
    }

  }

  return (
    <NextUIProvider>
      <Container>
        <Row gap={1}>
          <Card css={{ $$cardColor: "$colors$primary" }}>
            <Card.Body>
              <Text h6 align="center" size={25} color="white" css={{ m: 0 }}>
                Welcome to PARADOX
              </Text>
            </Card.Body>
          </Card>
        </Row>
        <Spacer y={1} />
        <Row gap={1}>
          <Col>
            <Card css={{ $$cardColor: "$colors$primary" }}>
              <Card.Body>
              <Text h6 align="center" size={18} color="white" css={{ m: 0 }}>
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
                      <Button
                        auto
                        type="submit"
                        color="secondary"
                        css={{ marginLeft: "auto", marginRight: "auto" }}
                      >
                        Login
                      </Button>
                    </Grid>
                    <Spacer y={0} />
            
                  </Grid.Container>
                </form>
               
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
          </Col>
          <Col>
            <Card css={{ $$cardColor: "$colors$primary" }}>
              <Card.Body>
              <Text h6 align="center" size={18} color="white" css={{ m: 0 }}>
                  New Here?
                </Text>
                <Spacer y={5} />
                  <Grid.Container justify="center">
                    <Grid>
                      <Link href="register">
                        <Button auto bordered color="secondary">
                          Register
                        </Button>
                      </Link>
                    </Grid>
                  </Grid.Container>
                <Spacer y={1} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </NextUIProvider>
  );


 
}
