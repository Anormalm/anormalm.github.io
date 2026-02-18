const CV = () => {
  return (
    <div className="min-h-screen">
      <section className="section">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Curriculum Vitae</div>
            <h1 className="font-display text-4xl">Anormalm</h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
              Creative technologist focused on research tooling, interface design, and software systems.
            </p>
          </div>
          <a
            href="/CV-Revised-June-2025.pdf"
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
                  Bachelor of Engineering in Computer Engineering (IoT)
                </div>
                <div>National University of Singapore</div>
                <div className="text-xs text-[var(--muted)]">
                  Second Major: Innovation and Design. Minor: Mathematics. GPA: 4.6/5.0
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">Jun 2025 - Jul 2025</div>
                <div className="mt-1 font-semibold text-[var(--ink)]">Summer School</div>
                <div>Shanghai Jiao Tong University</div>
                <div className="text-xs text-[var(--muted)]">Courses: Algebra, Statistical Inference. Grade: A</div>
              </div>
            </div>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-2xl">Experience</h2>
            <div className="mt-4 space-y-5 text-sm text-[var(--muted)]">
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">Jan 2025 - May 2025</div>
                <div className="mt-1 font-semibold text-[var(--ink)]">Lead Developer, National University of Singapore</div>
                <ul className="mt-2 list-disc pl-5">
                  <li>Designed an autonomous robot integrating ROS2, SLAM, and AMG8833 for thermal targeting.</li>
                  <li>Implemented multi-pass exploration and A* navigation with LiDAR-based avoidance.</li>
                  <li>Built exclusion-zone logic and adaptive rotation using tf2 pose tracking.</li>
                </ul>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">Feb 2025 - Apr 2025</div>
                <div className="mt-1 font-semibold text-[var(--ink)]">Robotics Group Leader, National University of Singapore</div>
                <ul className="mt-2 list-disc pl-5">
                  <li>Built encoder-tracked C++ firmware for Arduino with command parsing and multi-servo control.</li>
                  <li>Implemented IR-based sensing, ultrasonic braking, and Raspberry Pi serial interface.</li>
                </ul>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">May 2025 - Jun 2025</div>
                <div className="mt-1 font-semibold text-[var(--ink)]">
                  Digital Design Engineer Intern (AI), Shanghai MAHLE Thermal Systems
                </div>
                <ul className="mt-2 list-disc pl-5">
                  <li>Built a real-time meeting transcriber and translator (Vosk + MarianMT).</li>
                  <li>Developed YOLO-based blueprint detector and OCR pipelines for multilingual diagrams.</li>
                  <li>Designed a predictive model for factory quality stoppage using LightGBM logs.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-2xl">Skills</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
              {[
                'Python',
                'C/C++',
                'ROS2',
                'PyTorch',
                'PettingZoo',
                'RLlib',
                'Git/GitHub',
                'LaTeX',
                'Raspberry Pi',
                'Arduino',
                'AMG8833',
                'LiDAR',
              ].map((skill) => (
                <div key={skill} className="surface-strong rounded-2xl border border-[var(--line)] px-3 py-2 text-center">
                  {skill}
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-2xl">Certifications</h2>
            <ul className="mt-4 list-disc pl-5 text-sm text-[var(--muted)]">
              <li>WorldQuant BRAIN Challenge Silver Medal - Feb 2025</li>
              <li>MCM 2025 Meritorious Winner - COMAP</li>
            </ul>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-2xl">Publications</h2>
            <ul className="mt-4 list-disc pl-5 text-sm text-[var(--muted)]">
              <li>Hu Lifan, "Learning Lie Group Generators From Trajectories," arXiv.org, Apr 2025</li>
              <li>
                Hu Lifan, "GNN-Augmented RL for Fraud Detection in DeFi," CONF-SEML 2025 (published)
                DOI: 10.54254/2755-2721/2025.22856
              </li>
            </ul>
          </section>
        </div>
      </section>
    </div>
  );
};

export default CV;
