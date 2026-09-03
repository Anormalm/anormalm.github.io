export const projects = [
  {
    title: '说人话 Bench',
    category: 'Evaluation',
    status: 'v0.2 alpha',
    description:
      'A context- and population-conditioned benchmark for naturalness, direct usability, revision burden, and semantic preservation in model-generated Chinese text.',
    tags: ['LLM evaluation', 'Human preference', 'Python'],
    link: 'https://github.com/Anormalm/human-bench',
    live: 'https://human-bench-sandy.vercel.app',
    featured: true,
  },
  {
    title: 'Pink Elephant',
    category: 'AI Safety',
    status: 'Research harness',
    description:
      'A provider-agnostic experiment harness for measuring how corrected mistakes can persist and spread through later model outputs and project artifacts.',
    tags: ['Agent evaluation', 'Reproducibility', 'Python'],
    link: 'https://github.com/Anormalm/pink-elephant',
    featured: true,
  },
  {
    title: 'AGEA',
    category: 'Research',
    status: 'Research study',
    description:
      'Adaptive Graph Evidence Acquisition: a sequential framework that selects useful graph evidence before LLM-based fraud reasoning under token and latency constraints.',
    tags: ['Graph learning', 'LLM reasoning', 'Fraud detection'],
    link: 'https://github.com/Anormalm/AGEA',
    featured: true,
  },
  {
    title: 'C-OS',
    category: 'AI Systems',
    status: 'v0.1',
    description:
      'A persistent cognitive memory system with temporal graph memory, contradiction-aware fact versioning, hybrid retrieval, and an evaluation harness.',
    tags: ['Memory systems', 'Graph retrieval', 'FastAPI'],
    link: 'https://github.com/Anormalm/C-OS',
  },
  {
    title: 'CIRT',
    category: 'Architecture',
    status: 'Research code',
    description:
      'A PyTorch implementation of Competitive Information Routing Transformers, replacing purely additive residual mixing with learned competitive routing.',
    tags: ['Transformers', 'PyTorch', 'Representation learning'],
    link: 'https://github.com/Anormalm/CIRT',
  },
  {
    title: 'Linguine',
    category: 'Programming Languages',
    status: 'Published',
    description:
      'A natural-language programming language with formal semantics and a clean compiler pipeline, designed to make readable intent executable without giving up structure.',
    tags: ['Compiler design', 'Formal semantics', 'Python'],
    link: 'https://github.com/Anormalm/linguine',
  },
  {
    title: 'GAiVE',
    category: 'Multimodal AI',
    status: 'Prototype',
    description:
      'A story-aware pipeline that connects events across gameplay footage, selects a narrative arc, and produces a machine-readable short-video edit plan.',
    tags: ['Video understanding', 'Event graphs', 'Product systems'],
    link: 'https://github.com/Anormalm/gaive',
  },
  {
    title: 'Pose-Based Risk Detection',
    category: 'Computer Vision',
    status: 'Prototype',
    description:
      'A privacy-first, real-time multi-person pose pipeline for fall, instability, inactivity, and bed-exit risk detection without storing raw frames.',
    tags: ['Pose estimation', 'Edge vision', 'FastAPI'],
    link: 'https://github.com/Anormalm/ah-project',
  },
  {
    title: 'Lie Group Trajectory Encoder',
    category: 'Geometric ML',
    status: 'Published',
    description:
      'Learned generators from trajectories in SE(2), SE(3), SO(3), and SL(2,R), with manifold visualizations and robustness studies.',
    tags: ['Lie groups', 'Trajectories', 'Neural networks'],
    link: 'https://github.com/Anormalm/LieRL-on-Trajectories',
  },
  {
    title: 'Recursive Web',
    category: 'Creative Code',
    status: 'Live',
    description:
      'A browser-based, multi-level ARG with terminal commands, hidden clues, binary hints, and an ASCII-art finale.',
    tags: ['Interactive fiction', 'JavaScript', 'Puzzle design'],
    link: 'https://github.com/Anormalm/recursive-web',
    live: 'https://anormalm.com/recursive-web',
  },
];

export const writings = [
  {
    title: 'Kimi K3 — Open Source Miracle?',
    excerpt:
      'A close look at Kimi K3’s mixture-of-experts design, delta attention, and the practical meaning of openness at trillion-parameter scale.',
    date: 'July 2026',
    readingTime: '12 min read',
    link: 'https://medium.com/@hulifan55555/kimi-k3-open-source-miracle-0543a1757db9',
  },
  {
    title: 'On the Epistemology of Production',
    excerpt:
      'What three technical rounds at TikTok clarified about judgment, uncertainty, and the difference between knowing a model and operating a system.',
    date: 'March 2026',
    readingTime: '7 min read',
    link: 'https://medium.com/@hulifan55555/on-the-epistemology-of-production-ac6df40e2bbe',
  },
  {
    title: 'How DeepSeek-V3 Made a 671B Model Surprisingly Affordable',
    excerpt:
      'Four engineering ideas behind DeepSeek-V3’s efficiency: latent attention, expert routing, pipeline overlap, and disaggregated inference.',
    date: 'June 2025',
    readingTime: '5 min read',
    link: 'https://medium.com/@hulifan55555/how-deepseek-v3-made-a-671b-parameter-model-surprisingly-affordable-3cb93e6372f5',
  },
  {
    title: 'From Open Covers to Open Source',
    excerpt:
      'How algebraic topology becomes a practical way to think about invariants, refactoring, manifolds, and systems that must change without breaking.',
    date: 'June 2025',
    readingTime: '9 min read',
    link: 'https://medium.com/@hulifan55555/from-open-covers-to-open-source-500089bd3fe7',
  },
];

export const publications = [
  {
    title: 'Learning Lie Group Generators From Trajectories',
    venue: 'arXiv, 2025',
    link: 'https://arxiv.org/abs/2504.03220',
  },
  {
    title: 'Linguine: A Natural-Language Programming Language with Formal Semantics and a Clean Compiler Pipeline',
    venue: 'arXiv, 2025',
    link: 'https://arxiv.org/abs/2506.08396',
  },
  {
    title: 'GNN-Augmented RL for Fraud Detection in Decentralized Finance',
    venue: 'CONF-SEML, 2025',
    link: 'https://doi.org/10.54254/2755-2721/2025.22856',
  },
  {
    title: 'Graph Evidence Is Not Text Evidence: Serialization Faithfulness as Structural Invariance in Graph-Grounded Language Models',
    venue: 'EMNLP 2026 GroundLM Workshop · Archival short paper · Poster',
  },
  {
    title: 'Quantized Vision-Language Models on Embedded GPUs: A Comparative Benchmark for Edge Multimodal Inference',
    venue: 'ICARCV 2026 · Oral presentation',
  },
];
