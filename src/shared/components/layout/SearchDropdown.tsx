"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
    Search, 
    User, 
    MapPin, 
    School, 
    Newspaper, 
    FileText, 
    Loader2, 
    ArrowRight,
    SearchX
} from "lucide-react";
import { http } from "@/shared/api/api-client";

interface SearchResult {
    id: string | number;
    type: 'ADMISSION' | 'EXAM_CENTER' | 'COLLEGE' | 'NEWS' | 'LETTER';
    label: string;
    subLabel: string;
    link: string;
}

export function SearchDropdown() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Debounce Search
    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsLoading(true);
            try {
                const response = await http.get<{ success: boolean; data: SearchResult[] }>(`/search?q=${query}`);
                if (response.success) {
                    setResults(response.data);
                    setIsOpen(true);
                }
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setIsLoading(false);
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    // Handle Click Outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (result: SearchResult) => {
        router.push(result.link);
        setIsOpen(false);
        setQuery("");
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'ADMISSION': return <User className="text-blue-500" size={18} />;
            case 'EXAM_CENTER': return <MapPin className="text-emerald-500" size={18} />;
            case 'COLLEGE': return <School className="text-violet-500" size={18} />;
            case 'NEWS': return <Newspaper className="text-orange-500" size={18} />;
            case 'LETTER': return <FileText className="text-rose-500" size={18} />;
            default: return <Search size={18} />;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === "Enter" && activeIndex >= 0) {
            handleSelect(results[activeIndex]);
        } else if (e.key === "Escape") {
            setIsOpen(false);
        }
    };

    return (
        <div className="relative w-full max-w-md" ref={dropdownRef}>
            <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 text-primary animate-spin" />
                    ) : (
                        <Search className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    )}
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="block w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-[13px] font-medium placeholder-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
                    placeholder="Search anything (students, centers, news)..."
                />
            </div>

            {/* Results Dropdown */}
            {isOpen && (results.length > 0 || (query.length >= 2 && !isLoading)) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-2xl shadow-slate-200 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-[400px] overflow-y-auto p-1.5 custom-scrollbar">
                        {results.length > 0 ? (
                            <>
                                <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">
                                    Search Results ({results.length})
                                </div>
                                {results.map((result, index) => (
                                    <button
                                        key={`${result.type}-${result.id}`}
                                        onClick={() => handleSelect(result)}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
                                            activeIndex === index ? "bg-slate-50" : "hover:bg-slate-50/50"
                                        }`}
                                    >
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-100 shadow-sm">
                                            {getIcon(result.type)}
                                        </div>
                                        <div className="flex flex-1 flex-col truncate">
                                            <span className="text-[13px] font-bold text-slate-800 truncate">
                                                {result.label}
                                            </span>
                                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                                                {result.type.replace('_', ' ')} • {result.subLabel}
                                            </span>
                                        </div>
                                        <ArrowRight size={14} className={`text-slate-200 transition-transform ${activeIndex === index ? "translate-x-0.5 text-primary" : ""}`} />
                                    </button>
                                ))}
                            </>
                        ) : (
                            <div className="p-8 text-center">
                                <SearchX className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                                <p className="text-sm font-bold text-slate-800 mb-1">No results found</p>
                                <p className="text-xs text-slate-400">Try searching for something else</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
