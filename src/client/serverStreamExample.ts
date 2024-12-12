import { ServiceError, credentials } from "@grpc/grpc-js";
import {
  MyRequest,
  MyResponse,
  rpcExampleClient,
} from "../../generated/rpc_example";

const client = new rpcExampleClient(
  "localhost:12138",
  credentials.createInsecure()
);

const serverStreamRequest: MyRequest = {
  id: 1,
  msg: "This is a server side stream RPC request message from client!",
};

const stream = client.serverStreamExample(serverStreamRequest);

let count = 0;
console.log(`[Client] receiving server side stream: `);

stream.on("data", (response: MyResponse) => {
  console.log(`[Client] received: ${response.msg}`);
  count += 1;
});

stream.on("end", () => {
  console.log(`[Client] All ${count} responses received!`);
  console.log("[Client] Server-side stream ended.");
});

stream.on("error", (err: ServiceError) => {
  console.error("[Client] Stream error:", err);
});

// get stream status after finishing the RPC
stream.on("status", (status) => {
  console.log("[Client] Status received:", status);
});
