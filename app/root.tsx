import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import type { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import "./tailwind.css";
import { authenticator } from "./routes/.server/auth";
import { DefaultProfileImage, GoogleIcon, GoogleLoginButton, ProfileSettings } from "./routes/components";
import axios from "axios";
import { FLASK_API_URL } from "./routes/.server/constants";
import { prisma } from "./routes/.server/prisma";
import { CVUploadResponse } from "./routes/.server/dtos";
import { OutletContext } from "./routes/.server/types";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request)

  return json(user, { status: 200 })
}

export function Layout({ children }: { children: React.ReactNode }) {
  const user = useLoaderData<typeof loader>()

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col h-[100dvh] w-screen">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const user = useLoaderData<typeof loader>()
  const context: OutletContext = {
    user: user
  }

  return <Outlet context={context}/>;
}
