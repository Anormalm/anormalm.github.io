import { useLanguage } from '../../context/LanguageContext';

export default function Disenchantment() {
  const { isChinese } = useLanguage();
  return (
    <div className="max-w-3xl mx-auto p-6 text-lg leading-relaxed">
      <h1 className="text-3xl font-bold mb-2">{isChinese ? '现代生活的祛魅' : 'The Disenchantment of Modern Life'}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        {isChinese ? '2025 年 3 月｜内容已移除' : 'March 2025 | Content Removed'}
      </p>
      <p className="mb-4">
        {isChinese ? '这篇文章的内容已移除，卡片和路径会保留给未来的更新。' : 'This writing content has been removed. The card and route are preserved for future updates.'}
      </p>
    </div>
  );
}
