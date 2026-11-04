export interface ProjectInterviewGuide {
  id: string;
  title: string;
  tagline: string;
  role: string;
  timeline: string;
  techStack: string[];
  elevatorPitch: {
    quick30Sec: string;
    detailed90Sec: string;
  };
  architecture: {
    description: string;
    flow: string[];
    techChoiceReasoning: { tech: string; why: string; alternativeRejected: string }[];
  };
  featuresDeepDive: {
    feature: string;
    implementation: string;
    impact: string;
  }[];
  engineeringChallenges: {
    problem: string;
    solution: string;
    lessonLearned: string;
  }[];
  interviewQA: {
    question: string;
    answer: string;
    starTechnique?: {
      situation: string;
      task: string;
      action: string;
      result: string;
    };
  }[];
}

export const projectsInterviewData: ProjectInterviewGuide[] = [
  {
    id: 'edtech-platform',
    title: 'EdTech Learning Platform',
    tagline: 'Full-stack course management platform with automated quizzes, assignments, and verified certificates',
    role: 'Full Stack Developer (Lead Project Architect)',
    timeline: 'Ongoing / Production Ready',
    techStack: ['React.js', 'Node.js', 'Express.js', 'Supabase PostgreSQL', 'Supabase Auth', 'Supabase Storage', 'Tailwind CSS'],
    elevatorPitch: {
      quick30Sec: 'I built a comprehensive full-stack EdTech platform using React, Node.js, and Supabase PostgreSQL that supports courses, timed quizzes with auto-grading, assignment submissions, verified digital certificates, and granular Role-Based Access Control for students, instructors, and admins.',
      detailed90Sec: 'In online education, fragmented tools create high drop-off rates and administrative overhead. I engineered a unified EdTech learning management system using React.js and Tailwind for responsive dashboards, paired with an Express.js and Supabase backend. The platform features an interactive quiz engine with automatic scoring, secure assignment submission via Supabase Storage, automated certificate issuance with unique cryptographic verification codes, and strict database-level security via PostgreSQL Row Level Security (RLS). This setup allowed instant user authentication, real-time course progress tracking, and zero data leakage across different user tiers.'
    },
    architecture: {
      description: 'Client-Server architecture with React Single Page Application (SPA), Node.js / Express REST API proxy, and Supabase Managed PostgreSQL with Realtime and Storage.',
      flow: [
        'React Frontend -> Client initiates JWT authentication via Supabase Auth (PKCE flow).',
        'Stateful sessions pass bearer JWT in Authorization headers to Express backend and Supabase client.',
        'PostgreSQL evaluates Row Level Security (RLS) policies using `auth.uid()` to restrict student/instructor/admin records.',
        'File uploads (course videos, assignment PDFs, certificate templates) stream directly to Supabase private/public storage buckets with signed URLs.',
        'Completed courses trigger certificate generation with a unique UUID verified through a public `/verify/:certificateId` route.'
      ],
      techChoiceReasoning: [
        {
          tech: 'Supabase PostgreSQL over MongoDB',
          why: 'Education platforms require strict relational integrity (students enroll in courses, courses contain modules, modules contain quizzes). Foreign key constraints, relational joins, and Row Level Security made PostgreSQL significantly more robust and secure than MongoDB.',
          alternativeRejected: 'MongoDB (would have required manual relational consistency checks and application-layer authorization checks on every single route).'
        },
        {
          tech: 'React.js over Vanilla JS',
          why: 'Dynamic interactive quiz interfaces, timer count-downs, and modular dashboard views require high reusability and efficient DOM updates.',
          alternativeRejected: 'Traditional multi-page templates (poor user experience during quizzes and continuous video playback).'
        },
        {
          tech: 'Supabase Storage with Signed URLs over AWS S3 direct',
          why: 'Integrated authentication: permissions inherit directly from the Postgres database policies, eliminating the need for complex AWS IAM roles or separate lambda signer microservices for a student project.',
          alternativeRejected: 'Local file uploads (unscalable and risky in production containers).'
        }
      ]
    },
    featuresDeepDive: [
      {
        feature: 'Automated Quiz Engine with Timed Submissions',
        implementation: 'State-driven multi-question quiz runner with synchronized local timers and server-side submission timestamp validation. Automatically grades multiple-choice questions upon submission and prevents back-button retakes.',
        impact: 'Instant feedback loop for students and zero manual grading burden on instructors.'
      },
      {
        feature: 'Role-Based Access Control (RBAC)',
        implementation: 'Enforced at both the React router layer (protected routes) and Express middleware layer, as well as PostgreSQL RLS policies for `student`, `instructor`, and `admin` roles.',
        impact: 'Guarantees that students cannot modify course materials, instructors only edit their own syllabi, and administrative oversight is fully partitioned.'
      },
      {
        feature: 'Certificate Verification Pipeline',
        implementation: 'Upon achieving 100% course completion and passing the final assessment, the server generates a tamper-evident digital certificate with a unique UUID stored in the database. Anyone can verify authenticity at `/verify/:id`.',
        impact: 'Gives students verifiable credentials to showcase on LinkedIn or resumes.'
      }
    ],
    engineeringChallenges: [
      {
        problem: 'Concurrent Quiz Submissions & Cheating Prevention via Timer Manipulation',
        solution: 'If a student manipulates client-side JavaScript to stop the countdown timer, the submission will be rejected by the backend. When a quiz begins, a server record stores `started_at`. Upon submission, the server computes `submitted_at - started_at`. If the delta exceeds the allowed duration plus a 30-second network latency buffer, the submission is rejected.',
        lessonLearned: 'Never trust client-side state for time-sensitive, grading, or financial logic.'
      },
      {
        problem: 'Secure Access to Private Course Assignment PDFs',
        solution: 'Direct public URLs allow any unauthorized user with the link to download assignments. I transitioned all assignment buckets to private Supabase Storage and implemented short-lived signed URLs (valid for 15 minutes) issued only after verifying the student or instructor enrollment record.',
        lessonLearned: 'Always combine object storage access with dynamic authentication tokens.'
      }
    ],
    interviewQA: [
      {
        question: 'How did you design the database schema for the EdTech platform in PostgreSQL?',
        answer: 'The core schema consists of 6 primary relational tables: `users` (id, email, role, created_at), `courses` (id, title, instructor_id, price, status), `enrollments` (id, user_id, course_id, enrolled_at, progress_pct), `quizzes` (id, course_id, title, pass_threshold), `quiz_submissions` (id, user_id, quiz_id, score, passed, submitted_at), and `certificates` (id, user_id, course_id, issue_date, certificate_code). I indexed composite keys on `(user_id, course_id)` in enrollments for O(1) membership lookups and enforced cascading deletes where appropriate.'
      },
      {
        question: 'What happens if a student loses internet connection mid-quiz?',
        answer: 'I implemented local state persistence in `sessionStorage`. Each selected answer is cached locally on selection. If the student refreshes the browser or briefly disconnects, the quiz state rehydrates automatically. When the timer hits zero or they click submit, the cached answers are transmitted to the server.'
      },
      {
        question: 'Can you walk me through a STAR response on building the Role-Based Access Control in this project?',
        answer: 'Sure, here is the breakdown:',
        starTechnique: {
          situation: 'In the EdTech platform, we had three distinct personas: students consuming content, instructors creating syllabi, and administrators managing payments and user verification. Earlier prototypes suffered from security leaks where client-side parameter tampering could grant students instructor endpoints.',
          task: 'My goal was to implement an enterprise-grade, end-to-end RBAC system that verified permissions at the UI routing layer, the API middleware layer, and the database storage layer.',
          action: 'First, I injected role metadata into the JWT claims during login. Second, I created an Express middleware `authorizeRoles("admin", "instructor")` that intercepted all mutating requests. Third, I configured PostgreSQL Row-Level Security (RLS) policies directly on course and submission tables so that even direct database queries could only view records permitted for `auth.uid()`.',
          result: 'We eliminated all unauthorized API attempts in automated security audits, ensured students could only view enrolled materials, and allowed instructors to manage exclusively their own curricula with zero data collisions.'
        }
      }
    ]
  },
  {
    id: 'inventory-management',
    title: 'Automobile Spare Parts Inventory Management System',
    tagline: 'High-performance inventory tracking system with dynamic stock reordering, category filtering, and memory-efficient CSV export',
    role: 'Backend & Database Engineer',
    timeline: 'Completed / Production Ready',
    techStack: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'React.js', 'Tailwind CSS'],
    elevatorPitch: {
      quick30Sec: 'I developed a full-stack Automobile Spare Parts Inventory Management System using Node.js, Express, and MongoDB. It manages complex auto parts catalogs, tracks real-time stock levels with low-stock alerts, provides compound-indexed search and filtering, and streams memory-efficient CSV exports.',
      detailed90Sec: 'Automobile spare parts businesses manage tens of thousands of unique SKUs across multiple vehicle makes, models, and OEM manufacturers. Inefficient inventory management leads to stockouts, lost sales, and untracked depreciation. I designed an inventory system using Node.js and MongoDB with Mongoose schemas tailored for fast querying. Features include full CRUD management, role-based access for warehouse staff and managers, real-time threshold warnings, compound indexing for instant part-number lookups, and a Node.js streaming pipeline that exports tens of thousands of records to CSV without running out of server RAM.'
    },
    architecture: {
      description: 'RESTful architecture with MongoDB document database utilizing compound indexes and pipeline aggregations for inventory analytics.',
      flow: [
        'React UI provides responsive inventory tables with pagination and debounced search filters.',
        'Express server processes incoming CRUD operations with input validation via Zod schemas.',
        'MongoDB handles document storage across collections: `products`, `categories`, `suppliers`, `stock_transactions`, and `users`.',
        'Real-time stock depletion uses atomic `$inc` updates to prevent race conditions during multiple warehouse checkouts.',
        'CSV Export requests use Node.js `stream` pipeline piping directly into HTTP response to maintain O(1) memory footprint.'
      ],
      techChoiceReasoning: [
        {
          tech: 'MongoDB over SQL for Auto Spare Parts',
          why: 'Automobile parts have wildly varying specifications (e.g. brake pads have pad thickness and rotor diameter, while spark plugs have thread size and heat range). MongoDB document polymorphism allows storing diverse technical attributes without creating hundreds of sparse relational columns.',
          alternativeRejected: 'Strict Relational SQL (would require an Entity-Attribute-Value EAV anti-pattern or dozens of junction tables).'
        },
        {
          tech: 'Streaming CSV Generation over In-Memory Array Mapping',
          why: 'Generating a CSV for 50,000+ spare parts in memory with `JSON.stringify()` or array building causes Node.js V8 heap out-of-memory crashes. Using `stream` and `csv-stringify` pipes chunks directly to the network socket in O(1) RAM.',
          alternativeRejected: 'In-memory CSV generation (`res.send(data.map(...).join("\\n"))`).'
        }
      ]
    },
    featuresDeepDive: [
      {
        feature: 'Atomic Stock Adjustment & Low-Stock Alerts',
        implementation: 'When an item is checked out, MongoDB updates stock count atomically using `db.products.findOneAndUpdate({ _id, stock: { $gte: qty } }, { $inc: { stock: -qty } })`. Returns an error immediately if stock is insufficient.',
        impact: 'Eliminates overselling and race conditions when multiple warehouse clerks log transactions simultaneously.'
      },
      {
        feature: 'Multi-Criteria Search & Compound Indexing',
        implementation: 'Created compound indexes on `{ partNumber: 1, manufacturer: 1, category: 1 }` and text indexes on description. Enabled debounced autocomplete search across tens of thousands of auto parts with sub-20ms query latency.',
        impact: 'Warehouse staff can find exact replacement parts in seconds instead of browsing through binders or slow legacy systems.'
      },
      {
        feature: 'Streaming CSV Export Pipeline',
        implementation: 'Node.js cursor-based stream `Product.find().cursor()` piped through a CSV Transform stream directly into `res`.',
        impact: 'Server memory consumption remains flat under 30MB regardless of whether exporting 100 rows or 100,000 rows.'
      }
    ],
    engineeringChallenges: [
      {
        problem: 'Handling High-Concurrency Race Conditions on Limited Stock',
        solution: 'If two orders for the last available radiator arrive within 5ms of each other, reading stock count and then writing could lead to negative inventory. I used MongoDB atomic operators: `{ $inc: { stock: -orderedQty } }` with the query filter `{ stock: { $gte: orderedQty } }`. If the condition fails, the query matches 0 documents and the API returns a 409 Conflict.',
        lessonLearned: 'Always use atomic conditional database operations instead of client-side check-then-act logic.'
      },
      {
        problem: 'Slow Category and Manufacturer Filtering on Large Datasets',
        solution: 'Initial queries took over 800ms due to sequential collection scans (`COLLSCAN`). By running `explain("executionStats")`, I discovered missing composite indexes. Adding compound index `{ category: 1, price: 1 }` reduced query execution time to 12ms (`IXSCAN`).',
        lessonLearned: 'Regularly audit query plans using MongoDB explain tool rather than guessing performance bottlenecks.'
      }
    ],
    interviewQA: [
      {
        question: 'Why did you use MongoDB atomic operators instead of distributed locks?',
        answer: 'For single-document inventory decrements, MongoDB atomic conditional updates (`findOneAndUpdate` with `{ $inc: { stock: -qty } }` and condition `{ stock: { $gte: qty } }`) provide native row-level atomicity without the overhead, latency, or deadlocks associated with external distributed locking mechanisms like Redis Redlock.'
      },
      {
        question: 'How did you ensure the CSV export does not crash the Node.js server under high load?',
        answer: 'Instead of buffering all MongoDB records into an array in memory, I used `Mongoose.Query.cursor()`. This reads records one batch at a time from MongoDB and streams them through a transform stream that formats CSV rows and pipes them directly into the Express `res` writable stream. This backpressure mechanism ensures memory usage stays bounded regardless of dataset size.'
      }
    ]
  },
  {
    id: 'bytefest-2k25',
    title: 'ByteFest 2K25 Live Event Platform',
    tagline: 'High-traffic college tech-fest portal handling 2,000+ daily visitors and 1,500+ participant registrations',
    role: 'Lead Web Developer & Technical Support Lead',
    timeline: 'May 2025 – June 2025',
    techStack: ['React.js', 'Tailwind CSS', 'Node.js', 'Vite', 'Cloudflare CDN / Vercel', 'PostgreSQL / Supabase'],
    elevatorPitch: {
      quick30Sec: 'I designed and deployed the official website for ByteFest 2K25, our annual state-level technical symposium. It successfully handled 2,000+ daily visitors and 1,500+ participant registrations across coding, robotics, and hackathon events with 99.9% uptime and zero registration drop-offs.',
      detailed90Sec: 'College tech festivals experience massive traffic spikes, especially when registration opens and results are announced. For ByteFest 2K25, I engineered a responsive, high-performance web platform built with React, Vite, and Tailwind CSS. To handle over 2,000 daily unique visitors and 1,500 event participants, I optimized bundle sizes with code-splitting, leveraged aggressive edge caching via Cloudflare CDN, implemented rate limiting to prevent form spamming, and created an on-ground digital verification system for fast event check-ins. During the live event, I served as technical support lead, ensuring continuous uptime and real-time announcement synchronization.'
    },
    architecture: {
      description: 'JAMstack architecture with edge-cached static distribution and serverless registration endpoints designed for bursty traffic spikes.',
      flow: [
        'Users hit Cloudflare Edge CDN cache for static assets (HTML, CSS, JS, event posters).',
        'React Single Page Application features dynamic event timelines, rulebooks, speaker schedules, and registration modals.',
        'Registration submissions validate form inputs, prevent duplicate entries via unique phone/email constraints, and issue QR ticket confirmation IDs.',
        'Admins access a protected dashboard to view live registration counts per event, download participant manifests, and verify attendees at physical venue gates.'
      ],
      techChoiceReasoning: [
        {
          tech: 'Vite + React SPA with Cloudflare Edge Caching',
          why: 'Static assets cached at Cloudflare edge locations across India gave visitors sub-100ms load times even on spotty 4G mobile networks at the college campus.',
          alternativeRejected: 'Monolithic SSR server (would have crashed or scaled up cloud costs under sudden registration burst spikes).'
        },
        {
          tech: 'Tailwind CSS for Rapid UI Development',
          why: 'Allowed building a bespoke, high-energy cyber-themed tech fest UI with custom animations, glassmorphism, and responsive mobile layouts within a tight 3-week deadline.',
          alternativeRejected: 'Component libraries with rigid designs (would not fit the custom fest aesthetic).'
        }
      ]
    },
    featuresDeepDive: [
      {
        feature: 'High-Concurrency Event Registration Flow',
        implementation: 'Multi-step registration form supporting individual and team registrations (up to 4 members). Enforces unique phone/college email constraints to prevent duplicate entries.',
        impact: 'Successfully registered 1,500+ attendees across 8 events without database deadlocks or dropped submissions.'
      },
      {
        feature: 'Edge CDN Performance Optimization',
        implementation: 'Aggressive asset compression (Brotli/Gzip), image WebP conversion, dynamic code-splitting via `React.lazy`, and Cloudflare caching.',
        impact: 'Reduced initial bundle size by 65% and achieved a 98+ Google Lighthouse Performance Score.'
      },
      {
        feature: 'On-Ground Live Technical Support & Manifest Export',
        implementation: 'Built real-time manifest search tools and CSV exports for event organizers to verify tickets and resolve participant on-spot issues at event gates.',
        impact: 'Cut physical gate check-in time from 3 minutes per team to under 15 seconds.'
      }
    ],
    engineeringChallenges: [
      {
        problem: 'Handling Sudden Traffic Surge at Registration Launch',
        solution: 'When registration opened at 10:00 AM, over 800 students hit the website within 15 minutes. To avoid backend saturation, I decoupled static browsing from the registration pipeline. Event rules and schedules were 100% edge-cached, while registration forms included client-side validation and debounced submission to prevent double-clicks.',
        lessonLearned: 'Decoupling read traffic from write traffic is the most effective way to withstand massive traffic spikes.'
      },
      {
        problem: 'Duplicate Team Registrations from Flaky Mobile Connections',
        solution: 'Students submitting on weak campus Wi-Fi were repeatedly clicking "Register" when network latency delayed the confirmation message. I added database-level unique constraints on `(event_id, leader_email)` and implemented an immediate client-side button disable state with a loading spinner.',
        lessonLearned: 'Always guard against idempotent double-submits at both the UI layer (disable button) and database layer (unique composite index).'
      }
    ],
    interviewQA: [
      {
        question: 'How did you ensure 99.9% uptime during the high-traffic ByteFest 2K25 launch?',
        answer: 'By adopting a Jamstack approach where 95% of traffic (browsing schedules, rules, speaker bios) was served directly from CDN edge servers without touching our backend servers. The remaining 5% was registration write traffic, which was validated client-side and handled by lightweight serverless API endpoints backed by indexed database tables with rate limiting.'
      },
      {
        question: 'What was your role during the live technical support phase?',
        answer: 'I managed live system monitoring, tracked real-time registration logs for errors, coordinated gate verification tools for student coordinators, and handled on-the-fly schedule announcements. When unexpected team size requests arose for the hackathon, I pushed an immediate hotfix update through our CI/CD pipeline within 10 minutes.'
      }
    ]
  },
  {
    id: 'universal-job-apply-bot',
    title: 'Universal Job Apply Bot (Automation Project)',
    tagline: 'Full-stack automation worker with stealth browser scraping, queuing, and real-time dashboard tracking',
    role: 'Full Stack & Automation Engineer',
    timeline: 'Completed',
    techStack: ['Python', 'Selenium Stealth', 'FastAPI', 'React.js', 'Supabase PostgreSQL', 'Tailwind CSS'],
    elevatorPitch: {
      quick30Sec: 'I developed an intelligent automated job application platform combining a Python stealth Selenium worker, FastAPI backend, and React dashboard that automates repetitive job board applications, parses job descriptions, and tracks submission status in real-time.',
      detailed90Sec: 'Job hunting requires hundreds of repetitive application submissions across various portals. I built the Universal Job Apply Bot: a full-stack platform featuring a React frontend for job queue management and status tracking, a FastAPI REST API for application orchestration, and a background Python worker utilizing undetected Chrome and stealth Selenium techniques to navigate portals, auto-fill profile details, attach resumes, and log success/failure metrics to Supabase PostgreSQL.'
    },
    architecture: {
      description: 'Distributed worker architecture with asynchronous job queue, stealth headless browser execution, and real-time WebSocket state streaming.',
      flow: [
        'React Dashboard allows configuring target job keywords, salary filters, and resume profiles.',
        'FastAPI API schedules job execution tasks into an asynchronous queue.',
        'Python Selenium Stealth worker spawns headless browser sessions with anti-fingerprinting patches (randomized user-agents, webgl spoofing, human-like mouse movements).',
        'Application statuses, error screenshots, and confirmation emails are recorded in PostgreSQL.'
      ],
      techChoiceReasoning: [
        {
          tech: 'Python & Selenium Stealth over Puppeteer/Node.js',
          why: 'Python has superior ecosystem support for web automation, CAPTCHA classification, and undetected-chromedriver patches that successfully bypass modern anti-bot systems like Cloudflare Turnstile.',
          alternativeRejected: 'Standard Selenium (detected and blocked within seconds by modern applicant tracking systems).'
        }
      ]
    },
    featuresDeepDive: [
      {
        feature: 'Stealth Browser Automation Engine',
        implementation: 'Patched Chrome CDP (Chrome DevTools Protocol) flags, disabled `navigator.webdriver` flag, and injected randomized micro-delays between keystrokes to mimic human typing speed.',
        impact: 'Achieved a 92% successful submission completion rate without triggering IP bans or bot traps.'
      }
    ],
    engineeringChallenges: [
      {
        problem: 'Dynamic Form Fields Across Different Applicant Tracking Systems (ATS)',
        solution: 'Different company portals use different input names for "phone", "years of experience", or "LinkedIn URL". I implemented a heuristic selector matching algorithm that uses regular expressions across input `name`, `placeholder`, `aria-label`, and adjacent `<label>` text.',
        lessonLearned: 'Building resilient automation requires semantic heuristic matching rather than brittle hardcoded CSS selectors.'
      }
    ],
    interviewQA: [
      {
        question: 'How did you handle rate limiting and bot detection during automated job applications?',
        answer: 'I implemented randomized exponential backoff delays between applications (ranging from 15 to 45 seconds), rotated realistic desktop User-Agent headers, spoofed WebGL and canvas fingerprints, and utilized undetected Chrome drivers that prevent the `navigator.webdriver = true` flag from being exposed to the host webpage.'
      }
    ]
  }
];

