"use client";

import React from "react";
import { 
    X, User, Phone, Mail, 
    MapPin, GraduationCap, 
    Calendar, CreditCard,
    FileText, UserCheck, 
    CheckCircle2, Clock, 
    Hash, Eye, Download, Edit3,
    BookOpen, Briefcase, Award
} from 'lucide-react';
import { AdmissionDetailsModalProps } from "../types";
import { capitalizeWords } from "@/shared/utils/string-utils";

export function AdmissionDetailsModal({
  isOpen,
  onClose,
  data
}: AdmissionDetailsModalProps) {
  if (!isOpen || !data) return null;

  const SectionHeader = ({ icon: Icon, title, color }: { icon: any, title: string, color: string }) => (
    <h3 className={`text-[12px] md:text-[13px] font-bold tracking-widest uppercase border-b border-slate-100 pb-2 mb-4 flex items-center gap-2 ${color}`}>
        <Icon size={16} /> {title}
    </h3>
  );

  const DataField = ({ label, value, icon: Icon }: { label: string, value: string | number | undefined, icon?: any }) => (
    <div className="flex flex-col gap-1">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1.5">
            {Icon && <Icon size={12} className="text-[#00b4d8]" />}
            {label}
        </label>
        <span className="text-[14px] font-semibold text-slate-700 break-words">
            {value || "Not provided"}
        </span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-hidden">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 shrink-0 bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 text-[#00b4d8]">
                        <BookOpen size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 leading-none mb-1">
                            Application Details
                        </h2>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                            Ref #: <span className="text-[#00b4d8]">{data.applicationNumber}</span>
                        </p>
                    </div>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-white shadow-sm border border-transparent hover:border-slate-100">
                    <X size={20} />
                </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex-1 text-left">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Left Column: Personal & Identification */}
                    <div className="lg:col-span-2 space-y-10">
                        
                        {/* 1. Basic Information */}
                        <div>
                            <SectionHeader icon={User} title="Student Profile" color="text-[#00b4d8]" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <DataField label="Applicant Full Name" value={capitalizeWords(data.applicantName)} />
                                <DataField label="Email Address" value={data.email} />
                                <DataField label="Mobile Number" value={data.mobileNumber} />
                                <DataField label="Date of Birth" value={data.dateOfBirth} />
                                <DataField label="Gender" value={data.gender} />
                                <DataField label="Category" value={data.category} />
                                <DataField label="Aadhar Number" value={data.aadharNumber} />
                            </div>
                        </div>

                        {/* 2. Parental Information */}
                        <div>
                            <SectionHeader icon={UserCheck} title="Parental Details" color="text-[#3ed4b2]" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <DataField label="Father's Name" value={data.fatherName} />
                                <DataField label="Mother's Name" value={data.motherName} />
                            </div>
                        </div>

                        {/* 3. Address details */}
                        <div>
                            <SectionHeader icon={MapPin} title="Address Details" color="text-rose-400" />
                            <div className="space-y-6">
                                <DataField label="Communication Address" value={data.communicationAddress} />
                                <DataField label="Permanent Address" value={data.permanentAddress} />
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Academic & Administrative */}
                    <div className="space-y-10">
                        
                        {/* 4. Applied Preference */}
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6">
                            <SectionHeader icon={GraduationCap} title="Academic Preference" color="text-blue-500" />
                            <div className="flex flex-col gap-6">
                                <DataField label="Course Type" value={data.courseType} />
                                <DataField label="Course Name" value={data.courseApplied} />
                                <DataField label="Branch Choice" value={data.branchApplied} />
                                <DataField label="Exam Center" value={data.examCenter} />
                            </div>
                        </div>

                        {/* 5. Academic Performance */}
                        <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-6">
                            <SectionHeader icon={Award} title="Previous Education" color="text-amber-500" />
                            <div className="grid grid-cols-2 gap-4">
                                <DataField label="10th % Marks" value={data.tenthPercentage} />
                                <DataField label="12th % Marks" value={data.twelfthPercentage || "N/A"} />
                            </div>
                        </div>

                        {/* 6. Document & Payment Status */}
                        <div className="p-6 bg-emerald-50/30 rounded-2xl border border-emerald-100 space-y-6">
                            <SectionHeader icon={CreditCard} title="Administrative" color="text-emerald-500" />
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <DataField label="Payment Status" value={data.paymentStatus} />
                                    <div className={`p-1.5 rounded-full ${data.paymentStatus === 'PAID' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white'}`}>
                                        {data.paymentStatus === 'PAID' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                                    </div>
                                </div>
                                <DataField label="Submission Date" value={data.submissionDate} />
                                <DataField label="Application ID" value={data.idDocumentType} />
                            </div>
                        </div>

                    </div>

                    {/* Full Width Section: Document Links */}
                    <div className="lg:col-span-3">
                         <SectionHeader icon={FileText} title="Identification & Verification" color="text-indigo-500" />
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { name: "Passport Photo", url: data.photoUrl, icon: User },
                                { name: "Signature", url: data.signatureUrl, icon: Edit3 },
                                { name: "ID Document", url: data.idDocumentUrl, icon: Hash }
                            ].map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-[#00b4d8] transition-all group shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-[#00b4d8] group-hover:bg-blue-50 transition-colors">
                                            <doc.icon size={18} />
                                        </div>
                                        <span className="text-[13px] font-bold text-slate-700">{doc.name}</span>
                                    </div>
                                    <a 
                                        href={doc.url} target="_blank" rel="noreferrer"
                                        className="p-2 text-slate-300 hover:text-[#00b4d8] transition-colors"
                                    >
                                        <Eye size={18} />
                                    </a>
                                </div>
                            ))}
                         </div>
                    </div>

                </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0 rounded-b-xl">
                <button 
                    type="button" 
                    onClick={onClose} 
                    className="px-8 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-white hover:text-[#00b4d8] hover:border-[#00b4d8] transition-all"
                >
                    Close Verification
                </button>
            </div>

        </div>
    </div>
  );
}
