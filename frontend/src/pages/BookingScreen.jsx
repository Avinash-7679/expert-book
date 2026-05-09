import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { bookingService } from '../services/api';
import { format } from 'date-fns';
import { User, Mail, Phone, FileText, CheckCircle2, AlertCircle, ArrowLeft, Layers, Calendar } from 'lucide-react';

const BookingScreen = () => {
  const { id, slotId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { expert, slot } = state || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!expert || !slot) {
      return (
        <div className="max-w-md mx-auto text-center py-24 space-y-8">
           <AlertCircle className="w-16 h-16 text-slate-200 mx-auto" />
           <h2 className="text-2xl font-serif font-bold italic text-slate-400">Missing reservation details.</h2>
           <button onClick={() => navigate('/')} className="btn-primary">Return to Directory</button>
        </div>
      );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await bookingService.createBooking({
        expertId: id,
        slotId: slotId,
        ...formData
      });
      setSuccess(true);
      setTimeout(() => navigate('/my-bookings'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-10 py-32">
        <div className="border border-slate-900 w-32 h-32 flex items-center justify-center mx-auto text-slate-900 shadow-2xl">
           <CheckCircle2 className="w-16 h-16" />
        </div>
        <div className="space-y-4">
          <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight">Reservation Requested</h2>
          <p className="text-slate-500 text-xl font-light italic">Your session with {expert.name} has been submitted for approval.</p>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-700 animate-pulse pt-10">Updating Ledger...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-16">
      <button 
        onClick={() => navigate(-1)} 
        className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
        Modify Selection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Summary Column */}
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-4">
             <h2 className="text-3xl font-extrabold text-slate-900">Summary</h2>
             <div className="w-12 h-1 bg-amber-600"></div>
          </div>
          
          <div className="border border-slate-200 p-12 bg-white shadow-sm space-y-10">
            <div className="flex gap-6 items-start">
              <div className="icon-wrapper">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Distinguished Expert</p>
                <p className="text-2xl font-bold text-slate-900">{expert.name}</p>
                <p className="premium-tag inline-block">{expert.category}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 pt-10 border-t border-slate-100">
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Scheduled Date</p>
                  <p className="text-lg font-bold text-slate-900">{format(new Date(slot.date), 'MMMM do, yyyy')}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Appointment</p>
                  <p className="text-lg font-bold text-amber-700">{slot.time}</p>
               </div>
            </div>

            <div className="bg-slate-50 p-6 border-l-4 border-slate-900 text-slate-600 text-xs font-medium italic leading-relaxed">
              "Professional protocol requires attendance 5 minutes prior to commencement. A secure link will be provided in your portfolio."
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="lg:col-span-7 space-y-12">
          <div className="space-y-4">
             <h2 className="text-3xl font-extrabold text-slate-900">Identification</h2>
             <div className="w-12 h-1 bg-amber-600"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="border border-red-900 bg-red-50 text-red-900 p-6 flex items-center gap-4 text-xs font-black uppercase tracking-widest">
                <AlertCircle className="w-6 h-6 shrink-0" /> {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Legal Full Name</label>
                <div className="relative">
                  <User className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                  <input 
                    required
                    type="text" 
                    placeholder="E.g. Amitabh Bachchan" 
                    className="w-full pl-8 py-4 border-b border-slate-200 outline-none focus:border-slate-900 transition-all text-slate-900 font-bold placeholder:font-normal placeholder:italic placeholder:text-slate-300"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Official Email</label>
                <div className="relative">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                  <input 
                    required
                    type="email" 
                    placeholder="name@domain.com" 
                    className="w-full pl-8 py-4 border-b border-slate-200 outline-none focus:border-slate-900 transition-all text-slate-900 font-bold placeholder:font-normal placeholder:italic placeholder:text-slate-300"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                  <input 
                    required
                    type="tel" 
                    pattern="[0-9]{10}"
                    placeholder="10-digit mobile number" 
                    className="w-full pl-8 py-4 border-b border-slate-200 outline-none focus:border-slate-900 transition-all text-slate-900 font-bold placeholder:font-normal placeholder:italic placeholder:text-slate-300"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Appointment Date</label>
                <div className="relative">
                  <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                  <input 
                    readOnly
                    type="text" 
                    className="w-full pl-8 py-4 border-b border-slate-50 bg-slate-50/50 outline-none text-slate-400 font-bold cursor-not-allowed"
                    value={format(new Date(slot.date), 'MMMM do, yyyy')}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Time Slot</label>
                <div className="relative">
                  <Layers className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                  <input 
                    readOnly
                    type="text" 
                    className="w-full pl-8 py-4 border-b border-slate-50 bg-slate-50/50 outline-none text-slate-400 font-bold cursor-not-allowed"
                    value={slot.time}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Statement of Purpose</label>
                <div className="relative">
                  <FileText className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                  <input 
                    type="text"
                    placeholder="Optional notes..." 
                    className="w-full pl-8 py-4 border-b border-slate-200 outline-none focus:border-slate-900 transition-all text-slate-900 font-bold placeholder:font-normal placeholder:italic placeholder:text-slate-300"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full h-20 text-sm shadow-2xl hover:translate-y-[-4px]"
            >
              {loading ? 'Authenticating...' : 'Secure Appointment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingScreen;
