const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const serviceAccount = require('../mydatabase-ba6e1-firebase-adminsdk-jfiqi-a094b6cb0d.json');
const axios = require('axios');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://mydatabase-ba6e1-default-rtdb.europe-west1.firebasedatabase.app'
});

const typeDefs = gql`
  type Test {
    id :Int
    name:String
    description:String
  }
  type Query {
    tests:[Test]
  }
`;

const resolvers = {
  Query: {
    tests: () =>{
        return admin
        .database()
        .ref("tests")
        .once("value")
        .then((snap) => snap.val())
        .then((val) =>  Object.keys(val).map((key) => val[key]));
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();

async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/', cors: true });
  console.log('Apollo Server on Firebase Functions has started!');

  const db = admin.database();
  const testsRef = db.ref("tests");

  const sendTestToEndpoint = (test, eventType) => {
    console.log("eventType",eventType)
    console.log("test",test)
    axios.post(`http://example.com/my-endpoint/${eventType}`, test)
      .then(() => console.log(`Test ${eventType} sent to endpoint`))
      .catch((error) => console.log(`Error sending test to endpoint: ${error}`));
  };

  testsRef.on("child_changed", (snapshot) => {
    const changedTest = snapshot.val();
    console.log("Test changed:", changedTest);

    // Send the changed test to a specified endpoint
    sendTestToEndpoint(changedTest, "changed");
  });

  testsRef.on("child_added", (snapshot) => {
    const newTest = snapshot.val();
    console.log("New test added:", newTest);
    // Send the new test to a specified endpoint
    sendTestToEndpoint(newTest, "new");
    console.log("new Test ",newTest)
  });

  testsRef.on("child_removed", (snapshot) => {
    const removedTest = snapshot.val();
    console.log("Test removed:", removedTest);

    // Send the removed test to a specified endpoint
    sendTestToEndpoint(removedTest, "removed");
  });
}

startServer();

exports.graphql = functions.https.onRequest(app);







