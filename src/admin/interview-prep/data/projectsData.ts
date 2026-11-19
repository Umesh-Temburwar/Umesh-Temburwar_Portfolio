import { ProjectDiscussion } from '../types';

export const projectsData: ProjectDiscussion[] = [
  // 1. EDTECH LEARNING PLATFORM
  {
    id: 'edtech-platform',
    title: 'EdTech Learning Platform',
    tagline: 'Full-stack course management, interactive quizzes, automated certificates & progress tracking',
    role: 'Full Stack Developer (Sole Architect)',
    pitch30s:
      'I built a full-stack EdTech Learning Platform that enables students to enroll in courses, take timed quizzes, submit assignments, track real-time progress, and receive automated completion certificates. It features responsive React dashboards with role-based access control for students, instructors, and admins, backed by Node.js/Express REST APIs and Supabase PostgreSQL.',
    pitch2m:
      'During my final year, I realized many open-source LMS platforms were either overly bloated or lacked granular role-based security. I engineered this EdTech platform from scratch using React.js and Tailwind for the client, Node.js and Express for the REST API backend, and Supabase for PostgreSQL database, authentication, and cloud storage.\n\nThe system supports three distinct user roles: Students, Instructors, and Admins. Students can browse a catalog, view video lectures, take timed auto-graded quizzes, and earn verification certificates. Instructors get a dedicated dashboard to upload modules, evaluate assignments, and monitor student completion rates. Admins have complete governance over platform analytics, user bans, and course publishing.\n\nTechnically, I implemented Row Level Security (RLS) in PostgreSQL to enforce database-level multi-tenancy, integrated Supabase Storage for secure PDF certificate uploads, and designed a normalized relational schema with 8 interconnected tables. The hardest hurdle was handling race conditions during quiz timer expirations and automated certificate generation, which I solved with server-side timestamps and idempotent verification endpoints.',
    problem:
      'Traditional classroom environments lack automated continuous feedback loops, while enterprise LMS solutions are cost-prohibitive for smaller colleges and institutes, lacking transparent progress tracking and multi-tier role management.',
    targetUsers: [
      'Students (enrolling, consuming content, submitting assignments, taking quizzes, downloading certificates)',
      'Instructors (creating curriculum, authoring quizzes, grading submissions, student analytics)',
      'Platform Admins (user role assignment, course moderation, platform health monitoring)'
    ],
    coreFeatures: [
      'Modular Video & Article Curriculum Player with progress persistence',
      'Timed Quiz Engine with randomized question pools and auto-evaluation',
      'Assignment Submission Portal supporting PDF uploads via Supabase Storage',
      'Automated Certificate Generation with unique UUID verification links',
      'Role-Based Access Control (RBAC) protecting routes, APIs, and DB rows',
      'Instructor & Student Analytics Dashboards showing completion percentages'
    ],
    folderStructure: `edtech-platform/
├── client/                     # Frontend React.js SPA
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, VideoPlayer, QuizModal, ProtectedRoute
│   │   ├── context/            # AuthContext, CourseContext, ThemeContext
│   │   ├── hooks/              # useAuth, useCourses, useQuizTimer
│   │   ├── pages/              # /courses, /learn/:id, /dashboard, /admin, /certificates
│   │   ├── services/           # api.ts (axios instance with JWT interceptors), supabase.ts
│   │   └── App.tsx
├── server/                     # Backend Node.js / Express API
│   ├── config/                 # db.ts (pg pool), supabaseClient.ts, env.ts
│   ├── controllers/            # authController, courseController, quizController, certController
│   ├── middleware/             # authMiddleware (JWT verify), rbacMiddleware (checkRole), errorHandler
│   ├── models/                 # courseModel, quizModel, progressModel (SQL query builders)
│   ├── routes/                 # authRoutes, courseRoutes, quizRoutes, adminRoutes
│   └── server.ts
└── supabase/                   # Migrations, schema.sql, RLS policies`,
    architectureDescription:
      'React frontend communicates via Axios with a Node.js/Express REST API gateway. The gateway handles business logic, authorization middleware, and coordinates queries with Supabase PostgreSQL. Supabase Auth generates JWT tokens verified by both the Node backend and PostgreSQL RLS policies. Supabase S3-compatible Storage holds assignment files and certificate PDFs.',
    architectureSvg: `<svg viewBox="0 0 760 300" width="100%" height="220" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="300" fill="#f8fafc" rx="8" />
  <rect x="20" y="40" width="160" height="220" rx="8" fill="#ffffff" stroke="#4f46e5" stroke-width="2" />
  <text x="100" y="70" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e293b" text-anchor="middle">React.js Client</text>
  <rect x="35" y="90" width="130" height="30" rx="4" fill="#e0e7ff" />
  <text x="100" y="110" font-family="sans-serif" font-size="11" fill="#3730a3" text-anchor="middle">Role Dashboards</text>
  <rect x="35" y="130" width="130" height="30" rx="4" fill="#e0e7ff" />
  <text x="100" y="150" font-family="sans-serif" font-size="11" fill="#3730a3" text-anchor="middle">Video & Quiz Player</text>
  <rect x="35" y="170" width="130" height="30" rx="4" fill="#e0e7ff" />
  <text x="100" y="190" font-family="sans-serif" font-size="11" fill="#3730a3" text-anchor="middle">Axios Interceptors</text>
  <path d="M 180 150 L 280 150" stroke="#4f46e5" stroke-width="2" marker-end="url(#arrow)" />
  <text x="230" y="140" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="middle">REST / JWT</text>
  <rect x="280" y="40" width="190" height="220" rx="8" fill="#ffffff" stroke="#0ea5e9" stroke-width="2" />
  <text x="375" y="70" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e293b" text-anchor="middle">Express Backend API</text>
  <rect x="295" y="90" width="160" height="30" rx="4" fill="#e0f2fe" />
  <text x="375" y="110" font-family="sans-serif" font-size="11" fill="#0369a1" text-anchor="middle">JWT & RBAC Guard</text>
  <rect x="295" y="130" width="160" height="30" rx="4" fill="#e0f2fe" />
  <text x="375" y="150" font-family="sans-serif" font-size="11" fill="#0369a1" text-anchor="middle">Quiz Auto-Evaluation</text>
  <rect x="295" y="170" width="160" height="30" rx="4" fill="#e0f2fe" />
  <text x="375" y="190" font-family="sans-serif" font-size="11" fill="#0369a1" text-anchor="middle">Certificate Issuer</text>
  <path d="M 470 150 L 560 150" stroke="#0ea5e9" stroke-width="2" />
  <rect x="560" y="40" width="180" height="220" rx="8" fill="#ffffff" stroke="#10b981" stroke-width="2" />
  <text x="650" y="70" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e293b" text-anchor="middle">Supabase BaaS</text>
  <rect x="575" y="90" width="150" height="30" rx="4" fill="#d1fae5" />
  <text x="650" y="110" font-family="sans-serif" font-size="11" fill="#065f46" text-anchor="middle">PostgreSQL + RLS</text>
  <rect x="575" y="130" width="150" height="30" rx="4" fill="#d1fae5" />
  <text x="650" y="150" font-family="sans-serif" font-size="11" fill="#065f46" text-anchor="middle">Supabase Auth (JWT)</text>
  <rect x="575" y="170" width="150" height="30" rx="4" fill="#d1fae5" />
  <text x="650" y="190" font-family="sans-serif" font-size="11" fill="#065f46" text-anchor="middle">S3 Object Storage</text>
</svg>`,
    techStackWhy: [
      {
        tech: 'React.js (SPA) + Vite',
        reason:
          'Component modularity allowed clean separation between student player, quiz modal, and instructor management tables. Fast HMR speed with Vite.'
      },
      {
        tech: 'Tailwind CSS',
        reason:
          'Utility classes enabled creating clean responsive UI layouts without bloated custom CSS files; easy maintenance across different screen sizes.'
      },
      {
        tech: 'Node.js & Express.js',
        reason:
          'Lightweight, non-blocking I/O runtime perfect for routing API requests, running server-side quiz grading, and coordinating authentication logic.'
      },
      {
        tech: 'Supabase PostgreSQL',
        reason:
          'Strict relational integrity for course enrollments, prerequisites, and quiz scores. Row Level Security (RLS) provided defense-in-depth directly at DB level.'
      },
      {
        tech: 'Supabase Storage',
        reason:
          'S3-compatible bucket storage made PDF certificate and assignment file uploads seamless without needing heavy AWS S3 SDK boilerplate.'
      }
    ],
    databaseSchema: [
      {
        tableOrCollection: 'users',
        description: 'User profile records extending auth.users table',
        keyFields: ['id (UUID, PK)', 'email', 'full_name', 'role (student/instructor/admin)', 'created_at']
      },
      {
        tableOrCollection: 'courses',
        description: 'Course catalog details authored by instructors',
        keyFields: ['id (UUID, PK)', 'instructor_id (FK)', 'title', 'description', 'thumbnail_url', 'is_published']
      },
      {
        tableOrCollection: 'modules & lessons',
        description: 'Hierarchical lesson chapters and video links',
        keyFields: ['id (UUID, PK)', 'course_id (FK)', 'title', 'order_index', 'video_url', 'duration_seconds']
      },
      {
        tableOrCollection: 'enrollments',
        description: 'Tracks which student is enrolled in which course',
        keyFields: ['id (UUID, PK)', 'student_id (FK)', 'course_id (FK)', 'enrolled_at', 'completed_at']
      },
      {
        tableOrCollection: 'lesson_progress',
        description: 'Granular lesson completion for progress calculation',
        keyFields: ['id (UUID, PK)', 'enrollment_id (FK)', 'lesson_id (FK)', 'is_completed', 'updated_at']
      },
      {
        tableOrCollection: 'quizzes & questions',
        description: 'Quiz metadata, multiple choice questions, and answer keys',
        keyFields: ['id (UUID, PK)', 'course_id (FK)', 'title', 'time_limit_minutes', 'passing_score_percentage']
      },
      {
        tableOrCollection: 'quiz_attempts',
        description: 'Student submission scores, timestamps, and pass/fail status',
        keyFields: ['id (UUID, PK)', 'student_id (FK)', 'quiz_id (FK)', 'score', 'passed', 'submitted_at']
      },
      {
        tableOrCollection: 'certificates',
        description: 'Issued completion certificates with verification hash',
        keyFields: ['id (UUID, PK)', 'student_id (FK)', 'course_id (FK)', 'certificate_code', 'pdf_url', 'issued_at']
      }
    ],
    authAndRbac: {
      roles: ['Student', 'Instructor', 'Admin'],
      flowDescription:
        'Upon login, Supabase Auth issues a signed JWT containing user UUID. The user\'s assigned role is fetched from the `users` table and embedded into application state and request authorization headers. The Express backend verifies token validity with `authMiddleware` and checks permission with `rbacMiddleware(["admin", "instructor"])`.',
      securityRules:
        'In PostgreSQL, Row Level Security ensures: 1) Students can SELECT only courses they are enrolled in and their own quiz attempts. 2) Instructors can INSERT/UPDATE only courses where `instructor_id = auth.uid()`. 3) Only Admins can modify user roles or delete courses.'
    },
    apiDesign: [
      {
        method: 'POST',
        endpoint: '/api/courses/:id/enroll',
        purpose: 'Enrolls the authenticated student into the course and initializes progress tracking records',
        reqBody: '{ "paymentToken": "optional_token_123" }',
        resBody: '{ "success": true, "enrollmentId": "uuid-987", "message": "Enrolled successfully" }'
      },
      {
        method: 'POST',
        endpoint: '/api/quizzes/:quizId/submit',
        purpose: 'Submits answers for server-side evaluation and generates score snapshot',
        reqBody: '{ "answers": [{ "questionId": "q1", "selectedOption": 2 }, { "questionId": "q2", "selectedOption": 0 }] }',
        resBody: '{ "score": 85, "passed": true, "certificateEligible": true }'
      },
      {
        method: 'GET',
        endpoint: '/api/certificates/verify/:code',
        purpose: 'Public endpoint to verify authenticity of a student completion certificate',
        resBody: '{ "valid": true, "studentName": "Umesh Temburwar", "course": "React Mastery", "issuedDate": "2025-06-12" }'
      }
    ],
    hardestChallenges: [
      {
        challenge: 'Handling Quiz Timer Tampering & Tab Switching Race Conditions',
        solution:
          'Initially, the quiz timer ran only on the client, allowing students to pause JavaScript execution or edit timer state in DevTools. I re-architected it by storing `started_at` timestamp in the database upon quiz initialization. When submitted, the backend verifies `now - started_at <= duration + 10s grace`. Any late submission is rejected server-side.',
        outcome: 'Prevented cheating and ensured fair standardized grading across all students.'
      },
      {
        challenge: 'Dynamic Progress Calculation Bottleneck',
        solution:
          'Calculating course progress required counting completed lessons across multiple tables dynamically on every dashboard reload, causing slow queries. I solved this by writing a PostgreSQL trigger function that updates a cached `progress_percentage` column on the `enrollments` table whenever a row is inserted into `lesson_progress`.',
        outcome: 'Reduced course dashboard query response time from 380ms down to 22ms (17x speedup).'
      }
    ],
    securityAndScale: [
      'PostgreSQL Row-Level Security (RLS) guarantees data isolation even if client queries Supabase directly.',
      'Helmet.js and CORS policy configured on Express server to prevent clickjacking and unauthorized origin calls.',
      'JWT tokens validated on every private endpoint; no sensitive student data leaked in token payload.',
      'Rate limiting applied to auth and quiz submission endpoints using express-rate-limit.'
    ],
    futureImprovements: [
      'Implement Redis caching for hot course catalog queries and leaderboards.',
      'Add automated End-to-End (E2E) test coverage using Playwright / Cypress for quiz submission workflows.',
      'Set up GitHub Actions CI/CD pipeline to automate test execution and deployment to AWS / Render.',
      'Integrate WebSocket server (Socket.io) for real-time instructor-student doubt clarification chat.'
    ],
    honestNumbersDefense: {
      claim: 'Role-Based Architecture & Certificate Verification System',
      measurementTool: 'Unit tests, Supabase Dashboard logs, PostgreSQL query explain analyze',
      explanation:
        'The platform was tested with a seed database of 12 complete courses, 60+ modular video lessons, and 150+ dummy student enrollment records. Certificate verification URLs were tested with QR codes linked to live endpoints.',
      interviewScript:
        '"During development and testing in my final year, I seeded the database with 150+ simulated student profiles and 12 courses to stress-test the enrollment triggers, quiz timers, and certificate generation under concurrent requests. The RLS policies and triggers were verified directly using PostgreSQL `EXPLAIN ANALYZE` to ensure query times stayed under 30ms."'
    },
    crossQuestions: [
      {
        question: 'Why did you use Supabase instead of writing your own full PostgreSQL + Express backend from scratch?',
        answer:
          'Supabase gave me production-grade PostgreSQL with built-in Auth, Row-Level Security, and S3-compatible file storage out of the box. By using Supabase for infrastructure and combining it with a custom Express backend for specialized business logic (like server-side quiz grading and certificate issuance), I saved weeks of boilerplate infrastructure work while gaining enterprise-grade security.'
      },
      {
        question: 'How do you prevent a student from accessing an instructor-only API endpoint?',
        answer:
          'I use a two-tier defense: First, the Express backend has an `rbacMiddleware` that decodes the authenticated JWT, looks up the user\'s role in the database/token claims, and returns a 403 Forbidden if the role is not \'instructor\' or \'admin\'. Second, at the database level, PostgreSQL Row Level Security (RLS) rejects any INSERT or UPDATE on courses where `auth.uid()` does not match the instructor ID.'
      },
      {
        question: 'What happens if a student loses internet connection in the middle of a quiz?',
        answer:
          'The client saves selected answers in browser `localStorage` as the student progresses. When internet connectivity is restored, the client restores the selections. However, the server-side quiz timer continues to tick based on the initial database start timestamp, preventing offline timer manipulation.'
      },
      {
        question: 'How do you handle password storage and security?',
        answer:
          'Passwords are never stored in plaintext. Supabase Auth handles password hashing using Argon2 / bcrypt with automatic salt generation before storing in the internal `auth.users` table. The application layer never sees the raw password.'
      }
    ]
  },

  // 2. INVENTORY MANAGEMENT SYSTEM (AUTOMOBILE SPARE PARTS)
  {
    id: 'inventory-system',
    title: 'Automobile Spare Parts Inventory Management System',
    tagline: 'Web-based inventory tracking, role-based CRUD, category filtering & automated CSV reporting',
    role: 'Full Stack Developer',
    pitch30s:
      'I developed a web-based Inventory Management System tailored for automobile spare parts businesses. It features secure CRUD operations, role-based authentication for admins and store operators, category and vehicle compatibility filtering, low-stock threshold alerts, and one-click CSV report exports built with React.js, Node.js, Express, and MongoDB.',
    pitch2m:
      'Automobile spare parts retailers face a unique inventory problem: parts often have complex compatibility matrices (matching specific car makes, models, engine types, and years) which make standard generic inventory software hard to use. I developed this specialized solution using React.js and Tailwind on the frontend and Node.js with MongoDB on the backend.\n\nThe system allows store admins to manage suppliers, track stock across categories (Brakes, Engine, Suspension, Electricals, Transmission), set minimum reorder thresholds, and receive visual warning badges when stock is critically low. Store staff have permissions to record sales and look up part numbers without altering supplier prices.\n\nI chose MongoDB because automobile parts have highly variable attributes—for example, brake pads require brake disc diameter, while engine spark plugs require thread size and heat range. MongoDB\'s polymorphic document model handled these dynamic specifications cleanly without dozens of empty relational columns. I also built a search engine using MongoDB Compound Text Indexes and implemented stream-based CSV export for accounting reconciliation.',
    problem:
      'Automobile spare parts shops struggle with mismatched part numbers, manual stock counting errors, untracked inventory shrinkage, and lack of real-time alerts when fast-moving spare parts fall below reorder thresholds.',
    targetUsers: [
      'Store Managers / Admins (pricing, supplier purchase orders, inventory auditing, analytics)',
      'Sales Associates / Counter Staff (stock lookup, checking vehicle compatibility, logging sales)',
      'Warehouse Staff (receiving shipments, barcode/SKU scanning, shelf location tracking)'
    ],
    coreFeatures: [
      'Comprehensive CRUD for spare parts with vehicle compatibility tags',
      'Dynamic multi-filter search: Category, Brand, Vehicle Model, Price Range, and Stock Status',
      'Low Stock Alert System highlighting parts below safety threshold',
      'Role-Based Authentication (Admin vs Staff) with JWT and bcrypt',
      'One-click CSV Data Export for inventory valuation and tax filing',
      'Stock Adjustment Audit Trail logging who changed quantity and why'
    ],
    folderStructure: `inventory-system/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # PartsTable, FilterBar, StockBadge, AddPartModal, ExportCSV
│   │   ├── pages/              # Dashboard, InventoryList, LowStockReport, Suppliers, Users
│   │   ├── services/           # api.ts (Axios), inventoryService.ts
│   │   └── App.tsx
└── server/                     # Node.js + Express API
    ├── src/
    │   ├── config/             # db.js (Mongoose connection)
    │   ├── models/             # Part.js, Category.js, Supplier.js, AuditLog.js, User.js
    │   ├── controllers/        # inventoryController.js, authController.js, exportController.js
    │   ├── middleware/         # verifyToken.js, checkAdmin.js, validatePart.js
    │   ├── routes/             # partRoutes.js, categoryRoutes.js, authRoutes.js
    │   └── index.js`,
    architectureDescription:
      'Client SPA built with React communicates with Express REST endpoints. MongoDB stores flexible spare part documents using Mongoose schemas. When inventory actions occur, the server updates part quantities and writes an immutable audit record to `audit_logs`. A CSV streaming pipeline allows managers to download current stock valuation on demand.',
    architectureSvg: `<svg viewBox="0 0 760 300" width="100%" height="220" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="300" fill="#f8fafc" rx="8" />
  <rect x="20" y="40" width="170" height="220" rx="8" fill="#ffffff" stroke="#4f46e5" stroke-width="2" />
  <text x="105" y="70" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e293b" text-anchor="middle">React Dashboard</text>
  <rect x="35" y="90" width="140" height="30" rx="4" fill="#e0e7ff" />
  <text x="105" y="110" font-family="sans-serif" font-size="11" fill="#3730a3" text-anchor="middle">Parts Catalog & Filters</text>
  <rect x="35" y="130" width="140" height="30" rx="4" fill="#e0e7ff" />
  <text x="105" y="150" font-family="sans-serif" font-size="11" fill="#3730a3" text-anchor="middle">Low Stock Warnings</text>
  <rect x="35" y="170" width="140" height="30" rx="4" fill="#e0e7ff" />
  <text x="105" y="190" font-family="sans-serif" font-size="11" fill="#3730a3" text-anchor="middle">CSV Export Button</text>
  <path d="M 190 150 L 280 150" stroke="#4f46e5" stroke-width="2" marker-end="url(#arrow)" />
  <text x="235" y="140" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="middle">JSON / JWT</text>
  <rect x="280" y="40" width="200" height="220" rx="8" fill="#ffffff" stroke="#0ea5e9" stroke-width="2" />
  <text x="380" y="70" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e293b" text-anchor="middle">Express Server</text>
  <rect x="300" y="90" width="160" height="30" rx="4" fill="#e0f2fe" />
  <text x="380" y="110" font-family="sans-serif" font-size="11" fill="#0369a1" text-anchor="middle">RBAC Auth Guard</text>
  <rect x="300" y="130" width="160" height="30" rx="4" fill="#e0f2fe" />
  <text x="380" y="150" font-family="sans-serif" font-size="11" fill="#0369a1" text-anchor="middle">Stock Alert Triggers</text>
  <rect x="300" y="170" width="160" height="30" rx="4" fill="#e0f2fe" />
  <text x="380" y="190" font-family="sans-serif" font-size="11" fill="#0369a1" text-anchor="middle">CSV Stream Exporter</text>
  <path d="M 480 150 L 560 150" stroke="#0ea5e9" stroke-width="2" />
  <rect x="560" y="40" width="180" height="220" rx="8" fill="#ffffff" stroke="#10b981" stroke-width="2" />
  <text x="650" y="70" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e293b" text-anchor="middle">MongoDB Atlas</text>
  <rect x="575" y="90" width="150" height="30" rx="4" fill="#d1fae5" />
  <text x="650" y="110" font-family="sans-serif" font-size="11" fill="#065f46" text-anchor="middle">parts (Text Indexed)</text>
  <rect x="575" y="130" width="150" height="30" rx="4" fill="#d1fae5" />
  <text x="650" y="150" font-family="sans-serif" font-size="11" fill="#065f46" text-anchor="middle">suppliers collection</text>
  <rect x="575" y="170" width="150" height="30" rx="4" fill="#d1fae5" />
  <text x="650" y="190" font-family="sans-serif" font-size="11" fill="#065f46" text-anchor="middle">audit_logs collection</text>
</svg>`,
    techStackWhy: [
      {
        tech: 'MongoDB + Mongoose',
        reason:
          'Automobile parts have disparate technical specs (e.g. disc diameter, wattage, fluid volume, gear count). MongoDB documents naturally support varied key-value attributes without sparse SQL columns.'
      },
      {
        tech: 'Express.js & Node.js',
        reason:
          'High throughput for search queries and streaming capabilities for generating multi-megabyte CSV file downloads without memory leaks.'
      },
      {
        tech: 'React.js with Debounced Search',
        reason:
          'Fast interactive table rendering, responsive filtering, and immediate client-side feedback when updating stock levels.'
      },
      {
        tech: 'JSON Web Tokens (JWT) + bcrypt',
        reason:
          'Stateless, secure session management distinguishing between Store Admin and Cashier/Staff privileges.'
      }
    ],
    databaseSchema: [
      {
        tableOrCollection: 'parts',
        description: 'Spare part records with polymorphic attributes and compatibility tags',
        keyFields: ['_id (ObjectId)', 'partNumber (Indexed, unique)', 'name', 'category', 'compatibleVehicles [String]', 'costPrice', 'sellingPrice', 'quantity', 'minThreshold', 'specs (Object)', 'supplierId (Ref)']
      },
      {
        tableOrCollection: 'suppliers',
        description: 'Automobile parts distributors and contact info',
        keyFields: ['_id (ObjectId)', 'name', 'contactPerson', 'phone', 'email', 'address', 'paymentTerms']
      },
      {
        tableOrCollection: 'audit_logs',
        description: 'Immutable ledger of every inventory adjustment',
        keyFields: ['_id (ObjectId)', 'partId (Ref)', 'userId (Ref)', 'changeType (SALE/RESTOCK/DAMAGE/AUDIT)', 'previousQuantity', 'newQuantity', 'timestamp']
      },
      {
        tableOrCollection: 'users',
        description: 'Store employee credentials and access tier',
        keyFields: ['_id (ObjectId)', 'username', 'passwordHash', 'role (admin/staff)', 'createdAt']
      }
    ],
    authAndRbac: {
      roles: ['Admin', 'Staff'],
      flowDescription:
        'Staff can search catalog, view stock counts, and record sales adjustments. Admins have exclusive permissions to modify base cost prices, delete parts, create user accounts, and view gross profit margins.',
      securityRules:
        'Cost price and margin fields are excluded via Mongoose projection (`.select("-costPrice")`) whenever a non-admin token queries the API.'
    },
    apiDesign: [
      {
        method: 'GET',
        endpoint: '/api/parts?category=Brakes&search=Civic&page=1&limit=20',
        purpose: 'Paginated search with text query and category filtering',
        resBody: '{ "parts": [...], "totalCount": 42, "totalPages": 3, "currentPage": 1 }'
      },
      {
        method: 'PATCH',
        endpoint: '/api/parts/:id/adjust-stock',
        purpose: 'Updates quantity and creates immutable audit log record',
        reqBody: '{ "quantityDelta": -2, "reason": "Counter Sale", "invoiceId": "INV-504" }',
        resBody: '{ "success": true, "partNumber": "BP-2041", "updatedQuantity": 8, "isLowStock": false }'
      },
      {
        method: 'GET',
        endpoint: '/api/export/csv',
        purpose: 'Streams entire inventory as CSV attachment for Excel/Accounting',
        resBody: 'Content-Type: text/csv; filename="inventory-report.csv"'
      }
    ],
    hardestChallenges: [
      {
        challenge: 'Memory Bloat During Large CSV Exports',
        solution:
          'Originally, generating a CSV export loaded all inventory documents into an in-memory array before converting to text, which threatened to crash Node.js when dataset size expanded. I refactored the endpoint using Mongoose Cursor (`Part.find().cursor()`) piped directly into a transform stream (`json2csv`), streaming chunks to `res` with constant 15MB memory usage.',
        outcome: 'Achieved O(1) memory footprint regardless of whether exporting 100 or 100,000 records.'
      },
      {
        challenge: 'Preventing Concurrency Stock Overdraws (Race Condition)',
        solution:
          'If two counter sales happened simultaneously for the last item in stock, reading the quantity and then updating it caused negative stock. I solved this by using MongoDB\'s atomic `$inc` operator with a conditional check: `db.parts.updateOne({ _id, quantity: { $gte: qty } }, { $inc: { quantity: -qty } })`.',
        outcome: 'Completely eliminated negative stock anomalies under concurrent checkout requests.'
      }
    ],
    securityAndScale: [
      'Passwords hashed with bcrypt using 12 salt rounds.',
      'Mongoose schema sanitization protects against NoSQL injection queries (`$gt`, `$ne`).',
      'Compound text index on `name`, `partNumber`, and `compatibleVehicles` accelerates keyword searches.',
      'CORS restricted to authorized client dashboard domain.'
    ],
    futureImprovements: [
      'Barcode / QR code scanning using camera via web API for quick stock lookup on smartphones.',
      'Automated email/SMS notifications to suppliers when stock reaches `minThreshold`.',
      'Integration with an accounting platform like Tally or QuickBooks via webhook synchronization.',
      'Unit testing suite with Jest and Supertest for critical inventory calculation endpoints.'
    ],
    honestNumbersDefense: {
      claim: 'Automobile Spare Parts System with Category & CSV Export',
      measurementTool: 'MongoDB Atlas metrics, Postman collection benchmarks, CSV file verification',
      explanation:
        'The database was loaded with 500+ realistic spare part SKUs spanning Maruti, Hyundai, Tata, and Honda car models across 6 categories. Streamed CSV exports were tested up to 10,000 generated records to confirm low memory usage.',
      interviewScript:
        '"To validate system stability, I populated MongoDB with a dataset of 500+ spare parts across 6 categories with varied technical attributes and compatibility lists. I benchmarked text search response times (which averaged under 25ms due to compound indexes) and verified that streaming CSV downloads stayed under 20MB RAM usage during continuous exports."'
    },
    crossQuestions: [
      {
        question: 'Why did you choose MongoDB over PostgreSQL for this inventory system?',
        answer:
          'Automobile parts have wildly differing technical attributes: brake pads need disc dimensions, shock absorbers require stroke length, and engine sensors need pin counts and operating voltage. In a relational database, this either requires dozens of null columns or a complex Entity-Attribute-Value (EAV) anti-pattern. MongoDB documents enabled flexible polymorphic schemas while allowing compound text searches on vehicle compatibility tags.'
      },
      {
        question: 'How do you handle atomic stock updates in MongoDB without full multi-document transactions?',
        answer:
          'I use MongoDB\'s atomic `$inc` operator combined with a query filter condition: `findOneAndUpdate({ _id, quantity: { $gte: buyQty } }, { $inc: { quantity: -buyQty } })`. Because single document updates are atomic in MongoDB, this guarantees that two simultaneous requests cannot decrement the stock below zero.'
      },
      {
        question: 'How does your CSV export stream prevent Node.js from running out of memory?',
        answer:
          'Instead of reading all records into a single JavaScript array with `await Part.find()`, I use `Part.find().cursor()`. This fetches records from MongoDB in small batches and pipes them through a transform stream directly to the HTTP response stream (`res`), keeping memory usage constant regardless of file size.'
      }
    ]
  },

  // 3. BYTEFEST 2K25 (COLLEGE TECH FEST WEBSITE)
  {
    id: 'bytefest-2k25',
    title: 'ByteFest 2K25 Official Event Website',
    tagline: 'High-traffic event portal handling 2,000+ daily visitors, 1,500+ attendees & registrations',
    role: 'Lead Web Developer & System Administrator',
    period: 'May 2025 – June 2025',
    pitch30s:
      'I designed, developed, and deployed the official website for ByteFest 2K25, our college\'s annual technical fest. The site served as the central hub for event schedules, competitive guidelines, team registrations, and live announcements, handling over 2,000 daily visitors and successfully onboarding 1,500+ student attendees with 99.9% uptime.',
    pitch2m:
      'ByteFest 2K25 is the flagship technical symposium at MBES College of Engineering, drawing participation from colleges across the region for coding hackathons, robotics, web development competitions, and paper presentations. I served as the lead web developer responsible for end-to-end delivery.\n\nI built a responsive, visually engaging single-page application using React, Vite, and Tailwind CSS. The website featured dynamic event schedules, rulebooks, team registration forms with validation, automated entry ticket generation, and a live coordinator helpline.\n\nThe greatest challenge was handling sudden bursts of traffic when registrations opened and the day before the event. I hosted the frontend on Vercel\'s Edge CDN and optimized static assets, compressing hero media and font files. For the registration pipeline, I integrated Google Sheets API and Supabase to capture participant data with duplicate check heuristics. During the fest, the site recorded 2,000+ daily visitors and smoothly managed over 1,500 event participant registrations without a single server crash.',
    problem:
      'Previous fest editions relied on paper forms and scattered WhatsApp groups, leading to lost participant records, long registration desk queues, and miscommunication regarding event rules and room allocations.',
    targetUsers: [
      'College Students / Participants (viewing schedule, forming teams, registering for hackathons)',
      'Event Coordinators & Faculty (tracking registrations per competition, verifying payments, attendance)',
      'General Attendees & Guests (campus map, timing, live announcements)'
    ],
    coreFeatures: [
      'Interactive Event Catalog with filterable categories (Coding, Web Design, Robotics, Gaming, Seminar)',
      'Multi-Member Team Registration Form with client-side validation and instant confirmation',
      'Automated Digital Entry Pass with unique registration code',
      'Live Announcement Ticker for schedule updates and room change notifications',
      'Responsive Mobile-First Design optimized for low-bandwidth 4G college networks',
      'Organizer Admin Dashboard with real-time registration counts per event'
    ],
    folderStructure: `bytefest-2k25/
├── public/                     # Optimized images, rulebook PDFs, icons
├── src/
│   ├── assets/                 # SVGs, event logos
│   ├── components/             # Navbar, HeroSection, EventCard, ScheduleTimeline, RegistrationModal
│   ├── data/                   # eventsData.ts, coordinatorsData.ts, faqData.ts
│   ├── hooks/                  # useCountDown.ts, useWindowSize.ts
│   ├── pages/                  # Home, Events, Register, Schedule, Contact
│   ├── services/               # registrationService.ts (Supabase & Google Sheets webhook)
│   └── main.tsx
├── vercel.json                 # Caching headers, clean URLs, security headers
└── package.json`,
    architectureDescription:
      'Vercel Edge Network serves static HTML, CSS, and JS bundles from global CDN edge points. Registration requests are sent via HTTPS to Supabase backend and a Google Sheets sync webhook for instant spreadsheet viewing by faculty coordinators. Heavy assets are preloaded with aggressive caching headers.',
    architectureSvg: `<svg viewBox="0 0 760 300" width="100%" height="220" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="300" fill="#f8fafc" rx="8" />
  <rect x="20" y="40" width="170" height="220" rx="8" fill="#ffffff" stroke="#4f46e5" stroke-width="2" />
  <text x="105" y="70" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e293b" text-anchor="middle">2,000+ Daily Visitors</text>
  <rect x="35" y="90" width="140" height="30" rx="4" fill="#e0e7ff" />
  <text x="105" y="110" font-family="sans-serif" font-size="11" fill="#3730a3" text-anchor="middle">Mobile Smartphones</text>
  <rect x="35" y="130" width="140" height="30" rx="4" fill="#e0e7ff" />
  <text x="105" y="150" font-family="sans-serif" font-size="11" fill="#3730a3" text-anchor="middle">College Desktops</text>
  <rect x="35" y="170" width="140" height="30" rx="4" fill="#e0e7ff" />
  <text x="105" y="190" font-family="sans-serif" font-size="11" fill="#3730a3" text-anchor="middle">QR Code Scans</text>
  <path d="M 190 150 L 280 150" stroke="#4f46e5" stroke-width="2" />
  <rect x="280" y="40" width="200" height="220" rx="8" fill="#ffffff" stroke="#0ea5e9" stroke-width="2" />
  <text x="380" y="70" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e293b" text-anchor="middle">Vercel Edge CDN</text>
  <rect x="300" y="90" width="160" height="30" rx="4" fill="#e0f2fe" />
  <text x="380" y="110" font-family="sans-serif" font-size="11" fill="#0369a1" text-anchor="middle">Global Cache Points</text>
  <rect x="300" y="130" width="160" height="30" rx="4" fill="#e0f2fe" />
  <text x="380" y="150" font-family="sans-serif" font-size="11" fill="#0369a1" text-anchor="middle">Brotli Compression</text>
  <rect x="300" y="170" width="160" height="30" rx="4" fill="#e0f2fe" />
  <text x="380" y="190" font-family="sans-serif" font-size="11" fill="#0369a1" text-anchor="middle">Sub-50ms TTFB</text>
  <path d="M 480 150 L 560 150" stroke="#0ea5e9" stroke-width="2" />
  <rect x="560" y="40" width="180" height="220" rx="8" fill="#ffffff" stroke="#10b981" stroke-width="2" />
  <text x="650" y="70" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e293b" text-anchor="middle">Registration Pipeline</text>
  <rect x="575" y="90" width="150" height="30" rx="4" fill="#d1fae5" />
  <text x="650" y="110" font-family="sans-serif" font-size="11" fill="#065f46" text-anchor="middle">Supabase DB</text>
  <rect x="575" y="130" width="150" height="30" rx="4" fill="#d1fae5" />
  <text x="650" y="150" font-family="sans-serif" font-size="11" fill="#065f46" text-anchor="middle">Google Sheets Webhook</text>
  <rect x="575" y="170" width="150" height="30" rx="4" fill="#d1fae5" />
  <text x="650" y="190" font-family="sans-serif" font-size="11" fill="#065f46" text-anchor="middle">1,500+ Registrations</text>
</svg>`,
    techStackWhy: [
      {
        tech: 'React.js & Tailwind CSS',
        reason:
          'Fast component composition for interactive event timelines, rules modals, and responsive layout that renders flawlessly on mobile phones.'
      },
      {
        tech: 'Vite',
        reason:
          'Lightning-fast build tooling producing lean, tree-shaken JavaScript bundles.'
      },
      {
        tech: 'Vercel Edge Network',
        reason:
          'Provided zero-maintenance global CDN hosting, automatic SSL certificates, Brotli compression, and seamless uptime during high-concurrency registration spikes.'
      },
      {
        tech: 'Supabase PostgreSQL + Google Sheets Webhook',
        reason:
          'Provided a reliable relational database for registrations while concurrently syncing to a shared Google Sheet so faculty coordinators could view live attendance lists without needing a separate admin dashboard.'
      }
    ],
    databaseSchema: [
      {
        tableOrCollection: 'registrations',
        description: 'Participant details and team members for ByteFest events',
        keyFields: ['id (UUID)', 'teamName', 'leadName', 'leadEmail', 'leadPhone', 'collegeName', 'eventId', 'teamMembers (JSONB)', 'paymentReference', 'checkedIn (Boolean)', 'createdAt']
      },
      {
        tableOrCollection: 'events',
        description: 'Festival competitions and schedules',
        keyFields: ['id', 'title', 'category', 'venue', 'startTime', 'maxTeamSize', 'fee']
      }
    ],
    authAndRbac: {
      roles: ['Public Participant', 'Event Coordinator'],
      flowDescription:
        'Participants access the site openly without account creation to reduce friction. Coordinators have PIN-protected dashboard access to mark check-ins and download CSV lists.',
      securityRules: 'Rate-limiting applied on registration submissions to block bot spam.'
    },
    apiDesign: [
      {
        method: 'POST',
        endpoint: '/api/register',
        purpose: 'Validates team data, checks duplicate email/phone, saves registration, and triggers confirmation',
        reqBody: '{ "eventId": "code-clash", "leadName": "Umesh", "leadEmail": "umesh@example.com", "phone": "8856087984", "teamSize": 2 }',
        resBody: '{ "success": true, "ticketCode": "BF25-CC-401", "message": "Registered successfully" }'
      }
    ],
    hardestChallenges: [
      {
        challenge: 'Mobile Performance Over Low-Bandwidth Campus Networks',
        solution:
          'Many students browsed the website using spotty 4G connections on campus. Initial page weight was around 3.8MB due to uncompressed event banners. I converted all images to modern WebP format, implemented responsive `srcset`, used lazy loading for below-the-fold event cards, and stripped unused CSS with Tailwind JIT.',
        outcome: 'Reduced total page bundle size from 3.8MB down to 420KB, cutting mobile load time from 4.5s to 0.8s.'
      },
      {
        challenge: 'Preventing Duplicate Registrations Under Network Retries',
        solution:
          'When cell reception stuttered, students frequently clicked "Submit" multiple times, resulting in duplicate records in the database. I added both client-side button disabling with debounce and a PostgreSQL unique compound index constraint on `(leadEmail, eventId)`.',
        outcome: 'Completely eliminated duplicate registrations and prevented team count confusion.'
      }
    ],
    securityAndScale: [
      'Edge CDN caching stripped origin load during traffic spikes.',
      'Input sanitization to prevent XSS in attendee list displays.',
      'HTTPS enforced with TLS 1.3 encryption across all traffic.'
    ],
    futureImprovements: [
      'Direct payment gateway integration (Razorpay/UPI deep linking) for automated payment verification.',
      'Dynamic QR code scanner PWA for desk volunteers to check in attendees in under 2 seconds.'
    ],
    honestNumbersDefense: {
      claim: '2,000+ Daily Visitors & 1,500+ Attendees/Registrations',
      measurementTool: 'Vercel Analytics Dashboard & Supabase Registration Database row count',
      explanation:
        'During the 5-day promotional peak and the 2 event days, Vercel Analytics recorded 2,140 unique visitors on day 1 and 2,420 unique visitors on day 2. The database logged exactly 1,538 registered participants across 8 competitive events.',
      interviewScript:
        '"I tracked traffic metrics directly through Vercel Web Analytics, which recorded peak daily unique visitors of 2,140 and 2,420 during the main registration and fest days. The 1,500+ attendees metric is verifiable directly from our backend database, which recorded 1,538 individual student registrations across our 8 competitive events (including hackathons, coding, and robotics)."'
    },
    crossQuestions: [
      {
        question: 'How did you ensure the website didn\'t crash when 2,000+ visitors hit the server simultaneously?',
        answer:
          'Because the frontend was built as a static Single Page Application (SPA) and deployed on Vercel\'s Edge CDN, requests for HTML, CSS, JavaScript, and images were served directly from edge cache locations close to the users. This completely insulated the origin server from static file traffic spikes. For registrations, Supabase PostgreSQL handled the connection pool efficiently.'
      },
      {
        question: 'How did you measure the 2,000+ daily visitors and 1,500+ registrations mentioned on your resume?',
        answer:
          'The 2,000+ daily visitors metric was recorded using Vercel Analytics and Google Analytics during our peak registration window. The 1,500+ attendees metric was the exact count of unique registered participants in our database across all team and individual events (Coding, Web Design, Robotics, Paper Presentation).'
      },
      {
        question: 'What was your role in the ByteFest 2K25 project?',
        answer:
          'I was the lead web developer. I designed the UI, coded the React frontend, configured the database and Google Sheets synchronization pipeline, deployed the site on Vercel, and provided live on-ground technical support during the fest days.'
      }
    ]
  }
];

