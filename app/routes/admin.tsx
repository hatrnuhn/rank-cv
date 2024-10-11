import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, Outlet, json, useLoaderData, useNavigation } from "@remix-run/react";
import { LayoutDashboardIcon, LogOutIcon } from "lucide-react";
import { PageIcon, ThemePicker } from "~/components";
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { adminAuthenticator } from "./.server/auth";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await adminAuthenticator.isAuthenticated(request, {
        failureRedirect: '/admin/login'
    })

    const url = new URL(request.url)

    return json({
        pathname: url.pathname.split('/').at(-1)
    }, { status: 200 })
}

export default function Admin() {
    const { pathname } = useLoaderData<typeof loader>()

    return (
        <div className="flex h-[100dvh] items-stretch">
            <header className="px-2 py-4 flex flex-col justify-between bg-muted shadow-md shadow-black/15">
                <TooltipProvider>
                    <div>
                        <h1>
                            <PageIcon 
                                style={{transform: 'rotate(-5deg)'}} 
                                className="drop-shadow"
                                aria-label="Admin Panel"
                            />
                        </h1>

                        <nav className="mt-6">
                            <ul className="flex flex-col gap-2">
                                <li>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                asChild
                                                variant={'ghost'}
                                                className={`p-1.5 ${pathname === 'admin' ? 'bg-accent shadow shadow-black/15' : ''}`}
                                            >
                                                <Link to={'/admin'}>
                                                    <LayoutDashboardIcon />
                                                </Link>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                {'Dashboard'}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ThemePicker />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    {'Change Theme'}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <Form
                                action="/admin/logout"
                                method="post"
                            >
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant={'ghost'}
                                        className="p-1.5 -scale-100"
                                        type="submit"
                                    >
                                        <LogOutIcon />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        {'Logout'}
                                    </p>
                                </TooltipContent>
                            </Form>
                        </Tooltip>
                    </div>
                </TooltipProvider>
            </header>
            <div className="grow flex flex-col">
                <main className="grow overflow-hidden">
                    <Outlet />
                </main>
                <footer>
                    footer
                </footer>
            </div>
        </div>
    )
}