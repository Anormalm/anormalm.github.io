const CV = () => {
  return (
    <div className="min-h-screen">
      <section className="section">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Curriculum Vitae</div>
            <h1 className="font-display text-4xl">Hu Lifan</h1>
            <p className="mt-3 max-w-3xl text-sm text-[var(--muted)]">
              Executive summary below. For full details, download the complete CV PDF.
            </p>
          </div>
          <a
            href="/CV-Lifan-Latest.pdf"
            download
            className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90"
          >
            Download Full CV (PDF)
          </a>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <section className="glass-card p-6 md:col-span-2">
            <h2 className="font-display text-2xl">Profile</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Computer Engineering (IoT) student at the National University of Singapore focused on machine learning systems,
              robotics, and technical product engineering. Work includes applied research in GNN + MARL, on-device vision-language
              systems, and production-facing automation tooling.
            </p>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-2xl">Education</h2>
            <ul className="mt-4 list-disc pl-5 text-sm text-[var(--muted)]">
              <li>NUS B.Eng (Computer Engineering, IoT), Aug 2024 - Present</li>
              <li>Second Major: Innovation and Design Program</li>
              <li>Minor: Mathematics</li>
              <li>Summer School, Shanghai Jiao Tong University (Jun 2025 - Jul 2025)</li>
            </ul>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-2xl">Selected Publications</h2>
            <ul className="mt-4 list-disc pl-5 text-sm text-[var(--muted)]">
              <li>Learning Lie Group Generators From Trajectories (arXiv, Apr 2025)</li>
              <li>GNN-Augmented RL for Fraud Detection in Decentralized Finance (CONF-SEML 2025)</li>
              <li>DOI: 10.54254/2755-2721/2025.22856</li>
            </ul>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-2xl">Research Highlights</h2>
            <ul className="mt-4 list-disc pl-5 text-sm text-[var(--muted)]">
              <li>GNN + MARL DeFi fraud detection with PettingZoo and PPO on 50K+ Ethereum records</li>
              <li>Lie group trajectory encoders across SE(2), SE(3), SO(3), SL(2,R)</li>
              <li>On-device VLM assistant research on Jetson Orin Nano Super</li>
              <li>LLM Fusion research assistantship at NUS</li>
            </ul>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-2xl">Industry / Engineering</h2>
            <ul className="mt-4 list-disc pl-5 text-sm text-[var(--muted)]">
              <li>Digital Developer Intern, Shanghai MAHLE Thermal Systems (May 2025 - Jul 2025)</li>
              <li>Built OCR and multilingual transcription pipelines for factory workflows</li>
              <li>Developed predictive downtime models and internal API tooling</li>
              <li>Led autonomous robotics builds at NUS (ROS2, SLAM, LiDAR, AMG8833)</li>
            </ul>
          </section>

          <section className="glass-card p-6 md:col-span-2">
            <h2 className="font-display text-2xl">Core Skills</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
              {[
                'Python',
                'C/C++',
                'JavaScript',
                'PyTorch',
                'ROS2',
                'PettingZoo',
                'RLlib',
                'OpenCV',
                'React',
                'Tailwind CSS',
                'Vite',
                'Robotics + IoT',
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
