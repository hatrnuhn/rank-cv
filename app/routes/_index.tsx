import { type MetaFunction } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import { Footer, GoogleLoginButton, ProfileSettings } from "./components";
import { OutletContext } from "./.server/types";
import { UploadForm } from "./upload";

export const meta: MetaFunction = () => {
  return [
    { title: "Job Portal" },
    { name: "Job Portal", content: "Welcome to the Job Portal" },
  ];
};

export default function Index() {
  const { user } = useOutletContext<OutletContext>()
  return (
    <>
        <header className="flex justify-between px-10 py-6">
          <h1 className="text-2xl font-bold before:strip flex items-center gap-2">Job Portal</h1>
            {
              user ?
              <ProfileSettings user={user}/> :
              <GoogleLoginButton />
            }
        </header>
        <main className="grow px-10">
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <p className="text-justify">
              Thank you for taking an interest for a position at our company. Simply upload your résumé to start applying.
            </p>
            <div>
              {
                  !user ?
                  <GoogleLoginButton content="Login to upload" /> :
                  <UploadForm />
              }
            </div>
          </div>
        </main>
        <footer>
          <Footer />
        </footer>
    </>
  )
}