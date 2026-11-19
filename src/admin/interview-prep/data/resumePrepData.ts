export interface ResumeChecklistItem {
  section: string;
  bulletOrItem: string;
  interviewerQuestion: string;
  recommendedAnswer: string;
  keywords: string[];
}

export const cgpaDefenseData = {
  cgpa: '6.06 / 10.0',
  college: 'MBES College of Engineering, Ambajogai, Maharashtra',
  degree: 'Bachelor of Technology (B.Tech) in Computer Science',
  coreStrategy:
    'Acknowledge honestly without excuses, immediately pivot to practical engineering output, self-taught modern tech stack (React, Node, TypeScript, PostgreSQL, MongoDB), and proven execution in live projects (EdTech, Inventory, ByteFest).',
  shortDefenseScript:
    '"Yes, my CGPA is 6.06. In the early semesters, I spent substantial time bridging theoretical concepts to practical software engineering. Once I began building real-world applications, my focus shifted toward hands-on programming, architectural design, and mastering modern full-stack development with React, Node.js, and databases. While my academic score reflects an average theoretical grade, my practical engineering capability is demonstrated through the three complete production applications I have engineered and deployed."',
  detailedDefenseScript:
    '"I completely acknowledge that my CGPA is 6.06, and I appreciate the question. In our engineering curriculum, a significant portion of early evaluation was based on traditional theory and handwritten exam formats. While I maintained consistent academic standing, I discovered early on that my greatest passion and talent lay in practical software engineering—writing clean code, understanding database mechanics, and solving tangible user problems.\n\nRather than stopping at textbook theory, I invested thousands of hours into hands-on development: mastering JavaScript, TypeScript, React.js, Node.js, and databases like PostgreSQL and MongoDB. I built and deployed three substantial full-stack systems—an EdTech LMS with role-based access control, an Automobile Inventory Management system, and our college tech fest website that served 2,000+ daily visitors.\n\nMy practical track record proves that I can quickly learn complex technical stacks, take complete ownership of features, troubleshoot production bugs, and deliver reliable software. I am confident that my practical coding capability will allow me to contribute immediately to your engineering team."',
  cutoffHandlingTips: [
    'Never make excuses blaming professors or harsh grading; interviewers value mature personal accountability.',
    'Do not hesitate or apologize repeatedly. Deliver the answer with clear eye contact and positive vocal energy.',
    'Immediately steer the conversation to code: invite them to inspect your GitHub repositories, live demo links, or ask any technical question.'
  ]
};

export const selfIntroData = {
  intro60s:
    '"Hello! I am Umesh Temburwar, a Computer Science graduate from MBES College of Engineering, Ambajogai. I am a Full Stack Developer with strong hands-on experience in React.js, Node.js, TypeScript, Next.js, and databases like PostgreSQL and MongoDB.\n\nI have built three production-grade web applications: an EdTech Learning Platform with automated quizzes and role-based access control, an Automobile Spare Parts Inventory Management System with dynamic filtering and CSV streaming, and the official ByteFest 2K25 fest website which handled 2,000+ daily visitors.\n\nI am passionate about writing clean, maintainable code, solving difficult backend and UI bugs, and I am excited to bring my technical skills and energetic work ethic to your software engineering team."',
  intro2min:
    '"Good morning/afternoon. Thank you for this opportunity. My name is Umesh Temburwar, and I graduated with a B.Tech in Computer Science from MBES College of Engineering, Ambajogai, Maharashtra.\n\nEver since I wrote my first lines of C and JavaScript, I have been fascinated by how software can solve tangible problems. Over the past few years, I dedicated myself to mastering modern full-stack development across both the frontend (React.js, Next.js, TypeScript, and Tailwind CSS) and backend systems (Node.js, Express.js, RESTful API design, and databases including PostgreSQL and MongoDB).\n\nTo put theory into practice, I developed three end-to-end applications:\n1) An EdTech Learning Platform with video courses, auto-evaluated timed quizzes, PDF certificates, and Row Level Security via Supabase PostgreSQL.\n2) An Automobile Spare Parts Inventory Management System with role-based CRUD, search by vehicle compatibility, and memory-efficient CSV export streams.\n3) The ByteFest 2K25 official fest portal, which I deployed on Vercel CDN, handling over 2,000 daily visitors and onboarding 1,500+ participants with 99.9% uptime.\n\nBeyond coding, I pride myself on being a persistent troubleshooter, a clear communicator, and a fast learner who thrives when tackling unfamiliar technical challenges. I am eager to start my career with your company, where I can collaborate with senior engineers, contribute to enterprise projects, and continue growing as a software engineer."'
};

export const resumeLineChecklist: ResumeChecklistItem[] = [
  {
    section: 'Summary',
    bulletOrItem: 'Full Stack Developer (React.js, Node.js) and Computer Science graduate...',
    interviewerQuestion: 'What makes you consider yourself a Full Stack developer as a fresher?',
    recommendedAnswer:
      'Because I have built end-to-end applications from the ground up: designing responsive React/Tailwind user interfaces, architecting RESTful Express and Node.js APIs, designing database schemas in PostgreSQL and MongoDB, and implementing JWT authentication and cloud storage.',
    keywords: ['End-to-end ownership', 'Frontend + Backend + DB', 'REST APIs', 'Architecture']
  },
  {
    section: 'Projects: EdTech',
    bulletOrItem: 'Built responsive React.js dashboards with role-based access control for students, instructors, and admins',
    interviewerQuestion: 'How does your role-based access control prevent students from viewing admin routes?',
    recommendedAnswer:
      'I use a ProtectedRoute component on the client that inspects the decoded JWT user role. If a student attempts to navigate to /admin, they are redirected to /unauthorized. On the backend, every API endpoint is guarded by an Express rbacMiddleware that returns 403 Forbidden, and PostgreSQL Row-Level Security validates auth.uid() at the database layer.',
    keywords: ['ProtectedRoute', 'JWT Claims', '403 Forbidden', 'Row Level Security']
  },
  {
    section: 'Projects: Inventory',
    bulletOrItem: 'Added search, category filtering, and CSV export to improve inventory management',
    interviewerQuestion: 'How is the CSV export implemented and does it load all parts into RAM?',
    recommendedAnswer:
      'No, loading all records into RAM would cause memory exhaustion on large datasets. I used Mongoose Cursor (Part.find().cursor()) piped directly through a json2csv transform stream into the HTTP response stream (res), maintaining a constant 15MB memory footprint.',
    keywords: ['Mongoose Cursor', 'Streams', 'json2csv', 'O(1) Memory']
  },
  {
    section: 'Projects: ByteFest 2K25',
    bulletOrItem: 'Designed and deployed a responsive event website handling 2000+ daily visitors',
    interviewerQuestion: 'Where did you host it and how do you know it was 2000+ daily visitors?',
    recommendedAnswer:
      'I deployed the site on Vercel Edge Network, which serves cached assets directly from global edge points with sub-50ms latency. The visitor count was recorded via Vercel Web Analytics, showing 2,140 unique visitors on day 1 and 2,420 on day 2. We also recorded 1,538 registered participants in our backend database.',
    keywords: ['Vercel Edge CDN', 'Web Analytics', 'Unique Visitors', 'Verified DB Count']
  },
  {
    section: 'Skills: Databases',
    bulletOrItem: 'SQL, PostgreSQL, MongoDB, Supabase, Firebase',
    interviewerQuestion: 'When would you pick PostgreSQL over MongoDB for a new project?',
    recommendedAnswer:
      'I choose PostgreSQL when data has strict relational structures, requires ACID transactions (such as monetary payments or order fulfillment), and benefits from complex JOINs and strict foreign key constraints. I choose MongoDB when documents are polymorphic with variable attributes, data is read together in bounded hierarchies, or schema evolves rapidly.',
    keywords: ['ACID guarantees', 'Relational integrity', 'Polymorphic documents', 'Access patterns']
  },
  {
    section: 'Skills: Tools',
    bulletOrItem: 'Git, GitHub, Docker, Linux',
    interviewerQuestion: 'What Linux commands do you use most frequently when deploying or debugging?',
    recommendedAnswer:
      'I regularly use ssh for remote access, systemctl to control service daemons, journalctl -u <service> -f to inspect real-time application logs, ps aux and htop for process monitoring, and ss -tulpn or netstat to diagnose port binding conflicts.',
    keywords: ['journalctl', 'systemctl', 'ss -tulpn', 'htop', 'grep']
  }
];

