import { createMiddleware } from "@solidjs/start/middleware";
import { RequestEvent } from "solid-js/web";
import { getCookie, sendRedirect } from "vinxi/http";

const publicRoutes = ["/login", "/register"];
const publicEndpoints = ["/_server", "/api"];
async function redirectWhenNotAuthenticated(event: RequestEvent) {
  const cookie = getCookie("userData");
  const url = new URL(event.request.url);
  if (
    !publicRoutes.includes(url.pathname) &&
    !publicEndpoints.some((endpoint) => url.pathname.startsWith(endpoint))
  ) {
    if (!cookie) {
      console.warn(
        event.request.method + " " + url.href,
        " | ",
        cookie,
        " => redirect to /login"
      );
      return sendRedirect("/login");
    }
  }
  if (
    import.meta.env.VITE_BASE_URL?.includes("http://localhost:") &&
    url.pathname.startsWith("/api")
  ) {
    const timer = new Promise((resolve) => setTimeout(() => resolve(""), 0));
    await timer;
  }
}
async function logToConsole(event: RequestEvent) {
  const url = new URL(event.request.url);
  const cookie = getCookie("userData");
  console.log(
    event.request.method + " " + url.href,
    " | ",
    cookie,
    " => ",
    event.response.status
  );
}

export default createMiddleware({
  // onRequest: [redirectWhenNotAuthenticated],
  // onBeforeResponse: [logToConsole],
});
