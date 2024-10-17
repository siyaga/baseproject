const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka:9092"], // Use the Kafka service name from docker-compose
  // brokers: ['localhost:9092'], // Use 'localhost' if Kafka is on your machine
});

module.exports = kafka;
