import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { destroySession, getSession } from "./.server/session";

export const action = async ({ request }: ActionFunctionArgs) => {
    const session = await getSession(request.headers.get('_session'))

    return redirect('/', {
        headers: {
            "Set-Cookie": await destroySession(session)
        }
    })
}