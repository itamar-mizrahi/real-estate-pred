const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define your GraphQL schema
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Define your resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello, world!'
  }
};

// Create an Apollo Server instance
const server = new ApolloServer({ typeDefs, resolvers });

// Create an Express app
const app = express();

// Apply the Apollo Server middleware to the Express app
server.applyMiddleware({ app });

// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000/graphql');
});
