// src/pages/writings/GNNMARLFraud.jsx
export default function GNNMARLFraud() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-lg leading-relaxed">
      <h1 className="text-3xl font-bold mb-2">Graphs, Agents, and Adversaries</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        April 2025 · GNN · Reinforcement Learning · DeFi
      </p>

      <p className="mb-4">
        Decentralized finance (DeFi) has created a new class of fraud — rapid, adaptive, and difficult to catch using static rules or traditional models.
        To address this, I designed a hybrid system that merges Graph Neural Networks (GNNs) with Multi-Agent Reinforcement Learning (MARL), simulating both attackers and defenders in a strategic learning loop.
      </p>

      <p className="mb-4">
        Most fraud detection pipelines assume i.i.d. inputs — rows in a table, isolated in meaning. But financial transactions form networks of influence.
        GNNs allow us to model transactions as a graph: nodes as accounts, edges as transfers, with features like value, time, or frequency.
        A GCN (Graph Convolutional Network) aggregates structural and contextual information, allowing us to learn embeddings that reflect anomalous behavior patterns in context.
      </p>

      <p className="mb-4">
        I paired this with a custom PettingZoo environment where two agents — a detector and a fraudster — interact over a sequence of episodes.
        The fraudster’s goal is to mimic benign behavior while maximizing illicit gains. The detector’s policy, trained via PPO, learns to flag suspicious nodes by analyzing graph features and historical context.
        Importantly, both agents adapt over time — evolving strategies, counter-strategies, and learning in a loop that more closely mirrors adversarial dynamics in the wild.
      </p>

      <p className="mb-4">
        I experimented with multiple baselines — XGBoost, standalone GNN classifiers, and pure RL agents. The GNN + MARL combination consistently outperformed them on robustness, especially in noisy or intentionally obfuscated graphs.
        It wasn’t just more accurate — it was more aware. The model learned to anticipate evasion patterns, making decisions that were interpretable and grounded in structure.
      </p>

      <p className="mb-4">
        Technically, the most challenging aspects were the dual-policy training setup, sparse and asymmetric rewards, and the stability of graph embeddings under adversarial perturbations.
        I had to build a reward function that balanced false positives and missed fraud while ensuring convergence in a competitive environment.
        Visualization tools helped: I used graph heatmaps, reward plots, and trajectory traces to diagnose agent behavior over time.
      </p>

      <p className="mb-4">
        Beyond the technicals, this project taught me how to design systems that learn not just from data, but from competition — from simulation, from feedback, from play.
        It’s a small step toward models that not only classify but adapt, strategize, and resist deception.
      </p>

      <p className="mt-8 italic text-gray-600 dark:text-gray-400">
        “In a world where fraud evolves, detection must too. Intelligence is not prediction — it’s adaptation under pressure.”
      </p>
    </div>
  );
}
