export type Project = {
  slug: string;
  title: string;
  tagline: string;
  problem: string;
  build: string;
  impact: string;
  stack: string[];
  year: string;
  links: {
    repo?: string;
    demo?: string;
    video?: string;
  };
  media?: {
    type: "image" | "video";
    url: string;
  };
  featured?: boolean;
  // Planet / visual identity
  planetColor: string;
  planetGlow: string;
  planetSize: number; // relative 0.5 – 1.5
  orbitRadius: number;
};

export type SkillCluster = {
  title: string;
  skills: string[];
  planetColor: string;
  glowColor: string;
  orbitSpeed: number;
};

export type Milestone = {
  date: string;
  title: string;
  description: string;
  category: "research" | "leadership" | "certification" | "career";
};

export const profile = {
  name: "Shivam Panjolia",
  role: "Backend · AI · Systems Engineer",
  location: "Punjab, India",
  email: "shivampanjolia8@gmail.com",
  phone: "+91-8580818588",
  github: "https://github.com/LusmicSam",
  linkedin: "https://www.linkedin.com/in/shivam-panjolia",
  headline: "I build reliable systems where intelligence meets scale.",
  subheadline:
    "From secure verification pipelines to decentralized systems and edge AI — I engineer products end-to-end.",
  highlights: [
    "250+ LeetCode solved",
    "Production Startup Engineer (Since June 2025)",
    "First research publication (March 10)",
    "3 Professional Certifications (OCI DevOps, OCI AI)",
    "30+ Certificates (Coursera, Udemy, NPTEL Cloud)",
  ],
  education: [
    {
      institution: "Lovely Professional University",
      degree: "B.Tech Computer Science",
      period: "Aug 2023 - 2027",
    },
  ],

  // ── Personality ──────────────────────────────────────────────
  mbti: "INTP",
  mbtiDesc:
    "The Logician — Analytical, inventive, and driven by understanding systems at their deepest level. I dissect problems until the pattern is clear, then build from first principles.",
  personality:
    "Quiet thinker who goes deep rather than broad. I'm most alive when debugging a subtle race condition or building a system from scratch. I tend to over-engineer things in the best way possible.",

  softSkills: [
    "Technical Communication",
    "Critical Thinking",
    "Research & Analysis",
    "Collaborative Problem Solving",
    "Self-Directed Learning",
    "Deadline Management",
    "Written Articulation",
    "Systems Thinking",
  ],

  // ── Hobbies & Interests ──────────────────────────────────────
  hobbies: [
    {
      name: "Novel Reading",
      desc: "Sci-Fi, Fantasy, Philosophy, and dense non-fiction. Currently exploring classic science fiction like Asimov and PKD.",
      icon: "📚",
    },
    {
      name: "Creative Writing",
      desc: "I build fictional universes with complex internal logic — world-building, lore systems, political structures. Think hard sci-fi meets epic fantasy.",
      icon: "✍️",
    },
    {
      name: "Competitive Programming",
      desc: "250+ problems on LeetCode. I find algorithmic puzzle-solving genuinely satisfying.",
      icon: "⌨️",
    },
  ],

  communication:
    "I communicate best in writing — precise, structured, and thorough. In teams I tend to be the person who asks 'but why?' before starting. I believe good documentation is a form of respect.",
};

export const skillClusters: SkillCluster[] = [
  {
    title: "Languages & Mobile",
    skills: ["Python", "C++", "Java", "C", "Rust", "C#", "JavaScript", "SQL", "Kotlin", "Flutter", "Android Studio"],
    planetColor: "#58d8ff",
    glowColor: "#58d8ff",
    orbitSpeed: 0.6,
  },
  {
    title: "AI & ML",
    skills: ["CV", "Deep Learning", "OCR", "Reinforcement Learning", "NLP", "MOE", "Kaggle", "PyTorch", "TensorFlow", "DSA"],
    planetColor: "#a066ff",
    glowColor: "#a066ff",
    orbitSpeed: 0.4,
  },
  {
    title: "Systems, DevOps & Cloud",
    skills: ["Docker", "Kubernetes", "Jenkins", "Maven", "Puppet", "Nagios", "System Design", "AWS (EC2)", "Linux"],
    planetColor: "#ff8c6b",
    glowColor: "#ff8c6b",
    orbitSpeed: 0.35,
  },
  {
    title: "Web, DBs & Web3",
    skills: ["Node.js", "React", "HTML/CSS", "Streamlit", "PostgreSQL", "Firebase", "Supabase", "Blockchain", "MetaMask", "IPFS"],
    planetColor: "#3dff99",
    glowColor: "#3dff99",
    orbitSpeed: 0.28,
  },
];

export const projects: Project[] = [
  {
    slug: "voxel-engine",
    title: "Multiplayer Voxel Engine",
    tagline: "Minecraft-style 3D world with advanced rendering mechanics.",
    problem: "Building a highly optimized, fully functional voxel game engine from scratch.",
    build: "Developed an OpenGL/C++ rendering engine featuring infinite procedural terrain, multithreaded geometry, greedy meshing, physics & collision detection, interactive sandbox elements, and dynamic lighting.",
    impact: "Achieved high-performance rendering and seamless interactive gameplay.",
    stack: ["C++17", "CMake", "OpenGL 3.3 Core Profile", "GLM", "ImGui", "MVC"],
    year: "2024",
    links: { repo: "https://github.com/LusmicSam" },
    media: { type: "video", url: "/Voxel.mp4" },
    featured: true,
    planetColor: "#ffcc44",
    planetGlow: "#ffcc44",
    planetSize: 1.2,
    orbitRadius: 5,
  },
  {
    slug: "akg-rag",
    title: "AKG-RAG v3.0 (Second Brain)",
    tagline: "Semantic vector search meets intelligent knowledge graph traversal.",
    problem: "Organizing and interacting with massive unstructured datasets, from complex technical documentation to expansive lore and world-building for 'System Of Systems'.",
    build: "Engineered an advanced 'Second Brain' architecture bridging semantic chunking and a high-fidelity Reasoning Engine to transform unstructured data into an interactive, queryable knowledge network.",
    impact: "Currently in development. Designing the system to act as a highly contextual, interactive intelligence node.",
    stack: ["Python", "Knowledge Graphs", "RAG", "LLMs", "Vector DB"],
    year: "2026",
    links: { repo: "https://github.com/LusmicSam" },
    media: { type: "video", url: "/RAG.mp4" },
    featured: true,
    planetColor: "#a066ff",
    planetGlow: "#a066ff",
    planetSize: 1.3,
    orbitRadius: 8,
  },
  {
    slug: "pashudrishti",
    title: "Pashudrishti (SIH)",
    tagline: "Bovine disease identification and health tracking platform.",
    problem: "Farmers lack accessible tools for early and accurate diagnosis of diseases in bovine breeds.",
    build: "Trained a custom computer vision model to identify diseases from images. Developed a complete ecosystem including a responsive web portal and a native Android application for seamless field access.",
    impact: "Provided an accessible diagnostic tool bridging the gap between advanced ML and rural agricultural needs.",
    stack: ["AI/ML", "Computer Vision", "Android Studio", "Web UI"],
    year: "2025",
    links: { 
      demo: "https://pashudrishti-sih.vercel.app/",
      repo: "https://github.com/LusmicSam" 
    },
    media: { type: "video", url: "/Pashu.mp4" },
    featured: true,
    planetColor: "#3dff99",
    planetGlow: "#3dff99",
    planetSize: 1.1,
    orbitRadius: 11,
  },
  {
    slug: "chainguard",
    title: "ChainGuard",
    tagline: "Immutable audit trails for digital asset verification.",
    problem: "Digital asset tampering in distributed networks requires strict, cryptographically backed proof of integrity.",
    build: "Integrating IPFS (Pinata) for decentralized storage with an Ethereum blockchain layer for immutable records and content hashing. Accessed and managed via a high-speed FastAPI proxy node.",
    impact: "Currently in development. Will allow clients to cryptographically prove that files haven't been altered.",
    stack: ["IPFS", "Ethereum", "FastAPI", "Pinata", "Cryptography"],
    year: "2026",
    links: { repo: "https://github.com/LusmicSam" },
    media: { type: "image", url: "/ChainGuard.png" },
    planetColor: "#ff8c6b",
    planetGlow: "#ff8c6b",
    planetSize: 1.2,
    orbitRadius: 14,
  },
  {
    slug: "medical-ecosystem",
    title: "Medical AI Ecosystem",
    tagline: "Appointment booking and early lifestyle disease prediction.",
    problem: "Fragmented healthcare access and delayed identification of lifestyle-induced medical conditions.",
    build: "Built an integrated suite featuring a medical appointment chatbot and an AI-driven predictive diagnostic tool for early detection of lifestyle diseases.",
    impact: "Streamlined patient booking and provided preventative health insights.",
    stack: ["Python", "Machine Learning", "Streamlit", "Chatbot"],
    year: "2025",
    links: { 
      demo: "https://medical-appointment-booking-chatbot-1.onrender.com/",
      repo: "https://github.com/LusmicSam" 
    },
    media: { type: "video", url: "/Health.mp4" },
    planetColor: "#ff66aa",
    planetGlow: "#ff66aa",
    planetSize: 1.0,
    orbitRadius: 17,
  },
  {
    slug: "startup-portals",
    title: "Startup Core Portals",
    tagline: "Comprehensive internal and user-facing infrastructure.",
    problem: "Needed a robust digital infrastructure to handle administration, education, code execution, and user support.",
    build: "Architected and developed a suite of interconnected platforms including an Admin portal, a Teacher portal, an integrated code compiler, and a support ticketing system.",
    impact: "Running in production since June 2025, serving core business operations.",
    stack: ["React", "Node.js", "Supabase", "System Design"],
    year: "2025",
    links: { repo: "https://github.com/LusmicSam" },
    media: { type: "video", url: "/startup.mp4" },
    planetColor: "#58d8ff",
    planetGlow: "#58d8ff",
    planetSize: 1.3,
    orbitRadius: 20,
  },
  {
    slug: "polypharmacy-nlp",
    title: "Polypharmacy MOE & NLP",
    tagline: "Advanced ML models for drug interaction and natural language processing.",
    problem: "Analyzing complex drug interactions (polypharmacy) and processing medical text data.",
    build: "Implemented a Mixture of Experts (MOE) architecture for polypharmacy prediction combined with NLP pipelines.",
    impact: "Improved the accuracy of detecting adverse multi-drug interactions.",
    stack: ["Machine Learning", "NLP", "MOE", "Python"],
    year: "2026",
    links: { repo: "https://github.com/LusmicSam" },
    planetColor: "#ff8c6b",
    planetGlow: "#ff8c6b",
    planetSize: 1.0,
    orbitRadius: 23,
  },
  {
    slug: "python-blockchain",
    title: "Python Blockchain Core",
    tagline: "Custom blockchain implementation from scratch.",
    problem: "Understanding consensus mechanisms and distributed ledger technology at a fundamental level.",
    build: "Developed the core architecture of a blockchain entirely in Python, implementing fundamental cryptographic hashing, block validation, and chain management.",
    impact: "Solidified deep technical knowledge of decentralized systems.",
    stack: ["Python", "Cryptography", "Blockchain"],
    year: "2025",
    links: { repo: "https://github.com/LusmicSam" },
    media: { type: "image", url: "/blockchain.png" },
    planetColor: "#a066ff",
    planetGlow: "#a066ff",
    planetSize: 0.9,
    orbitRadius: 26,
  },
  {
    slug: "cert-verification",
    title: "Blockchain Certificate Verification",
    tagline: "Blockchain-backed credential authenticity at scale.",
    problem: "Universities and companies struggled with fake certificates, and manual verification was slow.",
    build: "Built a full-stack platform using Python (FastAPI) + React with a blockchain anchor layer to issue and verify credentials via QR codes.",
    impact: "Deployed at institutions, significantly cutting down verification time.",
    stack: ["Python", "FastAPI", "React", "Blockchain", "OCR"],
    year: "2024",
    links: { repo: "https://github.com/LusmicSam" },
    planetColor: "#58d8ff",
    planetGlow: "#58d8ff",
    planetSize: 0.8,
    orbitRadius: 29,
  }
];

export const milestones: Milestone[] = [
  {
    date: "Mar 10, 2026",
    title: "First Research Publication",
    description: "Successfully published initial research findings.",
    category: "research",
  },
  {
    date: "Nov 2025",
    title: "OCI AI Foundation Associate",
    description: "Certified by Oracle Cloud Infrastructure in Artificial Intelligence foundations.",
    category: "certification",
  },
  {
    date: "Oct 2025",
    title: "OCI DevOps Professional",
    description: "Certified Oracle Cloud Infrastructure DevOps professional.",
    category: "certification",
  },
  {
    date: "Jun 2025",
    title: "Production Startup Development",
    description: "Began engineering core production portals (Admin, Teacher, Ticketing) for an emerging startup.",
    category: "career",
  },
  {
    date: "Feb 2025",
    title: "Vice-President, Dynamic Vertos Club",
    description: "Elected as Vice-President of the Dynamic Vertos Club at Lovely Professional University, leading student initiatives and technical workshops.",
    category: "leadership",
  },
];