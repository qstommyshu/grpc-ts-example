import { credentials } from "@grpc/grpc-js";
import { MyRequest, rpcExampleClient } from "../../generated/rpc_example";

const client = new rpcExampleClient(
  "localhost:12138",
  credentials.createInsecure()
);

const stream = client.clientStreamExample((error, response) => {
  if (error) {
    console.error(`[Client] client side stream RPC error: ${error}`);
  } else {
    console.log(
      `[Client] client side stream RPC response received: ${response.msg}`
    );
  }
});

// no stream.on("data") because server response is not send through stream in this case

stream.on("error", (err: Error) => {
  console.error(`[Client] stream error: ${err}`);
});

stream.on("status", (status) => {
  console.log("Status received:", status);
});

console.log(`[Client] sending requests...`);
for (let i = 0; i < 5; i++) {
  // send a response every 1 sec
  setTimeout(() => {
    const request: MyRequest = { id: i, msg: `client stream request #${i}` };
    stream.write(request);
  }, i * 1000);
}

// end the stream after all response are sent, leave 1 sec as buffer time
setTimeout(() => {
  stream.end();
}, 6000);
