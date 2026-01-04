
import React from 'react';
import { X, Calendar, User, Clock, Share2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogReaderProps {
  post: BlogPost | null;
  onClose: () => void;
}

const BlogReader: React.FC<BlogReaderProps> = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl h-full md:h-[95vh] bg-white md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Header Controls */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <button onClick={onClose} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all">
            <ArrowLeft size={16} /> Back to Insights
          </button>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-brand-accent transition-colors"><Share2 size={20} /></button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><X size={24} /></button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Cover Image */}
          <div className="w-full h-[300px] md:h-[450px] relative">
            <img src={post.image} className="w-full h-full object-cover" alt={post.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
            <div className="absolute bottom-10 left-10 right-10">
               <span className="px-4 py-2 bg-brand-accent text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">{post.category}</span>
               <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">{post.title}</h1>
            </div>
          </div>

          <div className="px-8 md:px-20 py-12">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-8 mb-16 pb-8 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400"><User size={20} /></div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Author</p>
                  <p className="text-sm font-bold text-slate-900">{post.author}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400"><Calendar size={20} /></div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Published</p>
                  <p className="text-sm font-bold text-slate-900">{post.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400"><Clock size={20} /></div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Reading</p>
                  <p className="text-sm font-bold text-slate-900">{post.readTime}</p>
                </div>
              </div>
              {post.isCited && (
                <div className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-brand-accent rounded-xl text-[10px] font-black uppercase tracking-widest border border-teal-100">
                  <ShieldCheck size={14} /> Peer Cited Article
                </div>
              )}
            </div>

            {/* Article Content */}
            <article 
              className="prose prose-slate prose-lg max-w-none text-left
                prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight
                prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
                prose-strong:text-slate-900 prose-strong:font-black
                prose-blockquote:border-l-4 prose-blockquote:border-brand-accent prose-blockquote:bg-slate-50 prose-blockquote:p-8 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:font-bold
                prose-li:font-bold prose-li:text-slate-600
                [&>h2]:text-4xl [&>h2]:mt-16 [&>h2]:mb-8
                [&>h3]:text-2xl [&>h3]:mt-10 [&>h3]:mb-4
              "
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <div className="mt-20 pt-12 border-t border-slate-100 text-center">
              <h4 className="text-xl font-black text-slate-900 mb-4">Interested in Managed Precision?</h4>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">See how this strategic methodology applies to your specific portfolio square footage.</p>
              <button 
                onClick={onClose}
                className="px-12 py-5 bg-brand-accent text-white font-black rounded-2xl shadow-xl shadow-brand-accent/20 hover:bg-brand-accentLight transition-all uppercase tracking-widest text-[11px]"
              >
                Calculate My Monthly Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogReader;
