const { response } = require("express");
const express = require("express");
const fs = require('fs');
const port = 8080;
const bodyParser=require("body-parser");
const app = express();

app.use(bodyParser.json());

let users = [];
if (fs.existsSync('users.json')) {
  users = JSON.parse(fs.readFileSync('users.json', "utf8"));
  console.log('users: ', users);
}

app.use((request, response, next) => {
  if(request.method === 'GET'){
    console.log("You are using wrong method!");
  }
  console.log("<<<",request.body);
  next();
});

app.post((request, response, next) => {
  console.log('Hey!');
    if (
      request.method === 'POST' &&
      request.headers.iknowyoursecret === 'TheOwlsAreNotWhatTheySeem'
    ) {
      response.writeHead(200, { "Content-Type": "text/plain" });
      let name;
      let ip = request.connection.remoteAddress;
      if (request.headers.name) {
        name = request.headers.name;
      } else {
        name = 'unknown'
      }
      users.push({name: name, ip});
      fs.writeFile('users.json', JSON.stringify(users), (err) => {
        if (err) {
            return console.log('Something bad happened', err)
        }
      });
      response.end(`Hello ${(users.map(item => item.name).join(', '))}`);
      next();
    } 
    else{
      response.end(`Sorry, you are not authorized, bye`);
    }
  });

app.use('/', (request, response, next) => {
  if (request.path !== '/secret') {
    response.send('Sorry, i can\'t tell you nothing!');
  } else {
    response.send('The Owls Are Not What They Seem');
  }  
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err)
    }
    console.log(`Server is listening on ${port}`)
})