"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
    User, Mail, Camera, 
    Save, Loader2, CheckCircle2, 
    AlertCircle, ShieldCheck,
    ArrowLeft
} from "lucide-react";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const ASSET_URL = API_BASE_URL.replace(/\/api$/, '');

export default function ProfilePage() {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        profileImage: ""
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/auth/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const json = await res.json();
            if (json.success) {
                setProfile(json.data);
                if (json.data.profileImage) {
                    setPreviewUrl(`${ASSET_URL}${json.data.profileImage}`);
                }
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('name', profile.name);
            if (selectedFile) {
                formData.append('profileImage', selectedFile);
            }

            const res = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const json = await res.json();
            if (json.success) {
                setMessage({ type: 'success', text: "Profile updated successfully!" });
                setProfile(json.data);
                // Trigger event for navbar to update
                window.dispatchEvent(new Event('profileUpdated'));
            } else {
                setMessage({ type: 'error', text: json.message || "Failed to update profile" });
            }
        } catch (error) {
            setMessage({ type: 'error', text: "An error occurred during update" });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-[#00b4d8]" />
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto custom-scrollbar bg-slate-50/30 p-3 sm:p-6 md:p-8 font-sans text-left">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link 
                            href="/admin" 
                            className="flex items-center gap-2 text-slate-400 hover:text-[#00b4d8] transition-colors text-sm font-bold uppercase tracking-wider mb-2"
                        >
                            <ArrowLeft size={16} />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-light text-[#00b4d8] tracking-tight">Admin Profile</h1>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest flex items-center gap-2">
                             <ShieldCheck size={14} className="text-[#3ed4b2]" />
                             Super User Management
                        </p>
                    </div>
                </div>

                {message && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 border animate-in slide-in-from-top-2 duration-300 ${
                        message.type === 'success' 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                        : 'bg-rose-50 border-rose-100 text-rose-700'
                    }`}>
                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span className="text-sm font-bold">{message.text}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Portrait Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden transform transition-all duration-300">
                            <div className="h-32 bg-gradient-to-br from-[#00b4d8] to-[#0077b6] relative">
                                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-slate-100">
                                            {previewUrl ? (
                                                <img 
                                                    src={previewUrl} 
                                                    alt="Profile" 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                    <User size={40} />
                                                </div>
                                            )}
                                        </div>
                                        <label 
                                            htmlFor="profile-upload" 
                                            className="absolute bottom-1 -right-1 p-2 bg-white rounded-lg shadow-md border border-slate-100 text-[#00b4d8] cursor-pointer hover:bg-[#00b4d8] hover:text-white transition-all transform hover:scale-110 active:scale-95"
                                        >
                                            <Camera size={14} strokeWidth={2.5} />
                                            <input 
                                                type="file" 
                                                id="profile-upload" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-16 pb-6 px-4 sm:px-6 text-center">
                                <h3 className="text-xl font-bold text-slate-800">{profile.name || "System Admin"}</h3>
                                <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{profile.email}</p>
                                
                                <div className="mt-6 flex justify-center gap-3">
                                    <div className="flex-1 sm:flex-none px-3 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">Status</p>
                                        <p className="text-[11px] font-black text-emerald-500">Active</p>
                                    </div>
                                    <div className="flex-1 sm:flex-none px-3 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">Role</p>
                                        <p className="text-[11px] font-black text-blue-500">Super</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-4 sm:p-6 md:p-8">
                            <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-4 mb-6 sm:mb-8 flex items-center gap-2">
                                <User size={16} className="text-[#00b4d8]" />
                                Profile Settings
                            </h3>

                            <form onSubmit={handleUpdate} className="space-y-6 sm:space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <Mail size={12} />
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <input 
                                                type="email" 
                                                value={profile.email} 
                                                disabled 
                                                className="w-full h-12 px-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-400 font-bold text-sm cursor-not-allowed"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                                                <ShieldCheck size={14} />
                                            </div>
                                        </div>
                                        <p className="text-[9px] text-slate-400 font-medium ml-1">Email cannot be changed (Authenticated via Auth)</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <User size={12} />
                                            Admin Name
                                        </label>
                                        <input 
                                            type="text" 
                                            value={profile.name} 
                                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                                            required
                                            placeholder="Enter your name"
                                            className="w-full h-12 px-4 rounded-2xl border border-slate-200 text-slate-800 font-bold text-sm focus:border-[#00b4d8] focus:ring-4 focus:ring-[#00b4d8]/10 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <p className="text-[10px] text-slate-400 font-medium text-center sm:text-left max-w-full sm:max-w-[60%]">
                                        Make sure your name and profile photo are professional as they will be displayed on the dashboard.
                                    </p>
                                    <button 
                                        type="submit" 
                                        disabled={isSaving}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-[#00b4d8] text-white rounded-2xl font-bold text-sm shadow-lg shadow-[#00b4d8]/20 hover:bg-[#0077b6] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        {isSaving ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <Save size={18} className="group-hover:scale-110 transition-transform" />
                                        )}
                                        {isSaving ? "Saving..." : "Update Profile"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Password Section */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-4 sm:p-6 md:p-8">
                            <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-4 mb-6 sm:mb-8 flex items-center gap-2">
                                <ShieldCheck size={16} className="text-[#f59e0b]" />
                                Security Settings
                            </h3>

                            <form 
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const oldPassword = formData.get('oldPassword') as string;
                                    const newPassword = formData.get('newPassword') as string;
                                    const confirmPassword = formData.get('confirmPassword') as string;

                                    if (newPassword !== confirmPassword) {
                                        setMessage({ type: 'error', text: "New passwords do not match" });
                                        return;
                                    }

                                    setIsSaving(true);
                                    try {
                                        const token = localStorage.getItem('token');
                                        const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
                                            method: 'PATCH',
                                            headers: {
                                                'Authorization': `Bearer ${token}`,
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({ oldPassword, newPassword })
                                        });

                                        const json = await res.json();
                                        if (json.success) {
                                            setMessage({ type: 'success', text: "Password changed successfully!" });
                                            (e.target as HTMLFormElement).reset();
                                        } else {
                                            setMessage({ type: 'error', text: json.message || "Failed to change password" });
                                        }
                                    } catch (error) {
                                        setMessage({ type: 'error', text: "An error occurred" });
                                    } finally {
                                        setIsSaving(false);
                                    }
                                }} 
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                                        <input 
                                            name="oldPassword"
                                            type="password" 
                                            required
                                            className="w-full h-12 px-4 rounded-2xl border border-slate-200 text-slate-800 font-bold text-sm focus:border-[#f59e0b] focus:ring-4 focus:ring-[#f59e0b]/10 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                                        <input 
                                            name="newPassword"
                                            type="password" 
                                            required
                                            className="w-full h-12 px-4 rounded-2xl border border-slate-200 text-slate-800 font-bold text-sm focus:border-[#f59e0b] focus:ring-4 focus:ring-[#f59e0b]/10 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                                        <input 
                                            name="confirmPassword"
                                            type="password" 
                                            required
                                            className="w-full h-12 px-4 rounded-2xl border border-slate-200 text-slate-800 font-bold text-sm focus:border-[#f59e0b] focus:ring-4 focus:ring-[#f59e0b]/10 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-50 flex justify-end">
                                    <button 
                                        type="submit" 
                                        disabled={isSaving}
                                        className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50"
                                    >
                                        Change Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
