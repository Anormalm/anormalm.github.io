const CV = () => {
  return (
    <div className="p-8 min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-500 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-center">Curriculum Vitae</h1>

      {/* PDF Download */}
      <div className="text-center mb-10">
          <a
            href="/CV-Revised-June-2025.pdf"
            download
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition font-medium"
          >
            Download CV (PDF) 
          </a >
        </div>

      {/* Education Timeline */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-indigo-600 dark:text-indigo-400">🎓 Education</h2>
        <div className="border-l-2 border-indigo-600 dark:border-indigo-400 pl-6 space-y-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Aug 2024 – Present</p >
            <h3 className="text-lg font-semibold">Bachelor of Engineering in Computer Engineering (IoT Specialization)</h3>
            <p className="text-gray-700 dark:text-gray-300">National University of Singapore</p >
            <p className="text-sm text-gray-600 dark:text-gray-400">Second Major: Innovation and Design, Minor: Mathematics, GPA: 4.6/5.0</p >
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Jun 2025 – Jul 2025</p >
            <h3 className="text-lg font-semibold">Summer School</h3>
            <p className="text-gray-700 dark:text-gray-300">Shanghai Jiao Tong University</p >
            <p className="text-sm text-gray-600 dark:text-gray-400">Courses: Algebra, Statistical Inference — Grade: A</p >
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-indigo-600 dark:text-indigo-400">💼 Experience</h2>
        <div className="border-l-2 border-indigo-600 dark:border-indigo-400 pl-6 space-y-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Jan 2025 – May 2025</p >
            <h3 className="text-lg font-semibold">Lead Developer – National University of Singapore</h3>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 text-sm mt-1">
              <li>Designed an autonomous robot integrating ROS2, SLAM, and AMG8833 for thermal targeting and projectile firing.</li>
              <li>Implemented multi-pass exploration and A* navigation with dynamic LiDAR-based avoidance.</li>
              <li>Developed exclusion-zone logic and adaptive rotation using tf2 pose tracking.</li>
            </ul>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Feb 2025 – Apr 2025</p >
            <h3 className="text-lg font-semibold">Robotics Group Leader – National University of Singapore</h3>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 text-sm mt-1">
              <li>Built encoder-tracked C++ firmware for Arduino with command parsing and multi-servo control.</li>
              <li>Implemented IR-based sensing, ultrasonic braking, and Raspberry Pi-based serial interface.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-indigo-600 dark:text-indigo-400">🔧 Skills</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm text-gray-800 dark:text-gray-300">
          {[
            'Python', 'C/C++', 'ROS2', 'PyTorch',
            'PettingZoo', 'RLlib', 'Git/GitHub', 'LaTeX',
            'Raspberry Pi', 'Arduino', 'AMG8833', 'LiDAR'
          ].map((skill, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow text-center">
              {skill}
            </div>
          ))}
        </div>
      </section>

      {/* Internship Section */}
  <section className="mb-12">
    <h2 className="text-2xl font-semibold mb-6 text-indigo-600 dark:text-indigo-400">💼 Internship</h2>
    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 text-sm space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">May 2025 – Jun 2025</p >

        <span className="font-medium">Digital Design Engineer Intern (AI)</span> –Shanghai MAHLE Thermal Systems
      <li>
        Built real-time meeting transcriber & translator (Vosk + MarianMT); offline-capable, accurate speech segmentation.
      </li>
      <li>
        Developed YOLO-based blueprint detector and OCR pipelines for tables, diagrams, and multilingual annotations.
      </li>
      <li>
        Designed predictive model for factory quality stoppage using LightGBM & industrial sensor logs (Q-Predict).
      </li>
    </ul>
  </section>


      {/* Certifications Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-indigo-600 dark:text-indigo-400">📜 Certifications</h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 text-sm space-y-2">
          <li>Worldquant BRAIN Challenge Silver Medal – Feb 2025</li>
          <li>MCM 2025 Meritorious Winner – COMAP</li>
        </ul>
      </section>

     {/* Achievements Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-indigo-600 dark:text-indigo-400">🏆 Publications</h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 text-sm space-y-2">
          <li>Hu Lifan, "Learning Lie Group Generators From Trajectories," arXiv.org, Apr 2025</li>
          <li>Hu Lifan, "GNN-Augmented RL for Fraud Detection in DeFi," CONF-SEML 2025 (published) DOI: 10.54254/2755-2721/2025.22856</li>
        </ul>
      </section>

      {/* Footer line */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-12">
        Developed by React/Vite
      </div>
    </div>
  );
};

export default CV;
