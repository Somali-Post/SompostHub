'use client';

import {
  BookOpen,
  ChevronRight,
  FileText,
  Monitor,
  Search,
  Shield,
  Truck,
} from 'lucide-react';
import Link from 'next/link';

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

type ArticleRowProps = {
  title: string;
  category: string;
  views: string;
};

export default function KnowledgeBasePage() {
  return (
    <div className="flex h-full flex-col gap-8 overflow-y-auto p-6 md:p-8">
      <div className="mx-auto w-full max-w-3xl space-y-6 text-center">
        <div>
          <h1 className="mb-2 text-3xl font-black text-slate-900">Knowledge Base</h1>
          <p className="text-slate-500">Find SOPs, manuals, and operational guides.</p>
        </div>
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search for articles (e.g. 'Customs Codes')..."
            className="h-14 w-full rounded-xl border-2 border-slate-200 pl-12 pr-4 text-lg transition-all focus:border-auth-button focus:ring-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/knowledge/category/${cat.id}`}
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-auth-button/30 hover:shadow-md"
          >
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${cat.color}`}>
              {cat.icon}
            </div>
            <h3 className="font-bold text-slate-900 transition-colors group-hover:text-auth-button">
              {cat.title}
            </h3>
            <p className="mt-1 text-xs text-slate-500">{cat.count} Articles</p>
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="font-bold text-slate-800">Popular Articles</h3>
        </div>
        <div className="divide-y divide-slate-100">
          <ArticleRow
            title="Standard Procedure for International Registered Mail"
            category="Intl. Shipping"
            views="1.2k"
          />
          <ArticleRow
            title="How to Reset Handheld Scanner (Zebra TC26)"
            category="IT Support"
            views="850"
          />
          <ArticleRow
            title="Customs Declaration Codes (2024 Update)"
            category="Compliance"
            views="620"
          />
        </div>
      </div>
    </div>
  );
}

function ArticleRow({ title, category, views }: ArticleRowProps) {
  return (
    <Link
      href="/knowledge/article/registered-mail"
      className="group flex items-center justify-between p-4 transition-colors hover:bg-slate-50"
    >
      <div className="flex items-center gap-4">
        <div className="rounded-lg bg-slate-100 p-2 text-slate-400 transition-colors group-hover:bg-auth-button/10 group-hover:text-auth-button">
          <FileText size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 transition-colors group-hover:text-auth-button">
            {title}
          </h4>
          <p className="text-xs text-slate-500">{category}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-slate-400">
        <span>{views} views</span>
        <ChevronRight size={16} />
      </div>
    </Link>
  );
}
