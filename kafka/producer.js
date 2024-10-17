const kafka = require("../helpers/kafkaHelper");

const producer = kafka.producer();

const sendMessage = async (
  topic,
  message,
  maxRetries = 5,
  backoffTime = 100
) => {
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      await producer.connect(); // Ensure the producer is connected
      await producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
      console.log(`Message sent successfully to topic: ${topic}`);
      return; // Exit the loop on success
    } catch (error) {
      console.error(`Error sending message to topic ${topic}:`, error);
      retryCount++;
      console.log(`Retrying in ${backoffTime}ms...`);
      await new Promise((resolve) => setTimeout(resolve, backoffTime));
      backoffTime *= 2; // Exponential backoff
    } finally {
      await producer.disconnect(); // Disconnect after sending or retries
    }
  }

  console.error(
    `Max retries reached. Failed to send message to topic ${topic}.`
  );
  // Handle the error appropriately (e.g., log, alert, store the message)
};

module.exports = sendMessage;
