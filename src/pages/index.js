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
} from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
    <NextUIProvider>
      
      <Spacer y={1} />
      <Container>
        <Row gap={1}>
          <Card css={{ $$cardColor: "$colors$primary" }}>
            <Card.Body>
            <Text h6 align="left" size={25} color="white" css={{ m: 0 }}>
                PARADOX 
              </Text>
           
              <Text h6 align="right" size={25} color="white" css={{ m: 0 }}>
                Welcome <User
                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                    name="Benji"
                  />
              </Text>
            </Card.Body>
          </Card>
        </Row>
        <Spacer y={1} />
        <Row gap={1}>
          <Col>
            <Card css={{ $$cardColor: "none" }}>
              <Card.Body>
             
                  
          
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
