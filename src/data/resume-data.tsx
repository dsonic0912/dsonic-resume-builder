import {
  ClevertechLogo,
  ConsultlyLogo,
  JojoMobileLogo,
  MonitoLogo,
  NSNLogo,
  ParabolLogo,
} from "@/images/logos";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons";

export var RESUME_DATA = {
  name: "Ta-Chien (David) Tung",
  initials: "DT",
  location: "Richmond, BC, Canada",
  locationLink: "https://www.google.com/maps/place/Wrocław",
  about:
    "Detail-oriented Full Stack Engineer dedicated to building high-quality products.",
  summary: (
    <>
      Senior Software Developer with 10+ years of experience building scalable
      web applications and data platforms using Python, Django, React, and cloud
      services (GCP, AWS). Skilled in performance optimization, modern frontend
      migrations, data pipelines, and CI/CD. Strong track record of delivering
      high-quality, maintainable solutions in fast-paced, collaborative
      environments.
    </>
  ),
  avatarUrl: "",
  personalWebsiteUrl: "http://www.davidtung.ca",
  contact: {
    email: "example@example.com",
    tel: "+999-999-9999",
    social: [
      {
        name: "GitHub",
        url: "https://github.com/dsonic0912",
        icon: GitHubIcon,
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/ta-chien-david-t-96bb7456/",
        icon: LinkedInIcon,
      },
      // {
      //   name: "X",
      //   url: "https://x.com/BartoszJarocki",
      //   icon: XIcon,
      // },
    ],
  },
  education: [
    {
      school: "Douglas College",
      degree: "Bachelor's Degree in Computer Information Systems",
      start: "2004",
      end: "2002",
    },
  ],
  work: [
    {
      company: "Citylitics",
      link: "https://citylitics.com/",
      badges: [
        "Python",
        "Django",
        "DRF",
        "MySQL",
        "React",
        "Redux",
        "TypeScript",
        "GCP",
        "RabbitMQ",
        "Kubernetes",
        "Terraform",
        "Tailwind",
      ],
      title: "Senior Fuall Stack Developer",
      logo: null,
      start: "Oct 2021",
      end: "Oct 2024",
      description: (
        <>
          Redesigned the platform architecture and data workflows to enhance
          user experience and surface actionable insights on infrastructure
          project leads within a public infrastructure search and reporting
          system.
          <ul className="list-inside list-disc">
            <li>
              Optimized Django queries and DRF serializers, resulting in a 10x
              API performance improvement.
            </li>
            <li>
              Implemented backend pagination and dynamic pre-populated filters,
              reducing data load times from 30 seconds to under 3 seconds.
            </li>
            <li>
              Implementing system-wide monitoring and security improvements
            </li>
            <li>
              Introduced React Query with server-side caching to significantly
              enhance frontend responsiveness and user interaction.
            </li>
            <li>
              Led migration of the entire frontend codebase to TypeScript,
              boosting maintainability and code reliability.
            </li>
            <li>
              Overhauled local development setup, CI/CD pipeline, and
              documentation to streamline onboarding and reduce ramp-up time.
            </li>
            <li>
              Developed a Dataflow pipeline to export data from Elasticsearch to
              BigQuery for performance and coverage analytics.
            </li>
            <li>
              Built Airflow pipelines to analyze scraped data, improving
              downstream data quality and crawler effectiveness.
            </li>
          </ul>
        </>
      ),
    },
    {
      company: "Procurify",
      link: "https://www.procurify.com/",
      badges: [
        "Python",
        "Django",
        "DRF",
        "RESTFul API",
        "MySQL",
        "AWS",
        "React",
        "AngularJS",
        "TypeScript",
        "Stripe Payment Integration",
      ],
      title: "Senior Full Stack Developer",
      logo: null,
      start: "July 2016",
      end: "Aug 2021",
      description: (
        <>
          Designed and developed new features for a business procurement
          management platform to streamline purchasing workflows and enhance
          user efficiency.
          <ul className="list-inside list-disc">
            <li>
              Designed and developed RESTful APIs using Django REST Framework to
              support mobile and web applications.
            </li>
            <li>
              Increased test coverage to 80% by writing unit and integration
              tests using PyTest.
            </li>
            <li>
              Migrated a legacy codebase of 50,000+ lines from Python 2 to
              Python 3.
            </li>
            <li>
              Collaborated with frontend developers to transition the UI from
              AngularJS to React.
            </li>
            <li>
              Designed and implemented an event scheduler service in Go,
              integrated within the core platform.
            </li>
            <li>
              Led the integration of Stripe Connect for managing spend via
              company-issued credit cards.
            </li>
          </ul>
        </>
      ),
    },
    {
      company: "LBSTek",
      link: null,
      badges: [
        "Python",
        "Django",
        "DRF",
        "MySQL",
        "PostgreSQL",
        "React",
        "AngularJS",
        "Swift",
        "Kotlin",
      ],
      title: "Full Stack Developer",
      logo: ClevertechLogo,
      start: "June 2014",
      end: "June 2016",
      description: (
        <>
          Built a location-based, online-to-offline dating platform, increasing
          daily active users from 50 to 500.
          <ul className="list-inside list-disc">
            <li>
              Refactored legacy Django views to Django REST Framework, improving
              scalability and maintainability.
            </li>
            <li>
              Developed a location-based travel app using Swift (iOS) and Kotlin
              (Android) within 3 months.
            </li>
            <li>
              Replaced polling-based chat functionality with a real-time
              Socket.IO solution, enhancing responsiveness.
            </li>
            <li>
              Migrated frontend codebase from jQuery to React, significantly
              improving performance and maintainability.
            </li>
          </ul>
        </>
      ),
    },
    {
      company: "FriendFinder Network",
      link: null,
      badges: ["PHP", "CodeIgniter", "Javascript", "Facebook SDK", "Perl"],
      title: "Web Developer",
      logo: JojoMobileLogo,
      start: "Oct 2012",
      end: "June 2014",
      description: (
        <>
          Designed and integrated local payment systems for high-traffic online
          dating platforms serving millions of active users.
        </>
      ),
    },
  ],
  skills: [
    "React/Next.js/Remix",
    "TypeScript",
    "Tailwind CSS",
    "Design Systems",
    "WebRTC",
    "WebSockets",
    "Node.js",
    "GraphQL",
    "Relay",
    "System Architecture",
    "Remote Team Leadership",
  ],
  projects: [
    {
      title: "dSonic Resume Builder",
      techStack: ["Next.js", "Tailwind CSS", "PostgreSQL"],
      description:
        "A Next.js powered web application that provides users a intuitive interface for building their resume.",
      logo: MonitoLogo,
      link: {
        label: "dSonic Resume Builder",
        href: "http://dsonic-resume-builder.davidtung.ca/",
      },
    },
  ],
};
