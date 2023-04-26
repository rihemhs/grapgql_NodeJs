# grapgql_NodeJs
grapgql_NodeJs
this is an exercise for connecting to a firebase and getting data from a collection with graphql , also it should send a boolean value to detect any change in this collection.

details :
1 Create a new Firebase project named "mydatabase" and initialize the firebase-admin package in your Node.js application using your Firebase project credentials.
2 Write a GraphQL schema that defines a Test type with fields for id, name, and description.
3 Create a resolver function for the Test type that retrieves all documents from the "test" collection in Firebase and maps them to the Test type.
4 Test your resolver function by running a GraphQL query that retrieves all Test objects from the Firebase "test" collection.
5 Use the onSnapshot() method from the firebase-admin package to listen for real-time changes in the "test" collection.
6 Modify your resolver function to also send the added, modified, or removed document to a specified endpoint whenever a change is detected.
7 Test your resolver function again by running a GraphQL query that retrieves all Test objects from the Firebase "test" collection and checking that real-time changes are properly detected and sent to the specified endpoint.
