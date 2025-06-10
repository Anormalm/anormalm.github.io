const Contact = () => {
  return (
    <div className="p-8 min-h-screen transition-colors duration-500 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Contact Me</h2>
      <form
        action="https://formspree.io/f/mkgjnbdd"
        method="POST"
        className="flex flex-col gap-4 max-w-xl mx-auto"
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          className="p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          className="p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          required
          rows="5"
          className="p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
