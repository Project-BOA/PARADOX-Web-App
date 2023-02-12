import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  async function login(req, res) {

    console.log("login api page called...");
   
    console.log("looking at the variables we got from the browser..");
    console.log(req.body);
  
    // Get just the username and password and put them into variables.
    const username = req.body.username;
    const pass = req.body.password;
  
    console.log("username is: "+ username);
    console.log("password  is: "+ pass);
  
  
    // db
    // get the client
    const mysql = require('mysql2');
  
    // create the connection to database
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Wvfn9337',
      database: 'assignment1'
    });
  
  
    // simple query
  connection.query(
    "SELECT * FROM users WHERE username = '"+username+"' AND pass = '"+pass+"' LIMIT 1;",
    async function(err, results, fields) {
   
      console.log(results); // results contains rows returned by server
  
      console.log(results.length);
  
      
      // sending back the result.
      if(results.length == 1){

        req.session.user = {
          username: results[0].username,
          email: results[0].email,
          address: results[0].address
        };

        await req.session.save();
  
        //res.status(200).json("ok");
        var acctype = results[0].acctype;
        if(acctype == 'customer'){
          res.status(200).json("customer")
        }
        else if(acctype == 'manager'){
          res.status(200).json("manager")
        }
      } else {
       
        res.status(200).json("fail");
  
      }
     
    }
  );
      
  },{
    cookieName: "myapp_cookiename",
    password: "complex_password_at_least_32_characters_long",
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  },


);
   