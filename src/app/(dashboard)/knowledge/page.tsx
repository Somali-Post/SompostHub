'use client';

import { useState } from 'react';
import { BookOpen, ChevronRight, FileText, Monitor, Search, Shield, Truck } from 'lucide-react';
import Link from 'next/link';

const ARTICLES = [
  {
    id: '1',
    title: 'Standard Procedure for International Registered Mail',
    category: 'Intl. Shipping',
    views: '1.2k',
  },
  {
    id: '2',
    title: 'How to Reset Handheld Scanner (Zebra TC26)',
    category: 'IT Support',
    views: '850',
  },
  {
    id: '3',
    title: 'Customs Declaration Codes (2024 Update)',
    category: 'Compliance',
    views: '620',
  },
];

const CATEGORIES = [
  {
    id: 'mail',
    title: 'Mail Handling',
    icon: <BookOpen size={24} />,
    count: 12,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'shipping',
    title: 'Intl. Shipping',
    icon: <Truck size={24} />,
    count: 8,
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 'compliance',
    title: 'Compliance',
    icon: <Shield size={24} />,
    count: 5,
    color: 'bg-amber-100 text-amber-600',
  },
  {
    id: 'it',
    title: 'IT Support',
    icon: <Monitor size={24} />,
    count: 15,
    color: 'bg-purple-100 text-purple-600',
  },
];

export default function KnowledgeBasePage() {
  const [search, setSearch] = useState('');

  const filteredArticles = ARTICLES.filter(
    (article) =>
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 h-full overflow-y-auto p-6 md:p-8">
      <div className="max-w-3xl mx-auto w-full text-center space-y-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Knowledge Base</h1>
          <p className="text-slate-500">Find SOPs, manuals, and operational guides.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search for articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-slate-200 text-lg focus:border-auth-button focus:ring-0 transition-all"
          />
        </div>
      </div>

      {!search && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/knowledge/category/${cat.id}`}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-auth-button/30 transition-all group"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${cat.color}`}>
                {cat.icon}
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-auth-button transition-colors">
                {cat.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{cat.count} Articles</p>
            </Link>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">
            {search ? 'Search Results' : 'Popular Articles'}
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/knowledge/article/${article.id}`}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-400 group-hover:text-auth-button group-hover:bg-auth-button/10 transition-colors">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-auth-button transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-xs text-slate-500">{article.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>{article.views} views</span>
                  <ChevronRight size={16} />
                </div>
              </Link>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400">No articles found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
