import amqp from "amqplib";

class MessageQueueAdapter {
  private connection: amqp.Connection;
  private channel?: amqp.Channel;
  private queue: string;

  constructor(connection: amqp.Connection, queue: string) {
    this.queue = queue;
    this.connection = connection;
  }

  async createChannel() {
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queue, { durable: true });

    return this.channel;
  }

  async sendMessage(message: string) {
    if (!this.channel) throw new Error("Channel not initialized");

    this.channel.sendToQueue(this.queue, Buffer.from(message), {
      persistent: true,
    });
  }

  async consumeMessages(
    callback: (
      message: amqp.ConsumeMessage | null,
      channel?: amqp.Channel
    ) => void
  ) {
    if (!this.channel) throw new Error("Channel not initialized");

    await this.channel.consume(
      this.queue,
      (msg) => callback(msg, this.channel),
      {
        noAck: true,
      }
    );
  }

  async close() {
    if (!this.channel) throw new Error("Channel not initialized");
    if (!this.connection) throw new Error("Connection not initialized");

    await this.channel.close();
    await this.connection.close();
  }
}

export { MessageQueueAdapter };
