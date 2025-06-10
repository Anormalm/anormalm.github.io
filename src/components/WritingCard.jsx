import { motion } from 'framer-motion';

const WritingCard = ({ title, excerpt, date, link }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all hover:scale-105 hover:shadow-xl"
    >
      <h3 className="text-2xl font-semibold mb-1 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{date}</p>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{excerpt}</p>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
        >
          Read More →
        </a>
      )}
    </motion.div>
  );
};

export default WritingCard;
