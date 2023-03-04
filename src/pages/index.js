import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { withIronSessionSsr } from "iron-session/next";
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
  Navbar
} from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  async function handleSubmit(event){
    event.preventDefault();

    
    const data = {
      
    };

    

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    console.log(options); 

    const response = await fetch("api/create", options);
    const result = await response.json();
    if (result.status == "OK") {
      router.push("/room");
    } else {
      alert("Status: " + result.status);
    }

  }
  return (
    <>
    <NextUIProvider>

    <Navbar isBordered variant="floating">
          <Navbar.Brand>
            <Link href="/">
              <Image
                width={182}
                height={64}
                src="/image/penrose-triangle-PARADOX-text.png"
                alt=" Logo"
                objectFit="cover"
              />
            </Link>
          </Navbar.Brand>
          <Navbar.Content hideIn="xs" variant="highlight-rounded">
            <Navbar.Link href="/">Profile</Navbar.Link>
            <Navbar.Link href="/">Puzzle</Navbar.Link>
            <Navbar.Link href="/">LeaderBoard</Navbar.Link>
          
          </Navbar.Content>
          <Navbar.Content>
            <Navbar.Item>
            <Text h6 align="right" size={25} color="white" css={{ m: 0 }}>
                Welcome <User
                    src="https://media.istockphoto.com/id/1311634222/photo/portrait-of-successful-black-male-modern-day-student-holding-smartphone.jpg"
                    name="Benji"
                  />
              </Text>
            </Navbar.Item>
          </Navbar.Content>
        </Navbar>
      
      <Spacer y={1} />
      <Container>
        <Spacer y={1} />
        <Row gap={1}>
          <Col>
            <Card css={{ $$cardColor: "$colors$primary" }}>
              <Card.Body>
        

            
              <Grid.Container gap={2} justify="center">
                  <Grid xs={4}>
                  <Card css={{ mw: "330px" }}>
                      <Card.Header>
                        <Text  css={{ marginLeft: "auto", marginRight: "auto" }} b>Puzzle 1</Text>
                      </Card.Header>
                      <Card.Divider />
                      <Card.Body css={{ py: "$10" }}>
                         <Image
                          width={300}
                          height={300}
                          src="/image/puzzle.jpg"
                          alt=" Logo"
                          objectFit="cover"
                        />
                      </Card.Body>
                      <Card.Divider />
                      <Card.Footer>
                        <Row justify="flex-end">
        
                          <Button size="sm" css={{ marginLeft: "auto", marginRight: "auto" }}>Start</Button>
                        </Row>
                      </Card.Footer>
                    </Card>
                  </Grid>
                  <Grid xs={4}>
                    <Card css={{ mw: "330px" }}>
                      <Card.Header>
                        <Text  css={{ marginLeft: "auto", marginRight: "auto" }} b>Puzzle 2</Text>
                      </Card.Header>
                      <Card.Divider />
                      <Card.Body css={{ py: "$10" }}>
                         <Image
                          width={300}
                          height={300}
                          src="/image/puzzle.jpg"
                          alt=" Logo"
                          objectFit="cover"
                        />
                      </Card.Body>
                      <Card.Divider />
                      <Card.Footer>
                        <Row justify="flex-end">
        
                          <Button size="sm"  css={{ marginLeft: "auto", marginRight: "auto" }}>Start</Button>
                        </Row>
                      </Card.Footer>
                    </Card>
                  </Grid>
                  <Grid xs={4}>
                  <Card css={{ mw: "330px" }}>
                      <Card.Header>
                        <Text  css={{ marginLeft: "auto", marginRight: "auto" }} b>Puzzle 3</Text>
                      </Card.Header>
                      <Card.Divider />
                      <Card.Body css={{ py: "$10" }}>
                         <Image
                          width={300}
                          height={300}
                          src="/image/puzzle.jpg"
                          alt=" Logo"
                          objectFit="cover"
                        />
                      </Card.Body>
                      <Card.Divider />
                      <Card.Footer>
                        <Row justify="flex-end">
        
                          <Button size="sm"  css={{ marginLeft: "auto", marginRight: "auto" }}>Start</Button>
                        </Row>
                      </Card.Footer>
                    </Card>
                  </Grid>
                </Grid.Container>
              </Card.Body>
            </Card>
          </Col>  
        </Row>
      </Container>
    </NextUIProvider>
  </>
  );
}

// export const getServerSideProps = withIronSessionSsr(
//   async function getServerSideProps({ req }) {
//     if (req.session.user == undefined) {
//       return {
//         redirect: {
//           permanent: false,
//           destination: "login",
//         },
//       };
//     }

//     return {
//       props: {
//         user: req.session.user,
//       },
//     };
//   }, // -------------------- All boilerplate code for sessions ------------------------------------
//   {
//     cookieName: process.env.COOKIE_NAME,
//     password: process.env.SESSION_PASSWORD,
//     cookieOptions: {
//       secure: process.env.NODE_ENV === "production",
//     },
//   }
// );
