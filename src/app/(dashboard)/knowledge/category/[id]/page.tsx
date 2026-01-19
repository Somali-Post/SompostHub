'use client';

import { ArrowLeft, ChevronRight, FileText } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const ARTICLES = [
  { id: '1', title: 'Standard Operating Procedure (SOP)', views: '1.2k' },
  { id: '2', title: 'Emergency Handling Guide', views: '850' },
  { id: '3', title: 'Equipment Maintenance', views: '620' },
];

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;
  const title = categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace('-', ' ');

  return (
    <div className="flex flex-col h-full p-6 md:p-8 gap-6">
      <Link
        href="/knowledge"
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-auth-button"
      >
        <ArrowLeft size={16} /> Back to Knowledge Base
      </Link>

      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">{title}</h1>
        <p className="text-slate-500">All articles related to {title}.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {ARTICLES.map((article) => (
            <Link
              key={article.id}
              href={`/knowledge/article/${article.id}`}
              className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-400 group-hover:text-auth-button group-hover:bg-auth-button/10 transition-colors">
                  <FileText size={20} />
                </div>
                <span className="font-bold text-sm text-slate-900 group-hover:text-auth-button">
                  {article.title}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>{article.views} views</span>
                <ChevronRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
