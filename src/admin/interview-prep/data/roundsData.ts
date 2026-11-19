import { QAItem, CompanyNote } from '../types';

// CS Fundamentals for Technical Round 2
export const csFundamentalsData: QAItem[] = [
  // --- OOP & SOLID ---
  {
    id: 'cs-oop-1',
    category: 'Object-Oriented Programming (OOP)',
    question: 'Explain the 4 Pillars of OOP with practical code examples.',
    shortAnswer:
      'The four pillars are Encapsulation (bundling data and restricting direct access), Abstraction (hiding implementation details and exposing only essentials), Inheritance (reusing code across parent-child hierarchies), and Polymorphism (one interface, multiple behaviors).',
    detailedAnswer:
      '1) Encapsulation: Keeping fields private and exposing getters/setters or methods to protect internal invariants. 2) Abstraction: Using abstract classes or interfaces (e.g. `PaymentGateway.processPayment()`) so consumers do not need to know whether PayPal, Stripe, or Razorpay is executing underneath. 3) Inheritance: A `Car` inherits properties like `speed` and `fuelCapacity` from `Vehicle`. 4) Polymorphism: Method Overriding (runtime polymorphism) and Method Overloading (compile-time polymorphism).',
    codeSnippet: {
      language: 'typescript',
      code: `// Abstraction & Polymorphism:
interface PaymentGateway {
  charge(amount: number): boolean;
}

class StripeGateway implements PaymentGateway {
  charge(amount: number) {
    console.log(\`Charging \${amount} via Stripe API\`);
    return true;
  }
}

class RazorpayGateway implements PaymentGateway {
  charge(amount: number) {
    console.log(\`Charging \${amount} via Razorpay API\`);
    return true;
  }
}

// Client depends on abstraction, allowing interchangeable payment providers:
function checkout(gateway: PaymentGateway, total: number) {
  gateway.charge(total);
}`
    },
    followUps: [
      'Why is composition often favored over deep inheritance hierarchies ("favor composition over inheritance")?',
      'What is the difference between an abstract class and an interface in TypeScript / Java / C++?'
    ],
    level: 'Basic',
    tags: ['OOP', 'Core CS', 'Design']
  },
  {
    id: 'cs-solid-1',
    category: 'Object-Oriented Programming (OOP)',
    question: 'Explain the SOLID design principles with concise real-world examples.',
    shortAnswer:
      'SOLID principles guide maintainable software design: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.',
    detailedAnswer:
      '1) S (Single Responsibility): A class should have only one reason to change (e.g. separate invoice PDF generation from invoice database saving). 2) O (Open/Closed): Open for extension, closed for modification (add new discount rules without editing core checkout engine). 3) L (Liskov Substitution): Derived classes must be substitutable for their base class without altering program correctness. 4) I (Interface Segregation): Clients should not be forced to depend on interfaces they do not use (split fat interfaces into smaller ones). 5) D (Dependency Inversion): High-level modules should depend on abstractions, not concrete low-level details.',
    codeSnippet: {
      language: 'typescript',
      code: `// Single Responsibility Principle (SRP):
// ❌ Violates SRP:
class UserService {
  register(user) {
    db.save(user); // DB logic
    emailClient.sendWelcome(user.email); // Notification logic
    fs.appendFileSync('audit.log', 'user created'); // Logging logic
  }
}

// ✅ Adheres to SRP:
class UserRepository { save(user) { db.save(user); } }
class EmailService { sendWelcome(email) { emailClient.send(email); } }
class AuditLogger { log(msg) { fs.appendFileSync('audit.log', msg); } }`
    },
    followUps: [
      'Give an example where violating the Liskov Substitution Principle breaks code.',
      'How does Dependency Inversion relate to Dependency Injection frameworks like ASP.NET Core?'
    ],
    level: 'Intermediate',
    tags: ['SOLID', 'OOP', 'Software Design', 'Architecture']
  },

  // --- DBMS & RELATIONAL THEORY ---
  {
    id: 'cs-dbms-1',
    category: 'Database Management Systems (DBMS)',
    question: 'Explain Database Normalization: 1NF, 2NF, 3NF, and BCNF.',
    shortAnswer:
      'Normalization organizes database tables to minimize data redundancy and eliminate insert, update, and delete anomalies without losing information.',
    detailedAnswer:
      '1) 1NF: Every cell must contain atomic (indivisible) values, each record must have a unique identifier (Primary Key), and no repeating column groups. 2) 2NF: Must be in 1NF and have NO partial dependencies (every non-key attribute must depend fully on the complete candidate key, relevant for composite keys). 3) 3NF: Must be in 2NF and have NO transitive dependencies (non-key attributes must not depend on other non-key attributes; $X \\rightarrow Y \\rightarrow Z$). 4) BCNF (Boyce-Codd): A stricter version of 3NF where for every functional dependency $X \\rightarrow Y$, $X$ must be a super key.',
    codeSnippet: {
      language: 'sql',
      code: `-- 3NF Example:
-- ❌ Violates 3NF: department_name depends on department_id (transitive dependency)
-- employees(id, name, department_id, department_name, department_head)

-- ✅ Decomposed into 3NF:
CREATE TABLE departments (
  department_id INT PRIMARY KEY,
  department_name VARCHAR(100),
  department_head VARCHAR(100)
);

CREATE TABLE employees (
  employee_id INT PRIMARY KEY,
  name VARCHAR(100),
  department_id INT REFERENCES departments(department_id)
);`
    },
    followUps: [
      'When is intentional denormalization preferred in data warehousing or OLAP databases?',
      'What are insert, update, and delete anomalies?'
    ],
    level: 'Basic',
    tags: ['DBMS', 'Normalization', 'Relational', 'SQL']
  },
  {
    id: 'cs-dbms-2',
    category: 'Database Management Systems (DBMS)',
    question: 'What are the 4 Transaction Isolation Levels and the anomalies they prevent?',
    shortAnswer:
      'The ANSI SQL isolation levels from weakest to strongest are Read Uncommitted, Read Committed, Repeatable Read, and Serializable. They successively eliminate Dirty Reads, Non-Repeatable Reads, and Phantom Reads.',
    detailedAnswer:
      '1) Read Uncommitted: Allows reading dirty, uncommitted rows from other concurrent transactions (causes Dirty Reads). 2) Read Committed: Only committed data can be read. Prevents Dirty Reads, but a row read twice might change if another transaction commits an update (Non-Repeatable Read). Default in Postgres. 3) Repeatable Read: Ensures that if a row is read twice in the transaction, it returns identical values. Prevents Non-Repeatable Reads. 4) Serializable: Highest level; transactions execute as if strictly serialized one after another. Prevents all anomalies including Phantom Reads (new rows inserted matching a WHERE clause).',
    codeSnippet: {
      language: 'sql',
      code: `-- Setting transaction isolation level in PostgreSQL:
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;

SELECT * FROM spare_parts WHERE stock_quantity < 5;
-- Any subsequent query inside this transaction sees the exact snapshot from transaction start!

COMMIT;`
    },
    followUps: [
      'What is the performance trade-off of using Serializable isolation level in high-write web apps?',
      'How does MVCC (Multi-Version Concurrency Control) in PostgreSQL eliminate read-locks?'
    ],
    level: 'Intermediate',
    tags: ['DBMS', 'Transactions', 'ACID', 'Isolation Levels']
  },

  // --- OPERATING SYSTEMS ---
  {
    id: 'cs-os-1',
    category: 'Operating Systems (OS)',
    question: 'Explain the difference between a Process and a Thread.',
    shortAnswer:
      'A process is an independent program in execution with its own separate address space, file handles, and memory. A thread is a lightweight unit of execution within a process that shares memory and resources with sibling threads of the same process.',
    detailedAnswer:
      'Processes are isolated by the OS virtual memory manager; if one process crashes, others remain unaffected. Inter-Process Communication (IPC) requires OS primitives (sockets, pipes, shared memory) and context switching between processes is relatively expensive. In contrast, threads within the same process share code, data, and heap memory, but each thread has its own private stack and registers. Context switching between threads is faster, but a crash or unhandled exception in one thread can terminate the entire process.',
    codeSnippet: {
      language: 'text',
      code: `Comparison Breakdown:
Feature             | Process                      | Thread
--------------------+------------------------------+---------------------------
Memory              | Dedicated virtual memory     | Shared heap/data with peers
Creation Cost       | High (heavyweight)           | Low (lightweight)
Context Switch      | Slower (MMU page table swap) | Faster (shares address space)
Communication       | IPC (Pipes, Sockets, MQ)     | Direct memory access (needs mutex)
Fault Isolation     | High (one crash won't affect)| Low (can crash whole process)`
    },
    followUps: [
      'What is a Race Condition, and how do Mutexes vs Semaphores solve it?',
      'Why is thread synchronization critical when modifying shared variables?'
    ],
    level: 'Basic',
    tags: ['OS', 'Process', 'Thread', 'Concurrency']
  },
  {
    id: 'cs-os-2',
    category: 'Operating Systems (OS)',
    question: 'What is a Deadlock, and what are the 4 Coffman conditions required for a deadlock to occur?',
    shortAnswer:
      'A deadlock is a situation where two or more processes are permanently blocked because each holds a resource the other needs. Deadlock occurs if and only if all four Coffman conditions hold: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.',
    detailedAnswer:
      'The 4 Coffman Conditions: 1) Mutual Exclusion: At least one resource is held in a non-shareable mode. 2) Hold and Wait: A process holding at least one resource is waiting to acquire additional resources held by other processes. 3) No Preemption: Resources cannot be forcibly seized from a process; they must be released voluntarily. 4) Circular Wait: A closed chain of processes exists where $P_0$ waits for a resource held by $P_1$, $P_1$ waits for $P_2$, ..., and $P_n$ waits for $P_0$. Deadlock can be prevented by breaking any single condition (e.g. enforcing strict global ordering on resource acquisition to eliminate circular wait).',
    codeSnippet: {
      language: 'text',
      code: `Visualizing Deadlock (Circular Wait):
Process 1 holds Resource A ---> Wants Resource B (held by Process 2)
      ^                                      |
      |                                      v
Process 2 holds Resource B ---> Wants Resource A (held by Process 1)`
    },
    followUps: [
      'What is the Banker\'s Algorithm and how is it used for deadlock avoidance?',
      'How do modern databases detect deadlocks and resolve them (e.g. killing the cheaper victim transaction)?'
    ],
    level: 'Intermediate',
    tags: ['OS', 'Deadlock', 'Concurrency', 'Core CS']
  },

  // --- COMPUTER NETWORKS ---
  {
    id: 'cs-cn-1',
    category: 'Computer Networks (CN)',
    question: 'What happens behind the scenes from the moment you type a URL into a browser and press Enter?',
    shortAnswer:
      'The browser resolves the domain name via DNS hierarchy, establishes a TCP connection (3-way handshake) and TLS handshake for HTTPS, sends an HTTP GET request, the server processes the request and responds with HTML/CSS/JS, and the browser parses and renders the page.',
    detailedAnswer:
      'Step-by-step pipeline: 1) URL Parsing: Browser extracts protocol (https), domain (umeshtemburwar.in), and path. 2) DNS Lookup: Browser checks local cache -> OS hosts cache -> Resolver -> Root DNS -> TLD (.in) -> Authoritative Nameserver to get server IP address. 3) TCP 3-Way Handshake: SYN -> SYN-ACK -> ACK establishes reliable TCP connection on port 443. 4) TLS 1.3 Handshake: Client and server exchange encryption keys, verify SSL certificate authenticity, and establish encrypted session. 5) HTTP Request & Response: Browser sends `GET / HTTP/2`, server responds with `200 OK` and HTML payload. 6) Browser Rendering Engine: Parses HTML into DOM, CSS into CSSOM, calculates layout tree, paints pixels, and executes JavaScript.',
    codeSnippet: {
      language: 'text',
      code: `Step-by-step Flow:
User enters URL
  -> 1. DNS Resolution (Browser -> OS -> ISP -> Nameserver) -> IP: 76.76.21.21
  -> 2. TCP 3-Way Handshake (SYN -> SYN-ACK -> ACK)
  -> 3. TLS 1.3 Handshake (Certificate check & Key exchange)
  -> 4. HTTP Request (GET / HTTP/2)
  -> 5. Server Processing (Reverse proxy -> Node/FastAPI -> Response)
  -> 6. Browser Pipeline (DOM Tree + CSSOM Tree -> Render Tree -> Layout -> Paint)`
    },
    followUps: [
      'What is the difference between TCP and UDP?',
      'Why is HTTP/2 multiplexing faster than HTTP/1.1 head-of-line blocking?'
    ],
    level: 'Basic',
    tags: ['Computer Networks', 'DNS', 'TCP/IP', 'HTTP', 'Browser']
  },
  {
    id: 'cs-cn-2',
    category: 'Computer Networks (CN)',
    question: 'Explain TCP 3-Way Handshake and 4-Way Connection Teardown.',
    shortAnswer:
      'Connection establishment uses SYN (Synchronize sequence number) -> SYN-ACK -> ACK. Connection termination uses FIN -> ACK -> FIN -> ACK to ensure both directions are cleanly closed.',
    detailedAnswer:
      'TCP is connection-oriented and guarantees ordered, reliable packet delivery. Handshake: 1) Client sends `SYN` with sequence number $X$. 2) Server responds with `SYN-ACK` with sequence number $Y$ and acknowledgment $X+1$. 3) Client sends `ACK` with acknowledgment $Y+1$. Connection is now established. Teardown: 1) Client sends `FIN`. 2) Server sends `ACK` (half-close: server can still send remaining data). 3) Server sends `FIN`. 4) Client sends `ACK` and enters `TIME_WAIT` (typically 2 MSL) to ensure final ACK was received before port release.',
    codeSnippet: {
      language: 'text',
      code: `TCP 3-Way Handshake:
Client                   Server
  | ----- SYN (seq=x) ----> |
  | <--- SYN-ACK (y, x+1) - |
  | ----- ACK (seq=y+1) --> |
  [ Connection Established ]`
    },
    followUps: [
      'What is the purpose of the TIME_WAIT state in TCP teardown?',
      'What is a SYN Flood DDoS attack and how do SYN Cookies defend against it?'
    ],
    level: 'Intermediate',
    tags: ['Computer Networks', 'TCP', 'Handshake', 'Protocols']
  },

  // --- SDLC & AGILE ---
  {
    id: 'cs-agile-1',
    category: 'Software Engineering & Agile',
    question: 'Explain the Agile Scrum framework: Ceremonies, Roles, and Artifacts.',
    shortAnswer:
      'Scrum is an iterative Agile framework built around 1-4 week Sprints. Key roles are Product Owner, Scrum Master, and Developers. Artifacts include Product Backlog, Sprint Backlog, and Increment. Ceremonies include Sprint Planning, Daily Standup, Sprint Review, and Retrospective.',
    detailedAnswer:
      'In Scrum: 1) Product Owner prioritizes business value in the Product Backlog. 2) Scrum Master removes blockers and facilitates the team. 3) Ceremonies: Daily Standup (15-min sync: What I did yesterday, what I will do today, any blockers), Sprint Planning (committing to tickets for the next sprint), Sprint Review (demoing finished features to stakeholders), Sprint Retrospective (team discussion on what went well and process improvements).',
    codeSnippet: {
      language: 'text',
      code: `Scrum Cycle:
Product Backlog -> Sprint Planning -> Sprint Backlog
    -> 2-Week Sprint (Daily Standup: Yesterday / Today / Blockers)
    -> Potentially Shippable Increment
    -> Sprint Review (Demo) & Sprint Retrospective (Inspect & Adapt)`
    },
    followUps: [
      'How does Agile differ from the traditional Waterfall model?',
      'What is a Story Point and how does Planning Poker estimate task complexity?'
    ],
    level: 'Basic',
    tags: ['Agile', 'Scrum', 'SDLC', 'Software Engineering']
  }
];

// Managerial Round STAR Format Q&A
export const managerialRoundData: QAItem[] = [
  {
    id: 'mgr-1',
    category: 'Managerial Round (STAR)',
    question: 'Tell me about a time when you faced a tight deadline or high pressure while developing a project. How did you handle it?',
    shortAnswer:
      'During ByteFest 2K25, registration traffic surged to 2000+ daily visitors right before the deadline. I prioritized critical user journeys, cached static event data, and kept stakeholders informed, successfully registering all 1500+ participants without downtime.',
    detailedAnswer:
      '• Situation: 48 hours before ByteFest 2K25 registrations closed, daily visitors spiked past 2,000, creating database connection bottlenecks and slow response times.\n• Task: As the developer in charge of the event website, I had to ensure the registration form remained responsive and 1,500+ participants could submit payments and team details without drop-offs.\n• Action: I triaged the issue immediately. Instead of making live database queries for every static event schedule and brochure view, I moved event assets to Vercel CDN caching. For the registration form, I implemented client-side validation to eliminate redundant backend round-trips and debounced input fields. I stayed until midnight verifying server health logs.\n• Result: The website handled the surge with 99.9% uptime, successfully capturing 1,500+ registrations with zero data loss or payment discrepancies.',
    followUps: [
      'What would you do differently if you faced the same scenario today?',
      'How did you communicate with the event organizers during the high-traffic window?'
    ],
    level: 'Intermediate',
    tags: ['Managerial', 'STAR', 'Pressure', 'Ownership']
  },
  {
    id: 'mgr-2',
    category: 'Managerial Round (STAR)',
    question: 'Describe a situation where you had a disagreement with a team member. How did you resolve it?',
    shortAnswer:
      'When choosing the database for our inventory management system, a teammate wanted MySQL while I proposed MongoDB. We resolved it objectively by listing data access patterns and running a proof-of-concept benchmark together.',
    detailedAnswer:
      '• Situation: During the planning phase of our Automobile Spare Parts Inventory project, my team partner argued strongly for a relational schema in MySQL, while I advocated for MongoDB due to varied spare-part specifications across different vehicle models.\n• Task: We needed to decide quickly to stay on schedule without causing team friction.\n• Action: Instead of debating opinions, I proposed creating a simple objective matrix comparing both databases against our specific requirements: schema flexibility for diverse vehicle models, nested supplier info, and development speed. We built a 1-day prototype storing 50 sample automobile parts. We found that parts had dozens of disparate attributes (engine vs brake vs electrical components) that required 6+ relational join tables in MySQL, whereas MongoDB handled them cleanly in polymorphic documents.\n• Result: Seeing the concrete code and benchmark, my teammate agreed with MongoDB, and we completed the project ahead of deadline with zero resentment.',
    followUps: [
      'What would you have done if the team member still disagreed after the prototype?',
      'How do you separate technical disagreements from personal feelings?'
    ],
    level: 'Intermediate',
    tags: ['Managerial', 'Conflict Resolution', 'Collaboration', 'STAR']
  },
  {
    id: 'mgr-3',
    category: 'Managerial Round (STAR)',
    question: 'Give an example of a mistake you made in a technical project and what you learned from it.',
    shortAnswer:
      'I once pushed code containing hardcoded Supabase test credentials to a private git repository. I immediately rotated the keys, added environment variable validation, and instituted automated git pre-commit hooks.',
    detailedAnswer:
      '• Situation: Early in developing the EdTech Learning Platform, I was testing authentication locally and pushed a commit that inadvertently included my test Supabase project keys in a configuration file.\n• Task: Protect project security and ensure sensitive credentials could never leak into source control.\n• Action: The moment I realized the mistake within 10 minutes, I logged into Supabase and revoked the old API keys immediately to invalidate them. I rewrote the commit history using `git reset` before pushing. Then, to make sure it never happened again, I installed `dotenv-safe` and added a Git `pre-commit` hook that scans for secrets and verifies that `.env` is listed in `.gitignore`.\n• Result: No unauthorized access occurred, and the incident taught me the vital importance of security hygiene, automated linting, and defense-in-depth from day one.',
    followUps: [
      'Why is simply committing another change that removes the key insufficient in Git?',
      'How do you manage production environment secrets in CI/CD pipelines?'
    ],
    level: 'Intermediate',
    tags: ['Managerial', 'Mistakes', 'Learning', 'Security']
  }
];

// HR Round Fresher Guide & Q&A
export const hrRoundData: QAItem[] = [
  {
    id: 'hr-1',
    category: 'HR Round',
    question: 'Tell me about yourself (Fresher Elevator Pitch - Umesh Temburwar).',
    shortAnswer:
      '"Good morning/afternoon, sir/ma\'am. I am Umesh Temburwar, a Computer Science graduate from MBES College of Engineering, Ambajogai. I am a passionate Full Stack Developer with hands-on experience in React.js, Node.js, TypeScript, Next.js, and PostgreSQL/MongoDB through real-world applications."',
    detailedAnswer:
      'Complete 2-Minute Structured Answer:\n"Good morning/afternoon. Thank you for this opportunity. My name is Umesh Temburwar, and I am a Computer Science graduate from MBES College of Engineering, Ambajogai, Maharashtra.\n\nThroughout my engineering studies, I focused on becoming a capable full-stack software engineer. Rather than limiting myself to textbook theory, I built three production-grade web applications:\n1) An EdTech Learning Platform with role-based access control, courses, quizzes, and certificates using React.js, Node.js, and Supabase.\n2) An Automobile Spare Parts Inventory Management System with role-based authentication, category filtering, and CSV export using MongoDB and Node.js.\n3) The official ByteFest 2K25 college fest website, which I designed and deployed, handling over 2,000 daily visitors and managing 1,500+ participant registrations.\n\nTechnically, I am strongest in JavaScript, TypeScript, React.js, Node.js, and database systems like SQL and MongoDB. Beyond coding, I enjoy troubleshooting bugs, collaborating with peers, and learning new tools quickly.\n\nI am eager to begin my professional career with your organization, where I can contribute to high-impact projects, write clean scalable code, and grow under experienced engineering mentorship."',
    followUps: [
      'What is your biggest personal achievement outside academics?',
      'Which of your three projects was the most challenging to develop?'
    ],
    level: 'Basic',
    tags: ['HR', 'Self Introduction', 'Fresher', 'Elevator Pitch']
  },
  {
    id: 'hr-2',
    category: 'HR Round',
    question: 'Why do you want to join our company?',
    shortAnswer:
      'Mention specific reasons: the company\'s reputation for engineering excellence, structured fresher training programs, client impact, and your alignment with their technology stack and collaborative work culture.',
    detailedAnswer:
      '"I want to join your company for three key reasons: First, your organization is renowned for its world-class training programs for graduate engineers and a strong engineering culture where freshers are given genuine ownership of meaningful deliverables. Second, your projects work at enterprise scale across modern technologies like cloud services, microservices, and modern frontend frameworks, which directly aligns with my aspirations as a full-stack developer. Finally, through employee reviews and technical blogs, I have seen your emphasis on continuous learning and mentorship, which is the exact environment where I know I can contribute my best while continuously growing my technical skills."',
    followUps: [
      'What do you know about our recent business developments or clients?',
      'Where do you see yourself in our company in 3 to 5 years?'
    ],
    level: 'Basic',
    tags: ['HR', 'Why Company', 'Motivation']
  },
  {
    id: 'hr-3',
    category: 'HR Round',
    question: 'Are you open to relocation, night shifts, and signing a service agreement / bond?',
    shortAnswer:
      'State a clear, enthusiastic "YES". Explain that as a fresher, learning and technical exposure take precedence over location preferences.',
    detailedAnswer:
      '"Yes, absolutely. As a fresher at the start of my engineering career, my highest priority is technical learning, mentorship, and contributing to the team\'s mission. I am completely comfortable relocating to any of your development centres (e.g. Pune, Bangalore, Hyderabad, Chennai, or Mumbai) and working across rotational shifts if project deliverables or international client timezones require it. Regarding service agreements, I see a 1-to-2 year commitment as a natural investment by the company in my training, and I am glad to make that mutual commitment."',
    followUps: [
      'Do you have any family constraints regarding living in other cities?',
      'How quickly can you join if selected?'
    ],
    level: 'Basic',
    tags: ['HR', 'Relocation', 'Shifts', 'Bond']
  },
  {
    id: 'hr-4',
    category: 'HR Round',
    question: 'What are your strengths and weaknesses?',
    shortAnswer:
      'Strength: Fast learner with strong persistence in debugging and project ownership. Weakness: Tendency to spend too much time perfecting small UI details, which I now manage using strict timeboxing and MVP milestones.',
    detailedAnswer:
      '• Strengths: "My greatest strength is practical persistence and self-directed learning. When building my EdTech and ByteFest projects, whenever I hit unfamiliar territory—like configuring Supabase Row Level Security or handling high-concurrency registration traffic—I didn\'t get stuck; I dove into documentation, analyzed network logs, and delivered working solutions. I take full ownership of whatever I build."\n• Weakness: "Early on, I had a tendency to spend too much time over-polishing small visual details before finishing core backend functionality. I recognized this bottleneck, and I now use the \'MVP first\' principle and timebox my tasks using Trello/GitHub issues. This ensures all critical deliverables are completed ahead of schedule before I refine secondary enhancements."',
    followUps: [
      'Can you give an example where your debugging persistence saved a project?',
      'How do you handle constructive criticism from seniors?'
    ],
    level: 'Basic',
    tags: ['HR', 'Strengths', 'Weaknesses', 'Behavioral']
  },
  {
    id: 'hr-5',
    category: 'HR Round',
    question: 'What is your salary expectation as a fresher?',
    shortAnswer:
      'Be polite, flexible, and aligned with company fresher standards: "As a fresher, my primary focus is joining an organization where I can build strong fundamentals. I am happy to accept the standard compensation package offered by your company for graduate engineering trainees."',
    detailedAnswer:
      '"As a fresher starting my engineering career, my main priority is securing the right platform where I can apply my full-stack skills, learn best software engineering practices, and contribute value to real-world client projects. I trust that your company has a well-defined and competitive compensation structure for graduate software engineers, and I am very happy to accept the standard package as per company policy."',
    followUps: [
      'If given an offer at our standard slab, are you ready to accept immediately?',
      'Do you have any competing job offers currently?'
    ],
    level: 'Basic',
    tags: ['HR', 'Salary', 'Negotiation', 'Fresher']
  },
  {
    id: 'hr-6',
    category: 'HR Round',
    question: 'Do you have any questions for us at the end of the interview?',
    shortAnswer:
      'Always ask thoughtful, curious questions about team tech stacks, engineering culture, or training programs. Never ask about salary or leaves.',
    detailedAnswer:
      'Top 3 recommended questions to ask the interviewer:\n1) "Could you share a little about the tech stack and engineering practices (like CI/CD, testing, code reviews) that freshers are typically introduced to during onboarding in your team?"\n2) "What qualities distinguish the graduate engineers who make the strongest positive impact within their first 6 to 12 months at the company?"\n3) "What is the next step in the selection process, and is there any particular technology or domain you would recommend I strengthen before joining?"',
    followUps: [
      'Why is it a mistake to say "No, I don\'t have any questions"?',
      'What questions should you avoid asking the technical vs HR interviewer?'
    ],
    level: 'Basic',
    tags: ['HR', 'Reverse Questions', 'Interview Strategy']
  }
];

// MNC Company Notes
export const mncCompanyNotes: CompanyNote[] = [
  {
    company: 'Tata Consultancy Services (TCS)',
    category: 'IT Services Tier 1',
    rounds: [
      'TCS NQT (National Qualifier Test): Aptitude, Reasoning, Verbal, Advanced Quantitative, and 2 Coding questions',
      'Technical Interview (DSA, OOP, SQL, C/Java/JS, Projects)',
      'Managerial Interview (STAR situational questions)',
      'HR Interview (Document verification, relocation, shifts, bonds)'
    ],
    testPattern:
      'TCS NQT on iON platform: Negative marking in cognitive section. 2 coding problems: 1 easy (arrays/strings, 15 min) and 1 medium (greedy/hashing/DP, 30 min). Coding compiler is strict with standard input/output formatting.',
    keyFocusAreas: [
      'OOP 4 pillars and practical real-world analogies',
      'Relational database joins, normalization, and ACID properties',
      'Strong explanation of resume projects (EdTech & ByteFest)',
      'Basic data structures: arrays, linked lists, stacks, binary search',
      'Willingness to relocate to any delivery centre across India'
    ],
    generalGuidance:
      'TCS offers Ninja (3.36 - 3.6 LPA), Digital (7 - 7.5 LPA), and Prime (9 - 11 LPA) cadres based on NQT score and coding performance. Prepare clean code in C++ / Java / Python / JS.'
  },
  {
    company: 'Infosys',
    category: 'IT Services Tier 1',
    rounds: [
      'Online Test: Reasoning Ability, Technical Ability (Pseudocode / Data Structures), Verbal Ability, Numerical Ability, Puzzle Solving',
      'Technical Interview (DSA, Web Fundamentals, DB, Final Year Project)',
      'HR Interview (Communication, Flexibility, Bond agreement)'
    ],
    testPattern:
      'Infosys DSE (Digital Specialist Engineer) and SP (Specialist Programmer) have heavy coding tests (3 programming problems on LeetCode medium/hard topics like Dynamic Programming, Graphs, and Trees). System Engineer role focuses more on pseudocode and reasoning.',
    keyFocusAreas: [
      'Pseudocode tracing (loops, bitwise operations, recursion)',
      'Database querying (subqueries, GROUP BY, indexes)',
      'Web fundamentals (React, Node.js, REST APIs)',
      'Clean verbal communication and structured problem explanation'
    ],
    generalGuidance:
      'Infosys places high value on structured training at the Mysore campus. Emphasize your adaptability, love for coding, and foundational CS coursework.'
  },
  {
    company: 'Wipro',
    category: 'IT Services Tier 1',
    rounds: [
      'Online Assessment (National Talent Hunt): Quantitative, Logical, Verbal, Written Communication (Essay), 2 Coding questions',
      'Technical Interview (Core CS, Programming basics, Project deep dive)',
      'HR Interview'
    ],
    testPattern:
      'AMCAT-based platform. Adaptive test in aptitude. 2 coding questions (one basic math/array, one string manipulation/matrix). Essay writing is evaluated by an AI tool checking grammar, vocabulary, and spelling.',
    keyFocusAreas: [
      'Fundamentals of C, C++, and JavaScript',
      'Array manipulation and string reversal without built-in methods',
      'Clear project explanation without jargon',
      'Grammatically sound English writing in assessments'
    ],
    generalGuidance:
      'Wipro values humble, hard-working engineers. Be ready to explain your 6.06 CGPA with confidence, focusing on your portfolio projects and technical competencies.'
  },
  {
    company: 'Cognizant (CTS)',
    category: 'IT Services Tier 1',
    rounds: [
      'GenC / GenC Next Online Assessment: Aptitude, English, Coding / Advanced Technical MCQs',
      'Technical Interview: Hands-on coding in screen-share, OOP, SQL, Full Stack concepts',
      'HR Interview'
    ],
    testPattern:
      'GenC focuses on communication and foundational coding. GenC Next (6.75 LPA) tests advanced programming (DSA, recursion, trees, stack) and skill-based tracks like Full Stack (React/Node/SQL).',
    keyFocusAreas: [
      'Live code writing: Palindrome, Fibonacci, Anagram, Two Sum during screen share',
      'React Hooks (`useState`, `useEffect`), component lifecycle',
      'REST API design: GET vs POST, status codes, query params',
      'SQL Queries: 2nd highest salary, joins, aggregations'
    ],
    generalGuidance:
      'Your Full Stack (React, Node, PostgreSQL, MongoDB) background gives you a significant advantage for the GenC Next / GenC Elevate full-stack developer tracks.'
  },
  {
    company: 'Accenture',
    category: 'Consulting / Tech',
    rounds: [
      'Stage 1: Cognitive and Technical Assessment (Critical Thinking, English, Coding Logic, Cloud & Security basics)',
      'Stage 2: Coding Assessment (2 questions, 45 min)',
      'Stage 3: Communication Assessment (Automated AI voice test: reading, repetition, storytelling)',
      'Stage 4: Combined Technical + HR Interview'
    ],
    testPattern:
      'Cognitive & Technical is elimination round. Coding assessment occurs on the same day. Communication test tests pronunciation, fluency, and vocabulary using automated voice recognition.',
    keyFocusAreas: [
      'Cloud concepts basics (SaaS, PaaS, IaaS, AWS/Azure fundamentals)',
      'Clean spoken English with steady pace and clear articulation',
      'STAR-format answers for project contributions and challenges',
      'Understanding of modern web stacks and version control with Git'
    ],
    generalGuidance:
      'Accenture hires for ASE (Associate Software Engineer - 4.5 LPA) and FSE (Full Stack Engineer - 6.5 LPA). Highlight your end-to-end full-stack projects.'
  },
  {
    company: 'Capgemini',
    category: 'IT Services Tier 1',
    rounds: [
      'Technical Assessment (Pseudocode & Data Structures MCQs)',
      'English Communication Assessment',
      'Game-Based Aptitude (Grid challenge, Motion challenge, Deductive logic)',
      'Behavioral Profiling',
      'Technical + HR Interview'
    ],
    testPattern:
      'Unique game-based aptitude testing memory, spatial orientation, and reaction time. Pseudocode questions test C/C++ bitwise logic, pointers, and loops.',
    keyFocusAreas: [
      'Pseudocode tracing with bitwise XOR, AND, NOT',
      'Quick mental calculation and memory retention for game assessment',
      'Core Java/C++ fundamentals, OOP, pointers, memory allocation',
      'Positive demeanor and teamwork attitude'
    ],
    generalGuidance:
      'Capgemini does not have negative marking in game aptitude, but accuracy and consistency are tracked. Stay calm and focused throughout the game rounds.'
  },
  {
    company: 'HCL Technologies',
    category: 'IT Services Tier 1',
    rounds: [
      'Online Aptitude & Technical MCQs',
      'Coding Round',
      'Technical Interview',
      'HR Interview'
    ],
    testPattern:
      'Standard MCQs covering Quantitative, Logical, C/C++ basics, Data Structures, and 2 medium coding problems.',
    keyFocusAreas: [
      'Basic sorting algorithms (Bubble, Selection, Insertion, Merge sort mechanics)',
      'Operating Systems (Virtual memory, paging, thrashing)',
      'Computer Networks (OSI layers, TCP/IP, IP addressing)',
      'Honest answers regarding academic background and willingness to learn'
    ],
    generalGuidance:
      'Verify the latest process and syllabus on the official HCL Careers portal before your scheduled drive.'
  },
  {
    company: 'Tech Mahindra',
    category: 'IT Services Tier 1',
    rounds: [
      'Round 1: English Language Test + Quantitative/Reasoning Aptitude',
      'Round 2: Technical Test (Computer Science Fundamentals & Coding)',
      'Round 3: Conversational Assessment',
      'Round 4: Technical & HR Interview'
    ],
    testPattern:
      'Round 1 is qualifying. Conversational assessment tests accent and comprehension. Technical interview tests database knowledge and basic programming.',
    keyFocusAreas: [
      'Database queries and SQL syntax',
      'Core programming in C or Python',
      'Good active listening skills during conversational evaluation',
      'Flexibility regarding business units (Telecom, Enterprise, Cloud)'
    ],
    generalGuidance:
      'Verify requirements and testing format on the official Tech Mahindra portal.'
  },
  {
    company: 'LTIMindtree',
    category: 'IT Services Tier 1',
    rounds: [
      'Online Assessment: Aptitude, Verbal, Coding (2 problems)',
      'Technical Interview: DSA, OOP, Projects, Database design',
      'HR Interview'
    ],
    testPattern:
      'Coding round is strict; test cases include corner cases (empty arrays, large numbers). Technical interview is rigorous regarding project architecture.',
    keyFocusAreas: [
      'System architecture of your college projects',
      'Hands-on coding of two pointers and linked list problems',
      'Database normalization and schema design questions',
      'Agile principles and Git collaboration'
    ],
    generalGuidance:
      'LTIMindtree tests conceptual clarity over rote memorization. Walk through your project architecture step-by-step.'
  },
  {
    company: 'Deloitte',
    category: 'Consulting / Tech',
    rounds: [
      'Online Assessment: Verbal, Analytical, Quantitative, Technical MCQs (or Coding)',
      'Technical Interview: Problem solving, CS fundamentals, System design basics',
      'Managerial + Partner Interview: Case studies, situational ethics, fitment',
      'HR Interview'
    ],
    testPattern:
      'Aptitude tests are rigorous with high cutoffs. Interviews place heavy emphasis on analytical reasoning, business acumen, communication polish, and ethical decision-making.',
    keyFocusAreas: [
      'Structured thinking (frameworks like MECE, PREP)',
      'Explaining complex technical choices to non-technical business clients',
      'Why Deloitte, company values (integrity, inclusion, impact)',
      'Confidence, crisp attire, and professional body language'
    ],
    generalGuidance:
      'Deloitte looks for future consultants who code. Speak with structured clarity and connect technical code to business value.'
  },
  {
    company: 'IBM',
    category: 'Consulting / Tech',
    rounds: [
      'Cognitive Ability Games (Cognify - 5-6 mini games)',
      'Coding Assessment (HackerRank: 2 problems on DSA and algorithms)',
      'Technical Interview (Cloud, OS, Architecture, Algorithms, Projects)',
      'HR / Leadership Interview'
    ],
    testPattern:
      'Cognify games test mental agility and problem-solving without typical math equations. HackerRank test requires optimal time complexity (brute-force solutions will time out).',
    keyFocusAreas: [
      'Cloud fundamentals, Linux command line, Docker containers',
      'Time complexity optimization (O(N log N) vs O(N^2))',
      'RESTful APIs and microservice architecture concepts',
      'IBM core values and continuous open-source contribution'
    ],
    generalGuidance:
      'IBM values engineers with deep curiosity. Show enthusiasm for Linux, cloud native architectures, and modern open-source stacks.'
  }
];

