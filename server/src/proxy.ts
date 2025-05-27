// proxy.ts
import { Proxy } from "http-mitm-proxy";
import { RequestModel } from "./models/Request";
import { v4 as uuidv4 } from "uuid";
import net from "net";
import { exec } from "child_process";
import assert from "assert";
// Extend the IContext type to include requestBody and responseBody

// Since node 0.9.9, ECONNRESET on sockets are no longer hidden
function filterSocketConnReset(err: any, socketDescription: string) {
  if (err.errno === "ECONNRESET") {
    console.log(`Got ECONNRESET on ${socketDescription}, ignoring.`);
  } else {
    console.log(`Got unexpected error on ${socketDescription}`, err);
  }
}

export function createProxyServer() {
  const proxy = new Proxy();
  proxy.onConnect((req, socket, head, callback) => {
    console.log(`HTTPS CONNECT to ${req?.url}`, head.toString("utf-8"));
    if (!req.url) {
      console.log("No url in request");
      return;
    }
    //return callback(); // continue with MITM
    const host = req.url.split(":")[0];
    const port = parseInt(req.url.split(":")[1]);

    console.log("Tunnel to", req.url);
    const conn = net.connect(
      {
        port,
        host,
        allowHalfOpen: true,
      },
      () => {
        conn.on("finish", () => {
          socket.destroy();
        });
        socket.on("close", () => {
          conn.end();
        });
        socket.write("HTTP/1.1 200 OK\r\n\r\n", "utf-8", () => {
          conn.pipe(socket);
          socket.pipe(conn);
        });
        socket.write("HTTP/1.1 200 OK\r\n\r\n", "utf-8", () => {
          conn.pipe(socket);
          socket.pipe(conn);
        });
      }
    );

    conn.on("error", (err) => {
      filterSocketConnReset(err, "PROXY_TO_SERVER_SOCKET");
    });
    socket.on("error", (err) => {
      filterSocketConnReset(err, "CLIENT_TO_PROXY_SOCKET");
    });
  });
  /*proxy.onError((ctx: any, err: any) => {
    console.log(
      ctx?.clientToProxyRequest?.url,
      "---------error------------",
      ctx
    );
    console.error("Proxy error:", err);
  });

  proxy.onRequest((ctx: any, callback) => {
    console.log(ctx?.clientToProxyRequest?.url, "---------------------");
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
  });*/
  const port = 8888;
  proxy.listen({ port }, () => {
    console.log("✅ Proxy server started on port ", port);
    const cmd = `curl -x http://localhost:${port} https://github.com/ | grep html`;
    console.log(`> ${cmd}`);
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`${stdout}`);
      //assert(/DOCTYPE/.test(stdout));
      proxy.close();
    });
    //console.log("🕵️ TailAPI proxy running at http://localhost:8888");
  });
}
