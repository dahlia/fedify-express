import { Readable } from "node:stream";
import type { ReadableStream as WebReadableStream } from "node:stream/web";
import type { Federation } from "@fedify/fedify";
import type {
  Request as ERequest,
  Response as EResponse,
  NextFunction,
} from "express";

type Middleware = (req: ERequest, res: EResponse, next: NextFunction) => void;

export type ContextDataFactory<TContextData> = (
  req: ERequest,
) => TContextData | Promise<TContextData>;

export function integrateFederation<TContextData>(
  federation: Federation<TContextData>,
  contextDataFactory: ContextDataFactory<TContextData>,
): Middleware {
  return (req, res, next) => {
    const request = fromERequest(req);
    const contextData = contextDataFactory(req);
    const contextDataPromise =
      contextData instanceof Promise
        ? contextData
        : Promise.resolve(contextData);
    contextDataPromise.then(async (contextData) => {
      const response = await federation.fetch(request, {
        contextData,
        onNotFound: () => {
          // If the `federation` object finds a request not responsible for it
          // (i.e., not a federation-related request), it will call the `next`
          // function provided by the Express framework to continue the request
          // handling by the Express:
          next();
          return new Response("", { status: 404 }); // unused
        },
        onNotAcceptable: () => {
          // Similar to `onNotFound`, but slightly more tricky.
          // When the `federation` object finds a request not acceptable
          // type-wise (i.e., a user-agent doesn't want JSON-LD), it will call
          // the `next` function provided by the Express framework to continue
          // if any route is matched, and otherwise, it will return a 406 Not
          // Acceptable response:
          if (req.route != null) next();
          return new Response("", { status: 406 });
        },
      });
      setEResponse(res, response);
    });
  };
}

function fromERequest(req: ERequest): Request {
  const url = `${req.protocol}://${req.header("Host") ?? req.hostname}${req.url}`;
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const v of value) headers.append(key, v);
    } else if (typeof value === "string") {
      headers.append(key, value);
    }
  }
  return new Request(url, {
    method: req.method,
    headers,
    body: Readable.toWeb(req) as ReadableStream<Uint8Array>,
  });
}

function setEResponse(res: EResponse, response: Response): void {
  res.status(response.status);
  response.headers.forEach((value, key) => res.setHeader(key, value));
  if (response.body == null) return;
  // biome-ignore lint/suspicious/noExplicitAny: Readable.fromWeb is untyped
  Readable.fromWeb(response.body as WebReadableStream<any>).pipe(res);
}
