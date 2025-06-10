import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  return (
    <div className="p-8 min-h-screen transition-colors duration-500 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <h2 className="text-3xl font-bold mb-6">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProjectCard
          title="Personal Website"
          description="A portfolio website built with React and Tailwind CSS. This is recursive somehow."
          link="https://github.com/anormalm/personal-website"
        />
        <ProjectCard
          title="Creative Writing Archive"
          description="A digital archive of my short stories."
          link="#"
        />
        <ProjectCard
          title="Autonomous Robot"
          description="A ROS2-powered heat-seeking robot using SLAM, frontier exploration, AMG8833, and A* navigation with firing logic."
        />
        <ProjectCard
          title="Lie Group Trajectory Encoder"
          description="Learned Lie group generators from motion sequences in SE(2), SE(3), SO(3), and SL(2,R). Includes visualizations and manifold modeling."
          link="https://github.com/Anormalm/LieRL-on-Trajectories" // replace if needed
        />
        <ProjectCard
          title="BPCompanion"
          description="A blood pressure logging and prediction toolkit with anomaly detection, LSTM modeling, and a Tkinter GUI for elderly users."
          link="https://github.com/anormalm/bpcompanion" // optional
        />
        <ProjectCard
          title="TopoTrace"
          description="A topology-aware anomaly detection toolkit using persistent homology to analyze dynamic system traces."
          link="https://github.com/anormalm/topotrace" // optional
        />
      </div>
    </div>
  );
};

export default Projects;