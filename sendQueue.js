const { ServiceBusClient } = require("@azure/service-bus");

const connectionString = "Endpoint=sb://sb-yield-service-bus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=9qUsUaCnFcbvmU0mmNWScTfH9oWDIV4XxZeKo11y+ck="

const queueName = "sbq-yield-service-bus-queue"
const sendToQueue = async(message_queue) =>{
  const sbClient = new ServiceBusClient(connectionString);

	// createSender() can also be used to create a sender for a topic.
	const sender = sbClient.createSender(queueName);
  const message =
    { body: message_queue }
   
	try {
		// Tries to send all messages in a single batch.
		// Will fail if the messages cannot fit in a batch.
		// await sender.sendMessages(messages);

		// create a batch object
		let batch = await sender.createMessageBatch(); 
			// for each message in the array			

			// try to add the message to the batch
			if (!batch.tryAddMessage(message)) {			
				// if it fails to add the message to the current batch
				// send the current batch as it is full
				await sender.sendMessages(batch);
				// then, create a new batch 
				batch = await sender.createMessageBatch();
			
		}

		// Send the last created batch of messages to the queue
		await sender.sendMessages(batch);

		console.log(`Sent a batch of messages to the queue: ${queueName}`);

		// Close the sender
		await sender.close();
	} finally {
		await sbClient.close();
	}
  return "Successfully sent to Queue"
}

module.exports = { sendToQueue }