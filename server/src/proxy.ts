// proxy.ts
import { Proxy } from "http-mitm-proxy";
import { RequestModel } from "./models/Request";
import { v4 as uuidv4 } from "uuid";

// Extend the IContext type to include requestBody and responseBody
export function createProxyServer() {
  const proxy = new Proxy();

  proxy.onError((ctx: any, err: any) => {
    console.error("Proxy error:", err);
  });

  proxy.onRequest((ctx: any, callback) => {
    const chunks: Buffer[] = [];

    ctx.onRequestData((ctx: any, chunk: any, cb: any) => {
      chunks.push(chunk);
      return cb(null, chunk);
    });

    ctx.onRequestEnd((ctx: any, cb: any) => {
      const requestBody = Buffer.concat(chunks).toString();
      ctx.requestBody = requestBody;
      cb();
    });

    ctx.onResponseData((ctx: any, chunk: any, cb: any) => {
      ctx.responseBody =
        (ctx.responseBody || Buffer.from("")).toString() + chunk.toString();
      cb(null, chunk);
    });

    ctx.onResponseEnd((ctx: any, cb: any) => {
      const requestId = uuidv4();
      const request = new RequestModel({
        sessionId:
          ctx.clientToProxyRequest.headers["x-session-id"] || "default",
        timestamp: new Date(),
        method: ctx.clientToProxyRequest.method,
        url: ctx.clientToProxyRequest.url,
        headers: ctx.clientToProxyRequest.headers,
        body: ctx.requestBody,
        response: {
          status: ctx.serverToProxyResponse.statusCode,
          headers: ctx.serverToProxyResponse.headers,
          body: ctx.responseBody,
        },
        suggestedVariables: {},
        dependsOn: [],
      });
      request.save();
      cb();
    });

    callback();
  });

  proxy.listen({ port: 8000 });
  console.log("🕵️ TailAPI proxy running at http://localhost:8000");
}
