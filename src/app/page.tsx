'use client';

import { useState, useEffect } from 'react';

import IntroVideoPlayer from '@/components/IntroVideoPlayer';
import { SecondVideoPlayer } from '@/components/SecondVideoPlayer';
import AvatarGuide from '@/components/AvatarGuide';
import RealtimeVoice from '@/components/RealtimeVoice';
import { AnimatePresence } from 'framer-motion';
import {
  Home,
  User,
  FileText,
  Wrench,
  Camera,
  Film,
  Star,
  Award,
  Lightbulb,
  Video,
  Edit,
  Users,
  Handshake,
  Calendar,
  Sparkles,
  Eye,
  Languages,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Twitter,
  Save,
  Briefcase,
  Mail,
  Phone,
  Building,
  MapPin,
} from 'lucide-react';

export default function Page() {
  const [state, setState] = useState('intro');
  const [cardData] = useState({
    ownerName: 'Michaelangelo Casanova',
    title: 'CEO & Founder',
    company: 'vBiz Me',
    email: 'mcasanova@vbizme.com',
    phone: '(860) 770-9893',
    website: 'www.vbizme.com',
    address: 'New Britain, CT',
  });
  useEffect(() => {
    if (state === 'avatar') {
      setTimeout(() => {
        setState('chat');
      }, 2000);
    }
  }, [state]);

  return (
    <div className="relative w-full min-h-[100dvh] bg-[#f4f4f4] overflow-x-hidden font-sans text-slate-900 flex flex-col items-center p-2 sm:p-4 md:p-6">
      {/* Top Navigation Icons */}
      <div className="flex gap-3 md:gap-4 mb-2 md:mb-4 overflow-x-auto max-w-5xl w-full px-2 justify-start md:justify-center [&::-webkit-scrollbar]:hidden">
        {[
          Home,
          User,
          FileText,
          Wrench,
          Camera,
          Film,
          Star,
          Award,
          Lightbulb,
          Video,
          Edit,
          Users,
          Handshake,
          Calendar,
          Sparkles,
        ].map((Icon, i) => (
          <button
            key={i}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-slate-500 shrink-0"
          >
            <Icon className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        ))}
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-5xl flex-1 bg-black rounded-xl overflow-hidden shadow-2xl text-white flex flex-col min-h-[650px] md:min-h-0">
        {/* Background Image (Sparkles on right) */}
        <div
          className="absolute inset-0 bg-cover bg-right md:bg-center opacity-60"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519750783826-e2420f4d687f?q=80&w=2000&auto=format&fit=crop')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black via-black/90 to-black/60 md:to-transparent"></div>

        {/* Content Wrapper */}
        <div className="relative z-10 p-6 md:p-10 h-full flex flex-col overflow-y-auto md:overflow-hidden">
          {/* Top Right Floating Icons */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6 flex flex-col gap-3 md:gap-4">
            <div className="relative">
              <button className="w-8 h-8 md:w-10 md:h-10 bg-yellow-400 rounded-full flex items-center justify-center text-blue-700 hover:bg-yellow-300 transition-colors shadow-lg">
                <Eye className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                8.5K
              </span>
            </div>
            <button className="w-8 h-8 md:w-10 md:h-10 bg-yellow-400 rounded-full flex items-center justify-center text-blue-700 hover:bg-yellow-300 transition-colors shadow-lg">
              <Languages className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button className="w-8 h-8 md:w-10 md:h-10 bg-yellow-400 rounded-full flex items-center justify-center text-blue-700 hover:bg-yellow-300 transition-colors shadow-lg">
              <Globe className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          {/* Center Content */}
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center md:justify-start gap-6 md:gap-16 md:pl-12 mt-12 md:mt-0">
            {/* Profile Picture */}
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500&auto=format&fit=crop"
              alt="Michaelangelo Casanova"
              className="w-40 h-40 md:w-64 md:h-64 object-cover border-2 md:border-4 border-white shadow-xl"
            />

            {/* Name & Title */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-1 md:mb-4 tracking-tight drop-shadow-md">
                Michaelangelo
              </h1>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 md:mb-6 tracking-tight drop-shadow-md">
                Casanova
              </h1>
              <p className="text-lg md:text-xl font-medium mb-6 md:mb-8 tracking-wide text-gray-200">
                CEO & Founder
              </p>

              {/* Social Icons */}
              <div className="flex gap-2 md:gap-3">
                <button className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center text-yellow-400 hover:bg-blue-700 transition-colors shadow-md">
                  <Twitter className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button className="w-8 h-8 md:w-10 md:h-10 bg-yellow-400 rounded-full flex items-center justify-center text-blue-700 hover:bg-yellow-300 transition-colors shadow-md">
                  <Facebook className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center text-yellow-400 hover:bg-blue-700 transition-colors shadow-md">
                  <Instagram className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button className="w-8 h-8 md:w-10 md:h-10 bg-yellow-400 rounded-full flex items-center justify-center text-blue-700 hover:bg-yellow-300 transition-colors shadow-md">
                  <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center text-yellow-400 hover:bg-blue-700 transition-colors shadow-md">
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Content */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end w-full mt-8 md:mt-auto gap-8 md:gap-0 pb-24 md:pb-0">
            {/* Left Buttons */}
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <div className="flex gap-2 w-full">
                <button className="flex-1 md:flex-none justify-center bg-yellow-400 text-blue-800 px-4 md:px-6 py-3 md:py-2 font-bold text-xs md:text-sm flex items-center gap-2 hover:bg-yellow-300 transition-colors shadow-md">
                  <Save size={16} /> SAVE MY INFO
                </button>
                <button className="flex-1 md:flex-none justify-center bg-white text-black px-4 md:px-6 py-3 md:py-2 font-bold text-xs md:text-sm hover:bg-gray-100 transition-colors shadow-md">
                  MY VCARD
                </button>
              </div>
              <button className="bg-yellow-400 text-black px-4 md:px-6 py-3 md:py-2 font-bold text-xs md:text-sm w-full hover:bg-yellow-300 transition-colors shadow-md">
                GET YOUR VCARD NOW
              </button>
            </div>

            {/* Right Contact Info */}
            <div className="grid grid-cols-[auto_1fr] gap-x-2 md:gap-x-3 gap-y-1.5 md:gap-y-2 text-xs md:text-sm font-medium w-full md:w-auto bg-black/40 md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none backdrop-blur-sm md:backdrop-blur-none">
              <div className="flex items-center gap-2 text-blue-400 md:text-blue-500 justify-end">
                <Briefcase size={14} className="md:w-4 md:h-4" /> Profession:
              </div>
              <div className="text-yellow-400"></div>

              <div className="flex items-center gap-2 text-blue-400 md:text-blue-500 justify-end">
                <Mail size={14} className="md:w-4 md:h-4" /> Email:
              </div>
              <div className="text-yellow-400 break-all">{cardData.email}</div>

              <div className="flex items-center gap-2 text-blue-400 md:text-blue-500 justify-end">
                <Phone size={14} className="md:w-4 md:h-4" /> Phone:
              </div>
              <div className="text-yellow-400">{cardData.phone}</div>

              <div className="flex items-center gap-2 text-blue-400 md:text-blue-500 justify-end">
                <Building size={14} className="md:w-4 md:h-4" /> Company:
              </div>
              <div className="text-blue-400 md:text-blue-500">
                {cardData.company}
              </div>

              <div className="flex items-center gap-2 text-blue-400 md:text-blue-500 justify-end">
                <Globe size={14} className="md:w-4 md:h-4" /> Website:
              </div>
              <div className="text-blue-400 md:text-blue-500">
                {cardData.website}
              </div>

              <div className="flex items-center gap-2 text-blue-400 md:text-blue-500 justify-end">
                <MapPin size={14} className="md:w-4 md:h-4" /> Address:
              </div>
              <div className="text-yellow-400">{cardData.address}</div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {state === 'intro' && (
          <IntroVideoPlayer onComplete={() => setState('second')} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {state === 'second' && (
          <SecondVideoPlayer onComplete={() => setState('avatar')} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {(state === 'avatar' || state === 'chat') && (
          <AvatarGuide state={state === 'avatar' ? 'idle' : 'chat'} />
        )}
      </AnimatePresence>
    </div>
  );
}
