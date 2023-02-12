import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { NextUIProvider } from '@nextui-org/react';
import { Container, Card, Row, Text, Col, Spacer, Button, Input, Image , Navbar, Link} from "@nextui-org/react";



const inter = Inter({ subsets: ["latin"] });

export default function Login() {

    async function handleSubmit(event) {

        alert("The form was submitted");
        event.preventDefault();
     
 
        // grab the variables from the form.
        const name = document.querySelector('#username').value
 
        console.log("username is " + name);
 
        const pass = document.querySelector('#password').value
 
        console.log("password is " + pass);
 
 
 
 
 
         // Get data from the form.
         const data = {
           username: event.target.username.value,
           password: event.target.password.value,
         }
     
         // Send the data to the server in JSON format.
         const JSONdata = JSON.stringify(data)
     
         // API endpoint where we send form data.
         const endpoint = '/api/login'
 
 
     
         // Form the request for sending data to the server.
         const options = {
           // The method is POST because we are sending data.
           method: 'POST',
           // Tell the server we're sending JSON.
           headers: {
             'Content-Type': 'application/json',
           },
           // Body of the request is the JSON data we created above.
           body: JSONdata,
         }
 
         
     
         // Send the form data to our forms API on Vercel and get a response.
         const response = await fetch(endpoint, options)
     
         // Get the response data from server as JSON.
         // If server returns the name submitted, that means the form works.
         const result = await response.json()
         alert(`server result: ${result}`)
     
   }



  return (
    < NextUIProvider>

    <Container gap={0}>

    <Navbar isBordered variant={"floating"}>
        <Navbar.Brand>
          <Text b color="inherit" hideIn="xs">
            PARADOX
          </Text>
        </Navbar.Brand>
        <Navbar.Content hideIn="xs">
          <Navbar.Link href="#">Features</Navbar.Link>
          <Navbar.Link isActive href="#">Customers</Navbar.Link>
          <Navbar.Link href="#">Pricing</Navbar.Link>
          <Navbar.Link href="#">Company</Navbar.Link>
        </Navbar.Content>
    </Navbar>
    <Spacer y={1} />
    <Row gap={1}>
        <Col>
          <Card css={{ $$cardColor: '#08a04b' }}>
            <Card.Body>
            <Text h1 size={15} color="white" css={{ m: 0 }}>
                
            </Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card css={{ $$cardColor: '#08a04b' }}>
            <Card.Body>
              <Text h6 size={15} color="white" css={{ m: 0 }}>
              <form onSubmit={handleSubmit}>

               <Input id ="username" clearable bordered labelPlaceholder="Username" />

               <Spacer y={1.5} />

               <Input.Password id="password" labelPlaceholder="Password"/>
                
                <Spacer y={1.5} />

             
                <Button color="secondary" auto input type="submit" value="Sumbit">Login</Button>
                </form>

                <form action="/register">
                   <Button color="secondary" auto input type="sumbit" value="Sumbit">Register</Button>
                </form>
               
                

                {/* <Link href="/register"> Register</Link> */}
              
             
              </Text>
            </Card.Body>
          </Card>
        </Col>
    </Row>
    </Container>


    </NextUIProvider>
  );
}
