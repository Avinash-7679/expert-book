import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { expertService } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { Calendar, Clock, Star, MapPin, ShieldCheck, ArrowLeft, User, ChevronRight, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';

const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['expert', id],
    queryFn: () => expertService.getExpertById(id)
  });

  useEffect(() => {
    if (!socket) return;

    const handleSlotBooked = (payload) => {
      if (payload.expertId === id) {
        queryClient.invalidateQueries(['expert', id]);
      }
    };

    socket.on('slotBooked', handleSlotBooked);
    return () => socket.off('slotBooked', handleSlotBooked);
  }, [socket, id, queryClient]);

  if (isLoading) return (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      <div className="h-64 bg-slate-100 animate-pulse border border-slate-200" />
      <div className="h-96 bg-slate-100 animate-pulse border border-slate-200" />
    </div>
  );

  const expert = data?.data;

  const groupedSlots = expert?.availableSlots.reduce((acc, slot) => {
    const dateStr = format(new Date(slot.date), 'EEEE, MMM do');
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(slot);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto space-y-16 py-12 px-4">
      <button 
        onClick={() => navigate(-1)} 
        className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
        Back to Circle
      </button>

      {/* Profile Header */}
      <div className="glass-card p-12 border border-slate-200 flex flex-col md:flex-row gap-12 items-center md:items-start">
        <div className="w-48 h-48 border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
           <User className="w-24 h-24 text-slate-200" />
        </div>
        <div className="space-y-8 flex-grow">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">{expert.name}</h1>
              <p className="premium-tag inline-block text-base">{expert.category}</p>
            </div>
            <div className="flex flex-col items-center gap-2 border border-slate-900 p-4 min-w-[120px]">
               <div className="flex items-center gap-1.5">
                 <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                 <span className="text-2xl font-black">{expert.rating.toFixed(1)}</span>
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Distinction</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-900 text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Experience</p>
                <p className="font-bold text-slate-900">{expert.experience} Years of Mastery</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 border border-slate-200 text-slate-900">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Availability</p>
                <p className="font-bold text-slate-900">Global / Remote Direct</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slots Section */}
      <div className="space-y-12">
        <div className="flex items-center gap-6">
           <h2 className="text-3xl font-extrabold text-slate-900">Appointment Schedule</h2>
           <div className="flex-grow h-[1px] bg-slate-200"></div>
        </div>

        {Object.keys(groupedSlots || {}).length === 0 ? (
          <div className="text-center py-24 border border-dashed border-slate-200 text-slate-400 italic">
            Currently fully booked. Please check back shortly for new openings.
          </div>
        ) : (
          <div className="space-y-16">
            {Object.entries(groupedSlots).map(([date, slots]) => (
              <div key={date} className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-amber-700 sticky top-24">{date}</h3>
                </div>
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {slots.map((slot) => (
                    <button
                      key={slot._id}
                      disabled={slot.isBooked}
                      onClick={() => navigate(`/expert/${expert._id}/book/${slot._id}`, { state: { expert, slot } })}
                      className={`
                        p-6 border transition-all text-left group
                        ${slot.isBooked 
                          ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed opacity-50' 
                          : 'bg-white border-slate-200 text-slate-900 hover:border-slate-900 hover:shadow-xl'}
                      `}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <Clock className={`w-5 h-5 ${slot.isBooked ? 'text-slate-200' : 'text-slate-400 group-hover:text-slate-900'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${slot.isBooked ? 'text-slate-300' : 'text-amber-600'}`}>
                          {slot.isBooked ? 'Occupied' : 'Vacant'}
                        </span>
                      </div>
                      <span className="text-xl font-bold block">{slot.time}</span>
                      {!slot.isBooked && (
                        <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
                          Reserve Now <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertDetail;
