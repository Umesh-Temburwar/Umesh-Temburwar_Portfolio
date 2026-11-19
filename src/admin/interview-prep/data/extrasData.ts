import { StarStory, DayPlan } from '../types';

export interface SystemDesignTopic {
  id: string;
  title: string;
  tagline: string;
  functionalReqs: string[];
  nonFunctionalReqs: string[];
  capacityEstimation: string;
  architectureComponents: { name: string; role: string }[];
  dataModel: string;
  coreAlgorithmOrFlow: string;
  bottlenecksAndSolutions: string[];
}

export const systemDesignTopics: SystemDesignTopic[] = [
  {
    id: 'sd-url-shortener',
    title: 'Design a URL Shortener (e.g. TinyURL / Bitly)',
    tagline: 'High read-to-write ratio, Base62 encoding, and distributed caching',
    functionalReqs: [
      'Given a long URL, generate a unique short alias (e.g. https://tiny.cc/xyz123)',
      'Given a short alias, redirect user to original long URL via HTTP 301 or 302',
      'Optionally allow users to specify custom short aliases and expiration dates'
    ],
    nonFunctionalReqs: [
      'High availability (99.99%) - redirect service must not fail',
      'Ultra-low redirect latency (sub-10ms redirect speed)',
      'Short URLs should be non-guessable and compact (7 characters)'
    ],
    capacityEstimation:
      'Read-heavy system (100:1 read to write ratio). If 100M URLs created per month, write traffic is ~40 writes/sec, read traffic is ~4,000 reads/sec. Storing 100M URLs * 500 bytes = ~50GB storage per month.',
    architectureComponents: [
      { name: 'DNS & Global Load Balancer', role: 'Distributes traffic across API servers using Round Robin' },
      { name: 'API Web Servers', role: 'Stateless Node/Go services handling URL shortening and redirects' },
      { name: 'Distributed Counter (Redis / ZooKeeper)', role: 'Generates unique monotonically increasing 64-bit integer IDs' },
      { name: 'Redis Cache Cluster', role: 'Caches hot short-to-long URL mappings with LRU eviction' },
      { name: 'Persistent Relational / NoSQL DB', role: 'Stores { shortCode (PK), longUrl, userId, createdAt, expiresAt }' }
    ],
    dataModel:
      'Table: urls (short_code VARCHAR(7) PRIMARY KEY, long_url TEXT, created_at TIMESTAMP, expires_at TIMESTAMP, clicks INT)',
    coreAlgorithmOrFlow:
      'Base62 Encoding: 62 characters [0-9, a-z, A-Z]. A 7-character Base62 string provides 62^7 = ~3.5 Trillion unique combinations. 1) Fetch next unique counter integer from ZooKeeper/Redis range generator. 2) Convert integer to Base62 string. 3) Insert into DB and write-through cache.',
    bottlenecksAndSolutions: [
      'Cache Thundering Herd: If a viral link expires from cache, thousands of simultaneous requests hit the DB. Solution: Use mutex locks on cache misses or pre-warm cache for popular links.',
      'Redirection Status Code: HTTP 301 (Permanent) allows browsers to cache the redirect, reducing server load. HTTP 302 (Temporary) forces every request through the server, which is required if click analytics and tracking are needed.'
    ]
  },
  {
    id: 'sd-chat-app',
    title: 'Design a Real-Time 1-on-1 Chat Application (e.g. WhatsApp / Slack)',
    tagline: 'Bidirectional WebSockets, message delivery acknowledgments, and offline push queues',
    functionalReqs: [
      'Real-time 1-on-1 text messaging between online users',
      'Delivery status receipts: Sent, Delivered, and Read ticks',
      'Store offline messages and deliver when user reconnects'
    ],
    nonFunctionalReqs: [
      'Real-time low latency (< 100ms message delivery)',
      'Zero message loss guarantees',
      'End-to-End Encryption or secure transport'
    ],
    capacityEstimation:
      '50M daily active users sending 40 messages each = 2 Billion messages/day (~23,000 msgs/sec). Average message size 100 bytes = ~200GB storage/day.',
    architectureComponents: [
      { name: 'WebSocket Gateway Servers', role: 'Maintains open, persistent full-duplex TCP/WebSocket connections with online clients' },
      { name: 'Session Registry (Redis)', role: 'Maps user_id -> specific WebSocket server ID where that user is currently connected' },
      { name: 'Message Broker (Kafka / RabbitMQ)', role: 'Buffers messages and routes them to the correct gateway server' },
      { name: 'NoSQL Message Store (Cassandra/MongoDB)', role: 'High write-throughput database optimized for time-series chat logs' },
      { name: 'Push Notification Service (FCM / APNs)', role: 'Delivers notifications when recipient is offline' }
    ],
    dataModel:
      'Cassandra Table: messages (chat_id UUID, message_id TIMEUUID, sender_id UUID, text TEXT, status INT, PRIMARY KEY (chat_id, message_id)) with descending clustering order.',
    coreAlgorithmOrFlow:
      '1) User A sends message over WebSocket to Server 1. 2) Server 1 saves message to DB. 3) Server 1 queries Redis to see where User B is connected. 4) If User B is connected on Server 2, Server 1 forwards via message broker to Server 2, which pushes down to User B. 5) If User B is offline, enqueue to Firebase Cloud Messaging (FCM).',
    bottlenecksAndSolutions: [
      'WebSocket Server Reconnect Storm: If a gateway server crashes, 50,000 connections attempt reconnect simultaneously. Solution: Exponential backoff with random jitter on client reconnect logic.',
      'Message Ordering: Clocks across different devices cannot be trusted. Solution: Use monotonic server-side timestamps or Cassandra TimeUUID for strict chronological ordering.'
    ]
  },
  {
    id: 'sd-inventory-system',
    title: 'Design a Distributed E-Commerce Flash Sale Inventory System',
    tagline: 'High concurrency, race conditions prevention, and Redis distributed locks',
    functionalReqs: [
      'Track stock quantity for products in real time',
      'Allow customers to reserve an item during checkout for 10 minutes',
      'Release reserved stock if checkout is not completed within 10 minutes'
    ],
    nonFunctionalReqs: [
      'Absolute inventory accuracy: NEVER oversell below 0 (Zero overselling)',
      'Extremely high throughput during flash sale events (100k requests/minute)',
      'High consistency over eventual consistency for stock deduction'
    ],
    capacityEstimation:
      'Flash sale with 1,000 units of a smartphone receives 500,000 purchase attempts within the first 60 seconds. Direct database updates would cause deadlocks and server crash.',
    architectureComponents: [
      { name: 'Reverse Proxy & Rate Limiter', role: 'Strips duplicate bot requests and throttles per IP' },
      { name: 'Redis In-Memory Stock Counter', role: 'Performs atomic stock decrements via Lua scripts before hitting database' },
      { name: 'Message Queue (Kafka / SQS)', role: 'Enqueues confirmed orders for asynchronous database persistence' },
      { name: 'Relational DB (PostgreSQL)', role: 'Permanent source of truth for orders and payment settlements' },
      { name: 'Order Expiration Timer (Delayed Queue)', role: 'Restores stock in Redis if payment is not received in 10 minutes' }
    ],
    dataModel:
      'orders (id, user_id, product_id, status: PENDING|PAID|EXPIRED, expires_at); inventory (product_id, available_stock, reserved_stock)',
    coreAlgorithmOrFlow:
      'Redis Lua Script: Executes `local stock = redis.call("get", key); if tonumber(stock) >= qty then redis.call("decrby", key, qty); return 1 else return 0 end;`. Because Redis executes Lua scripts atomically in a single thread, race conditions and overselling are physically impossible.',
    bottlenecksAndSolutions: [
      'Database Row Locking: Running `SELECT ... FOR UPDATE` directly on PostgreSQL row blocks all concurrent threads. Solution: Decouple stock deduction to Redis Lua script; write to DB asynchronously via Kafka queue.',
      'Abandoned Carts: User reserves stock but closes browser. Solution: Redis TTL or delayed message in AWS SQS fires after 10 minutes to verify if order was paid; if not, increments Redis stock back.'
    ]
  }
];

export const starStoriesBank: StarStory[] = [
  {
    id: 'star-1',
    competency: 'Leadership & Project Ownership',
    title: 'Leading the ByteFest 2K25 Web Infrastructure Under Tight Deadlines',
    situation:
      'Our college\'s annual technical fest, ByteFest 2K25, had only three weeks until launch, and the organizing committee was struggling with chaotic paper registrations and conflicting schedule announcements across WhatsApp groups.',
    task:
      'As the lead web developer, I volunteered to build a centralized, responsive web portal that would host the complete event catalog, coordinate multi-member team registrations, and handle high-volume attendee traffic.',
    action:
      'I scoped the project into three 1-week sprints using GitHub issues: Week 1 for UI/UX and mobile-first event cards; Week 2 for registration forms, Supabase database triggers, and Google Sheets sync; Week 3 for load-testing, image compression, and Vercel edge deployment. I coordinated daily 10-minute check-ins with faculty coordinators to verify competition guidelines.',
    result:
      'The portal launched four days ahead of schedule, operated with 99.9% uptime, handled 2,000+ daily visitors, and successfully registered 1,538 participants without a single data loss incident.',
    takeaway:
      'Proactive scoping, continuous stakeholder alignment, and choosing reliable edge infrastructure prevent last-minute development crises.'
  },
  {
    id: 'star-2',
    competency: 'Overcoming Technical Obstacles & Debugging',
    title: 'Eliminating Memory Leaks in Large CSV Inventory Exports',
    situation:
      'While building the Automobile Spare Parts Inventory system, testing export on a large dataset of 15,000 spare parts caused Node.js to trigger `JavaScript heap out of memory` and crash the server.',
    task:
      'I needed to re-engineer the export pipeline so that store managers could export any inventory size without crashing the backend or consuming excessive RAM.',
    action:
      'I analyzed the heap dump using Chrome DevTools memory profiler and discovered that `Part.find().lean()` was loading the entire collection into a single in-memory array. I replaced the query with Mongoose Cursor streaming (`Part.find().cursor()`) and piped it into a Node.js `json2csv` transform stream directly into the HTTP response object `res`.',
    result:
      'RAM consumption dropped from over 850MB (causing process termination) to a stable, flat 15MB, allowing unlimited rows to be streamed smoothly in chunks.',
    takeaway:
      'Understanding stream mechanics and Node.js event-driven I/O is critical for building scalable, memory-safe backend systems.'
  },
  {
    id: 'star-3',
    competency: 'Fast Learning & Adaptability',
    title: 'Mastering Supabase Row-Level Security in 48 Hours',
    situation:
      'During the development of the EdTech Learning Platform, I realized that allowing client-side queries directly to the database risked unauthorized data leaks if malicious users modified query payloads in DevTools.',
    task:
      'I had to quickly learn and implement PostgreSQL Row-Level Security (RLS) policies to enforce multi-tenant authorization directly at the database engine level.',
    action:
      'I spent a weekend studying PostgreSQL RLS documentation, security best practices, and Supabase JWT claims integration. I wrote SQL policies for each table ensuring students could only read courses they had enrolled in, and instructors could only modify courses matching their authenticated UUID (`auth.uid()`). I tested edge cases using SQL mock queries and Postman.',
    result:
      'Successfully implemented robust database-level security with zero client leaks, keeping the client code lean and eliminating redundant authorization checks on read endpoints.',
    takeaway:
      'I can rapidly absorb unfamiliar technologies, dive deep into official documentation, and deliver production-ready implementations under time constraints.'
  },
  {
    id: 'star-4',
    competency: 'Team Collaboration & Constructive Disagreement',
    title: 'Resolving Database Architecture Disagreement for Automobile Inventory',
    situation:
      'During initial planning for our inventory system, my teammate strongly insisted on using MySQL, whereas I believed MongoDB was a superior fit for polymorphic spare part specifications.',
    task:
      'We needed to reach an aligned technical decision quickly without causing interpersonal friction or delaying project kickoff.',
    action:
      'Instead of arguing subjective opinions, I proposed building a 1-day proof of concept comparing both options against our core access patterns. We modeled 50 realistic automotive parts (brakes, spark plugs, filters, engine gaskets) in both MySQL and MongoDB. We observed that MySQL required 6 join tables with dozens of null columns to handle differing specs, whereas MongoDB handled them cleanly in flexible BSON documents with compound text search.',
    result:
      'Seeing the concrete benchmark, my teammate enthusiastically agreed to use MongoDB. We completed the project ahead of schedule and maintained an excellent working relationship.',
    takeaway:
      'Data-driven prototypes and objective requirements matrices resolve technical conflicts much more effectively than theoretical arguments.'
  },
  {
    id: 'star-5',
    competency: 'Handling Pressure & Live Production Incident',
    title: 'Fixing Registration Bottleneck During ByteFest Promotional Peak',
    situation:
      'On the final day before ByteFest 2K25 early-bird registrations closed, campus traffic surged to 200+ concurrent users, and our Google Sheets webhook began rate-limiting and dropping incoming student registration data.',
    task:
      'I had to immediately diagnose the bottleneck, preserve incoming registrations, and ensure no student lost their spot.',
    action:
      'I immediately inspected the server logs and identified that the synchronous HTTP calls to Google Sheets API were exceeding Google\'s 60 req/min quota and hanging the registration endpoint. Within 20 minutes, I decoupled the pipeline: registrations were written directly to Supabase PostgreSQL first with an immediate 200 OK response to the student, and an asynchronous background worker synced new records in batches to Google Sheets every 60 seconds.',
    result:
      'Zero registrations were dropped, latency dropped from 3.2s to 120ms, and all 1,538 participants registered smoothly.',
    takeaway:
      'Decoupling external third-party API dependencies via asynchronous background queues prevents cascading failures in production.'
  },
  {
    id: 'star-6',
    competency: 'Continuous Self-Improvement & Academic Resilience',
    title: 'Overcoming Average CGPA Through Practical Engineering Excellence',
    situation:
      'Entering my third year with a 6.06 CGPA, I recognized that textbook-focused evaluations did not fully showcase my engineering potential, and that campus recruitment would demand strong technical proof.',
    task:
      'I needed to transform my profile by mastering high-demand software engineering stacks and building tangible, production-grade applications that spoke for themselves.',
    action:
      'I instituted a disciplined personal coding routine: studying data structures and algorithms every morning, building full-stack applications with React, Node.js, and databases every afternoon, and publishing all code transparently to GitHub. I actively participated in college tech fests and took sole ownership of deploying the official ByteFest portal.',
    result:
      'Engineered three complete web platforms, accumulated deep hands-on expertise across 7 modern technologies, and built a verifiable GitHub portfolio that demonstrates my ability to deliver real software value.',
    takeaway:
      'Consistency, self-awareness, and relentless practical execution will always overcome past academic setbacks.'
  }
];

export const communicationFrameworks = {
  prepFramework: {
    title: 'PREP Framework for Clear Technical Explanations',
    steps: [
      { step: 'P - Point', desc: 'State your main point or conclusion directly in the very first sentence.' },
      { step: 'R - Reason', desc: 'Provide the technical why or engineering reasoning behind your point.' },
      { step: 'E - Example', desc: 'Give a concrete code snippet, real-world scenario, or project experience illustrating it.' },
      { step: 'P - Point (Reiterate)', desc: 'Conclude by reiterating how this benefits the system or user.' }
    ],
    example:
      'Example: "Should we use Redis?"\n• Point: Yes, we should use Redis as an in-memory cache for our course catalog.\n• Reason: Because the catalog is read hundreds of times per minute while courses are updated rarely, making frequent DB queries wasteful.\n• Example: In my EdTech project, caching course details reduced response time from 380ms to 22ms.\n• Point: Therefore, Redis improves user responsiveness and protects our database from high read traffic.'
  },
  howToSayIDontKnow: {
    title: 'How to Confidently Say "I Don\'t Know" Without Hurting Your Impression',
    dos: [
      'Be honest immediately: never pretend or guess wild answers.',
      'Explain what you DO know about related concepts.',
      'Walk through how you would reason about or investigate the solution.',
      'Show curiosity and willingness to learn.'
    ],
    scriptTemplate:
      '"I haven\'t worked with that specific concept/tool yet, so I don\'t want to give you an inaccurate answer. However, based on my understanding of [related technology, e.g. Node.js streams / PostgreSQL indexing], my initial intuition would be [your logical reasoning]. If faced with this in production, I would verify the official documentation and test it with a quick proof of concept. I would love to learn more about how your team approaches this!"'
  }
};

export const thirtyDaysPlan: DayPlan[] = [
  {
    day: 1,
    title: 'JavaScript Core Foundations',
    theme: 'Languages',
    tasks: ['Execution Context & Call Stack', 'var vs let vs const & Temporal Dead Zone', 'Closures & lexical scope with 3 code examples', 'Practice: Two Sum & Valid Anagram on LeetCode']
  },
  {
    day: 2,
    title: 'JavaScript Asynchronous Architecture',
    theme: 'Languages',
    tasks: ['Event Loop: Call stack, Microtasks vs Macrotasks', 'Promises mechanics & async/await error handling', 'Promise.all vs Promise.allSettled vs Promise.race', 'Practice: Best Time to Buy/Sell Stock & Valid Palindrome']
  },
  {
    day: 3,
    title: 'JavaScript Advanced & TypeScript Basics',
    theme: 'Languages',
    tasks: ['The `this` keyword & call/apply/bind', 'Prototypal Inheritance & `__proto__` vs `prototype`', 'TypeScript: Interface vs Type Alias & Generics', 'Practice: Maximum Subarray (Kadane\'s Algorithm)']
  },
  {
    day: 4,
    title: 'React.js Core & Virtual DOM',
    theme: 'Frontend',
    tasks: ['Virtual DOM & React Fiber reconciliation heuristics', 'Component Lifecycle & Functional Components', 'Rules of Hooks & internal singly linked list representation', 'Practice: Reverse Linked List & Merge Two Sorted Lists']
  },
  {
    day: 5,
    title: 'React Hooks Deep Dive & Performance',
    theme: 'Frontend',
    tasks: ['useEffect pitfalls & stale closure resolution', 'useMemo vs useCallback vs React.memo', 'Context API vs Redux Toolkit trade-offs', 'Practice: Valid Parentheses using Stack']
  },
  {
    day: 6,
    title: 'Next.js & Modern CSS/Tailwind',
    theme: 'Frontend',
    tasks: ['SSR vs SSG vs ISR architecture', 'Next.js App Router & Server vs Client Components', 'CSS Box Model, Flexbox vs CSS Grid', 'Practice: Binary Search & Search in Rotated Sorted Array']
  },
  {
    day: 7,
    title: 'Weekly Revision 1 & Mock Coding Test',
    theme: 'Revision',
    tasks: ['Solve 5 DSA problems in timed 60 minutes', 'Revise all bookmarked questions from Days 1-6', 'Perform 1 Mock Interview session in Hub']
  },
  {
    day: 8,
    title: 'Node.js Internals & Libuv',
    theme: 'Backend',
    tasks: ['Node.js Architecture: V8 engine & Libuv thread pool', 'Event Loop phases (Timers, Poll, Check)', 'Streams & Buffers (Readable, Writable, Pipe, Backpressure)', 'Practice: Maximum Depth of Binary Tree & Invert Tree']
  },
  {
    day: 9,
    title: 'Express.js & REST API Architecture',
    theme: 'Backend',
    tasks: ['Middleware pipeline `(req, res, next)` & 4-arg error handlers', 'HTTP status codes & Idempotency rules', 'Offset vs Cursor-based pagination', 'Practice: Level Order Traversal (BFS)']
  },
  {
    day: 10,
    title: 'Authentication & Security Best Practices',
    theme: 'Auth & Security',
    tasks: ['JWT Structure (Header.Payload.Signature)', 'Access Token vs Refresh Token rotation & HTTP-only cookies', 'OWASP Top 10 basics: XSS, CSRF, SQL Injection defenses', 'Practice: Longest Substring Without Repeating Characters']
  },
  {
    day: 11,
    title: 'Relational DBMS & SQL Mastery',
    theme: 'Databases',
    tasks: ['ACID Properties with banking transaction examples', 'SQL Joins (INNER, LEFT, RIGHT, FULL OUTER)', 'Normalization (1NF to 3NF) & Transitive dependencies', 'Practice: 3Sum using Two Pointers']
  },
  {
    day: 12,
    title: 'PostgreSQL Deep Dive & Indexing',
    theme: 'Databases',
    tasks: ['B-Tree Index mechanics & EXPLAIN ANALYZE', 'Sequential Scan vs Index Scan', 'Window Functions (`ROW_NUMBER()`, `RANK()`, `PARTITION BY`)', 'Practice: Product of Array Except Self']
  },
  {
    day: 13,
    title: 'NoSQL & MongoDB Architecture',
    theme: 'Databases',
    tasks: ['Embedding vs Referencing schema design (16MB BSON limit)', 'MongoDB Aggregation Pipeline (`$match`, `$group`, `$lookup`)', 'Atomic updates via `$inc` and compound text indexes', 'Practice: Climbing Stairs & Trapping Rain Water basics']
  },
  {
    day: 14,
    title: 'Weekly Revision 2 & Full Stack Check',
    theme: 'Revision',
    tasks: ['Review all database & backend notes in Hub', 'Write sample SQL queries for 2nd highest salary & joins', 'Perform 1 Mock Interview session in Hub']
  },
  {
    day: 15,
    title: 'Core CS: OOP & SOLID Principles',
    theme: 'CS Fundamentals',
    tasks: ['4 Pillars of OOP (Encapsulation, Abstraction, Inheritance, Polymorphism)', 'SOLID Principles with practical code refactoring examples', 'Abstract classes vs Interfaces', 'Practice: Group Anagrams with Hash Map']
  },
  {
    day: 16,
    title: 'Core CS: Operating Systems',
    theme: 'CS Fundamentals',
    tasks: ['Process vs Thread & Context Switching', '4 Coffman conditions for Deadlock', 'Virtual Memory, Paging, and Thrashing', 'Practice: Kth Largest Element using Min-Heap / Quickselect']
  },
  {
    day: 17,
    title: 'Core CS: Computer Networks',
    theme: 'CS Fundamentals',
    tasks: ['"What happens when you type a URL into a browser?"', 'TCP 3-Way Handshake & 4-Way Teardown', 'DNS Resolution hierarchy & TLS Handshake', 'Practice: Merge Intervals']
  },
  {
    day: 18,
    title: 'Project 1 Deep Dive: EdTech Learning Platform',
    theme: 'Projects',
    tasks: ['Rehearse 30-sec pitch and 2-min technical explanation', 'Walk through PostgreSQL RLS policies & trigger functions', 'Review all 20+ cross-questions in Project Deep Dive', 'Memorize how you defended quiz timer race conditions']
  },
  {
    day: 19,
    title: 'Project 2 Deep Dive: Automobile Spare Parts Inventory',
    theme: 'Projects',
    tasks: ['Rehearse 30-sec pitch & 2-min explanation', 'Explain MongoDB polymorphic schema vs MySQL', 'Explain CSV cursor streaming memory optimization', 'Review all 20+ cross-questions in Project Deep Dive']
  },
  {
    day: 20,
    title: 'Project 3 Deep Dive: ByteFest 2K25 Portal',
    theme: 'Projects',
    tasks: ['Rehearse 30-sec pitch & 2-min explanation', 'Review Honest Numbers defense (2,000+ daily visitors, 1,538 attendees)', 'Explain Vercel Edge CDN caching & asset optimization', 'Review all 20+ cross-questions in Project Deep Dive']
  },
  {
    day: 21,
    title: 'Weekly Revision 3 & Project Cross-Interview',
    theme: 'Revision',
    tasks: ['Record yourself delivering 2-min project pitches', 'Verify all live demo links & GitHub repos', 'Check for clean code commits and README badges']
  },
  {
    day: 22,
    title: 'Online Assessment: Quantitative Aptitude',
    theme: 'Aptitude OA',
    tasks: ['Time, Speed & Distance (trains & platforms)', 'Time & Work (efficiency LCM method)', 'Percentages, Profit & Loss, Simple & Compound Interest', 'Solve 15 quantitative problems in Aptitude section']
  },
  {
    day: 23,
    title: 'Online Assessment: Logical & Verbal Reasoning',
    theme: 'Aptitude OA',
    tasks: ['Number & Letter series, Blood relations, Direction sense', 'Syllogisms & Odd-man-out', 'Verbal: Subject-verb agreement, prepositions, idioms', 'Solve 15 logical and verbal questions in Aptitude section']
  },
  {
    day: 24,
    title: 'System Design Basics for Freshers',
    theme: 'System Design',
    tasks: ['URL Shortener architecture (Base62, hashing, Redis caching)', '1-on-1 Chat app (WebSockets, message queues, offline sync)', 'Flash sale inventory counter (Redis Lua script atomic decrements)']
  },
  {
    day: 25,
    title: 'Managerial Round & Behavioral STAR Stories',
    theme: 'Behavioral',
    tasks: ['Rehearse 6 STAR stories from Story Bank', 'Practice "Tell me about a time you handled high pressure"', 'Practice "Describe a disagreement with a teammate and resolution"']
  },
  {
    day: 26,
    title: 'Resume-Specific Defense & CGPA Explanation',
    theme: 'HR & Resume',
    tasks: ['Master the 6.06 CGPA defense script without hesitation', 'Rehearse 60-second and 2-minute "Tell me about yourself"', 'Review Resume Line-by-Line Checklist']
  },
  {
    day: 27,
    title: 'HR Round Polishing & Reverse Questions',
    theme: 'HR & Strategy',
    tasks: ['Prepare answers for "Why this company?", relocation, and shifts', 'Prepare salary expectation script for freshers', 'Select 3 thoughtful questions to ask the interviewer']
  },
  {
    day: 28,
    title: 'Company Notes Review: MNC Hiring Patterns',
    theme: 'Company Prep',
    tasks: ['Review hiring process for TCS, Infosys, Wipro, Cognizant, Accenture, Deloitte', 'Check specific test patterns and typical rounds', 'Note down key interview focus areas per company']
  },
  {
    day: 29,
    title: 'Full Simulation Day: Mock Interview & Speed Tests',
    theme: 'Simulation',
    tasks: ['Complete 5 back-to-back timed Mock Interviews in Hub', 'Test print/export of bookmarked revision notes to PDF', 'Review all starred items in Revise Later list']
  },
  {
    day: 30,
    title: 'Final Day Preparation & Mindset Readiness',
    theme: 'Final Readiness',
    tasks: ['Complete the Final-Day Document & System Checklist', 'Rest well, hydrate, and maintain calm positive focus']
  }
];

export const finalDayChecklist = [
  { id: 'chk-1', text: 'Printed 3 crisp physical copies of updated resume on clean white A4 paper.' },
  { id: 'chk-2', text: 'College ID card, Government photo ID (Aadhaar / PAN / Passport), and original mark sheets organized in a clean folder.' },
  { id: 'chk-3', text: 'GitHub profile cleanup: all project README files have live demo links, architecture badges, and clean commit history.' },
  { id: 'chk-4', text: 'LinkedIn profile headline and summary updated to match resume role ("Full Stack Developer | React.js, Node.js, TypeScript").' },
  { id: 'chk-5', text: 'Formal interview attire ironed and ready (clean light formal shirt, dark trousers, formal shoes).' },
  { id: 'chk-6', text: 'Virtual setup verified: stable internet connection, clean quiet room, neutral background, webcam and microphone tested.' },
  { id: 'chk-7', text: 'Laptop fully charged, charger handy, and clean desktop with all unnecessary browser tabs closed.' },
  { id: 'chk-8', text: 'Rehearsed 2-minute self-introduction and 6.06 CGPA defense script aloud in front of a mirror.' },
  { id: 'chk-9', text: 'Notepad and working pen kept beside laptop for rough calculations during DSA / aptitude rounds.' },
  { id: 'chk-10', text: 'Good night\'s sleep (7-8 hours) to ensure sharp mental alertness and calm confidence.' }
];

