import { MessageQueueAdapter } from "@erp/libs";
import { InvoiceStatus, PrismaClient } from "@prisma/client";
import { connection } from "./mq-connection";

// Payload message types
type CreateInvoicePayloadMessage = {
  bookingId: string;
  carPrice: number;
  customerName: string;
};

type UpdateInvoiceStatusPayloadMessage = {
  invoiceId: string;
  status: InvoiceStatus;
};

type PayloadMessage =
  | { type: "CREATE_INVOICE"; data: CreateInvoicePayloadMessage }
  | { type: "UPDATE_INVOICE_STATUS"; data: UpdateInvoiceStatusPayloadMessage };

type ProcessMessage = {
  [key in PayloadMessage["type"]]: (
    data: Extract<PayloadMessage, { type: key }>["data"]
  ) => Promise<void>;
};

// Prisma and message queue initialization
const prisma = new PrismaClient();
const messageQueue = new MessageQueueAdapter(connection, "invoice");

// Invoice service
export const invoiceService = {
  invoices: () => prisma.invoice.findMany(),
  createInvoices: (bookingId: string, carPrice: number, customerName: string) =>
    prisma.invoice.create({
      data: {
        bookingId,
        totalAmount: carPrice,
        paymentDate: new Date(),
        status: InvoiceStatus.Unpaid,
        customerName,
      },
    }),
  updateInvoiceStatus: (invoiceId: string, status: InvoiceStatus) =>
    prisma.invoice.update({
      where: { id: invoiceId },
      data: { status },
    }),
};

// Process message handlers
const processMessage: ProcessMessage = {
  CREATE_INVOICE: async (data: CreateInvoicePayloadMessage) => {
    const { bookingId, carPrice, customerName } = data;
    await invoiceService.createInvoices(bookingId, carPrice, customerName);
  },
  UPDATE_INVOICE_STATUS: async (data: UpdateInvoiceStatusPayloadMessage) => {
    const { invoiceId, status } = data;
    await invoiceService.updateInvoiceStatus(invoiceId, status);
  },
};

// Run invoice consumer
export const runInvoiceConsumer = async () => {
  await messageQueue.createChannel();

  messageQueue.consumeMessages((msg) => {
    if (msg !== null) {
      const payloadMessage: PayloadMessage = JSON.parse(
        msg.content.toString()
      ) as PayloadMessage;

      const process = processMessage[payloadMessage.type];
      if (process) {
        process(payloadMessage.data as any); // Type assertion to any
      } else {
        console.error(`Unknown message type: ${payloadMessage.type}`);
      }
    }
  });
};
