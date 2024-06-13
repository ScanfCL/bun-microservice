import { MessageQueueConnection } from "@erp/libs";

const messageQueueConnection = new MessageQueueConnection();
export const connection = await messageQueueConnection.connect();
