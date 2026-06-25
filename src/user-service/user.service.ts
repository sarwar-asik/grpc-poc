import * as grpc from "@grpc/grpc-js";
import { userRepository } from "./user.repository";

export function getUser(call: grpc.ServerUnaryCall<{ id: string }, any>, callback: grpc.sendUnaryData<any>) {
  const user = userRepository.findById(call.request.id);
  if (!user) {
    return callback(
      {
        code: grpc.status.NOT_FOUND,
        message: "User not found",
      },
      null,
    );
  }
  callback(null, user);
}
