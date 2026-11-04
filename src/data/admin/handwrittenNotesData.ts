export interface HandwrittenNote {
  id: string;
  topic: string;
  category: string;
  notebookPageNum: number;
  highlightTag: string;
  coreConcept: string;
  visualDiagram: string;
  rulesOfThumb: string[];
  interviewerCatchphrases: string[];
  quickMnemonic: string;
}

export const handwrittenNotesData: HandwrittenNote[] = [
  {
    id: 'hw-js-eventloop',
    topic: 'JavaScript V8 & Event Loop Visual Mental Model',
    category: 'Programming Languages',
    notebookPageNum: 1,
    highlightTag: 'Crucial for Every Interview',
    coreConcept: 'JavaScript is single-threaded synchronous language with non-blocking asynchronous concurrency provided by the browser / Node.js runtime environment via Libuv.',
    visualDiagram: `
   ┌─────────────────────────────────────────────────────────────┐
   │                    V8 MEMORY ARCHITECTURE                   │
   │                                                             │
   │   HEAP (Memory Allocation)      CALL STACK (Single-Thread) │
   │   ┌─────────────────────┐       ┌────────────────────────┐  │
   │   │ Objects, Closures,  │       │ console.log('1')       │  │
   │   │ Arrays in RAM       │       │ main()                 │  │
   │   └─────────────────────┘       └────────────────────────┘  │
   └───────────────────────────────┬─────────────────────────────┘
                                   │ (Async Web APIs / Libuv)
                                   ▼
   ┌─────────────────────────────────────────────────────────────┐
   │ 1. MICROTASK QUEUE (High Priority - Drained Completely!)   │
   │    -> Promise.then(), queueMicrotask(), MutationObserver    │
   ├─────────────────────────────────────────────────────────────┤
   │ 2. MACROTASK / TASK QUEUE (Processed 1 task per tick)       │
   │    -> setTimeout(), setInterval(), setImmediate(), I/O      │
   └─────────────────────────────────────────────────────────────┘
                                   │
               EVENT LOOP: "Is Call Stack empty?"
               Yes -> Drain ALL Microtasks -> Run 1 Macrotask -> Re-render
    `,
    rulesOfThumb: [
      'RULE 1: Microtasks ALWAYS starve macrotasks until the microtask queue is 100% empty.',
      'RULE 2: `async/await` is syntactic sugar for Promises; code after `await` is queued as a Microtask.',
      'RULE 3: `setTimeout(fn, 0)` does NOT run in 0ms; it runs after the current call stack + all microtasks are done.'
    ],
    interviewerCatchphrases: [
      '"The call stack is single-threaded, but the host environment (Browser WebAPIs / Node.js Libuv) is multi-threaded."',
      '"Promises bypass the macrotask queue entirely and execute in the higher-priority microtask queue."'
    ],
    quickMnemonic: 'C-M-M: Call Stack first -> Microtasks second -> Macrotasks last.'
  },
  {
    id: 'hw-c-pointers',
    topic: 'C / C++ Memory Model: Stack vs Heap & Pointers',
    category: 'Programming Languages',
    notebookPageNum: 2,
    highlightTag: 'System Fundamentals',
    coreConcept: 'Pointers store the hexadecimal memory address of another variable. Stack memory is managed by CPU; Heap memory requires explicit allocation and deallocation.',
    visualDiagram: `
    RAM MEMORY LAYOUT (Low to High Address):
    ┌─────────────────────────┐ 0x00000000
    │ Text Segment (Code)     │
    ├─────────────────────────┤
    │ Data & BSS (Globals)    │
    ├─────────────────────────┤
    │ HEAP (Grows DOWNWARD ▼) │ -> malloc() / free() or new / delete
    │                         │    Manual memory, risk of leaks!
    │      ... Free Memory ...│
    │ STACK (Grows UPWARD ▲)  │ -> Local vars, function frames, O(1) alloc
    └─────────────────────────┘ 0xFFFFFFFF (Top of RAM)

    POINTER DEREFERENCING VISUAL:
    int x = 42;          // Located at address 0x1004, value = 42
    int* ptr = &x;       // ptr is at 0x1008, value = 0x1004
    *ptr = 99;           // Goes to address 0x1004 and overwrites value to 99!
    `,
    rulesOfThumb: [
      'RULE 1: Every malloc() must have exactly one free(); every new must have one delete.',
      'RULE 2: Dangling pointer = pointer pointing to memory that has already been deallocated.',
      'RULE 3: In Modern C++, prefer std::unique_ptr and std::shared_ptr (RAII) over raw pointers.'
    ],
    interviewerCatchphrases: [
      '"Stack allocation is practically free (just a stack pointer register shift), whereas Heap allocation requires searching free-lists and triggers OS system calls."',
      '"RAII guarantees that resource acquisition is tied directly to object lifetime."'
    ],
    quickMnemonic: 'P-A-V: Pointer holds Address (&), Dereference (*) gets Value.'
  },
  {
    id: 'hw-react-fiber',
    topic: 'React 18 Fiber Architecture & Reconciliation Flow',
    category: 'Frontend Development',
    notebookPageNum: 3,
    highlightTag: 'Top Frontend Trap',
    coreConcept: 'React Fiber is a virtual stack frame representing work units. It transforms recursive synchronous rendering into cooperative, pauseable chunked scheduling.',
    visualDiagram: `
     JSX Code  --->  React.createElement()  --->  Virtual DOM Object Tree
                                                         │
                                  FIBER RECONCILER       ▼
    ┌──────────────────────────────────────────────────────────────────┐
    │ 1. RENDER PHASE (Asynchronous, pure, interruptible):             │
    │    - Builds "WorkInProgress" Fiber tree                          │
    │    - Diffing algorithm flags nodes with Effects (Placement/Update)│
    │    - Can be paused if higher priority event (e.g. typing) arrives│
    ├──────────────────────────────────────────────────────────────────┤
    │ 2. COMMIT PHASE (Synchronous, fast, non-interruptible):          │
    │    - Applies mutations to Real DOM in one batch                  │
    │    - Swaps current tree pointer (Double Buffering)               │
    │    - Runs useLayoutEffect -> Paints screen -> Runs useEffect     │
    └──────────────────────────────────────────────────────────────────┘
    `,
    rulesOfThumb: [
      'RULE 1: Never mutate state directly (`state.count = 5`). React relies on Object.is() reference comparison to trigger re-renders.',
      'RULE 2: Component re-renders do NOT mean Real DOM updates; Real DOM only updates if Virtual DOM diff detects changes.',
      'RULE 3: State batching in React 18 batches multiple state updates even inside promises and setTimeout.'
    ],
    interviewerCatchphrases: [
      '"Fiber uses a singly-linked list tree structure (child, sibling, return pointers) allowing traversal without call stack overflow."',
      '"Double Buffering: React maintains a current tree and builds a work-in-progress tree offscreen before swapping pointers synchronously."'
    ],
    quickMnemonic: 'Render is interruptible; Commit is synchronous.'
  },
  {
    id: 'hw-node-streams',
    topic: 'Node.js Streams, Buffers & Backpressure Mechanics',
    category: 'Backend Development',
    notebookPageNum: 4,
    highlightTag: 'Production Scalability',
    coreConcept: 'Buffers store raw binary chunks in V8 external memory. Streams read/write chunks sequentially to prevent OOM (Out-of-Memory) crashes on large files.',
    visualDiagram: `
    MEMORY USAGE COMPARISON (1 GB File Export):
    
    WITHOUT STREAMS (fs.readFile):
    [Disk 1GB]  ----loads completely---->  [RAM Heap: 1GB+]  💥 CRASH (OOM)

    WITH STREAMS (fs.createReadStream):
    [Disk] ─(64KB Chunk)─> [RAM Buffer: 64KB] ─(stream.pipe)─> [Network Socket]
                           (Memory remains FLAT under 20MB!)

    BACKPRESSURE MECHANISM:
    Fast Producer (Disk)  ====>> [HighWaterMark Buffer: 64KB Full] ====>> Slow Consumer (Client 3G)
                                          │
                                 res.write() returns FALSE
                                 producer.pause()!
                                          │
                                 drain event fires!
                                 producer.resume()!
    `,
    rulesOfThumb: [
      'RULE 1: Never use `fs.readFile()` or `JSON.stringify()` on arbitrarily large files or database query results.',
      'RULE 2: Use `stream.pipeline(readStream, transformStream, writeStream, cb)` instead of `.pipe()` to handle error cleanup automatically.',
      'RULE 3: Backpressure prevents memory buildup when data producer is faster than data consumer.'
    ],
    interviewerCatchphrases: [
      '"In my automobile inventory project, I used Mongoose cursor streams piped directly to response to stream 50,000+ CSV records in constant O(1) memory."',
      '"Backpressure is the signaling mechanism where a slow consumer tells a fast producer to pause reading."'
    ],
    quickMnemonic: 'Streams process chunks; Buffers hold raw bytes; Pipeline cleans errors.'
  },
  {
    id: 'hw-db-indexing',
    topic: 'PostgreSQL B-Tree Indexing & Query Execution Plans',
    category: 'Databases & Storage',
    notebookPageNum: 5,
    highlightTag: 'Database Performance',
    coreConcept: 'B-Tree (Balanced Tree) keeps data sorted and allows O(log N) searches, insertions, and deletions with balanced depth.',
    visualDiagram: `
    B-TREE INDEX STRUCTURE (Root -> Branch -> Leaf Pages):

                         [ 50 | 100 ]            <-- Root Node (In RAM)
                        /      |     \\
            [ 20 | 35 ]   [ 65 | 80 ]  [ 120 | 150 ] <-- Branch Nodes
            /    |    \\   /    |    \\  /     |     \\
          [Leaf][Leaf][Leaf]... [Leaf Pages with Row IDs/Pointers]

    QUERY EXECUTION PLANS:
    1. Seq Scan (Sequential Scan):
       Reads EVERY page on disk. O(N) time. Terrible on 1,000,000+ rows.
    2. Index Scan (B-Tree traversal):
       Traverses B-Tree O(log N) -> gets row pointer -> fetches disk page.
    3. Index Only Scan (Best Performance!):
       All required columns exist in the index itself! ZERO table disk visits.
    `,
    rulesOfThumb: [
      'RULE 1: Compound Index `(A, B, C)` follows the Leftmost Prefix Rule. Queries filtering on `(A)` or `(A, B)` use the index; queries filtering only on `(B)` cannot use it.',
      'RULE 2: High Cardinality columns (many unique values, e.g. email, user_id) make great indexes. Low Cardinality (gender, status) rarely benefit from B-Trees.',
      'RULE 3: Always verify with `EXPLAIN ANALYZE` before creating indexes in production.'
    ],
    interviewerCatchphrases: [
      '"Indexes speed up SELECT queries by O(log N), but impose an overhead on INSERT, UPDATE, and DELETE operations because the B-tree must be rebalanced."',
      '"A composite index satisfies queries on leading columns, but is ignored if the leading column is omitted in WHERE clauses."'
    ],
    quickMnemonic: 'Leftmost prefix rule: Index (A,B) works for A, but NOT for B alone.'
  },
  {
    id: 'hw-security-jwt',
    topic: 'JWT Security, Token Rotation & RLS Defense Architecture',
    category: 'Authentication & Security',
    notebookPageNum: 6,
    highlightTag: 'Enterprise Auth Model',
    coreConcept: 'Stateless JWT tokens must be paired with HttpOnly refresh cookies and database Row Level Security to prevent both XSS theft and CSRF exploits.',
    visualDiagram: `
    JWT STRUCTURE:
    ┌───────────────────────┬───────────────────────┬──────────────────────┐
    │ HEADER                │ PAYLOAD               │ SIGNATURE            │
    │ {"alg":"HS256"}       │ {"sub":"usr_123",     │ HMACSHA256(          │
    │                       │  "role":"student"}    │  base64(H).base64(P),│
    │                       │                       │  SECRET_KEY)         │
    └───────────────────────┴───────────────────────┴──────────────────────┘
    (Base64URL encoded)     (Base64URL encoded)     (Cryptographic Hash)

    THE BULLETPROOF AUTH ARCHITECTURE:
    1. Login Request  ──>  Server verifies credentials
    2. Response        ──>  • Access Token (15m expiry) sent in JSON body (In-Memory)
                           • Refresh Token (7d expiry) set as HttpOnly, Secure Cookie
    3. API Requests    ──>  Client passes Access Token in \`Authorization: Bearer <token>\`
    4. Database Level  ──>  Postgres RLS evaluates \`auth.uid() = user_id\`
    `,
    rulesOfThumb: [
      'RULE 1: Never store JWTs in localStorage or sessionStorage. Any XSS injection can steal localStorage tokens with one line of JavaScript.',
      'RULE 2: Payloads are Base64 encoded, NOT encrypted! Never put sensitive passwords or credit cards in a JWT payload.',
      'RULE 3: Use short-lived access tokens (15 mins) and rotate refresh tokens upon each use to detect replay attacks.'
    ],
    interviewerCatchphrases: [
      '"JWTs provide stateless authorization, but require database Row Level Security (RLS) to enforce granular access policies at the data layer."',
      '"We store the refresh token in an HttpOnly, SameSite=Strict cookie so client-side JavaScript cannot access it, neutralizing XSS exfiltration."'
    ],
    quickMnemonic: 'Header + Payload + Signature. Access token in memory, Refresh in HttpOnly cookie.'
  }
];

