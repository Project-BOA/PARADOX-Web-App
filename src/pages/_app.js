import "../styles/globals.css";
function MyApp({ Component, pageProps }) {
  //   require('dotenv').config()
  // const mysql = require('mysql2')
  // const connection = mysql.createConnection('mysql://1n3zsw42ldzhxafyliyq:************@eu-west.connect.psdb.cloud/assignment1?ssl={"rejectUnauthorized":true}')
  // console.log('Connected to PlanetScale!')
  // connection.end()
  return <Component {...pageProps} />;
}

export default MyApp;
