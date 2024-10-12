import { Job, Profile } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from "react";
import { loader as jobsLoader } from "~/routes/resources.jobs";
import { loader as profilesLoader } from "~/routes/admin.resources.profiles";
import { useDebounce } from "~/hooks";
import { Command, CommandInput, CommandItem, CommandList } from "./ui/command";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { isJob } from "~/lib/types";

type AdminTabProps = {
  data: (Job | Profile)[];
  setJob?: Dispatch<SetStateAction<Job | null>>;
  setProfile?: Dispatch<SetStateAction<Profile | null>>;
};
export const AdminTab: FC<AdminTabProps> = ({ data, setJob, setProfile }) => {
  const [filter, setFilter] = useState("");
  const fetcher = useFetcher<typeof jobsLoader | typeof profilesLoader>();

  const onChange = useDebounce(async (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);

    const q = `?q=${e.target.value}`;

    fetcher.load(
      (setProfile ? "/admin/resources/profiles" : "/resources/jobs") +
        (e.target.value ? q : ""),
    );
  });

  return (
    <Command
      className="mt-4 group bg-muted shadow-black/10 shadow-md"
      value={filter}
      onChange={onChange}
      shouldFilter={false}
    >
      <CommandInput placeholder="Search for a job" />
      <ScrollArea>
        <CommandList className="max-h-0 group-focus-within:max-h-36 lg:group-focus-within:max-h-48 transition-all duration-500 ease-in-out overflow-visible">
          {fetcher.data
            ? fetcher.data.map((d: Job | Profile) => (
                <CommandItem key={d.id}>
                  <Button
                    variant={"ghost"}
                    className="w-full rounded-none"
                    onClick={() => {
                      if (setJob && isJob(d)) setJob(d);
                      else if (setProfile && !isJob(d)) setProfile(d);
                    }}
                  >
                    {isJob(d) ? d.title : d.name}
                  </Button>
                </CommandItem>
              ))
            : data &&
              data.length > 0 &&
              data.map((d) => (
                <CommandItem key={d.id}>
                  <Button
                    variant={"ghost"}
                    className="w-full rounded-none"
                    onClick={() => {
                      if (setJob && isJob(d)) setJob(d);
                      else if (setProfile && !isJob(d)) setProfile(d);
                    }}
                  >
                    {isJob(d) ? d.title : d.name}
                  </Button>
                </CommandItem>
              ))}
        </CommandList>
      </ScrollArea>
    </Command>
  );
};

type AdminTableProps = {
  colNames: string[];
  data: Profile[];
  pushFn: (val: Profile) => void;
};

export const AdminTable: FC<AdminTableProps> = ({ colNames, data }) => {
  return (
    <ScrollArea className="h-full">
      <Table className="w-full">
        <TableHeader className="sticky top-0 bg-muted">
          <TableRow>
            {colNames.map((cn, i) => (
              <TableHead key={cn + i}>{cn}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data
            .map((r, i) => ({
              rank: i + 1,
              name: r.name,
              email: r.email,
            }))
            .map((r) => (
              <TableRow key={r.rank}>
                {Object.entries(r).map(([key, value]) => (
                  <TableCell key={key}>{value}</TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};
