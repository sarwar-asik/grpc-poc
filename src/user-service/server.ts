import * as grpc from "@grpc/grpc-js";
import { loadProto } from "../shared/proto-loader";
import { getUser } from "./user.service";

const proto = loadProto("user.proto") as any;

const PORT = "0.0.0.0:50051";

const server = new grpc.Server();
server.addService(proto.user.UserService.service, { GetUser1: getUser });

server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`✅ User Service running on ${PORT}`);
});
