const CV = () => {
  return (
    <div className="min-h-screen">
      <section className="section">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Curriculum Vitae</div>
            <h1 className="font-display text-4xl">Hu Lifan</h1>
            <p className="mt-3 max-w-3xl text-sm text-[var(--muted)]">
              +65 80999132 | lifan.hu@u.nus.edu | www.linkedin.com/in/anormalm/
            </p>
          </div>
          <a
            href="/CV-Lifan-Latest.pdf"
            download
            className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90"
          >
            Download PDF
          </a>
        </div>

        <div className="mt-10 grid gap-6">
          <section className="glass-card p-6">
            <h2 className="font-display text-2xl">Education</h2>
            <div className="mt-4 space-y-4 text-sm text-[var(--muted)]">
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">Aug 2024 - Present</div>
                <div className="mt-1 font-semibold text-[var(--ink)]">
                  Bachelor of Engineering in Computer Engineering (Specialization: IoT)
                </div>
                <div>National University of Singapore</div>
                <div className="text-xs text-[var(--muted)]">
                  Second Major: Innovation and Design Program. Minor: Mathematics. GPA: 4.6/5.0
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">Jun 2025 - Jul 2025</div>
                <div className="mt-1 font-semibold text-[var(--ink)]">Summer School</div>
                <div>Shanghai Jiao Tong University</div>
                <div className="text-xs text-[var(--muted)]">
                  Courses: Algebra (A), Statistics Inference (A)
                </div>
              </div>
            </div>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-2xl">Publications</h2>
            <ul className="mt-4 list-disc pl-5 text-sm text-[var(--muted)]">
              <li>
                Lifan Hu, "Learning Lie Group Generators From Trajectories," arXiv.org, April 4,
                2025. https://arxiv.org/abs/2504.03220
              </li>
              <li>
                Lifan Hu, "GNN-Augmented RL for Fraud Detection in Decentralized Finance,"
                CONF-SEML 2025 (Published), April 14, 2025.
                DOI: 10.54254/2755-2721/2025.22856
              </li>
            </ul>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-2xl">Internship Experience</h2>
            <div className="mt-4 space-y-5 text-sm text-[var(--muted)]">
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">May 2025 - Jul 2025</div>
                <div className="mt-1 font-semibold text-[var(--ink)]">
                  Shanghai MAHLE Thermal Systems Co., Ltd. (Shanghai, CN)
                </div>
                <div>Digital Developer Intern, Finance, Controlling & IT</div>
                <ul className="mt-2 list-disc pl-5">
                  <li>Built a real-time multilingual meeting transcriber/translator with Vosk + MarianMT.</li>
                  <li>Trained YOLOv5 on blueprint `.tif` images for diagram/table/handwriting detection.</li>
                  <li>Developed an OCR pipeline with Tesseract + PaddleOCR for structured extraction.</li>
                  <li>Created an OCR-based screen-snipping extractor for QM factory interfaces.</li>
                  <li>Built downtime forecasting models with Decision Tree and Extra Trees.</li>
                  <li>Deployed lightweight Flask APIs for inference, OCR, and monitoring workflows.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-2xl">Research Experience</h2>
            <div className="mt-4 space-y-5 text-sm text-[var(--muted)]">
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">Jan 2025 - May 2025</div>
                <div className="mt-1 font-semibold text-[var(--ink)]">GNN + MARL for DeFi Fraud Detection</div>
                <div>Researcher, supervised by Prof. Pietro Lio, Cambridge University</div>
                <ul className="mt-2 list-disc pl-5">
                  <li>Built a GNN-augmented multi-agent PPO system in PettingZoo ParallelEnv.</li>
                  <li>Validated on 50K+ Ethereum transaction records.</li>
                  <li>Benchmarked hybrid GNN-RL-GAN models against RL-only and traditional ML baselines.</li>
                </ul>
              </div>

              <div>
                <div className="text-xs uppercase tracking-[0.2em]">Feb 2025 - Apr 2025</div>
                <div className="mt-1 font-semibold text-[var(--ink)]">Lie Group Trajectory Encoder</div>
                <div>Independent Project</div>
                <ul className="mt-2 list-disc pl-5">
                  <li>Trained neural encoders for SE(2), SE(3), SO(3), and SL(2,R) trajectories.</li>
                  <li>Visualized manifold embeddings and benchmarked robustness under noise.</li>
                </ul>
              </div>

              <div>
                <div className="text-xs uppercase tracking-[0.2em]">Aug 2025 - Present</div>
                <div className="mt-1 font-semibold text-[var(--ink)]">
                  On-Device Vision-Language Assistant for the Visually Impaired
                </div>
                <div>
                  Undergraduate Researcher, supervised by A/Prof. Lim Li Hong Idris, National
                  University of Singapore
                </div>
                <ul className="mt-2 list-disc pl-5">
                  <li>Designed edge multimodal pipelines on Jetson Orin Nano Super for offline assistive vision.</li>
                  <li>Benchmarked VLM latency/memory/throughput across quantization schemes.</li>
                </ul>
              </div>

              <div>
                <div className="text-xs uppercase tracking-[0.2em]">Jan 2026 - Present</div>
                <div className="mt-1 font-semibold text-[var(--ink)]">LLM Fusion</div>
                <div>Research Assistant, supervised by Prof. He Bingsheng, National University of Singapore</div>
              </div>
            </div>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-2xl">Other Experience</h2>
            <div className="mt-4 space-y-5 text-sm text-[var(--muted)]">
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">Jan 2025 - May 2025</div>
                <div className="mt-1 font-semibold text-[var(--ink)]">Lead Developer, National University of Singapore</div>
                <ul className="mt-2 list-disc pl-5">
                  <li>Designed an autonomous robot using ROS2, SLAM, and AMG8833 thermal imaging.</li>
                  <li>Implemented multi-pass exploration and A* pathfinding with LiDAR avoidance.</li>
                </ul>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">Feb 2025 - Apr 2025</div>
                <div className="mt-1 font-semibold text-[var(--ink)]">Robotics Group Leader, National University of Singapore</div>
                <ul className="mt-2 list-disc pl-5">
                  <li>Built C++ serial communication workflows on Raspberry Pi for teleoperation.</li>
                  <li>Integrated infrared sensing, ultrasonic braking, and servo-claw control.</li>
                </ul>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">Oct 2024 - Present</div>
                <div className="mt-1 font-semibold text-[var(--ink)]">Member, NUS Astronomy Society</div>
                <ul className="mt-2 list-disc pl-5">
                  <li>Planned and co-led AstroBash stargazing expedition to Langkawi, Malaysia.</li>
                  <li>Organized logistics and guided observation sessions for 30+ participants.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-2xl">Awards & Certificates</h2>
            <ul className="mt-4 list-disc pl-5 text-sm text-[var(--muted)]">
              <li>WorldQuant BRAIN Challenge - Silver Medal (Feb 2025)</li>
              <li>2025 Mathematical Contest in Modeling - Meritorious Winner, COMAP (May 2025)</li>
            </ul>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-2xl">Skills</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
              {[
                'Chinese (Native)',
                'English (Proficient)',
                'Japanese (Intermediate)',
                'German (Basic)',
                'ROS2',
                'OpenCV',
                'PyTorch',
                'SuperSuit',
                'PettingZoo',
                'RLlib',
                'Raspberry Pi 4',
                'Arduino Mega',
                'AMG8833',
                'LiDAR',
                'Servo Motors',
                'React',
                'Tailwind CSS',
                'Vite',
                'Figma',
                'Python',
                'C/C++',
                'JavaScript',
                'Reinforcement Learning',
                'Graph Neural Networks',
                'Transformers',
              ].map((skill) => (
                <div key={skill} className="surface-strong rounded-2xl border border-[var(--line)] px-3 py-2 text-center">
                  {skill}
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default CV;
