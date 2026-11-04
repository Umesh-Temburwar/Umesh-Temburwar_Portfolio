export interface SkillTopic {
  id: string;
  title: string;
  level: 'Basic' | 'Intermediate' | 'Advanced';
  summary: string;
  keyPoints: string[];
  codeExample?: string;
  commonInterviewQuestions: { q: string; a: string }[];
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  badge: string;
  description: string;
  topics: SkillTopic[];
}

export const skillsNotesData: SkillCategory[] = [
  {
    id: 'programming-languages',
    name: 'Programming Languages',
    icon: 'Terminal',
    badge: 'C · C++ · C# · Python · TypeScript · JavaScript',
    description: 'Core syntax, memory execution models, type systems, concurrency, and OOP principles across languages.',
    topics: [
      {
        id: 'javascript-deep-dive',
        title: 'JavaScript Core Execution, Event Loop & Closures',
        level: 'Advanced',
        summary: 'Deep understanding of V8 execution context, call stack, microtask vs macrotask queues, closures, prototypal inheritance, and memory management.',
        keyPoints: [
          'Execution Context: Creation phase (hoisting functions/vars, lexical environment) and Execution phase (line-by-line).',
          'Event Loop: Call Stack -> Microtasks Queue (Promises, queueMicrotask, MutationObserver) -> Macrotasks Queue (setTimeout, setInterval, I/O, UI rendering). Microtasks always drain completely before the next macrotask.',
          'Closures: A function that remembers variables from its outer lexical scope even after the outer function has finished executing. Used for data privacy, currying, and memoization.',
          'Prototypal Inheritance: Objects link via `__proto__` to `prototype`. Classes in ES6 are syntactic sugar over prototype chains.',
          'Value vs Reference: Primitives (Number, String, Boolean, BigInt, Symbol, null, undefined) pass by value; Objects/Arrays pass by reference address.'
        ],
        codeExample: `// Event Loop Microtask vs Macrotask Order
console.log('1: Sync');
setTimeout(() => console.log('2: Macrotask Timeout'), 0);
Promise.resolve().then(() => console.log('3: Microtask Promise'));
queueMicrotask(() => console.log('4: Microtask queueMicrotask'));
console.log('5: Sync');
// Output order: 1 -> 5 -> 3 -> 4 -> 2`,
        commonInterviewQuestions: [
          {
            q: 'What is the difference between call(), apply(), and bind()?',
            a: 'call() invokes the function immediately with comma-separated arguments. apply() invokes immediately with an array of arguments. bind() returns a new function with the bound "this" context for later invocation.'
          },
          {
            q: 'How does garbage collection work in V8 engine?',
            a: 'V8 uses a generational garbage collector: Young generation (Scavenge copy collector for short-lived objects) and Old generation (Mark-Sweep-Compact for long-lived objects). Memory leaks happen via accidental globals, uncleared setIntervals, or detached DOM nodes.'
          }
        ]
      },
      {
        id: 'typescript-mastery',
        title: 'TypeScript Type System, Generics & Utility Types',
        level: 'Advanced',
        summary: 'Compile-time type checking, structural typing, generics, type narrowing, conditional types, and utility types in production.',
        keyPoints: [
          'Structural Subtyping: TypeScript checks types based on their shape/properties, not explicit nominal declaration (duck typing).',
          'Type vs Interface: Interfaces can be reopened (declaration merging) and extend easily for OOP; Types support unions, intersections, mapped types, and primitives.',
          'Generics: Parameterized types (`function identity<T>(arg: T): T`) allowing reusable, type-safe functions and components.',
          'Type Narrowing: Using `typeof`, `instanceof`, `in`, and custom type guards (`val is MyType`) to refine types in conditionals.',
          'Utility Types: Partial<T>, Required<T>, Readonly<T>, Record<K, T>, Pick<T, K>, Omit<T, K>, Exclude<T, U>, ReturnType<T>.'
        ],
        codeExample: `// Generic API Response Wrapper with Type Guard
interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

function isSuccessResponse<T>(res: ApiResponse<T>): res is ApiResponse<T> & { data: T } {
  return res.status === 'success' && res.data !== undefined;
}`,
        commonInterviewQuestions: [
          {
            q: 'What is the difference between any, unknown, and never in TypeScript?',
            a: 'any disables type-checking entirely. unknown is type-safe: you must narrow/check the type before performing operations. never represents a value that never occurs (e.g. function throwing an error or infinite loop, or exhaustive switch checks).'
          },
          {
            q: 'How do you create an immutable object type in TypeScript?',
            a: 'Using `Readonly<T>` for shallow immutability, or `as const` assertions (`const config = { ... } as const;`) to make all nested properties readonly literal types.'
          }
        ]
      },
      {
        id: 'python-core-fastapi',
        title: 'Python Internals, OOP & Asyncio',
        level: 'Intermediate',
        summary: 'Python memory model, GIL (Global Interpreter Lock), generators, decorators, and asynchronous programming with asyncio.',
        keyPoints: [
          'GIL (Global Interpreter Lock): A mutex preventing multiple native threads from executing Python bytecodes simultaneously. CPU-bound concurrency uses `multiprocessing`; I/O-bound concurrency uses `asyncio` or `threading`.',
          'Generators & yield: Functions that yield values lazily one-at-a-time, consuming O(1) memory for large datasets instead of loading everything into RAM.',
          'Decorators: Functions that take another function as argument and extend its behavior without modifying original code (e.g. `@app.get()`, `@functools.lru_cache`).',
          'Context Managers (`with` statement): Manage resources via `__enter__` and `__exit__` magic methods, ensuring files or DB connections close safely.'
        ],
        codeExample: `# Memory-efficient CSV row generator
def stream_csv_records(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        header = f.readline().strip().split(',')
        for line in f:
            yield dict(zip(header, line.strip().split(',')))`,
        commonInterviewQuestions: [
          {
            q: 'How does asyncio differ from multi-threading in Python?',
            a: 'asyncio provides single-threaded cooperative multitasking using an event loop with async/await. Tasks voluntarily yield control when waiting on I/O. Multithreading uses OS threads with preemptive scheduling, which incurs thread switching overhead and is bounded by the GIL.'
          }
        ]
      },
      {
        id: 'c-cpp-csharp',
        title: 'C, C++ & C# Memory Management and OOP',
        level: 'Advanced',
        summary: 'Stack vs Heap memory, pointers, manual memory allocation, RAII, VTable in C++, and C# CLR Managed Runtime with Garbage Collection.',
        keyPoints: [
          'C Memory Allocation: Stack (automatic, fast, limited size) vs Heap (manual via malloc/free, risk of memory leaks and dangling pointers).',
          'C++ RAII (Resource Acquisition Is Initialization): Binding resource lifecycle to object lifespan. Modern C++ uses Smart Pointers: `std::unique_ptr` (sole ownership), `std::shared_ptr` (reference-counted), `std::weak_ptr`.',
          'C++ Polymorphism & VTable: Virtual functions use a virtual method table (vptr/vtable) for dynamic dispatch at runtime.',
          'C# CLR & Garbage Collection: Managed code runs on Common Language Runtime. GC uses Mark-and-Compact across 3 generations (Gen 0, Gen 1, Gen 2) and Large Object Heap (LOH).',
          'C# Async/Await: Compiles into a state machine implementing `IAsyncStateMachine` backed by the Task Parallel Library (TPL).'
        ],
        codeExample: `// Modern C++ Smart Pointer usage (RAII)
#include <memory>
#include <iostream>

struct DatabaseConn {
    DatabaseConn() { std::cout << "Connected\\n"; }
    ~DatabaseConn() { std::cout << "Disconnected\\n"; }
};

void executeQuery() {
    auto conn = std::make_unique<DatabaseConn>(); // Automatically destroyed when exiting scope
}`,
        commonInterviewQuestions: [
          {
            q: 'What is a memory leak and how do you prevent it in C vs C++ vs C#?',
            a: 'A memory leak occurs when allocated memory is no longer referenced but cannot be reclaimed. In C: always pair malloc() with free() and check pointers. In C++: use RAII and smart pointers (unique_ptr/shared_ptr). In C#: dispose unmanaged resources via `IDisposable` and the `using` statement.'
          }
        ]
      }
    ]
  },
  {
    id: 'frontend-development',
    name: 'Frontend Development',
    icon: 'Layout',
    badge: 'HTML5 · CSS3 · React.js · Next.js · Tailwind CSS',
    description: 'Component lifecycles, Virtual DOM, Fiber reconciler, SSR/SSG/ISR architectures, and responsive styling systems.',
    topics: [
      {
        id: 'react-internals',
        title: 'React.js Virtual DOM, Fiber Architecture & State Optimization',
        level: 'Advanced',
        summary: 'How React renders under the hood: Virtual DOM diffing, Fiber tree data structure, reconciler phases, hooks rules, and performance tuning.',
        keyPoints: [
          'Virtual DOM: Lightweight in-memory representation of real DOM. Diffing algorithm operates in O(n) heuristic assuming different element types produce different trees and keys identify stable siblings.',
          'React Fiber: A complete rewrite of React reconciliation engine that enables incremental rendering, splitting rendering work into chunks and pausing/prioritizing updates based on user interaction urgency.',
          'Render Phase vs Commit Phase: Render phase is pure and can be interrupted/recalculated. Commit phase applies mutations to the real DOM synchronously.',
          'Hook Optimization: `useMemo` caches computed values; `useCallback` caches function references to prevent unnecessary child re-renders with `React.memo`.',
          'Batching: In React 18, state updates inside promises, setTimeout, and event handlers are automatically batched into a single render.'
        ],
        codeExample: `// Optimized Custom Hook for Debounced Search
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}`,
        commonInterviewQuestions: [
          {
            q: 'Why should keys never be Math.random() or array index for dynamic lists in React?',
            a: 'Keys allow React to match existing DOM nodes across renders. Using Math.random() forces every node to unmount and remount on every render, destroying state and hurting performance. Using array index causes rendering bugs when items are reordered, inserted, or removed.'
          },
          {
            q: 'What is the difference between useEffect and useLayoutEffect?',
            a: 'useEffect runs asynchronously after the DOM has painted on the screen. useLayoutEffect runs synchronously immediately after DOM mutations but BEFORE the browser paints, ideal for measuring DOM layout or preventing visual flicker.'
          }
        ]
      },
      {
        id: 'nextjs-architecture',
        title: 'Next.js Rendering Strategies (SSR, SSG, ISR) & App Router',
        level: 'Advanced',
        summary: 'Server-Side Rendering (SSR), Static Site Generation (SSG), Incremental Static Regeneration (ISR), React Server Components (RSC), and Server Actions.',
        keyPoints: [
          'SSR (Server-Side Rendering): HTML generated on every incoming request. Ideal for personalized, dynamic data (e.g. user dashboard, authenticated feeds).',
          'SSG (Static Site Generation): HTML pre-rendered at build time. Ultra-fast TTFB and cacheable on CDNs. Ideal for blogs, marketing pages, docs.',
          'ISR (Incremental Static Regeneration): Update static pages in background without full rebuild using `revalidate: 60`. Stale-while-revalidate caching model.',
          'React Server Components (RSC): Components render exclusively on server, shipping ZERO JavaScript bundle to the client for dependencies, keeping client bundles lightweight.',
          'Server Actions: Asynchronous functions that run on server without explicit API routes, callable directly from client forms or buttons.'
        ],
        codeExample: `// Next.js App Router Server Component with dynamic fetch
export default async function CourseCatalog() {
  // Runs on server, direct DB or API call, no client bundle bloat
  const res = await fetch('https://api.example.com/courses', {
    next: { revalidate: 3600 } // ISR: cached for 1 hour
  });
  const courses = await res.json();

  return (
    <div className="grid grid-cols-3 gap-4">
      {courses.map(course => <CourseCard key={course.id} data={course} />)}
    </div>
  );
}`,
        commonInterviewQuestions: [
          {
            q: 'How does Hydration work in Next.js and what causes hydration errors?',
            a: 'Hydration is the process where client-side JavaScript attaches event listeners and state to the server-rendered HTML. Hydration errors occur when the server-rendered HTML differs from the initial client render (e.g. using `window.innerWidth`, `localStorage`, or random timestamps during initial render).'
          }
        ]
      },
      {
        id: 'html5-css3-tailwind',
        title: 'HTML5 Semantic Web, CSS Grid/Flexbox & Tailwind Architecture',
        level: 'Intermediate',
        summary: 'Modern semantic markup, accessibility (a11y), responsive layouts with Flexbox and Grid, CSS specificity, and Tailwind CSS JIT compiler.',
        keyPoints: [
          'Semantic HTML5: `<main>`, `<article>`, `<section>`, `<nav>`, `<aside>`, `<header>`, `<footer>`. Improves SEO and screen-reader accessibility.',
          'Flexbox vs Grid: Flexbox is 1-dimensional (row OR column), ideal for alignment and distribution within components. Grid is 2-dimensional (rows AND columns), ideal for overall page structure.',
          'CSS Specificity: `Inline styles (1000) > IDs (100) > Classes/Attributes/Pseudo-classes (10) > Elements/Pseudo-elements (1)`.',
          'Tailwind CSS: Utility-first, purgeable CSS using Just-in-Time (JIT) compiler. Generates only the CSS rules used in markup, producing minuscule production CSS bundles (typically < 15KB gzipped).'
        ],
        codeExample: `/* Responsive 12-column auto-fit Grid */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}`,
        commonInterviewQuestions: [
          {
            q: 'What is the CSS Box Model and what does box-sizing: border-box do?',
            a: 'The box model consists of Content, Padding, Border, and Margin. With `box-sizing: content-box` (default), width/height apply only to content, and padding/border expand the total size. With `border-box`, padding and border are included inside the specified width/height, making layout sizing predictable.'
          }
        ]
      }
    ]
  },
  {
    id: 'backend-development',
    name: 'Backend Development',
    icon: 'Server',
    badge: 'Node.js · Express.js · ASP.NET Core · FastAPI',
    description: 'Event-driven I/O, middleware pipelines, streaming, concurrency, and enterprise API architectures.',
    topics: [
      {
        id: 'nodejs-internals',
        title: 'Node.js Architecture: V8, Libuv & Non-Blocking I/O',
        level: 'Advanced',
        summary: 'Deep dive into single-threaded event loop, Libuv thread pool, Buffers, Streams, Clustering, and Worker Threads.',
        keyPoints: [
          'Libuv: C library that abstracts the event loop and thread pool (default 4 threads, configurable via `UV_THREADPOOL_SIZE`). Handles file I/O, DNS lookup, and crypto tasks.',
          'Node.js Event Loop Phases: Timers (setTimeout) -> Pending callbacks (I/O) -> Idle/Prepare -> Poll (incoming connections/data) -> Check (setImmediate) -> Close callbacks.',
          'Streams: Data handling mechanism for processing chunks without loading entire files into memory. 4 types: Readable, Writable, Duplex, Transform. Backpressure prevents consumer saturation.',
          'Cluster Module vs Worker Threads: Clustering forks multiple OS processes sharing the same server port (one per CPU core) via IPC. Worker Threads run multiple threads inside the same process sharing memory via `SharedArrayBuffer`.'
        ],
        codeExample: `// Memory-efficient large file download stream with backpressure
import fs from 'node:fs';
import http from 'node:http';

http.createServer((req, res) => {
  const stream = fs.createReadStream('large-export.csv');
  res.writeHead(200, { 'Content-Type': 'text/csv' });
  stream.pipe(res); // Handles backpressure automatically
}).listen(4000);`,
        commonInterviewQuestions: [
          {
            q: 'What is the difference between process.nextTick() and setImmediate()?',
            a: 'process.nextTick() executes immediately after the current operation finishes, before the event loop continues to any other phase (highest priority microtask). setImmediate() executes during the Check phase of the event loop after the Poll phase.'
          },
          {
            q: 'How does Node.js handle CPU-intensive tasks without freezing the server?',
            a: 'Offload CPU-heavy computation (image processing, cryptography, heavy math) to Worker Threads (`worker_threads` module) or external queue workers (BullMQ with Redis), keeping the main event loop free to handle network I/O.'
          }
        ]
      },
      {
        id: 'express-architecture',
        title: 'Express.js Middleware, Routing & Security Hardening',
        level: 'Intermediate',
        summary: 'Middleware chaining, centralized error handling, rate limiting, CORS configuration, and security headers.',
        keyPoints: [
          'Middleware Chain: Functions having access to `(req, res, next)`. Modifies request object or ends request-response cycle. If `next()` is not called, request hangs.',
          'Error-Handling Middleware: Defined with 4 parameters: `(err, req, res, next)`. Must be placed after all route handlers.',
          'Security Best Practices: Use `helmet` for HTTP headers (CSP, HSTS, X-Frame-Options), configure explicit `cors` whitelist, implement rate limiting (`express-rate-limit`), and sanitize inputs to prevent NoSQL injection.',
          'Async Error Handling: In Express 4, unhandled promise rejections inside async handlers must be wrapped in `try/catch` with `next(err)` or using `express-async-errors`.'
        ],
        codeExample: `// Global centralized error-handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.error('[Error Pipeline]', { path: req.path, error: err });
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});`,
        commonInterviewQuestions: [
          {
            q: 'How do you prevent SQL/NoSQL injection in Express.js?',
            a: 'For SQL: always use parameterized queries or trusted ORMs (Prisma, TypeORM, Knex) never concatenate raw strings. For MongoDB: sanitize request inputs (`mongo-sanitize` package) and use strong schema validation (Joi or Zod) to reject query operator objects like `{"$gt": ""}` in user input.'
          }
        ]
      },
      {
        id: 'fastapi-aspnet',
        title: 'FastAPI & ASP.NET Core Enterprise Paradigms',
        level: 'Advanced',
        summary: 'Python ASGI asynchronous architecture with Pydantic validation vs C# ASP.NET Core Dependency Injection and Entity Framework Core.',
        keyPoints: [
          'FastAPI: Built on Starlette (ASGI) and Pydantic. Auto-generates OpenAPI / Swagger specs, enforces type safety at runtime, and natively supports async/await.',
          'Dependency Injection in FastAPI: Using `Depends()` to inject database sessions, current authenticated user, or validation services cleanly into route functions.',
          'ASP.NET Core: High-performance, cross-platform enterprise framework. Built-in IoC container with 3 service lifetimes: Transient (new per request), Scoped (shared within HTTP request), and Singleton (created once).',
          'Entity Framework Core (EF Core): Powerful ORM with LINQ, change tracking, migrations, and compiled queries.'
        ],
        codeExample: `# FastAPI Dependency Injection Pattern
from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel

app = FastAPI()

async def get_current_user(token: str = Depends(oauth2_scheme)):
    user = verify_jwt_token(token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return user

@app.get("/api/dashboard")
async def dashboard_data(user: dict = Depends(get_current_user)):
    return {"message": f"Welcome {user['name']}"}`,
        commonInterviewQuestions: [
          {
            q: 'What is ASGI vs WSGI in Python web servers?',
            a: 'WSGI (Web Server Gateway Interface) is synchronous and handles one request per worker thread sequentially (e.g. Flask, Django with Gunicorn). ASGI (Asynchronous Server Gateway Interface) supports asynchronous event loops, WebSockets, and long-polling connections with high concurrency (e.g. FastAPI with Uvicorn).'
          }
        ]
      }
    ]
  },
  {
    id: 'databases',
    name: 'Databases & Storage',
    icon: 'Database',
    badge: 'SQL · PostgreSQL · MongoDB · Supabase · Firebase',
    description: 'Relational vs NoSQL trade-offs, indexing mechanisms, aggregation pipelines, ACID transactions, and Row Level Security.',
    topics: [
      {
        id: 'postgresql-sql-mastery',
        title: 'PostgreSQL Relational Design, Indexing & ACID Transactions',
        level: 'Advanced',
        summary: 'ACID properties, database normalization (1NF to 3NF), B-Tree indexing, execution plan analysis, and query optimization.',
        keyPoints: [
          'ACID Properties: Atomicity (all or nothing), Consistency (preserves constraints), Isolation (concurrent transactions do not interfere), Durability (committed data survives crashes via WAL write-ahead log).',
          'Isolation Levels: Read Uncommitted -> Read Committed (default in PG) -> Repeatable Read -> Serializable. Solves Dirty Reads, Non-repeatable Reads, and Phantom Reads.',
          'Indexing: B-Tree (default, optimal for equality and range `<, <=, =, >=, >`), Hash (equality only), GIN/GiST (arrays, full-text search, JSONB). Indexes speed up reads but slow down writes.',
          'Normalization: 1NF (atomic columns, primary key), 2NF (no partial dependencies on composite keys), 3NF (no transitive dependencies). Denormalization used selectively for high-read performance.',
          'EXPLAIN ANALYZE: Analyzes query execution plan, identifying Sequential Scans vs Index Scans, cost estimations, and actual execution timing.'
        ],
        codeExample: `-- High-performance compound index and query
CREATE INDEX idx_enrollments_student_status 
ON enrollments(student_id, status) 
WHERE status = 'active';

EXPLAIN ANALYZE 
SELECT * FROM enrollments 
WHERE student_id = 'user_123' AND status = 'active';`,
        commonInterviewQuestions: [
          {
            q: 'What is the N+1 query problem and how do you resolve it?',
            a: 'N+1 occurs when fetching a parent list executes 1 query, and then fetching child relations executes N additional queries in a loop. Resolved via SQL JOINs, subqueries, or ORM eager loading (e.g. `include` in Prisma, `populate` in Mongoose, `select_related`/`prefetch_related`).'
          },
          {
            q: 'What is the difference between clustered and non-clustered index?',
            a: 'A clustered index determines the physical order of data stored on disk; there can only be one clustered index per table (typically the Primary Key). A non-clustered index creates a separate structure storing key values and row pointers back to the physical data rows.'
          }
        ]
      },
      {
        id: 'mongodb-nosql',
        title: 'MongoDB Schema Design & Aggregation Framework',
        level: 'Advanced',
        summary: 'Document data modeling, embedding vs referencing, compound indexes, and powerful aggregation pipelines ($match, $group, $lookup).',
        keyPoints: [
          'Embedding vs Referencing: Embed data if relations are 1:1 or 1:Few and queried together. Reference data if relations are 1:Many, data changes frequently, or documents exceed 16MB limit.',
          'BSON Document Model: Binary JSON supporting Date, Decimal128, Binary, and ObjectId types with fast traversal.',
          'Aggregation Pipeline: Multi-stage transformation pipeline where output of one stage feeds as input to the next (`$match` filters -> `$lookup` joins -> `$unwind` flattens -> `$group` aggregates -> `$project` shapes output).',
          'Transactions: Multi-document ACID transactions available in replica sets via session transactions.'
        ],
        codeExample: `// MongoDB Aggregation for Inventory Low-Stock Alert by Category
db.products.aggregate([
  { $match: { stock: { $lte: 10 } } },
  { 
    $group: {
      _id: "$category",
      lowStockCount: { $sum: 1 },
      items: { $push: { name: "$name", partNumber: "$partNumber", stock: "$stock" } }
    }
  },
  { $sort: { lowStockCount: -1 } }
]);`,
        commonInterviewQuestions: [
          {
            q: 'When would you choose MongoDB over PostgreSQL?',
            a: 'Choose MongoDB for hierarchical/unstructured documents, rapidly evolving schemas, high write throughput, and natural JSON data structures. Choose PostgreSQL when complex multi-table joins, strict relational constraints, strong consistency, or financial ACID transactions are mandatory.'
          }
        ]
      },
      {
        id: 'supabase-firebase',
        title: 'Supabase Architecture, Row Level Security (RLS) & Auth',
        level: 'Intermediate',
        summary: 'Open-source Firebase alternative: Managed PostgreSQL, Row Level Security (RLS), Supabase Auth (JWT), and real-time database subscriptions.',
        keyPoints: [
          'Row Level Security (RLS): PostgreSQL security feature where database itself enforces read/write permissions per user session, not just API application layer.',
          'Auth Integration: Supabase Auth issues JWT tokens containing user ID (`auth.uid()`) and role (`auth.role()`), accessible directly inside Postgres RLS policies.',
          'Realtime: Uses Postgres replication stream (Logical Decoding) transformed into WebSocket events for client subscribers.',
          'Supabase Storage: Built on S3-compatible object storage backed by Postgres metadata and protected via the same RLS policies.'
        ],
        codeExample: `-- Supabase Row Level Security policy for EdTech courses
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Students can read published courses
CREATE POLICY "Students can view published courses" 
ON courses FOR SELECT 
USING (status = 'published');

-- Instructors can update only their own courses
CREATE POLICY "Instructors can edit own courses" 
ON courses FOR UPDATE 
USING (auth.uid() = instructor_id);`,
        commonInterviewQuestions: [
          {
            q: 'How does Supabase RLS protect backend API endpoints?',
            a: 'Even if an attacker bypasses the client-side UI, the Supabase client passes the user JWT to PostgreSQL. Postgres evaluates `auth.uid() = instructor_id` at the database engine level, making unauthorized reads or writes impossible at the data layer.'
          }
        ]
      }
    ]
  },
  {
    id: 'auth-security',
    name: 'Authentication & Security',
    icon: 'ShieldCheck',
    badge: 'JWT · Sessions · OAuth · RBAC · CORS · CSRF',
    description: 'Stateless vs stateful authentication, token lifecycles, role-based access control, and web security defenses.',
    topics: [
      {
        id: 'jwt-vs-session',
        title: 'JWT vs Session-Based Authentication & Token Management',
        level: 'Advanced',
        summary: 'In-depth comparison of stateless JWT vs stateful session cookies, token refresh rotation, and secure storage.',
        keyPoints: [
          'Session-Based Auth: Server generates a session ID stored in DB or Redis and sets an `HttpOnly` cookie in the browser. Server maintains state. Easy to revoke instantly.',
          'JWT (JSON Web Token): Stateless token composed of Header.Payload.Signature. Verified using HMAC (HS256) or RSA (RS256) public/private key. Cannot be easily revoked before expiration without a blacklist.',
          'Token Rotation Pattern: Short-lived Access Token (15 mins) stored in memory + Long-lived Refresh Token (7-30 days) stored in `HttpOnly, Secure, SameSite=Strict` cookie. On expiry, client exchanges refresh token for new access token.',
          'Role-Based Access Control (RBAC): Embedding roles (`student`, `instructor`, `admin`) in token payload and enforcing authorization in route middleware.'
        ],
        codeExample: `// Express Role-Based Authorization Middleware
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden: Insufficient permissions for this resource' 
      });
    }
    next();
  };
};`,
        commonInterviewQuestions: [
          {
            q: 'Why should JWTs never be stored in browser localStorage in production?',
            a: 'Any JavaScript running on the page (including third-party scripts or malicious packages via XSS vulnerabilities) can read localStorage and exfiltrate the token. Storing refresh tokens in `HttpOnly, Secure, SameSite=Strict` cookies prevents JavaScript access entirely.'
          },
          {
            q: 'What is CSRF and how do you protect against it?',
            a: 'Cross-Site Request Forgery tricks an authenticated browser into sending unwanted requests to a trusted site. Protection: use `SameSite=Lax` or `Strict` cookies, require custom headers (`X-Requested-With: XMLHttpRequest`), and implement CSRF tokens verified on mutating requests (POST, PUT, DELETE).'
          }
        ]
      }
    ]
  },
  {
    id: 'devops-tools',
    name: 'Tools & DevOps',
    icon: 'Cpu',
    badge: 'Git · GitHub · Docker · Linux · CI/CD',
    description: 'Version control workflows, containerization lifecycles, and production Linux server administration.',
    topics: [
      {
        id: 'git-advanced',
        title: 'Git Version Control & Branching Workflows',
        level: 'Intermediate',
        summary: 'Git object model, branching strategies, interactive rebase, cherry-pick, stash, and resolving merge conflicts.',
        keyPoints: [
          'Git Architecture: Working Directory -> Staging Area (Index) -> Local Repository (Commit) -> Remote Repository. Commits are DAG (Directed Acyclic Graph) of snapshots identified by SHA-1/SHA-256 hashes.',
          'Merge vs Rebase: Merge creates a new merge commit preserving exact history branch topology. Rebase rewrites commit history onto the tip of another branch for a clean, linear git history.',
          'GitFlow vs Trunk-Based Development: GitFlow uses long-lived `main`, `develop`, feature, release, and hotfix branches. Trunk-Based development uses short-lived feature branches merged frequently into `main` with feature flags.',
          'Cherry-pick: Applies the changes introduced by one or more existing commits to another branch without merging the whole branch.'
        ],
        codeExample: `# Common Git Production Commands
git checkout -b feature/course-quiz-engine
git add -A && git commit -m "feat: add auto-grading algorithm"
git fetch origin && git rebase origin/main
git stash push -m "wip: quiz timers"
git stash pop`,
        commonInterviewQuestions: [
          {
            q: 'What is the difference between git reset and git revert?',
            a: 'git reset moves the current branch pointer backward, rewriting history (dangerous on shared branches; flags: --soft, --mixed, --hard). git revert creates a NEW commit that introduces the opposite changes of target commits, safely undoing changes without altering existing history.'
          }
        ]
      },
      {
        id: 'docker-containers',
        title: 'Docker Containerization & Multi-Stage Builds',
        level: 'Intermediate',
        summary: 'Containers vs VMs, Dockerfile optimization, multi-stage builds for small images, and Docker Compose.',
        keyPoints: [
          'Containers vs VMs: Virtual Machines emulate full hardware with guest operating systems (heavy, slow boot). Containers share the host OS kernel and isolate user space using Linux namespaces and cgroups (lightweight, megabytes in size, instant boot).',
          'Multi-Stage Builds: Build dependencies and compile code in temporary builder stages, copying only the final build output into a minimal production image (e.g. `node:alpine`), shrinking image sizes by 80%+.',
          'Docker Compose: Declarative YAML tool to define and run multi-container applications (e.g. Web App + PostgreSQL + Redis + Worker).'
        ],
        codeExample: `# Multi-stage Dockerfile for Node.js Application
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]`,
        commonInterviewQuestions: [
          {
            q: 'Why should you avoid running containers as root user in production?',
            a: 'If an attacker achieves remote code execution inside a container running as root, any container breakout vulnerability allows them full root access over the host machine OS. Specifying `USER node` restricts permissions to unprivileged user space.'
          }
        ]
      },
      {
        id: 'linux-essentials',
        title: 'Linux Server Administration & Diagnostics',
        level: 'Intermediate',
        summary: 'Command line power tools, file permissions, process monitoring, systemd service management, and networking diagnostics.',
        keyPoints: [
          'Permissions (`chmod` / `chown`): `r=4, w=2, x=1`. 755 = owner read/write/execute, group/others read/execute.',
          'Process Management: `ps aux`, `top`, `htop`, `kill -9 <PID>`, `pgrep`, `systemctl status/restart <service>`.',
          'Search & Stream Processing: `grep -rnw "error" /var/log/`, `find . -name "*.log" -mtime -7`, `tail -f app.log | grep --line-buffered "ERROR"`.',
          'Networking Diagnostics: `curl -I`, `netstat -tuln` / `ss -tulpn` (check open ports), `traceroute`, `ping`, `nslookup`.'
        ],
        codeExample: `# Systemd Service file for Node.js production service (/etc/systemd/system/portfolio.service)
[Unit]
Description=Portfolio Production Server
After=network.target

[Service]
ExecStart=/usr/bin/node /var/www/portfolio/dist/server.js
Restart=always
User=www-data
Environment=NODE_ENV=production PORT=3000

[Install]
WantedBy=multi-user.target`,
        commonInterviewQuestions: [
          {
            q: 'How do you troubleshoot a server when the CPU usage hits 100%?',
            a: '1. Run `htop` or `top` and sort by CPU (Shift+P) to identify the culprit PID. 2. Inspect thread count and memory with `ps -aux | grep <PID>`. 3. Check logs with `journalctl -u <service> -f`. 4. If Node.js: generate CPU profile with `node --prof` or inspect using Chrome DevTools.'
          }
        ]
      }
    ]
  },
  {
    id: 'api-development',
    name: 'API Development & Architecture',
    icon: 'Radio',
    badge: 'REST APIs · Status Codes · Pagination · Rate Limiting',
    description: 'REST architectural constraints, HTTP semantics, idempotent endpoints, pagination, and API design standards.',
    topics: [
      {
        id: 'rest-principles',
        title: 'REST Architecture, HTTP Methods & Status Codes',
        level: 'Advanced',
        summary: 'REST constraints, idempotency, proper HTTP status code utilization, pagination strategies, and API security.',
        keyPoints: [
          'REST Constraints: Client-Server architecture, Statelessness, Cacheability, Layered system, Uniform Interface (URIs as resources, verbs as HTTP methods).',
          'Idempotency: An HTTP method is idempotent if executing it multiple times produces the same server state as a single execution. GET, PUT, DELETE, HEAD, OPTIONS are idempotent; POST is NOT idempotent.',
          'Status Codes: 200 (OK), 201 (Created), 204 (No Content), 304 (Not Modified), 400 (Bad Request), 401 (Unauthorized / Unauthenticated), 403 (Forbidden / Unauthorized role), 404 (Not Found), 409 (Conflict), 422 (Unprocessable Entity), 429 (Too Many Requests), 500 (Internal Server Error), 502 (Bad Gateway), 503 (Service Unavailable).',
          'Pagination: Offset-based (`LIMIT 10 OFFSET 50` - slow on large tables, skips/duplicates on insert) vs Cursor-based (`WHERE id > last_seen_id LIMIT 10` - O(1) performance using index).'
        ],
        codeExample: `// Production REST API Response Pattern
interface StandardResponse<T> {
  success: boolean;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    nextCursor?: string;
  };
  error?: {
    code: string;
    message: string;
  };
}`,
        commonInterviewQuestions: [
          {
            q: 'What is the difference between PUT and PATCH in REST?',
            a: 'PUT is used for complete replacement of a resource (all fields must be supplied, missing fields are overwritten or nulled; idempotent). PATCH is used for partial update (only modified fields are sent and updated; can be non-idempotent depending on operation).'
          },
          {
            q: 'How does Rate Limiting work and what algorithms exist?',
            a: 'Rate limiting limits incoming requests per client IP or API token to prevent abuse. Common algorithms: Token Bucket (allows bursts while maintaining average rate), Leaky Bucket (processes requests at smooth, constant rate), Fixed Window Counter (resets every minute, vulnerable to boundary spikes), Sliding Window Log (accurate, higher memory), and Sliding Window Counter (balanced accuracy and low memory).'
          }
        ]
      }
    ]
  }
];

