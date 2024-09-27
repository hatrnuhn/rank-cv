import { LoaderFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react"
import { authenticator } from "./.server/auth";

export async function loader({ request }: LoaderFunctionArgs) {
    // If the user is already authenticated redirect to /dashboard directly
    return await authenticator.isAuthenticated(request, {
      successRedirect: "/"
    });
};

const Login = () => {
    return (
        <Form method="post" action="/auth/google">
            <button>login w/ google</button>
        </Form>
    )
}

export default Login