export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'Basic' | 'Medium' | 'Hard';
  answer: string;
  codeSnippet?: string;
  interviewTip?: string;
}

export interface InterviewRound {
  id: string;
  roundName: string;
  roundNumber: number;
  duration: string;
  focusArea: string;
  badge: string;
  overview: string;
  keyStrategies: string[];
  questions: InterviewQuestion[];
}

export const interviewRoundsData: InterviewRound[] = [
  {
    id: 'round-1-fundamentals',
    roundName: 'Round 1: Core CS Fundamentals & Online Assessment',
    roundNumber: 1,
    duration: '45 - 60 Minutes',
    focusArea: 'Data Structures, Algorithms, OOPs, DBMS, OS & Computer Networks',
    badge: 'Core Computer Science',
    overview: 'The initial filter round testing foundational computer science principles taught in B.Tech CSE: algorithmic problem-solving, memory organization, relational database theory, and networking protocols.',
    keyStrategies: [
      'Always clarify constraints and edge cases (e.g. empty inputs, negative numbers, memory bounds) before jumping to code.',
      'State your brute-force approach first (Time & Space complexity), then optimize systematically to O(N) or O(N log N).',
      'Speak your thought process out loud: interviewers grade problem-solving clarity as much as the final code syntax.'
    ],
    questions: [
      {
        id: 'r1-q1',
        category: 'Data Structures & Algorithms',
        difficulty: 'Medium',
        question: 'What is the Two Pointers technique and when should you use it over a nested loop?',
        answer: 'Two Pointers is an algorithmic pattern where two reference indices iterate across a sequential data structure (array or string) simultaneously. Typically used on SORTED arrays (e.g. 2-Sum sorted, container with most water, trapping rainwater) or linked lists (slow and fast runner for cycle detection). It reduces time complexity from O(N^2) brute force to O(N) linear time with O(1) auxiliary space.',
        codeSnippet: `// 2-Sum in Sorted Array O(N) time O(1) space
function twoSumSorted(arr: number[], target: number): [number, number] | null {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return null;
}`,
        interviewTip: 'Mention that if the array is unsorted, a Hash Map achieves O(N) time at the expense of O(N) space, demonstrating trade-off awareness.'
      },
      {
        id: 'r1-q2',
        category: 'Object-Oriented Programming (OOP)',
        difficulty: 'Medium',
        question: 'Explain the 4 Pillars of OOP and give a real-world software engineering example of each.',
        answer: '1. Encapsulation: Bundling data and methods into a single unit while restricting direct access to internal state via private fields and getters/setters (e.g. BankAccount balance only modified via deposit/withdraw methods).\\n2. Abstraction: Hiding internal complexity and showing only essential features via interfaces or abstract classes (e.g. calling `database.connect()` without knowing underlying socket connection logic).\\n3. Inheritance: Mechanism where a child class inherits properties and behaviors from a parent class to promote code reuse (e.g. `ElectricCar` extends `Vehicle`).\\n4. Polymorphism: Ability for a message or method to be processed in different ways. Compile-time (Method Overloading) vs Runtime (Method Overriding via virtual functions).',
        interviewTip: 'Follow up by mentioning the SOLID principles, especially the Single Responsibility and Dependency Inversion principles.'
      },
      {
        id: 'r1-q3',
        category: 'Database Management Systems (DBMS)',
        difficulty: 'Hard',
        question: 'What are ACID properties and what are the 4 standard SQL Transaction Isolation Levels?',
        answer: 'ACID guarantees database reliability:\\n- Atomicity: All operations in a transaction succeed, or the entire transaction rolls back.\\n- Consistency: Transactions transition the database from one valid state to another, respecting all constraints.\\n- Isolation: Concurrent transactions execute without interfering with one another.\\n- Durability: Once committed, changes persist permanently even during a power outage or system crash (via Write-Ahead Logging WAL).\\n\\n4 SQL Isolation Levels (from lowest to highest):\\n1. Read Uncommitted: Allows Dirty Reads (reading uncommitted data from another transaction).\\n2. Read Committed (Postgres default): Prevents Dirty Reads; permits Non-Repeatable Reads.\\n3. Repeatable Read: Guarantees reading the same row twice yields the same values; permits Phantom Reads (new rows inserted by concurrent transactions).\\n4. Serializable: Total isolation, transactions appear to run sequentially. Protects against all anomalies at the cost of concurrency throughput.',
        interviewTip: 'Explain that higher isolation levels reduce concurrency and increase lock contention or serialization failures.'
      },
      {
        id: 'r1-q4',
        category: 'Operating Systems',
        difficulty: 'Medium',
        question: 'What is the fundamental difference between a Process and a Thread?',
        answer: 'A Process is an executing instance of a computer program with its own independent, isolated memory space (Text, Data, Heap, Stack). Context switching between processes is relatively expensive as it involves updating page tables and flushing TLB (Translation Lookaside Buffer).\\nA Thread is a lightweight execution unit inside a process. Multiple threads within the same process share the same code segment, data segment, heap, and open OS file descriptors, but each thread has its own private Stack and Program Counter. Context switching between threads within the same process is significantly faster.',
        interviewTip: 'Tie this to Node.js: Node.js is a single process running JavaScript on one main thread, but uses Libuv worker threads for asynchronous I/O.'
      },
      {
        id: 'r1-q5',
        category: 'Computer Networks',
        difficulty: 'Medium',
        question: 'What happens step-by-step from the moment you type https://google.com into your browser until the page renders?',
        answer: '1. DNS Resolution: Browser checks local browser cache -> OS cache -> hosts file -> Router cache -> Recursive DNS resolver -> Root/TLD nameservers to resolve domain name to an IP address.\\n2. TCP Handshake: 3-way handshake (SYN -> SYN-ACK -> ACK) establishes reliable transport layer connection on port 443.\\n3. TLS Handshake: ClientHello -> ServerHello (with SSL Certificate & public key) -> Key Exchange (Diffie-Hellman) -> Encrypted session keys established for HTTPS.\\n4. HTTP Request: Browser sends `GET / HTTP/1.1` with headers (User-Agent, Accept).\\n5. Server Processing: Web server/load balancer routes request, application processes response, and returns HTTP 200 OK with HTML payload.\\n6. Browser Rendering: HTML parser builds DOM tree -> CSS parser builds CSSOM tree -> Combined into Render Tree -> Layout/Reflow calculates geometry -> Paint converts pixels -> Compositing layers render on GPU screen.',
        interviewTip: 'Mentioning the Critical Rendering Path (DOM + CSSOM = Render Tree) proves you have full-stack depth.'
      }
    ]
  },
  {
    id: 'round-2-frontend',
    roundName: 'Round 2: Technical Deep Dive (Frontend, JS/TS & React)',
    roundNumber: 2,
    duration: '60 Minutes',
    focusArea: 'JavaScript Core, TypeScript, React.js Hooks, Next.js, Web Performance',
    badge: 'Frontend Engineering',
    overview: 'Comprehensive technical interview evaluating deep JavaScript knowledge (closures, asynchronous execution, prototype chains), React component lifecycle, custom hooks, reconciliation algorithm, and modern Next.js rendering architectures.',
    keyStrategies: [
      'When explaining React hooks, emphasize render triggers, dependency array immutability, and memory closures.',
      'Show that you understand how browser rendering works (Reflow vs Repaint, Virtual DOM vs Real DOM).',
      'Write clean, modern ES6+ TypeScript code with explicit types.'
    ],
    questions: [
      {
        id: 'r2-q1',
        category: 'JavaScript Internals',
        difficulty: 'Hard',
        question: 'What will be the output of this code snippet and why? How do you fix it using ES6 vs ES5?',
        answer: 'Output: Prints `3` three times with a 1-second delay between each. Reason: `var` is function-scoped (or global), not block-scoped. By the time the `setTimeout` callback executes from the task queue 1 second later, the synchronous for-loop has already completed and the shared variable `i` equals 3.\\n\\nFix 1 (ES6): Replace `var` with `let`. `let` creates a new lexical binding for each loop iteration.\\nFix 2 (ES5): Wrap `setTimeout` in an IIFE (Immediately Invoked Function Expression) to capture `i` by value in a separate closure.',
        codeSnippet: `// Tricky Question Snippet:
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}

// Fix 1 (ES6 - Block Scope):
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000); // 0, 1, 2
}

// Fix 2 (ES5 - IIFE Closure):
for (var i = 0; i < 3; i++) {
  (function(capturedIndex) {
    setTimeout(() => console.log(capturedIndex), 1000);
  })(i);
}`,
        interviewTip: 'Explain the difference between lexical environment bindings in `let` vs hoistable function-scoped `var`.'
      },
      {
        id: 'r2-q2',
        category: 'React.js Hooks',
        difficulty: 'Medium',
        question: 'When should you use useMemo and useCallback, and what is the cost of overusing them?',
        answer: '`useMemo` caches the calculated result of an expensive computation between renders. `useCallback` caches a function definition reference between renders.\\n\\nWhen to use:\\n1. Passing callback functions to optimized child components wrapped in `React.memo` (prevents breaking shallow equality props comparison).\\n2. Heavy computations (e.g. filtering or sorting a list of 10,000+ items).\\n3. Supplying dependencies to other hooks (`useEffect`, `useMemo`).\\n\\nCost of overuse: Every call to `useMemo`/`useCallback` allocates an array for dependencies and performs shallow equality checks on every render. If the computation is trivial (e.g. string concatenation or adding 2 numbers), the hook overhead costs more memory and CPU cycles than simply re-creating the function or recalculating.',
        interviewTip: 'Emphasize: "Premature optimization is the root of all evil. Profile first using React DevTools Profiler before wrapping everything in useMemo."'
      },
      {
        id: 'r2-q3',
        category: 'React.js Core',
        difficulty: 'Hard',
        question: 'How does React Reconciliation work and what is React Fiber?',
        answer: 'Reconciliation is React algorithm for comparing two Virtual DOM trees and determining the minimal set of mutations required to update the Real DOM.\\nIn React 15 (Stack Reconciler), reconciliation was recursive and synchronous; once started, it could not be paused, causing dropped animation frames on large component trees.\\nIn React 16+, React introduced Fiber: a linked-list data structure representing component tree nodes. Each "fiber" represents a unit of work. Fiber allows React to:\\n1. Pause work and return to it later.\\n2. Assign priority to different types of updates (e.g. user input typing > offscreen data fetching).\\n3. Reuse previously completed work or abort work if an update becomes stale.\\nThis enables Concurrent Mode, `useTransition`, and Suspense in React 18.',
        interviewTip: 'Mentioning the two phases (Render Phase: interruptible/pure, and Commit Phase: synchronous DOM mutation) guarantees top marks.'
      },
      {
        id: 'r2-q4',
        category: 'TypeScript',
        difficulty: 'Medium',
        question: 'What is Type Narrowing in TypeScript and how do Discriminated Unions work?',
        answer: 'Type Narrowing is the process where TypeScript refines a broader type (like `string | number` or `unknown`) into a more specific type within conditional branches using guards like `typeof`, `instanceof`, or `in`.\\n\\nA Discriminated Union (or Tagged Union) is an advanced pattern where multiple object types share a common literal property (the "discriminant"), allowing TypeScript to safely infer exact types in a `switch` or `if/else` block with 100% type safety and exhaustive checking.',
        codeSnippet: `type NetworkState =
  | { state: 'loading' }
  | { state: 'failed'; code: number; message: string }
  | { state: 'success'; response: { title: string; duration: number } };

function handleState(state: NetworkState) {
  switch (state.state) {
    case 'loading':
      return 'Spinner...';
    case 'failed':
      return \`Error: \${state.message}\`; // TS knows code & message exist!
    case 'success':
      return \`Course: \${state.response.title}\`; // TS knows response exists!
  }
}`,
        interviewTip: 'Highlight how discriminated unions eliminate runtime undefined errors in API response handling.'
      },
      {
        id: 'r2-q5',
        category: 'Next.js & Performance',
        difficulty: 'Hard',
        question: 'Explain Core Web Vitals (LCP, INP, CLS) and how you optimize them in React/Next.js.',
        answer: 'Core Web Vitals are Google official metrics measuring real-world user experience:\\n1. LCP (Largest Contentful Paint) - Measures loading speed; time until largest image or text block renders (< 2.5s is Good). Optimization: use Next.js `<Image priority>`, preconnect to critical domains, use CDN, implement SSR/SSG.\\n2. INP (Interaction to Next Paint - replaced FID in 2024) - Measures responsiveness to user clicks/keys (< 200ms is Good). Optimization: avoid blocking main thread, break long tasks via `requestIdleCallback`, use `useTransition` for non-urgent state updates.\\n3. CLS (Cumulative Layout Shift) - Measures visual stability against unexpected jumps (< 0.1 is Good). Optimization: always set explicit `width` and `height` on images/videos, avoid inserting dynamic banners above existing content, use font-display: optional or CSS size-adjust.',
        interviewTip: 'Mentioning that INP replaced FID shows your knowledge is current for 2025/2026 standards.'
      }
    ]
  },
  {
    id: 'round-3-backend',
    roundName: 'Round 3: Technical Deep Dive (Backend, Node.js, System Design & DB)',
    roundNumber: 3,
    duration: '60 - 75 Minutes',
    focusArea: 'Node.js, Express, REST APIs, PostgreSQL, MongoDB, Caching, System Design',
    badge: 'Backend & Distributed Systems',
    overview: 'Deep architectural examination covering asynchronous backend runtimes, database indexing, API security, concurrency controls, scalability, and high-level system design.',
    keyStrategies: [
      'Structure system design answers systematically: 1. Functional Requirements -> 2. Non-Functional Requirements (Scalability, Availability, Latency) -> 3. High-Level Diagram -> 4. Database Schema -> 5. Deep-Dive on Bottlenecks.',
      'Always consider failure modes: "What happens if the database goes down?", "How do we handle duplicate requests?", "How do we cache safely?".'
    ],
    questions: [
      {
        id: 'r3-q1',
        category: 'Node.js Internals',
        difficulty: 'Hard',
        question: 'Explain the 6 Phases of the Node.js Event Loop in exact order.',
        answer: 'Each tick of the Node.js event loop executes through 6 distinct phases managed by Libuv:\\n1. Timers Phase: Executes callbacks scheduled by `setTimeout()` and `setInterval()` whose threshold has expired.\\n2. Pending Callbacks Phase: Executes I/O callbacks deferred to the next loop iteration (e.g. certain system errors like TCP ECONNREFUSED).\\n3. Idle, Prepare Phase: Internal callbacks used only by Node.js runtime.\\n4. Poll Phase: Retrieves new I/O events; executes I/O-related callbacks (almost all code except timers, setImmediate, and close callbacks). If the queue is empty, Node blocks and waits for incoming connections unless a `setImmediate` is scheduled.\\n5. Check Phase: Executes `setImmediate()` callbacks immediately after Poll phase finishes.\\n6. Close Callbacks Phase: Executes close events (e.g. `socket.on("close", ...)`).\\n* Note: Microtasks (`process.nextTick` and `Promise.then`) run immediately between each phase transition.',
        interviewTip: 'Highlight that `process.nextTick` executes before Promise microtasks, which execute before the next event loop phase.'
      },
      {
        id: 'r3-q2',
        category: 'Database Concurrency',
        difficulty: 'Hard',
        question: 'How do you handle the Double-Spending / Concurrent Checkout race condition in an inventory or booking system?',
        answer: 'When two users attempt to purchase the last available stock item simultaneously, a race condition occurs if the application reads stock first and then updates.\\n\\nSolutions:\\n1. Atomic Conditional Updates (Recommended for single DB instances): In MongoDB: `db.products.updateOne({ _id: id, stock: { $gte: qty } }, { $inc: { stock: -qty } })`. In SQL: `UPDATE products SET stock = stock - qty WHERE id = id AND stock >= qty;`. If affected rows = 0, stock was exhausted.\\n2. Pessimistic Locking: In PostgreSQL: `SELECT * FROM products WHERE id = 1 FOR UPDATE;`. Locks the row exclusively until the transaction commits, blocking concurrent transactions.\\n3. Optimistic Locking: Add a `version` column. `UPDATE products SET stock = stock - 1, version = version + 1 WHERE id = 1 AND version = current_version;`. If version mismatch, retry or abort.\\n4. Distributed Locks: Use Redis Redlock with TTL for multi-service microservices architectures.',
        interviewTip: 'Directly reference your Automobile Inventory Management project where you implemented atomic `$inc` updates with conditional guards.'
      },
      {
        id: 'r3-q3',
        category: 'System Design',
        difficulty: 'Hard',
        question: 'Design a High-Concurrency Course Enrollment & Quiz Platform (like your EdTech project) handling 100,000 active students.',
        answer: 'High-Level Architecture Blueprint:\\n1. CDN & Edge Layer: Cloudflare caches all static video thumbnails, course syllabus markdown, and JS/CSS bundles. SSL termination at edge.\\n2. Load Balancer & API Gateway: Nginx or AWS ALB distributing requests to auto-scaling Node.js/Express container instances in Docker/Kubernetes.\\n3. Caching Layer (Redis): Cache hot course metadata and user enrollment tokens in Redis with TTL. Cache hit ratio targets > 85%, shielding the primary database.\\n4. Database Layer (PostgreSQL with Read Replicas): Primary database handles mutating transactions (quiz submissions, course enrollments, payments). Multiple Read Replicas handle read queries (browsing course catalogs, viewing lessons).\\n5. Asynchronous Processing Queue (BullMQ / RabbitMQ): Decouple certificate generation, PDF rendering, and welcome emails into background worker tasks so the user HTTP request returns in < 100ms.\\n6. Video & Static Storage: Supabase / S3 bucket with CloudFront CDN and signed cookies for authorized video streaming.',
        interviewTip: 'Always calculate back-of-the-envelope estimations: 100,000 active users * 10 requests/min = ~1,666 QPS, well within reach of 4-6 Node.js instances behind Redis.'
      },
      {
        id: 'r3-q4',
        category: 'API Security',
        difficulty: 'Medium',
        question: 'What is the difference between Authentication (401) and Authorization (403), and how do you implement them in Express?',
        answer: 'Authentication verifies WHO you are (Identity verification). Failure returns HTTP 401 Unauthorized (e.g. missing or expired JWT token).\\nAuthorization verifies WHAT you are permitted to do (Permissions & Roles). Failure returns HTTP 403 Forbidden (e.g. an authenticated student trying to access the instructor course creation endpoint).\\n\\nImplementation: Chain two separate middlewares: `authenticateToken` parses the Bearer JWT from headers and attaches `req.user`. Next, `authorizeRoles(["admin", "instructor"])` checks `req.user.role` against the whitelist.',
        interviewTip: 'Mention that returning 403 tells the client "I know who you are, but you do not have permission", whereas 401 means "You need to log in first".'
      }
    ]
  },
  {
    id: 'round-4-machine-coding',
    roundName: 'Round 4: Machine Coding & Live Debugging',
    roundNumber: 4,
    duration: '45 - 60 Minutes',
    focusArea: 'Live Hands-On Coding, Custom Polyfills, State Machines, Bug Triaging',
    badge: 'Live Coding & Implementation',
    overview: 'Practical round where candidates are asked to code real-world utilities from scratch (e.g. debounce, throttle, custom EventEmitter, deep clone, or a complete interactive React component) in front of the interviewer.',
    keyStrategies: [
      'Write clean, modular code with descriptive variable names.',
      'Check for edge cases immediately (null, undefined, invalid types, memory leaks via uncleared timers).',
      'Test your code by manually dry-running an example input before saying you are finished.'
    ],
    questions: [
      {
        id: 'r4-q1',
        category: 'JavaScript Polyfill',
        difficulty: 'Medium',
        question: 'Implement a Production-Ready Debounce Function with an "immediate" (leading edge) option from scratch.',
        answer: 'Debounce guarantees that a function will not be executed until a specified time delay has elapsed since the last time it was invoked. Essential for search autocomplete inputs, window resize handlers, and auto-save forms.',
        codeSnippet: `function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    const callNow = immediate && !timerId;

    if (timerId) clearTimeout(timerId);

    timerId = setTimeout(() => {
      timerId = null;
      if (!immediate) fn.apply(context, args);
    }, delay);

    if (callNow) fn.apply(context, args);
  };
}`,
        interviewTip: 'Explain why preserving the `this` context with `.apply(context, args)` is critical for DOM event listener attachments.'
      },
      {
        id: 'r4-q2',
        category: 'Data Structures in JS',
        difficulty: 'Hard',
        question: 'Implement an LRU (Least Recently Used) Cache with O(1) get() and O(1) put() in JavaScript/TypeScript.',
        answer: 'An LRU cache evicts the least recently accessed item when capacity is exceeded. Using a JavaScript `Map` preserves insertion order, allowing O(1) reads and updates by re-inserting accessed keys to the end of the map.',
        codeSnippet: `class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, V>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map<K, V>();
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;
    // Re-insert to mark as most recently used
    const val = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // First key in Map iterator is the oldest / least recently used
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}`,
        interviewTip: 'Mention that under the hood, JS Map is implemented like a hash table combined with a doubly-linked list.'
      },
      {
        id: 'r4-q3',
        category: 'Live Bug Fixing',
        difficulty: 'Medium',
        question: 'Identify the memory leak and race condition in this React component and rewrite it cleanly.',
        answer: 'Bugs in the flawed code:\\n1. Race condition: If `userId` prop changes rapidly from 1 to 2, request 1 might finish AFTER request 2, causing the component to render stale data for user 1.\\n2. Memory leak: If the component unmounts while the fetch is in flight, setting state causes a memory leak warning.\\n\\nClean fix: Use an `AbortController` or a boolean `isMounted / isCancelled` flag inside the `useEffect` cleanup return function.',
        codeSnippet: `// Fixed Production Implementation:
import { useState, useEffect } from 'react';

export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
          setLoading(false);
        }
      });

    return () => controller.abort(); // Cancels stale in-flight request on re-render/unmount
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  return <div>{user?.name}</div>;
}`,
        interviewTip: 'Using AbortController is the industry standard for cancelling HTTP requests in React 18.'
      }
    ]
  },
  {
    id: 'round-5-behavioral',
    roundName: 'Round 5: HR, Behavioral & Managerial Leadership (STAR)',
    roundNumber: 5,
    duration: '30 - 45 Minutes',
    focusArea: 'Culture Fit, Team Collaboration, Conflict Resolution, Career Goals',
    badge: 'HR & Leadership Fit',
    overview: 'The final evaluation round testing communication skills, adaptability, engineering ethics, self-awareness, and team collaboration using the STAR (Situation, Task, Action, Result) methodology.',
    keyStrategies: [
      'Speak positively about past experiences, professors, teammates, and challenges.',
      'Always follow the STAR structure: 15% Situation/Task, 70% Action (what YOU specifically did), 15% Measurable Result.',
      'Have 3-4 thoughtful questions prepared to ask the interviewer at the end of the round.'
    ],
    questions: [
      {
        id: 'r5-q1',
        category: 'Introduction & Elevator Pitch',
        difficulty: 'Basic',
        question: 'Tell me about yourself (Tailored script for Umesh Temburwar).',
        answer: 'Hello! My name is Umesh Temburwar. I am a Computer Science graduate from MBES College of Engineering with a passion for full-stack web development and scalable backend systems.\\n\\nOver the past few years, I have specialized in the JavaScript/TypeScript and React ecosystem alongside Node.js, Express, Python, PostgreSQL, and MongoDB. I enjoy taking ideas from architectural concept to live production code.\\n\\nFor example, I architected a full-stack EdTech Learning Platform featuring automated quiz engines, certificate verification, and Row-Level Security in Supabase PostgreSQL. I also built an Automobile Inventory Management System utilizing atomic MongoDB operations and streaming CSV pipelines to handle large datasets efficiently. Additionally, as the lead web developer for our annual tech fest, ByteFest 2K25, I deployed a high-availability portal that handled over 2,000 daily visitors and 1,500 participant registrations with 99.9% uptime.\\n\\nI am looking for a full-stack software engineering role where I can contribute to mission-critical applications, collaborate with talented engineers, and continue growing as a developer.',
        interviewTip: 'Keep it within 90 to 120 seconds. Do not recite your resume line by line; highlight your impact and passion.'
      },
      {
        id: 'r5-q2',
        category: 'Problem-Solving / Overcoming Challenges',
        difficulty: 'Medium',
        question: 'Tell me about a time you faced a critical bug or technical roadblock right before a deadline and how you resolved it.',
        answer: 'During the launch week of ByteFest 2K25, we scheduled event registrations to open on Monday morning. On Sunday evening during load testing, we noticed that duplicate submissions were sneaking into the database when testers submitted forms on throttled network connections.\\n\\nWith less than 12 hours before launch, I took immediate ownership. I identified the root cause: network latency caused users to click the "Submit" button multiple times, and our backend had no idempotency guard.\\n\\nI executed a two-pronged solution: first, at the UI layer, I bound form submission to a state machine that immediately disabled the button and rendered an inline loading spinner. Second, at the database layer, I applied a composite unique index on `(event_id, leader_email)`. When registration went live, over 1,500 participants registered smoothly with zero duplicate tickets issued.',
        interviewTip: 'Notice the STAR structure: Situation (Sunday before launch), Task (prevent duplicates), Action (two-pronged fix UI + DB), Result (1,500 registrations, 0 duplicates).'
      },
      {
        id: 'r5-q3',
        category: 'Strengths and Weaknesses',
        difficulty: 'Medium',
        question: 'What are your greatest strength and your greatest weakness?',
        answer: 'Strength: My greatest strength is architectural curiosity and relentless debugging tenacity. When I encounter a production bug or a performance bottleneck, I do not just apply a superficial patch; I inspect network logs, database execution plans, and memory heap snapshots to understand the root cause and ensure it never happens again.\\n\\nWeakness: Earlier in my college projects, I struggled with delegation and perfectionism—I would try to personally build every single UI component and microservice myself. During ByteFest 2K25, I realized that taking on everything led to fatigue. I learned to break features into modular specifications, delegate ticket verification tasks to other team members, and conduct brief daily standups. This made the team significantly more productive and taught me the value of collaborative engineering.',
        interviewTip: 'Always frame your weakness with self-awareness and show the concrete actions you have taken to improve.'
      },
      {
        id: 'r5-q4',
        category: 'Career Vision',
        difficulty: 'Basic',
        question: 'Where do you see yourself in 3 to 5 years?',
        answer: 'In the next 3 to 5 years, my goal is to develop into a high-impact Senior Full-Stack Engineer and technical lead. In the first year or two, I want to master your company codebase, contribute reliable production features, and deepen my system design skills. By year 3, I aim to lead feature architecture from inception to deployment, mentor junior engineers, and actively participate in system optimization and high-availability design.',
        interviewTip: 'Show that you are ambitious, eager to learn, and looking for long-term growth within their engineering organization.'
      },
      {
        id: 'r5-q5',
        category: 'Reverse Questions',
        difficulty: 'Basic',
        question: 'What questions should you ask the interviewer at the end of the round?',
        answer: 'Always ask 2-3 thoughtful questions to demonstrate high engagement:\\n1. "What does a typical day or development cycle look like for your engineering team (e.g. Agile, code reviews, deployment frequency)?"\\n2. "What are the biggest technical or architectural challenges your team is currently working to solve over the next 6 to 12 months?"\\n3. "How does your engineering culture support continuous learning, code quality, and mentorship for fresh engineers?"\\n4. "What distinguishes a good engineer from an exceptional engineer on this team?"',
        interviewTip: 'Never say "I don not have any questions". Asking questions proves you care deeply about where you will be working.'
      }
    ]
  }
];
