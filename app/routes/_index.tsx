import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { PageIcon, UserAvatar } from "~/components";
import { getJobs, updateProfile } from "./.server/models";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { userAuthenticator } from "./.server/auth";
import axios, { isAxiosError } from "axios";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { ThemePicker } from "../components/ThemePicker";
import { GoogleLoginButton } from "~/components/GoogleLoginButton";
import { VacantJobs } from "~/components/VacantJobs";
import { UploadAlert, UploadInput } from "~/components/Upload";
import { isNoFileError, isWrongFileError } from "~/lib/types";

export const links = () => {
  return [
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "true",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap",
    },
  ];
};

export const meta: MetaFunction = () => {
  return [
    { title: "Job Portal" },
    { name: "description", content: "AI-powered job portal" },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await userAuthenticator.isAuthenticated(request);

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const formData = await request.formData();

  try {
    const response = await axios.post<string>(
      process.env.FLASK_API_URL + "/cvs",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${process.env.FLASK_API_TOKEN}`,
        },
      },
    );

    await updateProfile({
      ...user,
      resume: response.data,
    });

    return json("ok", { status: 201 });
  } catch (err) {
    if (isAxiosError<string>(err)) {
      const data = err.response?.data;
      if (isWrongFileError(data)) return json(data, { status: 401 });
      else if (isNoFileError(data)) return json(data, { status: 401 });
      else if (err.response?.status === 404) return json(503, { status: 503 });
      else return json(500, { status: 500 });
    }

    throw err;
  }
};

export async function loader({ request }: LoaderFunctionArgs) {
  const jobs = await getJobs();
  const user = await userAuthenticator.isAuthenticated(request);

  return json({ jobs, user }, { status: 200 });
}

export default function Index() {
  const { jobs, user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { state } = useNavigation();

  return (
    <div className="flex flex-col items-stretch h-[100dvh]">
      <header className="px-8 py-2 flex items-center justify-between gap-1 shadow-md">
        <h1 className="grow font-bold flex gap-2 items-center">
          <PageIcon
            style={{ transform: "rotate(-5deg)" }}
            className="drop-shadow text-foreground"
          />
          Job Portal
        </h1>
        {user ? (
          <UserAvatar name={user.name} image={user.image} />
        ) : (
          <GoogleLoginButton withText />
        )}
        <ThemePicker />
      </header>
      <main className="overflow-hidden grow p-8 md:flex md:items-center md:justify-between gap-[10%] xl:justify-normal">
        <div className="md:max-w-2xl">
          <h2 className="text-4xl font-light font-ubuntu mb-4">
            Thank you for taking an interest at our company.
          </h2>
          <div className="max-w-[90%]">
            <p className="inline font-bold">
              {`Simply upload your résumé as a PDF file, we'll take it from there. `}
            </p>
            {!user && <GoogleLoginButton className="align-middle" />}
          </div>
          {user && (
            <Form
              encType="multipart/form-data"
              className={
                "flex bg-muted shadow-md shadow-black/10 rounded-lg mt-4"
              }
              method="post"
            >
              <UploadInput isSubmitting={state === "submitting"} />
            </Form>
          )}
          {user && actionData && state === "idle" && (
            <UploadAlert actionData={actionData} />
          )}
        </div>
        <section className="md:grow md:max-w-2xl xl:max-w-3xl">
          <VacantJobs jobs={jobs} />
        </section>
      </main>
      <footer className="flex justify-center py-2">
        <Link to={"https://github.com/hatrnuhn/rank-cv"}>
          <GitHubLogoIcon />
        </Link>
      </footer>
    </div>
  );
}
