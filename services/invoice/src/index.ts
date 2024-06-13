import { Elysia } from "elysia";
import { runInvoiceConsumer } from "./invoice.service";

await runInvoiceConsumer();
const app = new Elysia().get("/", () => "Hello Elysia").listen(3003);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
