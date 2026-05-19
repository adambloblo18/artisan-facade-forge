import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/googleb6633cba44aa57ec.html")({
  server: {
    handlers: {
      GET: async () => {
        return new Response("google-site-verification: googleb6633cba44aa57ec.html\n", {
          status: 200,
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      },
    },
  },
});
