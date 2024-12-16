import { credentials } from "@grpc/grpc-js";
import { MyRequest, rpcExampleClient } from "../../generated/rpc_example";

const client = new rpcExampleClient(
  "localhost:12138",
  credentials.createInsecure()
);

const unaryRequest: MyRequest = {
  id: 1,
  msg: "This is a unary RPC request message from client!",
};

client.unaryExample(unaryRequest, (err, response) => {
  if (err) {
    console.error(`[Client] unary RPC error: ${err}`);
  } else {
    console.log(`[Client] unary RPC response received: ${response.msg}`);
  }
});

console.log("[Client] unary RPC example done");
