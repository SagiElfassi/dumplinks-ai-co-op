
import React from 'react';
import { Auth } from './Auth';
import { SparklesIcon } from './icons/SparklesIcon';
import { ShoppingIcon } from './icons/MiniIcons';
import { LogoIcon } from './icons/LogoIcon';
import { GridIcon } from './icons/GridIcon';
import { TagIcon } from './icons/TagIcon';
import { ListIcon } from './icons/ListIcon';
import type { User } from '../types';

interface LandingPageProps {
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
}

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-lg h-full hover:bg-white/10 transition-colors">
        <div className="bg-primary/10 text-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{children}</p>
    </div>
);


export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onRegister }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans overflow-x-hidden">
        {/* Abstract background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/20 rounded-full filter blur-3xl animate-pulse"></div>
        </div>

        <main className="relative z-10 container mx-auto px-4 md:px-8">
            <header className="py-6">
                 <div className="flex items-center gap-3">
                    <LogoIcon className="w-8 h-8" />
                    <h1 className="text-xl md:text-2xl font-bold text-gray-200 tracking-tight">
                    DumpLinks
                    </h1>
                </div>
            </header>

            {/* Hero Section */}
            <section className="min-h-[calc(100vh-88px)] flex items-center justify-center py-16">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                            Stop Losing Links.
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Rediscover Your Digital World.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl mx-auto md:mx-0">
                            DumpLinks uses AI to instantly save, summarize, and organize any link into a beautiful library. Effortlessly find what you've saved, whenever you need it.
                        </p>
                    </div>
                    
                    <div className="max-w-md w-full mx-auto">
                        <div className="bg-gray-800/60 p-8 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-md">
                           <Auth onLogin={onLogin} onRegister={onRegister} />
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Findability Section */}
            <section className="py-20">
                 <div className="text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Rediscover, Don't Re-search</h2>
                     <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Finding saved links should be intuitive, not a chore. We make it easy to find exactly what you're looking for.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard icon={<SearchIcon className="w-6 h-6" />} title="Search Like You Talk">
                        Ask for 'that chicken recipe from last week' or 'tech reviews under $100'. Our AI understands your natural language and finds it instantly.
                    </FeatureCard>
                    <FeatureCard icon={<TagIcon className="w-6 h-6" />} title="Filter with a Click">
                        AI-generated tags and categories mean you can instantly narrow down your library. Find all your 'TO_BUY' items or 'baking' recipes in a second.
                    </FeatureCard>
                     <FeatureCard icon={<GridIcon className="w-6 h-6" />} title="Browse, Don't Dig">
                        Your links are transformed into a beautiful, image-rich grid. Find what you're looking for by sight, not by reading endless blue links.
                    </FeatureCard>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-bold tracking-tight">The Magic Behind the Curtain</h2>
                     <p className="text-gray-400 mt-2 max-w-2xl mx-auto">From a messy link to a structured memory in seconds. Here's how our AI makes it happen.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard icon={<SparklesIcon className="w-6 h-6" />} title="Instant AI Analysis">
                        Paste any link and watch our AI instantly generate a title, a concise summary, and find a relevant image. No more manual data entry.
                    </FeatureCard>
                    <FeatureCard icon={<ShoppingIcon className="w-6 h-6" />} title="Smart Shopping">
                        From clothes and gadgets to baby gear and wishlists, DumpLinks automatically categorizes your shopping items and extracts key details like price and ratings.
                    </FeatureCard>
                    <FeatureCard icon={<ListIcon className="w-6 h-6" />} title="Key Details, Extracted">
                        For shopping, we grab the price and reviews. For recipes, the ingredients. All the important info, right on the card, saving you a click.
                    </FeatureCard>
                </div>
            </section>
        </main>
    </div>
  );
};