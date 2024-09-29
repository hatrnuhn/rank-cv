import { Job } from "~/types";
import { prisma } from "./prisma";

export type GetJobs = () => Promise<Job[]>

export const getJobs: GetJobs = async () => {
    const jobs = await prisma.job.findMany()
    return jobs
}