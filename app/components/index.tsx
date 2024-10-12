import { Button } from "./ui/button";
import { ComponentPropsWithRef, FC, SVGProps, forwardRef } from "react";
import { cn } from "~/lib/utils";
import { Profile } from "@prisma/client";
import { Form } from "@remix-run/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export const PageIcon = forwardRef<
  SVGSVGElement,
  SVGProps<SVGSVGElement> & { className: string }
>(({ className, ...props }, ref) => {
  return (
    <svg
      ref={ref}
      {...props}
      className={cn("h-8 w-8", className)}
      viewBox="0 0 36 36"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m32.415 9.586-9-9c-.361-.361-.862-.586-1.415-.586-1.104 0-1.999.896-2 2 0 .552.224 1.053.586 1.415l-3.859 3.859 9 9 3.859-3.859c.362.361.862.585 1.414.585 1.104 0 2.001-.896 2-2 0-.552-.224-1.052-.585-1.414z"
        fill="#e1e8ed"
      />
      <path
        d="m22 0h-15c-2.209 0-4 1.791-4 4v28c0 2.209 1.791 4 4 4h22c2.209 0 4-1.791 4-4v-21h-9c-1 0-2-1-2-2z"
        fill="#ccd6dd"
      />
      <path
        d="m22 0h-2v9c0 2.209 1.791 4 4 4h9v-2h-9c-1 0-2-1-2-2zm-5 8c0 .552-.448 1-1 1h-8c-.552 0-1-.448-1-1s.448-1 1-1h8c.552 0 1 .448 1 1zm0 4c0 .552-.448 1-1 1h-8c-.552 0-1-.448-1-1s.448-1 1-1h8c.552 0 1 .448 1 1zm12 4c0 .552-.447 1-1 1h-20c-.552 0-1-.448-1-1s.448-1 1-1h20c.553 0 1 .448 1 1zm0 4c0 .553-.447 1-1 1h-20c-.552 0-1-.447-1-1s.448-1 1-1h20c.553 0 1 .447 1 1zm0 4c0 .553-.447 1-1 1h-20c-.552 0-1-.447-1-1s.448-1 1-1h20c.553 0 1 .447 1 1zm0 4c0 .553-.447 1-1 1h-20c-.552 0-1-.447-1-1s.448-1 1-1h20c.553 0 1 .447 1 1z"
        fill="#99aab5"
      />
    </svg>
  );
});
PageIcon.displayName = "PageIcon";

export const UserAvatar: FC<Pick<Profile, "image" | "name">> = ({
  image,
  name,
}) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {name.toUpperCase().split(" ")[0].slice(0, 2)}
          </AvatarFallback>
          <AvatarImage src={image!} />
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="max-w-24 p-0 bg-muted">
        <LogoutButton />
      </PopoverContent>
    </Popover>
  );
};

export const LogoutButton = () => {
  return (
    <Form action="/auth/logout" method="post">
      <Button variant={"ghost"} className="w-full" type="submit">
        Logout
      </Button>
    </Form>
  );
};

export const Spinner = forwardRef<HTMLDivElement, ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("w-2 h-2", className, "loader relative")}
        {...props}
      >
        {Array(5)
          .fill("")
          .map((_, i) => (
            <div key={i} />
          ))}
      </div>
    );
  },
);
Spinner.displayName = "Spinner";
