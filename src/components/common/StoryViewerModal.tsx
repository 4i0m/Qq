/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Send, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from './UserAvatar';

export const StoryViewerModal: React.FC = () => {
  const { activeStory, setActiveStory, stories, openUserProfile } = useApp();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!activeStory) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Advance to next story or close
          const currentIndex = stories.findIndex(s => s.id === activeStory.id);
          if (currentIndex < stories.length - 1) {
            setActiveStory(stories[currentIndex + 1]);
            return 0;
          } else {
            setActiveStory(null);
            return 0;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStory, stories, setActiveStory]);

  if (!activeStory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm h-full max-h-[820px] rounded-3xl overflow-hidden bg-black flex flex-col justify-between p-4 shadow-2xl">
        {/* Story Background / Image */}
        {activeStory.imageUrl ? (
          <img
            src={activeStory.imageUrl}
            alt="Story content"
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#1C160C] via-[#0E0E0E] to-black flex items-center justify-center p-6 text-center text-lg font-bold text-white">
            {activeStory.textContent || activeStory.authorName}
          </div>
        )}

        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 pointer-events-none" />

        {/* Top: Progress Bars & Author Row */}
        <div className="relative z-10 space-y-3">
          {/* Progress Bar */}
          <div className="flex gap-1 h-1 w-full bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div
              onClick={() => {
                setActiveStory(null);
                openUserProfile(activeStory.authorId);
              }}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <UserAvatar
                userId={activeStory.authorId}
                avatarUrl={activeStory.authorAvatar}
                name={activeStory.authorName}
                size="sm"
                clickable={false}
              />
              <div>
                <span className="font-bold text-white text-xs group-hover:underline">
                  {activeStory.authorName}
                </span>
                <span className="block text-[10px] text-white/70">{activeStory.timestamp}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveStory(null)}
              className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Bottom Reply Bar */}
        <div className="relative z-10 flex items-center gap-2">
          <input
            type="text"
            placeholder="الرد على القصة..."
            className="flex-1 bg-black/60 border border-white/20 rounded-full px-4 py-2.5 text-xs text-white placeholder-white/50 backdrop-blur-md focus:outline-none focus:border-[#C5A46D]"
          />
          <button className="w-10 h-10 rounded-full bg-black/60 text-white/80 border border-white/20 flex items-center justify-center hover:text-[#FF3040]">
            <Heart size={18} />
          </button>
          <button className="w-10 h-10 rounded-full bg-[#C5A46D] text-black flex items-center justify-center hover:brightness-110">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
