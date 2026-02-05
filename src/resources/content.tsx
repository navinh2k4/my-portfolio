import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Vinh",
  lastName: "Nguyen An",
  name: "Nguyen An Vinh",
  role: "Infrastructure & DevOps Intern",
  avatar: "/images/avatar.jpg",
  email: "navinh2k4@gmail.com",
  location: "Asia/Ho_Chi_Minh",
  languages: ["English", "Vietnamese"],
};

const newsletter: Newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>My weekly newsletter about creativity and engineering</>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  // Set essentials: true for links you want to show on the about page
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/navinh2k4",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/vinh-nguyen-an-196aa7358/",
    essential: true,
  },
  {
    name: "Facebook",
    icon: "facebook",
    link: "https://www.facebook.com/nh.vi.14661/?viewas=100000686899395",
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Building bridges between design and code</>,
  featured: {
    display: false,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Once UI</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work/building-once-ui-a-customizable-design-system",
  },
  subline: (
    <>
      I'm Vinh, an Infrastructure & DevOps Intern at <Text as="span" size="xl" weight="strong">Tel4vn</Text>. <br />
      I optimize systems using Open Source solutions.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Senior Information Security student with a solid technical foundation in Network Infrastructure and DevOps.
        I am a problem-solver who values efficiency and cost-optimization through Open Source solutions.
        Possesses hands-on experience in deploying, monitoring, and troubleshooting VoIP systems and Cloud infrastructure.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "Tel4vn",
        timeframe: "Present",
        role: "Infrastructure & DevOps Intern",
        achievements: [
          <>
            Deployed and managed FusionPBX 4.4 on Debian 12, configured Nginx Web Server and PostgreSQL 12 Database.
          </>,
          <>
            Configured advanced Dialplans (Time conditions, International blocking); analyzed SIP signaling and troubleshot issues using Wireshark and sngrep.
          </>,
          <>
            Implemented Zabbix for Cloud infrastructure monitoring and Homer 7 for log management. Utilized Jenkins and Ansible for initial deployment automation.
          </>,
        ],
        images: [],
      },
      {
        company: "Side Project",
        timeframe: "Recent",
        role: "Family Invoice Management App",
        achievements: [
          <>
            Developed a web-based invoicing solution for a family business using Next.js and Supabase.
          </>,
          <>
            Optimized PDF generation and export workflows using html2canvas and jsPDF.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "Academy of Cryptography Techniques (KMA)",
        description: <>Information Security - 4th Year Student</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "VoIP/Telecom",
        description: (
          <>FreeSWITCH, FusionPBX, SIP Protocol Analysis (sngrep, Wireshark)</>
        ),
        tags: [
        ],
        images: [],
      },
      {
        title: "System/OS",
        description: (
          <>Debian 12, Linux Administration, Bash Scripting</>
        ),
        tags: [
        ],
        images: [],
      },
      {
        title: "DevOps/Tools",
        description: (
          <>Zabbix, Ansible, Jenkins, Docker, Git</>
        ),
        tags: [
        ],
        images: [],
      },
      {
        title: "Web/Database",
        description: (
          <>Nginx, PHP 7.2, PostgreSQL, Next.js</>
        ),
        tags: [
          {
            name: "Next.js",
            icon: "nextjs",
          },
          {
            name: "PostgreSQL",
            icon: "postgresql", // Need to verify if this exists, otherwise generic
          }
        ],
        images: [],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
