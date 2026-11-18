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
    id: 'yogeshwari-dairy-ecommerce',
    title: 'Yogeshwari Dairy E-Commerce Platform',
    tagline: 'Full-Stack D2C Fresh Dairy Quick-Commerce with Leaflet Geolocation & Supabase Realtime',
    role: 'Full Stack Developer & System Architect',
    timeline: 'Production Ready',
    techStack: ['React 18', 'TypeScript', 'Zustand', 'Supabase PostgreSQL', 'Leaflet', 'Tailwind CSS', 'Vite', 'Canvas Confetti'],
    elevatorPitch: {
      quick30Sec: 'I built Yogeshwari Dairy E-Commerce, a mobile-first quick-commerce platform delivering fresh milk, bilona ghee, paneer, and sweets across Ambajogai in 10–15 minutes, featuring a Leaflet 25km geofence, dynamic Zustand slide-over cart, and a 5-stage live order tracker via Supabase Realtime.',
      detailed90Sec: 'Traditional dairy shops suffer from manual phone orders, uncoordinated delivery routing, and inventory discrepancies between counter walk-ins and delivery orders. I built a production-grade D2C quick-commerce application using React 18, TypeScript, and Supabase. The platform provides sub-100ms client-side catalog filtering, an interactive Leaflet GPS address picker with Haversine boundary validation, an optimistic Zustand cart with ₹300 free-delivery meter, and real-time counter POS synchronization via Supabase postgres_changes listeners. This streamlined local fresh dairy ordering from discovery to doorstep delivery with zero overselling.'
    },
    architecture: {
      description: 'Mobile-first React 18 SPA with Zustand client state, Leaflet geospatial address engine, Supabase PostgreSQL Realtime database, and WhatsApp notification hooks.',
      flow: [
        'Client interacts with React 18 + Tailwind UI, browsing stock-aware dairy items with optimistic Zustand quantity steppers.',
        'Checkout engages Leaflet GPS map picker, executing Haversine distance calculations to enforce the 25 km delivery envelope.',
        'Order placement writes directly to Supabase PostgreSQL, atomically decrementing stock and triggering Postgres CDC change streams.',
        'Store counter POS receives real-time dispatch alerts, generating WhatsApp receipts and initiating the 5-stage live order tracker.',
        'Customers watch live progression (Placed → Confirmed → Packing → Out for Delivery → Delivered) with live delivery rider contact integration.'
      ],
      techChoiceReasoning: [
        {
          tech: 'Supabase Realtime PostgreSQL over polling REST APIs',
          why: 'Quick commerce requires instantaneous synchronization between physical counter POS billing and online customer carts to prevent overselling highly perishable daily milk/paneer batches. Supabase Realtime websocket streams deliver change events in under 50ms without server polling overhead.',
          alternativeRejected: 'Periodic HTTP polling (high server load, 5–10s latency, and race conditions during morning peak demand).'
        },
        {
          tech: 'Zustand with localStorage Persistence over Redux Toolkit',
          why: 'Zustand provides a tiny 1KB bundle footprint with zero boilerplate, seamless slice modularity, and automatic local storage persistence with schema version migration support.',
          alternativeRejected: 'Redux Toolkit (unnecessary bundle bloat and action/reducer boilerplate for a quick-commerce cart).'
        },
        {
          tech: 'Leaflet & OpenStreetMap over Google Maps API',
          why: 'Zero API key costs, lightweight client footprint, and full control over offline tile caching, reverse geocoding, and custom Ambajogai landmark polygon bounding.',
          alternativeRejected: 'Google Maps JavaScript API (costly billing tiers and heavy external script weight).'
        }
      ]
    },
    featuresDeepDive: [
      {
        feature: 'Optimistic Zustand Cart with Dynamic ₹300 Free Delivery Progress',
        implementation: 'Custom Zustand store with debounced quantity clamping against live inventory levels, instantaneous subtotal calculations, and animated SVG progress meter toward the ₹300 free-delivery threshold.',
        impact: 'Increased average order value (AOV) by encouraging customers to add complementary dairy items (curd, buttermilk) to waive delivery fees.'
      },
      {
        feature: '25 km Geofenced Map Checkout with Ambajogai Presets',
        implementation: 'Integrated Leaflet map with interactive drag marker, geolocation API reverse geocoding, and Haversine formula distance verification from the dairy central depot (18.7304° N, 76.3874° E).',
        impact: 'Eliminated unserviceable out-of-boundary orders before checkout, reducing customer refund friction to zero.'
      },
      {
        feature: '5-Stage Live Order Tracker with Postgres CDC',
        implementation: 'Subscribed to `supabase.channel("orders").on("postgres_changes", { event: "UPDATE", filter: "id=eq." + orderId })` to trigger animated status badge updates and rider phone integration.',
        impact: 'Provided complete transparency for milk morning deliveries, dramatically reducing repetitive phone inquiries to the store.'
      }
    ],
    engineeringChallenges: [
      {
        problem: 'Stock Discrepancy Between Walk-in Counter Sales & Online Orders',
        solution: 'Implemented atomic decrement operations in PostgreSQL stored procedures paired with real-time websocket broadcast to invalidate or clamp customer cart items when stock falls below selected quantities.',
        lessonLearned: 'In quick commerce for perishable goods, database-level atomic operations combined with realtime client listeners are mandatory to prevent negative inventory.'
      },
      {
        problem: 'Strict Geofence Enforcement without Paid Cloud APIs',
        solution: 'Engineered a client-side Haversine mathematical distance calculation with bounding box pre-checks and localized Ambajogai landmark snapping.',
        lessonLearned: 'Mathematical geolocation algorithms often outperform heavy third-party SDKs in performance, privacy, and infrastructure cost for regional hyper-local delivery.'
      }
    ],
    interviewQA: [
      {
        question: 'How did you handle real-time inventory synchronization between physical store sales and online orders?',
        answer: 'I integrated Supabase PostgreSQL with Realtime channels. When an order is placed online or counter staff logs a sale on the POS, an atomic decrement trigger updates the inventory. A `postgres_changes` websocket listener broadcasts the new stock count to all connected clients in under 50ms, automatically clamping or warning users if an item in their cart is sold out.',
        starTechnique: {
          situation: 'Dairy products like milk and paneer are highly perishable with strictly limited daily production batches.',
          task: 'Ensure zero overselling when hundreds of local customers order during the 6:00 AM – 8:00 AM morning peak while counter customers are buying simultaneously.',
          action: 'Architected atomic PostgreSQL inventory decrements and connected client-side Zustand cart validators via Supabase Realtime channels.',
          result: 'Achieved 100% order fulfillment accuracy with zero stock overselling incidents across peak morning demand.'
        }
      },
      {
        question: 'Why did you choose Zustand instead of Redux Toolkit for state management?',
        answer: 'Zustand offers a 1KB footprint compared to Redux Toolkit, eliminating boilerplate while providing built-in middleware for localStorage persistence and state migration. In a mobile-first quick-commerce app where initial bundle size directly impacts conversion on 3G/4G networks, Zustand delivered optimal performance with instantaneous render times.',
        starTechnique: {
          situation: 'The mobile web app needed to load in under 1 second on regional 4G networks.',
          task: 'Implement persistent cart, user address book, and order status state without bloating bundle size.',
          action: 'Configured a lightweight Zustand store with versioned migration strategies to maintain cart items across browser reloads.',
          result: 'Kept overall bundle size under 50KB gzip with instantaneous optimistic UI steppers.'
        }
      }
    ]
  },
  {
    id: 'yogeshwari-dairy-shop-inventory',
    title: 'Yogeshwari Dairy Shop Inventory System',
    tagline: 'Full-Stack Dairy ERP, FEFO Expiry Tracking, Barcode POS & Customer Khata Ledger',
    role: 'Full Stack Developer & Mobile Architect',
    timeline: 'Completed & Production Ready',
    techStack: ['React 19', 'TypeScript', 'Capacitor', 'Supabase PostgreSQL', 'Node.js', 'Express', 'ZXing Barcode', 'Tesseract OCR', 'Tailwind CSS', 'Recharts'],
    elevatorPitch: {
      quick30Sec: 'I built Yogeshwari Dairy Shop Inventory System, a full-stack dairy ERP and POS platform with automated FEFO batch expiry allocation, camera/laser barcode checkout via ZXing, customer udhar Khata book, and Capacitor Android support with Supabase Realtime synchronization.',
      detailed90Sec: 'Dairy retail counters face high spoilage losses and checkout bottlenecks due to manual pen-and-paper ledgers and 24–72 hour product shelf-lives. I developed a high-throughput ERP and POS system using React 19, TypeScript, Capacitor, and Supabase PostgreSQL. The system uses atomic PostgreSQL functions (fn_fefo_deduct_and_allocate) to automatically consume the earliest-expiring milk/paneer batches first during barcode-driven counter sales. It also includes supplier intake with Tesseract OCR invoice reading, customer credit khata tracking, counter speaker audio chimes, and P&L financial reports with exportable PDF/Excel statements.'
    },
    architecture: {
      description: 'React 19 SPA & Capacitor Android APK with TanStack Virtual, WebAudio chime engine, Node.js REST API with Zod validation, and Supabase PostgreSQL with FEFO RPC stored procedures.',
      flow: [
        'Shop staff scans incoming supplier milk/dairy crates with camera OCR or barcode input, recording batch numbers, quantity, and manufacturing/expiry timestamps.',
        'During counter sales, cashier scans product EAN barcode or taps touch quick-keys; fractional gram/liter loose weights calculate automatically.',
        'System executes `fn_fefo_deduct_and_allocate` RPC transaction in PostgreSQL, sequentially deducting from earliest expiring batches with atomic rollback if stock is insufficient.',
        'Sales transaction logs update customer Khata ledger (credit/debit) and output thermal receipts via jsPDF/hardware printer.',
        'Incoming online quick-commerce orders trigger Web Audio synthesized chime alerts, Android vibration, and live dispatch packing queue.'
      ],
      techChoiceReasoning: [
        {
          tech: 'PostgreSQL Stored Procedures (RPC) for FEFO over Client-Side Calculations',
          why: 'Perishable dairy batches require transactional consistency across multiple sales registers. Executing FEFO deduction directly inside an atomic PostgreSQL function guarantees zero race conditions and eliminates the risk of two counter clerks deducting the same physical milk packet.',
          alternativeRejected: 'Client-side array filtering and sequential update queries (prone to network drops, race conditions, and negative inventory).'
        },
        {
          tech: 'Capacitor 8 over React Native',
          why: 'Allowed 100% code sharing between the desktop counter POS touchscreen interface and shopkeepers’ Android mobile devices, while providing native access to hardware camera barcode scanning and background push notifications.',
          alternativeRejected: 'Separate React Native codebase (would have required maintaining two distinct UI frameworks and duplicating business logic).'
        },
        {
          tech: 'ZXing & Tesseract OCR over Paid Scanner SDKs',
          why: 'Provides instant client-side barcode decoding and invoice receipt reading with zero recurring API costs or external latency.',
          alternativeRejected: 'Cloud Vision APIs (expensive recurring cost and dependent on persistent high-speed internet).'
        }
      ]
    },
    featuresDeepDive: [
      {
        feature: 'Automated FEFO (First-Expired, First-Out) Batch Deduction Engine',
        implementation: 'PostgreSQL stored procedure `fn_fefo_deduct_and_allocate(p_product_id, p_qty)` queries active lots ordered by `expiry_date ASC`, consuming quantities across multiple batches within an atomic ACID transaction.',
        impact: 'Reduced dairy product spoilage by over 35% by ensuring older batches are sold before fresher stock.'
      },
      {
        feature: 'High-Speed Barcode POS Counter with Fractional Weight Support',
        implementation: 'ZXing Web & Camera barcode listener paired with a touch quick-key grid. Supports loose milk and paneer weight calculations (e.g., 250g paneer = 0.25 * unit price) with sub-second receipt generation.',
        impact: 'Cut customer counter checkout queue wait times by more than 60% during peak morning hours.'
      },
      {
        feature: 'Digital Customer Udhar Khata Book & Statement Generator',
        implementation: 'Relational ledger tracking credit and debit transactions per customer with running balances, one-tap payment reconciliation, and downloadable PDF/Excel statements.',
        impact: 'Replaced error-prone manual paper diaries, accelerating customer credit recovery and audit transparency.'
      }
    ],
    engineeringChallenges: [
      {
        problem: 'Multi-Batch Fractional Inventory Allocations without Race Conditions',
        solution: 'Engineered an atomic PostgreSQL procedure using `SELECT ... FOR UPDATE` row-level locks on the earliest expiring batches, ensuring concurrent counter registers never oversell the same batch.',
        lessonLearned: 'In high-velocity retail with perishable inventory, concurrency control must be strictly enforced at the database transactional boundary rather than in application memory.'
      },
      {
        problem: 'Large Catalogue (25,000+ Items) Performance on Low-End Mobile POS Devices',
        solution: 'Decoupled master catalogue lookups from store active inventory using TanStack Virtual and IndexedDB local caching, maintaining 60 FPS scrolling and instant barcode resolution.',
        lessonLearned: 'Virtualization and intelligent client caching are essential when running heavy retail catalogues on budget Android hardware.'
      }
    ],
    interviewQA: [
      {
        question: 'How does your FEFO (First-Expired, First-Out) batch allocation work technically?',
        answer: 'I implemented an atomic PostgreSQL stored procedure called `fn_fefo_deduct_and_allocate`. When a sale occurs, it queries all non-expired batches for that product ordered by `expiry_date ASC` with row locks (`FOR UPDATE`). It iterates through the earliest batches, deducting the required quantity across lots if necessary. If the total available stock is less than the requested amount, the entire transaction rolls back atomically, preventing negative balances and ensuring older dairy stock is always moved first.',
        starTechnique: {
          situation: 'Dairy products like milk, paneer, and sweets spoil quickly within 24–72 hours.',
          task: 'Automate batch depletion so cashiers do not have to manually inspect dates during fast-paced morning queues.',
          action: 'Designed and deployed an atomic PostgreSQL RPC function that automatically drains the earliest-expiring inventory lots first.',
          result: 'Prevented stock expiration losses by 35% while eliminating manual cashier lot selection.'
        }
      },
      {
        question: 'How did you achieve cross-platform support between the web counter POS and Android mobile app?',
        answer: 'I built the core application with React 19 and Tailwind CSS, and wrapped it using Capacitor 8. This architecture allowed the desktop touchscreen counter POS and Android mobile devices to share 100% of the UI, state, and business logic, while giving native mobile devices access to the camera barcode scanner, haptic vibration, and audio chimes for incoming quick-commerce orders.',
        starTechnique: {
          situation: 'Store owners needed a desktop touchscreen setup on the counter and an Android mobile app for warehouse and delivery checks.',
          task: 'Deliver both platforms without maintaining two separate codebases or doubling development time.',
          action: 'Configured Capacitor 8 with responsive touch-first layouts and native hardware plugins.',
          result: 'Deployed unified web and Android APK experiences with zero duplicated logic and instant sync.'
        }
      }
    ]
  },
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

