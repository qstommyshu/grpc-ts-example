import {
  Server,
  ServerCredentials,
  sendUnaryData,
  ServerUnaryCall,
  ServerWritableStream,
  ServerReadableStream,
  ServerDuplexStream,
} from "@grpc/grpc-js";
import {
  MyRequest,
  MyResponse,
  rpcExampleService,
} from "../generated/rpc_example";

// Unary RPC example: Handles a single request and sends a single response.
const unaryExample = (
  call: ServerUnaryCall<MyRequest, MyResponse>,
  callback: sendUnaryData<MyResponse>
) => {
  const request = call.request;
  console.log("[Server] Unary RPC request received: ", request.msg);

  const result: MyResponse = {
    msg: "server response-unary example",
  };

  callback(null, result);
  console.log("[Server] Unary RPC response sent.");
};

// Server-side streaming RPC example: Sends multiple responses for a single request.
const serverStreamExample = (
  stream: ServerWritableStream<MyRequest, MyResponse>
) => {
  console.log(
    "[Server] Server-side stream RPC request received: ",
    stream.request.msg
  );

  for (let i = 0; i < 5; i++) {
    // Send a response every 1 second.
    setTimeout(() => {
      const response = { msg: `server response #${i}-server stream example` };
      stream.write(response);
    }, i * 1000);
  }

  // End the stream after all responses are sent, with a 1-second buffer.
  setTimeout(() => {
    stream.end();
    console.log("[Server] Server-side stream ended.");
  }, 6000);
};

// Client-side streaming RPC example: Receives multiple requests and sends a single response.
const clientStreamExample = (
  stream: ServerReadableStream<MyRequest, MyResponse>,
  callback: sendUnaryData<MyResponse>
) => {
  console.log("[Server] Client-side stream RPC request received.");

  let count = 0;
  stream.on("data", (request: MyRequest) => {
    console.log(`[Server] Received client stream request: ${request.msg}`);
    count++;
  });

  stream.on("end", () => {
    console.log(`[Server] All ${count} client stream requests received.`);
    const response: MyResponse = {
      msg: "server response: client stream example",
    };
    callback(null, response);
    console.log("[Server] Client stream response sent.");
  });
};

// Bidirectional streaming RPC example: Handles a two-way stream of requests and responses.
const bidirectionalExample = (
  stream: ServerDuplexStream<MyRequest, MyResponse>
) => {
  console.log("[Server] Bidirectional stream RPC started.");

  let count = 0;
  let sent = 0;
  stream.on("data", (request: MyRequest) => {
    console.log(
      `[Server] Received bidirectional stream request with id:${request.id}`
    );
    count++;

    const response = {
      msg: `server response #${count}-bidirectional example`,
    };
    // send response 0.5 sec after receiving request
    setTimeout(() => {
      stream.write(response);
      sent++;
    }, 500);
  });

  stream.on("end", () => {
    console.log(
      `[Server] All ${count} bidirectional stream requests received.`
    );
    console.log("[Server] Bidirectional stream ended.");
    stream.end();
  });

  stream.on("error", (err: Error) => {
    console.error("[Server] Bidirectional stream error:", err);
  });

  stream.on("status", (status) => {
    console.log("[Server] Status received:", status);
  });
};

// Initialize the gRPC server and bind the RPC services.
const server = new Server();
server.addService(rpcExampleService, {
  unaryExample,
  serverStreamExample,
  clientStreamExample,
  bidirectionalExample,
});

// Start the server on the specified address.
server.bindAsync("localhost:12138", ServerCredentials.createInsecure(), () => {
  console.log("[Server] Running at http://localhost:12138");
});
