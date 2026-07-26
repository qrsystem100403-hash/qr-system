import { NextResponse } from "next/server";

import {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MINUTES,
} from "../utils";

export class SessionCookieService {
  set(
    response: NextResponse,
    token: string
  ) {
    response.cookies.set(
      SESSION_COOKIE_NAME,
      token,
      {
        httpOnly: true,
        sameSite: "lax",
        secure:
          process.env.NODE_ENV ===
          "production",
        path: "/",
        maxAge:
          SESSION_DURATION_MINUTES *
          60,
      }
    );
  }

  clear(
    response: NextResponse
  ) {
    response.cookies.delete(
      SESSION_COOKIE_NAME
    );
  }
}