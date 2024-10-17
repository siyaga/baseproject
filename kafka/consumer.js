// const kafka = require("../helpers/kafkaHelper");

// const consumer = kafka.consumer({ groupId: "user-group" });

// const consumeMessages = async (topic, messageHandler) => {
//   await consumer.connect();
//   await consumer.subscribe({ topic: topic, fromBeginning: true });

//   await consumer.run({
//     eachMessage: async ({ topic, partition, message }) => {
//       const messageContent = JSON.parse(message.value.toString());
//       await messageHandler(messageContent);
//     },
//   });
// };

// module.exports = consumeMessages;
