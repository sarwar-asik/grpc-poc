import * as grpc from "@grpc/grpc-js";
import { loadProto } from "../shared/proto-loader";
import { createOrder } from "./order.service";

const proto = loadProto("order.proto") as any;

async function createOrderHandler(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
  try {
    const result = await createOrder(call.request);
    callback(null, result);
  } catch (err: any) {
    callback({
      code: err.code || grpc.status.INTERNAL,
      message: err.message || "Internal error",
    });
  }
}

const server = new grpc.Server();
server.addService(proto.order.OrderService.service, {
  CreateOrder: createOrderHandler,
});

const PORT = "0.0.0.0:50052";
server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`✅ Order Service running on ${PORT}`);
});
