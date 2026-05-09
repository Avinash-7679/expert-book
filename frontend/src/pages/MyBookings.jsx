import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '../services/api';
import { Search, Mail, Calendar, Clock, User, CheckCircle, Clock4, AlertCircle, Layers, ChevronRight, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import ChatModal from '../components/ChatModal';

const MyBookings = () => {
  const [email, setEmail] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [activeChat, setActiveChat] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-bookings', searchEmail],
    queryFn: () => bookingService.getBookingsByEmail(searchEmail),
    enabled: !!searchEmail
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchEmail(email);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-slate-900 text-white border-slate-900';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Completed': return 'bg-slate-50 text-slate-400 border-slate-100';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 py-12 px-4">
      {/* Header */}
      <div className="text-center space-y-6 py-12">
        <h1 className="section-title">The Ledger</h1>
        <p className="text-slate-500 text-xl font-light italic max-w-xl mx-auto">
          "Review and manage your scheduled consultations within the inner circle."
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex flex-col md:flex-row gap-0 border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex-grow relative">
          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
          <input 
            required
            type="email" 
            placeholder="Authorized Email Address..." 
            className="w-full pl-14 pr-6 py-5 outline-none text-slate-900 font-bold placeholder:font-normal placeholder:italic placeholder:text-slate-300 transition-all focus:bg-slate-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-slate-900 text-white px-10 py-5 font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all active:scale-95">
          Access
        </button>
      </form>

      {/* Results */}
      <div className="space-y-10">
        {isLoading ? (
          <div className="space-y-6">
            {[1,2].map(n => <div key={n} className="h-40 bg-slate-100 animate-pulse border border-slate-200" />)}
          </div>
        ) : !searchEmail ? (
          <div className="text-center py-32 border border-dashed border-slate-200 text-slate-300 italic">
            Please enter your credentials above to retrieve your appointments.
          </div>
        ) : data?.data?.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-slate-200 text-slate-400 italic">
            No reservations found for this identity.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {data?.data?.map((booking) => (
              <div key={booking._id} className="glass-card border border-slate-200 p-10 flex flex-col md:flex-row gap-10 items-center justify-between group">
                <div className="flex gap-8 items-start flex-grow w-full">
                   <div className="icon-wrapper w-20 h-20 bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      <Layers className="w-10 h-10 text-slate-200" />
                   </div>
                   <div className="space-y-4 flex-grow">
                      <div className="flex flex-wrap items-center gap-4">
                        <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none uppercase">
                          {booking.expertId?.name}
                        </h3>
                        <span className={`text-[10px] font-black tracking-[0.2em] px-3 py-1 uppercase border ${getStatusStyle(booking.status)}`}>
                           {booking.status}
                        </span>
                      </div>
                      <p className="premium-tag inline-block">{booking.expertId?.category}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-3 text-slate-500 font-bold tracking-tight text-sm">
                          <Calendar className="w-4 h-4 text-amber-600" /> 
                          {format(new Date(booking.date), 'MMMM do, yyyy')}
                        </div>
                        <div className="flex items-center gap-3 text-slate-500 font-bold tracking-tight text-sm">
                          <Clock4 className="w-4 h-4 text-amber-600" /> 
                          {booking.timeSlot}
                        </div>
                      </div>
                   </div>
                </div>
                
                <div className="w-full md:w-auto flex flex-col gap-4">
                   <div className="flex gap-2">
                     <button className="flex-grow px-8 py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all">
                        Enter Session
                     </button>
                     <button 
                       onClick={() => setActiveChat(booking)}
                       className="p-4 border border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all text-slate-900"
                       title="Open Mentorship Chat"
                     >
                       <MessageCircle className="w-6 h-6" />
                     </button>
                   </div>
                   <div className="text-[10px] text-center text-slate-400 uppercase tracking-[0.3em] font-black">
                     Serial: {booking._id.slice(-8).toUpperCase()}
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {activeChat && (
        <ChatModal 
          isOpen={!!activeChat} 
          onClose={() => setActiveChat(null)} 
          booking={activeChat}
        />
      )}
    </div>
  );
};

export default MyBookings;
