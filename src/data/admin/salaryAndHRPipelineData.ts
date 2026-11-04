export interface InterviewStage {
  id: string;
  stageNumber: number;
  stageTitle: string;
  stageSubtitle: string;
  badge: string;
  estimatedDuration: string;
  interviewerMindset: string;
  keyStrategies: string[];
  conversations: {
    interviewerQuestion: string;
    suggestedAnswer: string;
    alternativeScripts?: { label: string; script: string }[];
    interviewerSecretChecklist: string[];
    whatNOTtoSay: string;
    proNegotiationTip?: string;
  }[];
}

export const salaryAndHRPipelineData: InterviewStage[] = [
  {
    id: 'stage-1-introduction',
    stageNumber: 1,
    stageTitle: 'Self-Introduction & First Impressions',
    stageSubtitle: 'Hook the interviewer in the first 90 seconds and establish high technical credibility',
    badge: 'Opening 5 Minutes',
    estimatedDuration: '5 - 10 Minutes',
    interviewerMindset: 'Evaluating communication clarity, confidence, passion for software development, and whether the candidate sounds like a builder who writes real code.',
    keyStrategies: [
      'Structure: Past (Education & Core Passion) -> Present (Full-Stack Specialization & Production Projects) -> Future (Why this specific company).',
      'Mention your actual project names (EdTech, Inventory, ByteFest) immediately to anchor the conversation in your technical strengths.',
      'Maintain steady eye contact and enthusiastic, calm vocal pacing.'
    ],
    conversations: [
      {
        interviewerQuestion: 'Tell me about yourself / Walk me through your resume.',
        suggestedAnswer: `Hello, thank you for this opportunity! My name is Umesh Temburwar. I am a Computer Science graduate from MBES College of Engineering with a strong focus on full-stack web engineering and scalable backend architecture.

Over the past few years, I have specialized in the modern JavaScript and TypeScript ecosystem, working extensively with React.js and Next.js on the frontend, and Node.js, Express.js, and Python FastAPI on the backend, alongside PostgreSQL and MongoDB.

What drives me most is taking complex system requirements and turning them into production-ready software. For instance:
1. I architected an EdTech Learning Platform with automated quiz engines, certificate issuance, and database-level security via PostgreSQL Row Level Security (RLS).
2. I built an Automobile Spare Parts Inventory Management System in Node.js and MongoDB, utilizing atomic conditional queries and memory-efficient streaming CSV pipelines for large catalogs.
3. As the web lead for our college tech fest, ByteFest 2K25, I deployed a high-traffic platform with Cloudflare edge caching that handled over 2,000 daily visitors and 1,500 participant registrations with 99.9% uptime.

I am eager to bring my hands-on full-stack development experience, passion for clean code, and fast-learning attitude to your engineering team.`,
        alternativeScripts: [
          {
            label: '45-Second Quick Version',
            script: `Hi! I am Umesh Temburwar, a Full-Stack Developer specializing in React.js, Node.js, TypeScript, and PostgreSQL. I build production web applications, having developed an EdTech platform with Supabase RLS, an Automobile Inventory system with streaming CSV pipelines in MongoDB, and the ByteFest 2K25 portal that handled 2,000+ daily visitors. I love solving concurrency and API architecture challenges and am excited about the work your team is doing!`
          },
          {
            label: '2-Minute Executive Version',
            script: `Hello! I am Umesh Temburwar, a Computer Science graduate from MBES College of Engineering. My core expertise is Full-Stack Web Development, specifically React, Node.js, Express, and databases like PostgreSQL and MongoDB. Rather than just building basic demo apps, I have focused on solving real-world production engineering problems: handling concurrent quiz submissions in EdTech, streaming 50,000+ spare parts records in constant O(1) RAM in my Inventory system, and managing live on-ground registration infrastructure for 1,500+ attendees during ByteFest 2K25. I stay current with industry practices like TypeScript type safety, Docker containerization, and RESTful API standards, and I am looking for a software engineering role where I can contribute to mission-critical applications.`
          }
        ],
        interviewerSecretChecklist: [
          'Did he mention concrete tech stacks instead of generic buzzwords?',
          'Does he sound like a hands-on developer or just an academic exam-passer?',
          'Was the answer concise and well-paced (< 2 mins)?'
        ],
        whatNOTtoSay: 'Do NOT say: "My name is Umesh, I like coding, my hobbies are playing cricket and listening to music, and my family has 4 members." (Keep it 100% professional and engineering-focused).'
      },
      {
        interviewerQuestion: 'I see your CGPA is 6.06. Can you explain your academic performance vs your technical skills?',
        suggestedAnswer: `That is a completely fair question, and I am glad you brought it up. In my early university semesters, I was studying traditional theoretical concepts for exams. However, midway through my engineering, I realized that true software engineering is about building, debugging, and shipping production systems.

I made a conscious decision to invest 4 to 6 hours every single day building real-world full-stack applications, studying system design, and mastering modern frameworks like React, Node.js, TypeScript, and PostgreSQL. While my theoretical exam scores remained at a 6.06 CGPA, that practical focus allowed me to successfully architect complex platforms like our EdTech portal, our Automobile Inventory Management System, and manage the live production portal for ByteFest 2K25 handling 2,000+ daily visitors without a hitch.

In a software engineering team, what delivers business value is the ability to read documentation, debug production crashes, write clean APIs, and ship features independently—and my projects prove that I am fully equipped to do exactly that from day one.`,
        interviewerSecretChecklist: [
          'Does he take ownership without making defensive excuses?',
          'Does he demonstrate that practical competence far outweighs theoretical memorization?',
          'Is he honest, mature, and confident in his technical ability?'
        ],
        whatNOTtoSay: 'Never blame the college, the professors, or the exam system ("Professors didn\'t give marks"). Always reframe toward deliberate practical engineering mastery.'
      }
    ]
  },
  {
    id: 'stage-2-project-defense',
    stageNumber: 2,
    stageTitle: 'Project Grilling & Deep Technical Defense',
    stageSubtitle: 'Demonstrate architectural depth, system design decisions, and real debugging experience',
    badge: 'Technical Cross-Examination',
    estimatedDuration: '20 - 30 Minutes',
    interviewerMindset: 'Testing if the candidate personally wrote the code or copied tutorials. Probing edge cases, concurrency, security, and trade-offs.',
    keyStrategies: [
      'Always explain WHY you made a architectural decision, not just WHAT you used.',
      'Show trade-off awareness: "We chose PostgreSQL over MongoDB because of relational foreign keys and RLS."',
      'Be honest when discussing technical bugs and walk through your step-by-step debugging methodology.'
    ],
    conversations: [
      {
        interviewerQuestion: 'In your EdTech platform, how did you prevent students from cheating on timed quizzes or manipulating the countdown clock?',
        suggestedAnswer: `I realized early on that client-side timers in JavaScript can be paused or modified by opening Chrome DevTools or manipulating local clocks. 

To solve this, I decoupled the timer logic between client and server. When a student clicks "Start Quiz", an API call records a timestamped record in PostgreSQL with \`started_at = NOW()\`. The client receives the quiz payload and displays a local countdown timer purely for UX.

When the student submits their answers, the backend computes \`submission_delta = NOW() - started_at\`. If the delta exceeds the allowed quiz duration plus a 30-second network latency buffer, the submission is automatically rejected or marked as late. Furthermore, each question has an anti-replay token, and the student's answers are stored atomically in a single transaction.`,
        interviewerSecretChecklist: [
          'Understands the golden rule of backend engineering: Never trust client-side data.',
          'Considered network latency buffers (+30s).',
          'Database atomic transaction awareness.'
        ],
        whatNOTtoSay: 'Do NOT say: "I disabled right-click and prevented inspect element." (Any developer can easily bypass that).'
      },
      {
        interviewerQuestion: 'In your Automobile Inventory system, what happens if two staff members check out the last 5 brake pads at the exact same millisecond?',
        suggestedAnswer: `This is the classic double-spending / concurrent checkout race condition. If you read the stock count first and then perform an update, both requests will read 5, approve the order, and decrement the stock to 0 or negative numbers.

To prevent this in MongoDB without the overhead of heavy distributed locks, I used MongoDB atomic conditional updates:
\`\`\`javascript
db.products.findOneAndUpdate(
  { _id: productId, stock: { $gte: requestedQty } },
  { $inc: { stock: -requestedQty } }
);
\`\`\`
Because MongoDB handles document updates atomically at the storage engine layer, the first request matches the document, decrements the stock by 5, and returns the updated document. The second concurrent request fails the condition \`stock >= 5\` because stock is now 0; it matches 0 documents and returns null. My Express backend checks this and immediately returns HTTP 409 Conflict: "Insufficient stock available".`,
        interviewerSecretChecklist: [
          'Knows atomic operators ($inc, $gte) in MongoDB.',
          'Understands race conditions and HTTP status code 409 Conflict.',
          'Practical experience handling concurrency.'
        ],
        whatNOTtoSay: 'Do not suggest checking in JavaScript with `if (product.stock >= qty)` before saving—that is the exact definition of a race condition bug!'
      }
    ]
  },
  {
    id: 'stage-3-behavioral-culture',
    stageNumber: 3,
    stageTitle: 'Behavioral, Managerial & Situational Fit (STAR)',
    stageSubtitle: 'Prove teamwork, emotional intelligence, resilience under pressure, and communication',
    badge: 'Culture & HR Alignment',
    estimatedDuration: '15 - 20 Minutes',
    interviewerMindset: 'Assessing if this person will be easy to mentor, communicative during blockers, accountable for mistakes, and a positive team player.',
    keyStrategies: [
      'Use the STAR Method: Situation (15%), Task (15%), Action (55%), Result (15%).',
      'Never blame teammates or managers; focus on solution-oriented collaboration.',
      'Show humility and high coachability.'
    ],
    conversations: [
      {
        interviewerQuestion: 'Tell me about a time you had a technical disagreement with a teammate or peer. How did you resolve it?',
        suggestedAnswer: `During the planning of ByteFest 2K25, our team had a major disagreement regarding the tech stack for the registration portal. One team member strongly advocated for building a full SSR monolith on Python Django, while I proposed a decoupled React + Vite SPA backed by Cloudflare edge caching and serverless API endpoints.

He was concerned that React client-side rendering might take too long to load on students' mobile networks, while I was concerned that a single Django server instance would crash under the anticipated 2,000+ daily visitors during registration launch spikes.

Instead of arguing theoretically, I suggested we build a simple benchmark prototype. I set up a mock load-test using Artillery simulating 500 concurrent connections. The edge-cached React architecture responded in 45ms with zero CPU spike, whereas the local server hit 95% CPU load. When my teammate saw the empirical data, we agreed on the edge-cached React architecture. To address his valid point about mobile network performance, I implemented aggressive bundle code-splitting and WebP image compression. We launched on time and achieved 99.9% uptime with over 1,500 registrations.`,
        interviewerSecretChecklist: [
          'Did he use data and benchmarking instead of ego?',
          'Did he listen to the teammate\'s valid concern (mobile network speed)?',
          'Was the result measurable and collaborative?'
        ],
        whatNOTtoSay: 'Never say: "I proved I was right and he was wrong."'
      },
      {
        interviewerQuestion: 'Where do you see yourself in 3 to 5 years?',
        suggestedAnswer: `In the next 3 to 5 years, my goal is to develop into a strong, dependable Senior Full-Stack Engineer and technical mentor. 

In the first year, my primary focus is to master your codebase, internalize team engineering workflows, ship clean bug-free features, and become completely independent. By year 3, I want to take ownership of complex microservices and feature architectures, contribute to system design and latency optimizations, and help onboard and mentor new junior developers. Long-term, I want to be someone the engineering management can trust with critical, high-impact projects.`,
        interviewerSecretChecklist: [
          'Realistic and aligned with engineering career ladders.',
          'Not overambitious ("I want to be CTO in 2 years") nor passive ("I haven\'t thought about it").',
          'Shows dedication to growing with the company.'
        ],
        whatNOTtoSay: 'Avoid saying: "I plan to do an MBA or MS in the US after 1 year" (Companies will not invest in training you if you leave in 12 months).'
      }
    ]
  },
  {
    id: 'stage-4-salary-negotiation',
    stageNumber: 4,
    stageTitle: 'Salary Discussion & HR Offer Negotiation Masterclass',
    stageSubtitle: 'How to negotiate your compensation package with confidence, professionalism, and zero awkwardness',
    badge: 'Final HR & Offer Closing',
    estimatedDuration: '15 - 30 Minutes',
    interviewerMindset: 'Determining your price point, checking if you fit within the team budget, evaluating your market awareness, and securing your commitment to join.',
    keyStrategies: [
      'Never be the first to throw out a rigid single number; always quote a research-backed bracket (e.g. 6.5 - 9.5 LPA).',
      'Anchor your value on your production independence: you already know React, Node, SQL, and Git and require zero basic training latency.',
      'Differentiate between Fixed Base Pay, Variable Performance Bonus, and Employee Benefits.'
    ],
    conversations: [
      {
        interviewerQuestion: 'What are your salary expectations for this software engineering role?',
        suggestedAnswer: `Based on my research into software engineering compensation for full-stack developers in our industry, and considering the technical requirements of this role—building and maintaining production React, Node.js, and database services—I am targeting a package in the range of ₹6.5 Lakhs to ₹9 Lakhs per annum.

However, more than just the exact starting figure, what is most important to me is joining a company with strong engineering practices, mentorship, and opportunities to solve challenging technical problems. If the role and team fit are right, I am very open to discussing a mutually beneficial package that aligns with your company's standard compensation structure for high-performing engineers.`,
        alternativeScripts: [
          {
            label: 'When asked for an exact minimum number',
            script: `If I had to specify a baseline, I would be very comfortable starting at ₹7 LPA fixed base compensation. Given that I have already built and deployed full-stack systems like our EdTech platform and ByteFest infrastructure, I can contribute directly to your sprint goals from week one without requiring months of foundational training.`
          },
          {
            label: 'When you want HR to give their range first',
            script: `I am very flexible and primarily excited about the engineering challenges here. What is the approved compensation budget or band for this software engineer position at your company?`
          }
        ],
        interviewerSecretChecklist: [
          'Did he give a reasonable, market-appropriate bracket instead of an unrealistic demand?',
          'Did he show flexibility while maintaining professional self-worth?',
          'Is he polite and enthusiastic about the actual work?'
        ],
        whatNOTtoSay: 'Never say: "Anything is fine, whatever you give I will accept" (destroys your perceived value). And never say: "I need 18 LPA because my friend got that" (sounds entitled and uninformed).'
      },
      {
        interviewerQuestion: 'Our company standard fresher package is ₹3.5 LPA (or ₹4 LPA). Why should we offer you ₹6.5 LPA+?',
        suggestedAnswer: `I completely understand that ₹3.5 to ₹4 LPA is your baseline for typical campus graduates who require 3 to 6 months of training on basic HTML, CSS, JavaScript, and Git before they can touch production code.

However, my background is distinctly different. Over the past two years, I have already built and deployed production-grade applications:
- In my EdTech project, I engineered PostgreSQL Row Level Security, Supabase Auth, and automated quiz scoring algorithms.
- In my Automobile Inventory system, I solved real-world concurrency race conditions using atomic database updates and built memory-safe streaming CSV pipelines.
- In ByteFest 2K25, I handled live production deployment for over 2,000 daily visitors with 99.9% uptime.

Because I already work fluently with TypeScript, React, Node.js, Express, Git branching, and Docker, your team will not need to spend months training me on the fundamentals. I can pick up your sprint tasks, write clean testable code, and deliver positive ROI from day one. I believe ₹6.5 to ₹8 LPA reflects that immediate production readiness.`,
        interviewerSecretChecklist: [
          'Backed up his value with concrete engineering facts instead of emotional arguments.',
          'Demonstrated ROI: Less training cost = Faster feature delivery.',
          'Respectful of the company policy while advocating for his technical level.'
        ],
        whatNOTtoSay: 'Do NOT say: "₹3.5 LPA is too low, inflation is high and rent is expensive." (The company cares about business value, not your personal expenses).'
      },
      {
        interviewerQuestion: 'We have a mandatory 2-year service agreement / employment bond. Are you comfortable signing it?',
        suggestedAnswer: `I am looking for a long-term engineering home where I can spend the next 2 to 3 years mastering the system architecture and making significant contributions, so a multi-year commitment aligns completely with my personal goals.

Could you share the specific details of the agreement—such as whether it is a training bond, what the terms are, and whether there are standard performance review cycles every 6 or 12 months? As long as the compensation is fair and the agreement is standard, I am very happy to commit long-term to this team.`,
        interviewerSecretChecklist: [
          'Shows commitment to staying long-term.',
          'Asks smart, professional clarifying questions about the bond terms.',
          'Does not panic or refuse outright.'
        ],
        whatNOTtoSay: 'Never sign blindly without reading, and never say "No way, bonds are illegal!" in an aggressive tone.'
      },
      {
        interviewerQuestion: 'How soon can you join us if we extend an offer today?',
        suggestedAnswer: `I have completed my academic requirements and am ready to join immediately or within 1 to 2 weeks for onboarding, relocation, and laptop setup. If your team has an immediate sprint starting, I am ready to start right away!`,
        interviewerSecretChecklist: [
          'Immediate availability is a huge competitive advantage for freshers over candidates with 90-day notice periods.'
        ],
        whatNOTtoSay: 'Do not be vague like "Maybe sometime next month or two."'
      },
      {
        interviewerQuestion: 'Do you have any other offers or interviews in progress right now?',
        suggestedAnswer: `Yes, I am currently in discussions with two other product and services companies for full-stack developer roles. However, based on the technology stack, the engineering culture described by the team, and the scale of problems you are solving, this position at your company is my absolute top priority. If we can reach an agreement on the offer details, I would be thrilled to accept and close out my other interview processes.`,
        interviewerSecretChecklist: [
          'Creates healthy urgency / FOMO (Fear Of Missing Out) without sounding arrogant.',
          'Reassures the recruiter that they are his #1 choice.'
        ],
        whatNOTtoSay: 'Never lie about having an official offer in hand if you do not, but always state that you are actively in technical interview pipelines.'
      }
    ]
  }
];

