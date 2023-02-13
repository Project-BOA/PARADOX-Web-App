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
      <Container
        gap={0}
        display="flex"
        alignItems="center"
        justify="right"
        css={{ minHeight: "100vh" }}
      >
        <Row gap={1}>
          <Col>
            <Card css={{ mw: "420px", p: "20px" }} variant="bordered">
              <Text
                size={24}
                weight="bold"
                css={{
                  as: "center",
                  mb: "20px",
                }}
              >
                PARADOX Login
              </Text>

              <form onSubmit={handleSubmit}>
              <Input
                id="username"
                clearable
                bordered
                labelPlaceholder="Username"
                initialValue=""
                maxLength="20"
                minLength="4"
              />

              <Spacer y={1} />

              <Input
                id="password"
                clearable
                bordered
                labelPlaceholder="Password"
                initialValue=""
                maxLength="20"
                minLength="4"
              />

              <Spacer y={1} />

              <Button color="secondary" auto input type="submit" value="Submit">
                Login
              </Button>
              </form>
            </Card>
          </Col>
        </Row>

        <Row gap={1}>
          <Col>
            <Card css={{ mw: "420px", p: "20px" }} variant="bordered">
              <Text
                size={24}
                weight="bold"
                css={{
                  as: "center",
                  mb: "20px",
                }}
              >
                New Here?
              </Text>

              <Text
                size={16}
                css={{
                  as: "center",
                  mb: "20px",
                }}
              >
                Click Below
              </Text>

              <Button color="secondary" auto input type="submit" value="Submit">
                Sign Up
              </Button>
             
            </Card>
          </Col>
        </Row>
      </Container>
    </NextUIProvider>
  )
}
