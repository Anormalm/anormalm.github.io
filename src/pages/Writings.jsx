import WritingCard from '../components/WritingCard';

const Writings = () => {
  return (
    <div className="p-8 min-h-screen transition-colors duration-500 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <h2 className="text-3xl font-bold mb-6">Writings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WritingCard
          title="The Disenchantment of Modern Life (GEC1052 @NUS)"
          excerpt="An essay exploring how rationalization shapes culture and identity."
          date="March 2025"
          link="/writings/Disenchantment"
        />
        <WritingCard
          title="Fragments of a Digital Mind"
          excerpt="Reflections on attention, algorithms, and the self in the age of screens."
          date="February 2025"
          link="/writings/Fragments"
        />
        <WritingCard
        title="Graphs, Agents, and Adversaries"
        excerpt="Lessons from building a fraud detection system using GNNs and multi-agent reinforcement learning."
        date="April 2025"
        link="/writings/GNNMARLFraud"
      />

      </div>
    </div>
  );
};

export default Writings;
