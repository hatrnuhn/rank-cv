import { ActionFunction, MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { ThemePicker } from "~/components";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tooltip, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { adminAuthenticator } from "./.server/auth";

export const action: ActionFunction = async ({ request }) => {
    await adminAuthenticator.authenticate('form', request, {
        successRedirect: '/admin'
    })
}

export const meta: MetaFunction = () => {
    return [
        {title: 'Admin Login'},
        {name: 'description', content: 'Admin login page'}
    ]
}

export default function AdminLogin() {
    return (
        <div className="w-[100dvw] h-[100dvh] flex justify-center items-center">
            <Card className="shadow-md bg-muted text-muted-foreground">
                <CardHeader>
                    <div className="flex items-center justify-between p-0">
                        <CardTitle asChild>
                            <h1>
                                Admin Login
                            </h1>
                        </CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button className="p-0" variant={'ghost'} asChild>
                                        <ThemePicker />
                                    </Button>
                                </TooltipTrigger>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </CardHeader>
                <CardContent>
                    <Form 
                        method='post'
                    >
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input id='username' name="username" type="text" placeholder="Username" required className="bg-background"/>
                        </div>
                        <div>
                            <Label htmlFor="username">Password</Label>
                            <Input id='username' name="password" type='password' placeholder="Password" required className="bg-background text-foreground"/>
                        </div>
                        <Button
                            type="submit"
                            className="mt-2"
                        >
                            Submit
                        </Button>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}