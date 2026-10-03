import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, Search, Heart, MessageSquare, Bell, Building, Calendar, PlusCircle } from 'lucide-react';

const MobileNavbar = () => {
  const { isAuthenticated, isOwner } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] px-3 py-2">
      <div className="flex items-center justify-around">
        {isOwner ? (
          <>
            <Link
              to="/owner"
              className={`flex flex-col items-center gap-1 text-xs font-semibold ${
                isActive('/owner') ? 'text-[#198754]' : 'text-gray-500'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/owner/properties"
              className={`flex flex-col items-center gap-1 text-xs font-semibold ${
                isActive('/owner/properties') ? 'text-[#198754]' : 'text-gray-500'
              }`}
            >
              <Building className="w-5 h-5" />
              <span>Stays</span>
            </Link>

            <Link
              to="/owner/properties/add"
              className="flex flex-col items-center gap-1 text-xs font-semibold text-[#198754]"
            >
              <PlusCircle className="w-6 h-6" />
              <span>Add</span>
            </Link>

            <Link
              to="/owner/bookings"
              className={`flex flex-col items-center gap-1 text-xs font-semibold ${
                isActive('/owner/bookings') ? 'text-[#198754]' : 'text-gray-500'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Bookings</span>
            </Link>

            <Link
              to="/notifications"
              className={`flex flex-col items-center gap-1 text-xs font-semibold ${
                isActive('/notifications') ? 'text-[#198754]' : 'text-gray-500'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span>Alerts</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/home"
              className={`flex flex-col items-center gap-1 text-xs font-semibold ${
                isActive('/home') ? 'text-[#198754]' : 'text-gray-500'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>

            <Link
              to="/explore"
              className={`flex flex-col items-center gap-1 text-xs font-semibold ${
                isActive('/explore') ? 'text-[#198754]' : 'text-gray-500'
              }`}
            >
              <Search className="w-5 h-5" />
              <span>Explore</span>
            </Link>

            <Link
              to="/shortlist"
              className={`flex flex-col items-center gap-1 text-xs font-semibold ${
                isActive('/shortlist') ? 'text-[#198754]' : 'text-gray-500'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span>Saved</span>
            </Link>

            <Link
              to="/messages"
              className={`flex flex-col items-center gap-1 text-xs font-semibold ${
                isActive('/messages') ? 'text-[#198754]' : 'text-gray-500'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Chat</span>
            </Link>

            <Link
              to="/notifications"
              className={`flex flex-col items-center gap-1 text-xs font-semibold ${
                isActive('/notifications') ? 'text-[#198754]' : 'text-gray-500'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span>Alerts</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileNavbar;
