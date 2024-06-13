import amqp from "amqplib";

class MessageQueueConnection {
  private connection?: amqp.Connection;

  async connect() {
    this.connection = await amqp.connect("amqp://localhost");
    return this.connection;
  }

  async close() {
    if (!this.connection) throw new Error("Connection not initialized");
    await this.connection.close();
  }
}

export { MessageQueueConnection };
