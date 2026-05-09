import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SocketProvider } from './context/SocketContext';
import ExpertListing from './pages/ExpertListing';
import ExpertDetail from './pages/ExpertDetail';
import BookingScreen from './pages/BookingScreen';
import MyBookings from './pages/MyBookings';
import { User, Calendar, BookOpen, Layers } from 'lucide-react';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50">
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 py-2">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                  <Link to="/" className="flex items-center gap-3 group">
                    <div className="bg-slate-900 p-2.5 rounded-none group-hover:bg-amber-700 transition-colors">
                      <Layers className="text-white w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-serif font-black tracking-tight text-slate-900 leading-none">EXPERTBOOK</span>
                      <span className="text-[10px] font-bold tracking-[0.3em] text-amber-700 uppercase leading-normal">Premium Mentorship</span>
                    </div>
                  </Link>
                  <div className="flex items-center gap-10">
                    <Link to="/" className="text-xs font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 transition-colors border-b-2 border-transparent hover:border-slate-900 py-1">
                      Directory
                    </Link>
                    <Link to="/my-bookings" className="flex items-center gap-3 bg-slate-900 px-6 py-3 rounded-none text-white hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Reservations</span>
                    </Link>
                  </div>
                </div>
              </div>
            </nav>

            <main className="flex-grow pb-20">
              <Routes>
                <Route path="/" element={<ExpertListing />} />
                <Route path="/expert/:id" element={<ExpertDetail />} />
                <Route path="/expert/:id/book/:slotId" element={<BookingScreen />} />
                <Route path="/my-bookings" element={<MyBookings />} />
              </Routes>
            </main>

            <footer className="bg-slate-900 border-t border-slate-800 py-16 text-white">
              <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <Layers className="text-amber-500 w-6 h-6" />
                      <span className="text-2xl font-serif font-black tracking-tight leading-none">EXPERTBOOK</span>
                   </div>
                   <p className="text-slate-400 text-sm max-w-sm">
                     The world's most prestigious platform for technical mentorship and strategic consulting.
                   </p>
                </div>
                <div className="text-left md:text-right text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] space-y-2">
                  <p>&copy; 2026 EXPERTBOOK INTERNATIONAL</p>
                  <p>All Rights Reserved. Terms & Privacy apply.</p>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </SocketProvider>
    </QueryClientProvider>
  );
}

export default App;
