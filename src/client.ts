import { ClientReadableStream, ServiceError, credentials } from "@grpc/grpc-js";
import {
  MyRequest,
  MyResponse,
  rpcExampleClient,
} from "../generated/rpc_example";

const rpcRequest: MyRequest = { name: "client unary request" };

const client = new rpcExampleClient(
  "localhost:12138",
  credentials.createInsecure()
);

client.unaryExample(
  rpcRequest,
  (err: ServiceError | null, response: MyResponse) => {
    console.log(`response from server is ${response.name}`);
  }
);

const stream = client.serverStreamExample(rpcRequest);

stream.on("data", (response: MyResponse) => {
  console.log(`Received message from server-side stream: ${response.name}`);
});

stream.on("end", () => {
  console.log("Server-side stream ended.");
});

stream.on("error", (err: ServiceError) => {
  console.error("Stream error:", err);
});

stream.on("status", (status) => {
  console.log("Status received:", status);
});
