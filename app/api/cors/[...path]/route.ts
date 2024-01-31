import { NextRequest, NextResponse } from "next/server";

// /api/cors AOP

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }

  // 从原始请求中提取查询字符串
  const queryString = req.nextUrl.search;

  const [protocol, ...subpath] = params.path;
  console.log("path", params.path);
  const targetUrl = `${protocol}://${subpath.join("/")}${queryString}`;

  const method = req.headers.get("method") ?? undefined;
  const shouldNotHaveBody = ["get", "head"].includes(
    method?.toLowerCase() ?? "",
  );

  const fetchOptions: RequestInit = {
    headers: {
      "Content-Type": req.headers.get("Content-Type") ?? "application/json",
      authorization: req.headers.get("authorization") ?? "",
    },
    body: shouldNotHaveBody ? null : req.body,
    method,
    // @ts-ignore
    duplex: "half",
  };

  const fetchResult = await fetch(targetUrl, fetchOptions);

  console.log("[Any Proxy]", targetUrl, {
    path: params,
    headers: fetchResult.headers,
    status: fetchResult.status,
    statusText: fetchResult.statusText,
  });

  return fetchResult;
}

export const POST = handle;
export const GET = handle;

export const PUT = handle;
export const DELETE = handle;

export const OPTIONS = handle;

export const runtime = "edge";
