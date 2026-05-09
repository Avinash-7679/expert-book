import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { expertService } from '../services/api';
import { Search, Filter, Star, Briefcase, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExpertListing = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['experts', page, category, debouncedSearch],
    queryFn: () => expertService.getExperts({ page, category, search: debouncedSearch }),
    keepPreviousData: true
  });

  const categories = [
    "Full Stack Development",
    "Data Science & AI",
    "UI/UX Design",
    "Cloud Computing",
    "Mobile App Development",
    "Cybersecurity",
    "Blockchain Technology",
    "Digital Marketing",
    "Product Management",
    "DevOps Engineering"
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-6 py-12">
        <h1 className="section-title">The Expert Circle</h1>
        <p className="text-slate-500 text-xl font-light italic max-w-xl mx-auto">
          "Connect with India's finest minds for exclusive 1-on-1 mentorship sessions."
        </p>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-slate-200 shadow-sm">
        <div className="md:col-span-7 relative border-b md:border-b-0 md:border-r border-slate-200">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Search by name or keyword..." 
            className="w-full pl-14 pr-6 py-5 outline-none text-slate-700 font-medium placeholder:text-slate-300 transition-all focus:bg-slate-50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="md:col-span-5 relative">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Filter className="w-5 h-5" />
          </div>
          <select 
            className="w-full pl-14 pr-10 py-5 outline-none appearance-none bg-white text-slate-700 font-medium cursor-pointer focus:bg-slate-50 transition-all"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            <option value="">All Specializations</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
            <ChevronRight className="w-5 h-5 rotate-90" />
          </div>
        </div>
      </div>

      {/* Experts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(n => (
            <div key={n} className="h-80 bg-slate-100 animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20 border border-red-100 bg-red-50 text-red-600">
          We encountered an error while fetching our experts. Please refresh the page.
        </div>
      ) : (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.data?.experts?.map((expert) => (
              <Link 
                key={expert._id} 
                to={`/expert/${expert._id}`}
                className="glass-card group flex flex-col h-full overflow-hidden"
              >
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-6">
                    <div className="icon-wrapper">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white text-xs font-bold tracking-widest">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {expert.rating.toFixed(1)}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                      {expert.name}
                    </h3>
                    <p className="premium-tag inline-block">
                      {expert.category}
                    </p>
                  </div>

                  <div className="mt-auto space-y-6">
                    <div className="flex items-center text-slate-500 text-sm border-t border-slate-100 pt-6">
                      <Briefcase className="w-4 h-4 mr-3 shrink-0" />
                      <span className="font-medium tracking-tight">{expert.experience} Years of Excellence</span>
                    </div>
                    
                    <div className="flex items-center justify-between group-hover:translate-x-2 transition-transform duration-300">
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">View Portfolio</span>
                      <ChevronRight className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {data?.data?.totalPages > 1 && (
            <div className="flex justify-center items-center gap-10 py-12 border-t border-slate-200">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest disabled:opacity-20 transition-all hover:text-amber-700"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Previous
              </button>
              <div className="text-sm font-serif italic text-slate-500">
                Page <span className="font-sans font-bold text-slate-900 not-italic mx-1">{page}</span> of {data?.data?.totalPages}
              </div>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={page >= data?.data?.totalPages}
                className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest disabled:opacity-20 transition-all hover:text-amber-700"
              >
                Next
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpertListing;
