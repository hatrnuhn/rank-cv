import { Admin, Job } from "@prisma/client";
import { prisma } from "~/routes/.server/prisma";
import bcrypt from 'bcryptjs'

const generateAdmins = async (n: number) => {
    const admins: Omit<Admin, 'id'>[] = [];

    for (let i = 0; i < n; i++) {
        const adminString = `admin${i + 1}`
        const password = await bcrypt.hash(adminString, 10)
        admins.push({
            username: adminString,
            password: password
        })
    }

    return admins;
}

const jobs: Omit<Job, 'id'>[] = [
    {
        title: 'AI Researcher',
        description: `<h2>About the job</h2>
        <p>We are a leading shipping and logistic company in Indonesia with the forefront of AI innovation, dedicated to pushing the boundaries of technology. We seek a talented AI Researcher to join our team and contribute to cutting-edge projects.</p>
        <h3>Responsibilities:</h3>
        <ul>
            <li>Conduct data mining to uncover valuable insights and patterns.</li>
            <li>Optimize AI systems for performance and scalability.</li>
            <li>Collaborate with a multidisciplinary team to drive research initiatives.</li>
            <li>Stay updated with the latest advancements in AI and machine learning.</li>
        </ul>
        <h3>Qualifications:</h3>
        <ul>
            <li>Advanced degree in Computer Science, Data Science, or a related field.</li>
            <li>Proven experience in data mining and AI system optimization.</li>
            <li>Strong programming skills in Python, R, or similar languages.</li>
            <li>Excellent problem-solving and analytical abilities.</li>
            <li>Willing to be placed in Surabaya.</li>
        </ul>`
    },
    {
        title: 'Data Scientist',
        description: `<h2>About the job</h2>
        <p>We are a leading shipping and logistic company in Indonesia at the forefront of AI innovation, dedicated to pushing the boundaries of technology. We are looking for a talented <strong>Data Scientist</strong> to join our team and leverage big data to drive business solutions.</p>
        <h3>Responsibilities:</h3>
        <ul>
            <li>Analyze complex datasets to extract actionable business insights.</li>
            <li>Build predictive models and machine learning algorithms.</li>
            <li>Work closely with cross-functional teams to implement data-driven strategies.</li>
            <li>Present findings to key stakeholders in a clear and actionable manner.</li>
        </ul>
        <h3>Qualifications:</h3>
        <ul>
            <li>Bachelor’s or Master’s degree in Data Science, Statistics, or a related field.</li>
            <li>Experience in data analysis, predictive modeling, and statistical computing.</li>
            <li>Proficiency in Python, SQL, or related tools.</li>
            <li>Strong communication and presentation skills.</li>
            <li>Willing to be placed in Jakarta.</li>
        </ul>`
    },
    {
        title: 'DevOps Engineer',
        description: `<h2>About the job</h2>
        <p>We are a leading shipping and logistic company in Indonesia, spearheading AI innovation. We are looking for a skilled <strong>DevOps Engineer</strong> to support the development and deployment of AI-driven systems.</p>
        <h3>Responsibilities:</h3>
        <ul>
            <li>Automate and optimize CI/CD pipelines.</li>
            <li>Monitor and manage cloud infrastructure for performance and scalability.</li>
            <li>Collaborate with development and operations teams to streamline workflows.</li>
            <li>Ensure system security and compliance with industry standards.</li>
        </ul>
        <h3>Qualifications:</h3>
        <ul>
            <li>Bachelor’s degree in Computer Engineering, IT, or a related field.</li>
            <li>Strong experience with cloud platforms (AWS, GCP, or Alibaba Cloud).</li>
            <li>Expertise in containerization (Docker, Kubernetes).</li>
            <li>Excellent knowledge of CI/CD tools (Jenkins, GitLab CI).</li>
            <li>Willing to be placed in Medan.</li>
        </ul>`
    },
    {
        title: 'Software Engineer',
        description: `<h2>About the job</h2>
        <p>We are a leading shipping and logistics company in Indonesia, constantly innovating with AI. We are seeking an experienced <strong>Software Engineer</strong> to help us develop advanced AI-based applications.</p>      
        <h3>Responsibilities:</h3>
        <ul>
            <li>Design, develop, and maintain software applications.</li>
            <li>Collaborate with AI researchers and data scientists to integrate machine learning models.</li>
            <li>Write clean, scalable, and efficient code.</li>
            <li>Debug and troubleshoot issues across the software stack.</li>
        </ul> 
        <h3>Qualifications:</h3>
        <ul>
            <li>Bachelor’s or Master’s degree in Computer Science or a related field.</li>
            <li>Proficiency in programming languages such as JavaScript, Python, or Java.</li>
            <li>Experience with software architecture and design patterns.</li>
            <li>Familiarity with AI/ML frameworks is a plus.</li>
            <li>Willing to be placed in Bandung.</li>
        </ul>`
    },
    {
        title: 'Product Manager',
        description: `<h2>About the job</h2>
        <p>We are a leading shipping and logistics company in Indonesia, driving AI innovation in the industry. We are looking for a <strong>Product Manager</strong> to lead AI-powered product development initiatives.</p>       
        <h3>Responsibilities:</h3>
        <ul>
            <li>Define product vision and roadmap for AI-based solutions.</li>
            <li>Coordinate with cross-functional teams (engineering, AI research, business development).</li>
            <li>Gather and prioritize product requirements based on customer feedback and market trends.</li>
            <li>Drive product launches and ensure timely delivery of key milestones.</li>
        </ul>     
        <h3>Qualifications:</h3>
        <ul>
            <li>Bachelor’s degree in Business, Engineering, or related fields.</li>
            <li>Proven experience in product management, especially with AI or tech products.</li>
            <li>Strong leadership and communication skills.</li>
            <li>Ability to work closely with technical teams to align on product strategy.</li>
            <li>Willing to be placed in Bali.</li>
        </ul>`
    }
]

const main = async () => {
    const admins = await generateAdmins(5)
    
    await prisma.admin.createMany({
        data: admins
    })

    await prisma.job.createMany({
        data: jobs
    })
}

main()