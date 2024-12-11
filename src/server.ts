import {
  Server,
  ServerCredentials,
  sendUnaryData,
  ServerUnaryCall,
  ServerWritableStream,
} from "@grpc/grpc-js";
import {
  MyRequest,
  MyResponse,
  rpcExampleService,
} from "../generated/rpc_example";

const unaryExample = (
  call: ServerUnaryCall<MyRequest, MyResponse>,
  callback: sendUnaryData<MyResponse>
) => {
  const request = call.request;
  console.log(`request name is ${request.name}`);
  console.log(`[server] unary request received`);
  const result: MyResponse = { name: "Server unary response" };
  callback(null, result);
};

const serverStreamExample = (
  call: ServerWritableStream<MyRequest, MyResponse>
) => {
  const request = call.request;
  console.log(`[server] server stream request received`);

  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const response = { name: `server stream ${i}` };
      call.write(response);
    }, i * 1000);
  }
  setTimeout(() => {
    call.end();
  }, 5000);
};

const server = new Server();
server.addService(rpcExampleService, { unaryExample, serverStreamExample });
server.bindAsync("localhost:12138", ServerCredentials.createInsecure(), () => {
  console.log("Server running at http://localhost:12138");
});
