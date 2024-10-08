import { Moon, Sun } from "lucide-react"
import { Theme, useTheme } from "remix-themes"

import { Button, ButtonProps } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import React from "react"
import { cn } from "~/lib/utils"
import { Command, CommandInput, CommandList } from "./ui/command"
import { CommandItem } from "cmdk"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Job, Profile } from "@prisma/client"
import { Form, useFetcher } from "@remix-run/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { loader as jobsLoader } from '~/routes/resources.jobs'
import { useDebounce } from "~/hooks"
import { Input } from "./ui/input"

export function ThemePicker() {
  const [theme, setTheme, metadata] = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="shadow-black/20">
        <DropdownMenuItem onClick={() => setTheme(Theme.LIGHT)} className={`${theme === Theme.LIGHT && metadata.definedBy !== 'SYSTEM' ? 'bg-muted text-muted-foreground' : ''}`}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(Theme.DARK)} className={`${theme === Theme.DARK && metadata.definedBy !== 'SYSTEM' ? 'bg-muted text-muted-foreground' : ''}`}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(null)} className={`${metadata.definedBy === 'SYSTEM' ? 'bg-muted text-muted-foreground' : ''}`}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const GoogleLoginButton = React.forwardRef<HTMLButtonElement, ButtonProps & { withText?: boolean }>(
  ({ className, variant, size, withText, ...props }, ref) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <GoogleLoginForm 
              className={className}
              ref={ref}
              {...props}
              variant={variant}
              size={size}
              withText={withText}
            />
          </TooltipTrigger>
          <TooltipContent>
            Login to start uploading
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
)
GoogleLoginButton.displayName = 'GoogleLoginButton'

const GoogleLoginForm = React.forwardRef<HTMLButtonElement, ButtonProps & { withText?: boolean }>(
  ({ className, variant, size, withText, ...props }, ref) => {
    const [theme] = useTheme()
    
    return (
      <Form className="inline" action="/auth/google" method="post">
        <Button 
          className={cn('font-bold shadow shadow-black/10 dark:shadow-none', className)}
          ref={ref}
          {...props}
          variant={variant ? variant : theme === Theme.LIGHT ? 'outline' : 'ghost'}
          size={withText ? size : 'icon'}
          aria-label="Login with Google"
          type="submit"
        >
            {withText && 'Login with Google'}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`${withText ? 'ms-1' : 'p-1'} h-full`}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
        </Button>
      </Form>
    )
  }
)
GoogleLoginForm.displayName = 'GoogleLoginForm'

export const PageIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement> & { className: string }>(({ className, ...props }, ref) => {
  return (
    <svg ref={ref} {...props} className={cn('h-8 w-8', className)} viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path d="m32.415 9.586-9-9c-.361-.361-.862-.586-1.415-.586-1.104 0-1.999.896-2 2 0 .552.224 1.053.586 1.415l-3.859 3.859 9 9 3.859-3.859c.362.361.862.585 1.414.585 1.104 0 2.001-.896 2-2 0-.552-.224-1.052-.585-1.414z" fill="#e1e8ed"/><path d="m22 0h-15c-2.209 0-4 1.791-4 4v28c0 2.209 1.791 4 4 4h22c2.209 0 4-1.791 4-4v-21h-9c-1 0-2-1-2-2z" fill="#ccd6dd"/><path d="m22 0h-2v9c0 2.209 1.791 4 4 4h9v-2h-9c-1 0-2-1-2-2zm-5 8c0 .552-.448 1-1 1h-8c-.552 0-1-.448-1-1s.448-1 1-1h8c.552 0 1 .448 1 1zm0 4c0 .552-.448 1-1 1h-8c-.552 0-1-.448-1-1s.448-1 1-1h8c.552 0 1 .448 1 1zm12 4c0 .552-.447 1-1 1h-20c-.552 0-1-.448-1-1s.448-1 1-1h20c.553 0 1 .448 1 1zm0 4c0 .553-.447 1-1 1h-20c-.552 0-1-.447-1-1s.448-1 1-1h20c.553 0 1 .447 1 1zm0 4c0 .553-.447 1-1 1h-20c-.552 0-1-.447-1-1s.448-1 1-1h20c.553 0 1 .447 1 1zm0 4c0 .553-.447 1-1 1h-20c-.552 0-1-.447-1-1s.448-1 1-1h20c.553 0 1 .447 1 1z" fill="#99aab5"/></svg>
  )
})
PageIcon.displayName = 'PageIcon'

type VacantJobsProps = {
  jobs: Job[]
}
export const VacantJobs: React.FC<VacantJobsProps> = ({ jobs }) => {
  const [job, setJob] = React.useState<Job | null>(null)
  const [filter, setFilter] = React.useState('')
  const { data, load } = useFetcher<typeof jobsLoader>()

  const onChange = useDebounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value)

    load('/resources/jobs' + (e.target.value ? `?q=${e.target.value}` : ''))
  })

  return (
    <Dialog>
      <Command 
        className="mt-4 group bg-muted shadow-black/10 shadow-md"
        value={filter}
        onChange={onChange}
        shouldFilter={false}
      > 
        <CommandInput 
          placeholder="Search for a job"
        />
        <CommandList className="max-h-0 group-focus-within:max-h-36 transition-all duration-500 ease-in-out">
          {
            data ? 
              data.map(
                d => 
                <CommandItem key={d.id}>
                  <DialogTrigger asChild>
                    <Button 
                      variant={'ghost'} 
                      className="w-full rounded-none" 
                      onClick={() => setJob(d)}
                    >
                      {d.title}
                    </Button>
                  </DialogTrigger>
                </CommandItem>
              ) : jobs.length > 0 && 
              jobs.map(
                d => 
                <CommandItem key={d.id}>
                  <DialogTrigger asChild>
                    <Button 
                      variant={'ghost'} 
                      className="w-full rounded-none" 
                      onClick={() => setJob(d)}
                    >
                      {d.title}
                    </Button>
                  </DialogTrigger>
                </CommandItem>
              )
          }
        </CommandList>
      </Command>
      {
        job &&
        <DialogContent className='rounded-lg md:max-w-2xl md:max-h-2xl'>
          <DialogHeader>
            <DialogTitle asChild>
              <h1>
                {job.title}
              </h1>
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-52 overflow-y-auto bg-accent shadow-md shadow-black/20 rounded-lg py-2 px-4 job-modal-html md:max-h-none" dangerouslySetInnerHTML={{ __html: job.description }} />
        </DialogContent>
      }
    </Dialog>
  )
}

export const UserAvatar: React.FC<Pick<Profile, 'image' | 'name'>> = ({ image, name }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Avatar className="h-8 w-8">
          <AvatarFallback>{name.toUpperCase().split(' ')[0].slice(0, 2)}</AvatarFallback>
          <AvatarImage src={image!}/>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="max-w-24 p-0 bg-muted">
        <LogoutButton />
      </PopoverContent>
    </Popover>
  )
}

export const LogoutButton = () => {
 return (
    <Form 
      action="/auth/logout" 
      method="post"
    >
      <Button 
        variant={'ghost'} 
        className="w-full"
        type='submit'
      >
        Logout
      </Button>
    </Form>
  ) 
}

export const UploadInput = () => {
  return (
    <>
      <Input
        type="file" name="file" 
        className="border-none"
      />
      <Button 
        type="submit" 
        className="rounded-l-none"
        variant={'ghost'}
      >
        Upload
      </Button>
    </>
  )
}