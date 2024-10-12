import { Job } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { FC, useState } from "react";
import { useDebounce } from "~/hooks";
import { loader as jobsLoader } from "~/routes/resources.jobs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Command, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Button } from "./ui/button";

type VacantJobsProps = {
  jobs?: Job[];
};
export const VacantJobs: FC<VacantJobsProps> = ({ jobs }) => {
  const [job, setJob] = useState<Job | null>(null);
  const [filter, setFilter] = useState("");
  const { data, load } = useFetcher<typeof jobsLoader>();

  const onChange = useDebounce(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilter(e.target.value);

      load("/resources/jobs" + (e.target.value ? `?q=${e.target.value}` : ""));
    },
  );

  return (
    <Dialog>
      <Command
        className="mt-4 group bg-muted shadow-black/10 shadow-md"
        value={filter}
        onChange={onChange}
        shouldFilter={false}
      >
        <CommandInput placeholder="Search for a job" />
        <CommandList className="max-h-0 group-focus-within:max-h-36 transition-all duration-500 ease-in-out">
          {data
            ? data.map((d) => (
                <CommandItem key={d.id}>
                  <DialogTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className="w-full rounded-none"
                      onClick={() => setJob(d)}
                    >
                      {d.title}
                    </Button>
                  </DialogTrigger>
                </CommandItem>
              ))
            : jobs &&
              jobs.length > 0 &&
              jobs.map((d) => (
                <CommandItem key={d.id}>
                  <DialogTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className="w-full rounded-none"
                      onClick={() => setJob(d)}
                    >
                      {d.title}
                    </Button>
                  </DialogTrigger>
                </CommandItem>
              ))}
        </CommandList>
      </Command>
      {job && (
        <DialogContent className="rounded-lg md:max-w-2xl md:max-h-2xl">
          <DialogHeader>
            <DialogTitle asChild>
              <h1>
                <DialogDescription>{job.title}</DialogDescription>
              </h1>
            </DialogTitle>
          </DialogHeader>
          <div
            className="max-h-52 overflow-y-auto bg-accent shadow-md shadow-black/20 rounded-lg py-2 px-4 innerHTML md:max-h-none"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        </DialogContent>
      )}
    </Dialog>
  );
};
