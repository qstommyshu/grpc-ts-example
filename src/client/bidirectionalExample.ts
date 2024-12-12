import { credentials } from "@grpc/grpc-js";
import {
  MyRequest,
  MyResponse,
  rpcExampleClient,
} from "../../generated/rpc_example";

const client = new rpcExampleClient(
  "localhost:12138",
  credentials.createInsecure()
);

const stream = client.bidirectionalExample();

stream.on("data", (response: MyResponse) => {
  console.log(`Received response from server: ${response.msg}`);
});

stream.on("error", (err: Error) => {
  console.error("Stream error:", err);
});

stream.on("status", (status) => {
  console.log("Status received:", status);
});

for (let i = 0; i < 5; i++) {
  // send a response every 1 sec
  setTimeout(() => {
    const request: MyRequest = {
      id: i,
      msg: `bidirectional stream request #${i}`,
    };
    stream.write(request);
  }, i * 1000);
}

// end the stream after all response are sent, leave 1 sec as buffer time
setTimeout(() => {
  stream.end();
}, 6000);
