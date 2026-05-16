import { NextResponse } from "next/server";

const TOKEN_HEADER = "x-internal-token";

function getTokenFromRequest(request: Request) {
  const headerToken = request.headers.get(TOKEN_HEADER);
  if (headerToken) {
    return headerToken;
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return null;
  }

  return authHeader.replace(/^Bearer\s+/i, "");
}

export function isInternalRequest(request: Request) {
  const configuredToken = process.env.INTERNAL_API_TOKEN;
  if (!configuredToken) {
    return false;
  }

  const requestToken = getTokenFromRequest(request);
  return Boolean(requestToken && requestToken === configuredToken);
}

export function requireInternalRequest(request: Request) {
  if (isInternalRequest(request)) {
    return null;
  }

  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}
