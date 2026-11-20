// TODO: Replace with your actual URLs, emails, and file paths. 
// Look for "TODO:" comments throughout this file.

export const profileLinks: { name: 'LinkedIn' | 'GitHub' | 'LeetCode' | 'HackerRank' | 'GeeksforGeeks' | 'Instagram' | 'Email'; url: string }[] = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/umesh-temburwar' }, // TODO: add my real profile URL
  { name: 'GitHub', url: 'https://github.com/Umesh-Temburwar' },
  { name: 'Instagram', url: 'https://www.instagram.com/umesh_temburwar' },
  { name: 'Email', url: 'mailto:umeshtemburwar2002@gmail.com' },
  { name: 'LeetCode', url: '' }, // TODO: add my real profile URL
  { name: 'HackerRank', url: '' }, // TODO: add my real profile URL
  { name: 'GeeksforGeeks', url: '' }, // TODO: add my real profile URL
];

export interface ProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  shortDescription: string;
  description: string;
  problem?: string;
  solution?: string;
  features?: string[];
  architecture?: string;
  challenges?: string;
  tech: string[];
  status: string;
  githubUrl: string;
  liveUrl: string;
  screenshots: string[];
  coverImage: string;
}

export const portfolioData = {
  header: {
    logo: "UMESH TEMBURWAR",
    navLinks: [
      { name: "Projects", href: "/projects" },
      { name: "Resume", href: "/resume" },
      { name: "Contact", href: "/contact" },
    ]
  },
  navbar: {
    brandName: "Umesh Temburwar",
    brandRole: "Computer Science Engineer",
    avatarUrl: "/umesh.jpg",
    ctaText: "Let's talk",
    ctaLink: "/contact",
    items: [
      { name: "About", href: "#about" },
      { name: "Skills", href: "#skills" },
      { name: "Projects", href: "#projects" },
      { name: "Experience", href: "#experience" },
      { name: "Education", href: "#education" },
      { name: "Certifications", href: "#certifications" },
      { name: "Contact", href: "#contact" },
    ]
  },
  hero: {
    name: "Umesh Temburwar",
    title: "Computer Science Engineer | Full-Stack Developer | React · Node.js · TypeScript",
    role: "Computer Science Engineer | Full-Stack Developer",
    subtitle: "B.Tech CSE Student (2022-2026)",
    description: "I am a fresh, passionate developer seeking software engineering roles, with a strong interest in full-stack web development, Python, AI automation, and cybersecurity.",
    heroStack: ["React", "Node.js", "TypeScript", "MongoDB", "PostgreSQL"],
    idCard: {
      line1: "B.Tech CSE, 2022-2026",
      line2: "Ambajogai, Maharashtra"
    },
    // TODO: Insert your actual GitHub URL here
    githubUrl: "https://github.com/Umesh-Temburwar",
    // TODO: Insert your actual LinkedIn URL here
    linkedinUrl: "https://www.linkedin.com/in/umesh-temburwar",
    // Profile photo (Used for BOTH the Hero section and the dynamic NavBar logo)
    // To update your photo and logo, simply replace the file in the public/ folder or change this path.
    profilePhoto: "/umesh.jpg",
  },
  about: {
    title: "About Me",
    subtitle: "THE PERSON BEHIND THE WORK",
    content: "I am a Computer Science Engineering student with a solid foundation in building full-stack web applications. My development journey revolves around continuous learning in databases, modern web development, and emerging AI tools. I enjoy translating complex problems into clean, scalable code and am excited to bring my technical skills to professional software engineering roles.",
    bio: "I am dedicated to building robust, accessible, and high-performance digital solutions. My experience ranges from architecting end-to-end full-stack web platforms with React and Node.js to designing resilient REST APIs, automated backend workers, and cloud storage workflows.",
    metrics: [
      { value: "3+", label: "Years Building & Coding" },
      { value: "10+", label: "Full-Stack & AI Projects" },
      { value: "2,000+", label: "ByteFest Daily Visitors" },
      { value: "THE WORK", label: "REAL-WORLD IMPACT." }
    ]
  },
  projects: [
    {
      id: "universal-job-apply-bot",
      title: "Universal Job Apply Bot",
      subtitle: "Full-Stack Job Application Automation Platform",
      category: "Full-Stack Development / Browser Automation",
      shortDescription: "A full-stack job application automation platform designed to streamline job searching and application workflows using Python, browser automation, React, FastAPI, and Supabase.",
      description: "Developed a full-stack platform for automating repetitive job application workflows using Python, Selenium, FastAPI, React, and Supabase. The system features a modern control dashboard, asynchronous task worker dispatch, stealth browser automation with anti-detection pacing, dynamic resume upload, and persistent SQLite tracking ensuring zero duplicate submissions.",
      problem: "Job seekers spend hundreds of hours manually searching job portals, re-entering identical profile details, filling repetitive screening questionnaires, and tracking application statuses across disjointed portals without unified metrics.",
      solution: "Engineered an end-to-end automation platform combining a React 19 + TypeScript SPA dashboard, an asynchronous Python FastAPI backend, stealth Selenium browser workers, and Supabase cloud state management. Handles automated keyword searches, form filling, cover notes, and non-blocking smartphone alert notifications.",
      features: [
        "Automated multi-platform application workflows across Naukri, LinkedIn, Indeed, and Internshala",
        "Stealth browser automation engine with human-like delays, mouse trajectories, and anti-bot evasion",
        "FastAPI asynchronous REST backend with background worker task queue and rate-limiting",
        "Modern React 19 + TypeScript dashboard with live telemetry logs and application CRM table",
        "AI-assisted screening answerer and ATS keyword match scoring against candidate profile",
        "Persistent SQLite tracking database ensuring zero duplicate job applications",
        "Cloud-ready deployment architecture on Vercel (Frontend) and Render (FastAPI Backend)"
      ],
      architecture: "React Frontend (Vite + Tailwind CSS) → FastAPI Async REST API (Python) → Background Automation Worker → Stealth Selenium WebDriver (Browser Automation) ↔ Supabase (Cloud Auth/DB) & SQLite (Local CRM)",
      challenges: "Mitigating portal bot detection and dynamic DOM mutations across frequent UI updates; orchestrating non-blocking background workers with real-time log streaming; handling multi-step application modal forms with conditional screening questionnaires reliably.",
      tech: ["Python", "Selenium", "FastAPI", "React", "Supabase", "REST API", "TypeScript", "Tailwind CSS", "SQLite"],
      status: "Completed",
      githubUrl: "https://github.com/Umesh-Temburwar/universal-job-apply-bot",
      liveUrl: "https://universal-job-apply-bot.vercel.app",
      screenshots: ["/universal-job-apply-bot.png"],
      coverImage: "/universal-job-apply-bot.png",
    },
    {
      id: "yogeshwari-dairy-ecommerce",
      title: "Yogeshwari Dairy E-Commerce Platform",
      subtitle: "Full-Stack D2C Fresh Dairy Products Online Ordering & Delivery Platform",
      category: "E-Commerce / Full-Stack Web Application",
      shortDescription: "A high-performance, mobile-first quick-commerce platform delivering farm-fresh cow & buffalo milk, bilona ghee, soft paneer, and authentic dairy sweets across Ambajogai in 10–15 minutes. Features an interactive slide-over cart, dynamic free-delivery progress meter, map-based GPS delivery location validation, and a 5-stage real-time order tracking pipeline.",
      description: "Yogeshwari Dairy E-Commerce is a production-grade D2C quick-commerce web application engineered to bridge traditional brick-and-mortar dairy counters with digital quick commerce. Customers browse an extensive catalog of fresh dairy essentials, regional sweets, and top FMCG brands using cascading category drill-downs, dynamic brand shelves, and real-time stock-aware filtering. The platform supports seamless item additions with optimistic quantity steppers, best-before shelf-life transparency, and automated store open/closed operating schedules.\n\nThe checkout experience is optimized for speed and reliability, featuring an interactive Leaflet/OpenStreetMap address picker that validates delivery serviceability within a 25 km geo-envelope, phone validation, and multi-address management (Home, Shop, Work). Orders are instantly dispatched to the shop counter POS system through Supabase Realtime channels with zero-latency PostgreSQL change events, generating one-tap WhatsApp order receipts and driving a live 5-stage order tracking workflow from packing to doorstep delivery.",
      problem: "Local dairy customers faced friction ordering perishable farm-fresh milk and daily dairy staples due to erratic shop timings, lack of transparent delivery schedules, and non-existent digital channels for local dairies. Meanwhile, physical dairy counters struggled with manual phone orders, paper-based udhar ledgers, uncoordinated delivery routing, and inventory discrepancies between store walk-ins and delivery orders.",
      solution: "Engineered a lightning-fast, mobile-first D2C web storefront integrated with the dairy's central POS and Supabase database. The solution provides sub-100ms client-side product filtering by category and brand, persistent cart synchronization, automatic delivery radius enforcement via Haversine geolocation, live store operational status controls, and real-time bi-directional order dispatch tracking.",
      features: [
        "Interactive Dairy Product Catalog: Multi-category browsing (Cow/Buffalo Milk, Ghee, Spongy Paneer, Curd, Chaas, Sweets) with instant search, cascading brand filters, and stock-quantity badges.",
        "Dynamic Persistent Shopping Cart: Zustand-powered cart drawer with optimistic quantity steppers, maximum stock threshold clamping, live subtotal computation, and a dynamic ₹300 free delivery progress bar.",
        "Frictionless Map & Geolocation Checkout: Leaflet-powered GPS location picker with reverse geocoding, Ambajogai landmark presets, 25 km delivery envelope validation, and multi-address book management.",
        "5-Stage Real-Time Live Order Tracker: Instant visual progression (Placed → Confirmed → Packing → Out for Delivery → Delivered) with live Supabase Postgres change streams and delivery rider contact integration.",
        "Blinkit/Zepto-Style Promotional Architecture: Auto-sliding hero promo carousel with touch swipe gestures, category/brand deep linking, and Flipkart-style 72px brand logo strip with vector fallback avatars.",
        "Store Operations & Counter POS Synchronization: Automated opening/closing store states (6:00 AM – 10:00 PM), preventing checkout when closed, with real-time stock decrement and admin order packing workflows.",
        "Mobile-First Responsive PWA Experience: Sub-50KB initial CSS bundle, native haptic feedback triggers (navigator.vibrate), canvas-confetti order celebration, and accessible touch targets (≥44px) meeting WCAG AA standards."
      ],
      architecture: "React 18 (Vite) + TypeScript Frontend → Zustand Persistence Store (State & Storage Layer) → Leaflet / OpenStreetMap GeoEngine (25 km Delivery Boundary & Coordinates) → Supabase PostgreSQL + Realtime Channels (Postgres CDC for Products, Orders & Stock) ↔ Express/Node.js POS Backend (Order Inward, Batch Traceability & Counter Dispatch) → WhatsApp Business Webhooks & Live Order Tracker",
      challenges: "1. Real-time Inventory & Concurrency Reconciliation: Synchronizing fast-moving perishable stock between walk-in counter POS billing and online e-commerce carts using Supabase Realtime postgres_changes listeners and atomic database inventory decrement triggers.\n2. Geofenced Delivery Serviceability: Enforcing a strict 25 km Ambajogai delivery envelope using Haversine mathematical distance formulas on client-selected GPS coordinates while providing instantaneous fallback for manual street addresses and popular local landmarks.\n3. Zero-Latency State Persistence & Data Sanitation: Designing resilient Zustand client stores with versioned migration strategies (v5 storage upgrade) to transparently purge legacy mock records, eliminate pre-filled dummy profiles, and maintain cart integrity across browser tab reloads and offline reconnections.",
      tech: [
        "React 18",
        "TypeScript",
        "Vite",
        "Zustand",
        "Tailwind CSS",
        "@supabase/supabase-js",
        "PostgreSQL",
        "Leaflet",
        "react-leaflet",
        "React Router DOM",
        "Lucide React",
        "Canvas Confetti",
        "Vitest",
        "PostCSS",
        "Autoprefixer"
      ],
      status: "Completed",
      githubUrl: "https://github.com/Umesh-Temburwar/Yogeshwari-Dairy-Ecommerce",
      liveUrl: "https://yogeshwari-dairy-ecommerce.vercel.app",
      screenshots: [],
      coverImage: "/dairy-ecommerce-mockup.svg",
    },

    {
      id: "edtech",
      title: "EdTech Learning Platform",
      shortDescription: "A full-stack learning platform with roles for students, instructors, and admins.",
      description: "A comprehensive e-learning solution featuring course browsing, quizzes, assignments, certificates, and progress tracking. Includes distinct role-based React dashboards for students, instructors, and administrators to seamlessly manage content and learning goals.",
      tech: ["React.js", "Node.js", "Express.js", "Supabase", "PostgreSQL", "REST APIs"],
      status: "Completed",
      // TODO: Add GitHub URL for EdTech platform
      githubUrl: "https://github.com/Umesh-Temburwar/Ed-tech-platform",
      // TODO: Add Live Demo URL if available
      liveUrl: "https://edtechacademy.vercel.app",
      // TODO: Add an array of screenshot paths here
      screenshots: [],
      coverImage: "/EdTech Learning Platform.png",
    },
    {
      id: "yogeshwari-dairy-shop-inventory",
      title: "Yogeshwari Dairy Shop Inventory System",
      subtitle: "Full-Stack Dairy Inventory, Daily Stock Ledger & Supply Tracking System",
      category: "Full-Stack Development / Business Automation",
      shortDescription: "A robust, mobile-first dairy ERP and POS system engineered for precision stock control, batch-wise FEFO expiry tracking, and real-time dairy inventory management. It streamlines daily supplier intake, counter billing, and customer udhar ledgers with instant synchronization across web and Android devices.",
      description: "Yogeshwari Dairy Shop Inventory System provides a comprehensive, end-to-end operational workflow tailored specifically for high-turnover dairy retail. Staff and store owners can record supplier intake with invoice scanning (Tesseract OCR), automate batch-level FEFO (First-Expired, First-Out) shelf-life monitoring for highly perishable items (milk, paneer, curd, butter, and sweets), and process counter sales via integrated barcode scanning (@zxing) and quick-touch POS billing. Every completed sale or customer return triggers atomic inventory deductions, preventing stock discrepancies and negative balance states.\n\nThe system integrates automated low-stock and expiry threshold alerts, counter speaker audio alarms, and browser/OS push notifications for incoming online customer orders. Store owners gain access to role-based analytics dashboards featuring profit-and-loss reports, daily revenue summaries, customer Khata (credit ledger) reconciliations, and exportable PDF/Excel statements—delivering total visibility and financial accountability from milk collection to customer checkout.",
      problem: "Traditional dairy shops and local retail counters suffer from reliance on manual pen-and-paper ledgers, leading to frequent errors in reconciling daily milk collection against physical sales. The highly perishable nature of dairy goods (with shelf lives ranging from 24 to 72 hours) causes substantial financial losses through untracked product spoilage, missed expiry dates, and unaccounted shrinkage. Furthermore, shopkeepers face stock shortages during peak hours, unorganized supplier credit balances, and slow manual checkout queues that frustrate customers.",
      solution: "The system delivers an automated, audit-logged inventory management platform with real-time atomic quantity reconciliation and multi-device Supabase Realtime synchronization. It replaces manual registers with transactional FEFO batch allocation, automated low-stock warnings, and barcode-driven POS billing. Role-based dashboards (Owner, Manager, Cashier, Delivery Staff) provide instant access to daily ledger records, supplier payments, digital customer khata books, and automated receipt printing—eliminating operational blind spots and revenue leakages.",
      features: [
        "Real-time stock tracking for perishable dairy items (milk, paneer, curd, ghee, butter, and sweets) with fractional gram/liter quantity support",
        "Supplier & batch management with entry date, manufacturing/expiry date tracking, and automated FEFO (First-Expired, First-Out) lot allocation",
        "High-speed POS billing counter with camera/hardware barcode scanning (@zxing), loose weight calculations, and instant inventory deductions",
        "Automated low-stock threshold alerts, expiry dashboard, and counter speaker audio alarms for critical inventory updates",
        "Comprehensive sales analytics, daily revenue & profit/loss tracking, customer Khata (credit/debit ledger), and exportable PDF/Excel reports",
        "Responsive, one-thumb mobile UI and Capacitor Android APK optimized for fast counter operation, offline caching, and PWA installation",
        "Enterprise-grade data security with Supabase PostgreSQL Row Level Security (RLS), Zod schema validation, and immutable stock movement audit logs"
      ],
      architecture: "Client Layer: React 19 SPA (Vite + Tailwind CSS + Lucide Icons) & Native Android App (Capacitor 8) -> State & Data Layer: React Context API, TanStack Virtual, WebAudio Engine & Service Worker Push API -> Backend API Layer: Node.js & Express REST API with Zod validation -> Database & Realtime Layer: Supabase PostgreSQL (Row-Level Security, RPC Transactional Stored Procedures, Realtime Change Streams & PostGIS / Storage Buckets)",
      challenges: "1. Perishable Batch & FEFO Deduction Engine: Implemented atomic PostgreSQL database functions (fn_fefo_deduct_and_allocate) that automatically consume inventory from the earliest expiring batch first, eliminating manual lot selection and preventing negative stock race conditions during high-volume counter sales.\n2. Real-Time Hardware & Mobile Notification Pipeline: Architected a resilient cross-platform alerting workflow integrating Web Audio API synthesized chimes, Android vibration patterns, and Service Worker Web Push notifications to alert staff of incoming online orders even when the app is in the background or locked.\n3. High-Throughput Barcode & Catalogue Synchronization: Engineered a dual-table architecture separating master catalogue items (25,000+ PackSense India dataset entries) from physical in-stock batches, preserving shop purchase/selling margins while maintaining millisecond scan lookups via indexed text-based EAN/UPC barcodes.",
      tech: [
        "React 19",
        "TypeScript",
        "Tailwind CSS",
        "Vite",
        "Capacitor",
        "Node.js",
        "Express",
        "Supabase",
        "PostgreSQL",
        "ZXing",
        "Tesseract.js",
        "Recharts",
        "jsPDF",
        "Leaflet",
        "Zod"
      ],
      status: "Completed",
      githubUrl: "https://github.com/Umesh-Temburwar/Yogeshwari-Dairy-Shop-Inventory-System",
      liveUrl: "https://yogeshwari-dairy-shop.vercel.app",
      screenshots: [],
      coverImage: "/dairy-inventory-mockup.svg",
    },
    {
      id: "bytefest",
      title: "ByteFest 2K25 Event Website",
      shortDescription: "Official website built for a technical fest in Ambajogai.",
      description: "Developed and managed the official website for the ByteFest technical festival. Handled participant registrations, data management, and ensured smooth site performance and technical support throughout the event.",
      // TODO: Confirm the exact tech stack used for ByteFest
      tech: ["React.js", "Tailwind CSS"],
      status: "Completed",
      // TODO: Add GitHub URL for ByteFest
      githubUrl: "https://github.com/Umesh-Temburwar/ByteFest2K25-Official_Website",
      // TODO: Add Live Demo URL if available
      liveUrl: "https://bytefest2k25.vercel.app",
      // TODO: Add an array of screenshot paths here
      screenshots: [],
      coverImage: "/bytefest2k25.png",
    },
    {
      id: "ai-forensics",
      title: "AI-Powered Digital Forensics Automation",
      shortDescription: "Automated digital forensics tool powered by AI.",
      description: "An experimental initiative aimed at automating routine digital forensics tasks using AI, increasing efficiency and accuracy in data analysis.",
      tech: ["Python", "AI", "Cybersecurity"],
      status: "Experimental / Planned",
      githubUrl: "",
      liveUrl: "",
      screenshots: [],
      coverImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
    }
  ] as ProjectItem[],
  skills: {
    core: [
      { category: "Languages", items: ["C", "C++", "Python", "JavaScript", "TypeScript"] },
      { category: "Frontend", items: ["React.js", "HTML", "CSS", "Tailwind CSS"] },
      { category: "Backend", items: ["FastAPI", "Python", "Node.js", "Express.js", "REST APIs", "Authentication"] },
      { category: "Databases", items: ["Supabase", "PostgreSQL", "SQLite", "MongoDB", "Firebase", "SQL"] },
      { category: "Tools", items: ["Selenium", "Git", "GitHub", "VS Code", "Postman", "Linux", "Docker"] },
      { category: "CS Fundamentals", items: ["Data Structures and Algorithms", "OOP", "DBMS", "Operating Systems", "Computer Networks"] }
    ],
    learning: [
      "AI automation", "Cybersecurity", "Linux", "Cloud Computing"
      // TODO: If you are comfortable explaining these in an interview, uncomment them:
      // "Next.js", "Flask", "MySQL"
    ]
  },
  experience: [
    {
      role: "Project Coordinator & Core Tech Member",
      company: "ByteFest",
      location: "Ambajogai, Maharashtra",
      duration: "May 2025 - June 2025",
      description: "Served as the primary website developer, data manager, and core organizer. Handled participant registrations, technical support, and site maintenance during the festival.",
      // TODO: If you have accurate attendee/visitor numbers, add them here
      highlights: [
        "Built and maintained the event website.",
        "Managed participant registration data.",
        "Provided live technical support during the fest."
      ]
    }
  ],
  education: [
    {
      degree: "B.Tech in Computer Science and Engineering",
      institution: "M.B.E. Society's College of Engineering",
      location: "Ambajogai, Maharashtra",
      duration: "2022 - 2026",
      cgpa: "6.06",
      degreeType: "Bachelor of Technology (B.Tech)",
      coreFocus: "Focusing on Computer Science fundamentals: Data Structures, Algorithms, DBMS, Operating Systems, Computer Networks, and Full-Stack Engineering.",
      competencies: ["Data Structures", "Algorithms", "DBMS & SQL", "Operating Systems", "Computer Networks", "OOP", "Full-Stack Web Dev", "REST APIs"]
    }
  ],
  certifications: [
    {
      title: "Data Engineering on AWS – Foundations",
      issuer: "AWS Training & Certification",
      date: "December 03, 2025",
      link: "/DATA Engineering ON AWS Foundations.pdf",
      image: "/DATA Engineering ON AWS Foundations.png",
      credentialType: "Training Completion Certificate",
      topics: ["Data pipelines", "ETL/ELT", "Data lakes", "Data warehousing", "Amazon S3", "AWS Glue", "AWS Lambda", "Amazon Redshift", "Amazon Athena"],
      hasPdf: true
    },
    {
      title: "Fundamentals of Machine Learning and Artificial Intelligence",
      issuer: "AWS Training & Certification",
      date: "November 17, 2025",
      link: "/Foundation of Macine Learning and Artificial Intelligence.pdf",
      image: "/Foundation of Macine Learning and Artificial Intelligence.png",
      credentialType: "Training Completion Certificate",
      topics: ["Fundamentals of Machine Learning", "Artificial Intelligence", "AWS-based AI/ML learning"],
      hasPdf: true
    },
    {
      title: "JavaScript Algorithms and Data Structures",
      issuer: "freeCodeCamp",
      date: "2024",
      link: "",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80",
      hasPdf: false
    },
    {
      title: "Responsive Web Design",
      issuer: "freeCodeCamp",
      date: "2023",
      link: "",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
      hasPdf: false
    },
    {
      title: "Introduction to Cybersecurity",
      issuer: "Cisco Networking Academy",
      date: "2024",
      link: "",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
      hasPdf: false
    },
  ] as Array<{ title: string; issuer: string; date: string; link: string; image: string; credentialType?: string; topics?: string[]; hasPdf?: boolean }>,
  resume: {
    // TODO: Place your PDF file in the public/resume/ folder and update this path if different
    pdfUrl: "/Umesh-Temburwar-OCT.pdf",
    exists: true // TODO: Set this to true when the resume file is actually placed in the folder
  },
  contact: {
    tag: "■ 07 / INITIATE A CONVERSATION",
    heading: "Let's build something exceptional together.",
    description: "Whether you have an engineering role opening, an ambitious full-stack project, or simply want to connect, my inbox is always open.",
    email: "umeshtemburwar2002@gmail.com",
    phone: "+91 8856087984",
    message: "Have a project, collaboration, or opportunity in mind? Send me a message."
  }
};
