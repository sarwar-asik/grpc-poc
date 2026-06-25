import * as grpc from "@grpc/grpc-js";
import { loadProto } from "../shared/proto-loader";

const proto = loadProto("user.proto") as any;

const client = new proto.user.UserService(process.env.USER_SERVICE_URL || "localhost:50051", grpc.credentials.createInsecure());

function getUser(id: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 3); // 3s timeout

    client.GetUser1({ id }, { deadline }, (err: any, res: any) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

export async function createOrder(req: { user_id: string; product: string; quantity: number }) {
  // 1) User Service ke jiggesh kori — user ache kina
  let user;
  try {
    user = await getUser(req.user_id);
  } catch (err: any) {
    if (err.code === grpc.status.NOT_FOUND) {
      throw {
        code: grpc.status.FAILED_PRECONDITION,
        message: "Invalid user — order create kora jabe na",
      };
    }
    throw err; // e.g. User Service down — error upore pathai
  }

  // 2) User valid — ekhon order banai
  return {
    order_id: `ORD-${Date.now()}`,
    status: "CONFIRMED",
    customer_name: user.name, // User Service theke pawa naam
  };
}
