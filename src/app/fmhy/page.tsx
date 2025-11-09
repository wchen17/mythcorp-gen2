// src/app/fmhy/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';

interface ContentItem {
  id: number;
  title: string;
  category: string;
  url: string;
  description: string;
  dateAdded: string;
}

export default function FMHYPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sample backup content data - this would come from a database/API in production
  const contentItems: ContentItem[] = [
    {
      id: 1,
      title: 'Research Archive 2024',
      category: 'Research',
      url: '#',
      description: 'Comprehensive research documentation and findings',
      dateAdded: '2024-11-01',
    },
    {
      id: 2,
      title: 'Project Documentation',
      category: 'Documentation',
      url: '#',
      description: 'Technical documentation for internal projects',
      dateAdded: '2024-10-28',
    },
    {
      id: 3,
      title: 'Data Visualization Tools',
      category: 'Tools',
      url: '#',
      description: 'Collection of data visualization resources',
      dateAdded: '2024-10-25',
    },
    {
      id: 4,
      title: 'AI Training Datasets',
      category: 'Research',
      url: '#',
      description: 'Curated datasets for machine learning projects',
      dateAdded: '2024-10-20',
    },
    {
      id: 5,
      title: 'Code Libraries Archive',
      category: 'Development',
      url: '#',
      description: 'Essential code libraries and frameworks',
      dateAdded: '2024-10-15',
    },
  ];

  const categories = ['All', 'Research', 'Documentation', 'Tools', 'Development'];

  const filteredItems = contentItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left: Menu */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-white"></div>
              <div className="w-full h-0.5 bg-white"></div>
              <div className="w-full h-0.5 bg-white"></div>
            </div>
            <span className="text-sm font-medium">MENU</span>
          </div>

          {/* Center: Logo */}
          <div className="flex flex-col items-center">
            <Link href="/" className="text-2xl font-bold font-serif tracking-wide">
              MYTHCORP
            </Link>
            <span className="text-xs font-sans tracking-wider opacity-70">
              FOUNDED IN CHICAGO
            </span>
          </div>

          {/* Right: Navigation */}
          <div className="flex space-x-8">
            <Link href="/about" className="text-sm font-medium hover:underline">
              ABOUT US
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:underline">
              CONTACT
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 px-6 max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">BACKUP CONTENT ARCHIVE</h1>
          <p className="text-lg opacity-70">Access backed up resources and documentation</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-cyan-400 text-white placeholder-white/50"
          />
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-cyan-500 text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Content List */}
        <div className="space-y-4 pb-12">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 hover:border-cyan-400/50 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                    <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-sm text-white/50">{item.dateAdded}</span>
                </div>
                <p className="text-white/70 mb-4">{item.description}</p>
                <a
                  href={item.url}
                  className="inline-block px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-medium rounded-lg transition-all"
                >
                  Access Content →
                </a>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-white/50">
              <p>No content found matching your search.</p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="border-t border-white/10 pt-8 pb-12">
          <p className="text-sm text-white/50 text-center">
            This archive is regularly updated with backed up content and resources. 
            Check back frequently for new additions.
          </p>
        </div>
      </main>
    </div>
  );
}
