// "use client";

// import React, { useState } from "react";
// import { 
//     Search, RotateCw, 
//     Trash2, Calendar, FileCheck, 
//     Plus, X, Upload, Hash, Mail,
//     Edit3,
//     CheckCircle
// } from 'lucide-react';
// import { getFileUrl } from "@/shared/api/api-client";
// import { capitalizeWords } from "@/shared/utils/string-utils";
// import { GovernmentLetter, GovLetterTableProps, GovLetterCategory } from "../types";

// const CATEGORIES: GovLetterCategory[] = ['Admission', 'Scholarship', 'General', 'Examination', 'Affiliation'];

// export function GovLettersTable({
//   data,
//   onDelete,
//   onRefresh,
//   onStatusUpdate,
//   onSave
// }: GovLetterTableProps) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingLetter, setEditingLetter] = useState<GovernmentLetter | null>(null);
//   const [isSaving, setIsSaving] = useState(false);

//   // Form States
//   const [formData, setFormData] = useState({
//     title: "",
//     refNumber: "",
//     date: new Date().toISOString().split('T')[0],
//     subject: "",
//     description: "",
//     category: "General" as GovLetterCategory
//   });
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

//   const handleOpenModal = (letter?: GovernmentLetter) => {
//     if (letter) {
//       setEditingLetter(letter);
//       setFormData({
//         title: letter.title,
//         refNumber: letter.refNumber,
//         date: letter.date,
//         subject: letter.subject,
//         description: letter.description,
//         category: letter.category
//       });
//     } else {
//       setEditingLetter(null);
//       setFormData({
//         title: "",
//         refNumber: "",
//         date: new Date().toISOString().split('T')[0],
//         subject: "",
//         description: "",
//         category: "General"
//       });
//     }
//     setSelectedFile(null);
//     setIsModalOpen(true);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSaving(true);

//     const dataToSend = new FormData();
//     dataToSend.append("title", formData.title);
//     dataToSend.append("refNumber", formData.refNumber);
//     dataToSend.append("date", formData.date);
//     dataToSend.append("subject", formData.subject);
//     dataToSend.append("description", formData.description);
//     dataToSend.append("category", formData.category);

//     if (selectedFile) {
//       dataToSend.append("images", selectedFile);
//     }

//     const success = await onSave?.(editingLetter?.id || null, dataToSend);
//     if (success) {
//       setIsModalOpen(false);
//     }
//     setIsSaving(false);
//   };

//   const filteredData = data.filter(item => 
//     item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.refNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.subject.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="h-full flex flex-col gap-4 md:gap-6 w-full font-sans max-w-full">
      
//       {/* 🔝 HEADER SECTION */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2 shrink-0">
//         <div className="w-full md:w-auto">
//           <h1 className="text-2xl md:text-3xl font-light text-[#00b4d8] mb-1 tracking-wide">
//             Government Letters
//           </h1>
//           <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-400 tracking-widest uppercase">
//             <span>APP</span>
//             <span className="text-slate-300">&gt;</span>
//             <span>PUBLIC</span>
//             <span className="text-slate-300">&gt;</span>
//             <span className="text-slate-800">GOVT LETTERS</span>
//           </div>
//         </div>
        
//         {/* Actions */}
//         <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          
//           <div className="flex flex-grow md:flex-grow-0 items-center bg-white px-3 py-2 rounded-md border border-slate-200 shadow-sm h-10 w-full md:w-72">
//             <Search className="text-slate-400 mr-2 shrink-0" size={16} />
//             <input 
//               type="text" 
//               placeholder="Search by Title, Ref No, or Subject..." 
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="bg-transparent border-none outline-none text-[13px] md:text-sm w-full text-slate-600 placeholder:text-slate-400"
//             />
//           </div>

//           <button 
//             onClick={onRefresh}
//             className="p-2.5 bg-white border border-slate-200 shadow-sm rounded-md text-slate-400 hover:text-slate-600 transition-colors h-10"
//             title="Refresh"
//           >
//             <RotateCw size={18} />
//           </button>

//           <button 
//             onClick={() => handleOpenModal()}
//             className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white p-2.5 rounded-full shadow-md shadow-red-200 transition-transform hover:scale-105 shrink-0 h-10 w-10 flex items-center justify-center ml-auto md:ml-0"
//             title="Upload New Letter"
//           >
//             <Plus size={20} strokeWidth={2.5} />
//           </button>

//         </div>
//       </div>

//       {/* 📊 DATA TABLE SECTION */}
//       <div className="flex-1 bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-0">
//         <div className="flex-1 overflow-auto custom-scrollbar">
//           <table className="w-full text-left border-collapse whitespace-nowrap lg:whitespace-normal min-w-[900px]">
//             <thead className="sticky top-0 z-10 bg-slate-50">
//               <tr className="border-b border-slate-200 text-[12px] md:text-[13px] text-[#00b4d8] tracking-wide uppercase font-semibold shadow-sm">
//                 <th className="p-3 md:p-4 w-[60px] text-center bg-slate-50">#</th> 
//                 <th className="p-3 md:p-4 w-[40%] bg-slate-50">Letter Details</th>
//                 <th className="p-3 md:p-4 w-[15%] text-center bg-slate-50">Category</th>
//                 <th className="p-3 md:p-4 w-[15%] text-center bg-slate-50">Date</th>
//                 <th className="p-3 md:p-4 w-[10%] text-center bg-slate-50">Status</th>
//                 <th className="p-3 md:p-4 w-[10%] text-right pr-6 bg-slate-50">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50 text-left">
//               {filteredData.map((letter, idx) => (
//                 <tr key={letter.id} className="hover:bg-slate-50/50 transition-colors group">
//                   <td className="p-3 md:p-4 text-center text-slate-400 text-xs font-medium">
//                     {idx + 1}
//                   </td>
                  
//                   {/* Title & Ref info */}
//                   <td className="p-3 md:p-4 text-left">
//                     <div className="flex items-center gap-3">
//                         <div className="p-2.5 rounded-lg shrink-0 bg-blue-50 text-blue-500">
//                              <FileCheck size={20} />
//                         </div>
//                         <div className="flex flex-col gap-0.5 relative group/title">
//                             <span className="font-semibold text-slate-800 text-[13px] md:text-[14px]">
//                               {capitalizeWords(letter.title)}
//                             </span>
//                             <div className="flex items-center gap-2 text-[10px] text-[#00b4d8] font-medium">
//                                 <Hash size={10} />
//                                 <span className="uppercase tracking-wider">{letter.refNumber.toUpperCase()}</span>
//                             </div>
                            
//                             <div className="mt-1 flex flex-col gap-1">
//                                <p className="text-[11px] text-slate-500 font-medium italic">
//                                  {capitalizeWords(letter.subject)}
//                                </p>
//                                <a 
//                                   href={getFileUrl(Array.isArray(letter.images) ? letter.images[0] : letter.images)} 
//                                   target="_blank" 
//                                   rel="noopener noreferrer" 
//                                   className="text-[10px] text-slate-400 hover:text-[#00b4d8] hover:underline"
//                                >
//                                   View Document
//                                </a>
//                             </div>
//                         </div>
//                     </div>
//                   </td>
                  
//                   {/* Category Chip */}
//                   <td className="p-3 md:p-4 text-center">
//                     <span className={`px-2 md:px-3 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${
//                         letter.category === 'Admission' ? 'bg-orange-50 text-orange-600' :
//                         letter.category === 'Scholarship' ? 'bg-emerald-50 text-emerald-600' :
//                         letter.category === 'Examination' ? 'bg-red-50 text-red-600' :
//                         letter.category === 'Affiliation' ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-600'
//                     }`}>
//                         {letter.category}
//                     </span>
//                   </td>
                  
//                   {/* Date Column */}
//                   <td className="p-3 md:p-4 text-center">
//                     <div className="flex items-center justify-center gap-2 text-[12px] md:text-[13px] text-slate-500 font-light">
//                         <Calendar size={14} className="text-[#00b4d8]" />
//                         {new Date(letter.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
//                     </div>
//                   </td>
                  
//                   {/* Status */}
//                   <td className="p-3 md:p-4 text-center">
//                     <div className="flex items-center justify-center gap-2 group/toggle">
//                        <span className={`text-[10px] font-bold transition-colors ${letter.isActive ? 'text-green-500' : 'text-slate-300'}`}>
//                           {letter.isActive ? 'LIVE' : 'HIDDEN'}
//                        </span>
//                        <button 
//                           onClick={() => onStatusUpdate?.(letter.id)}
//                           className={`w-8 h-4.5 rounded-full relative transition-all duration-300 shadow-inner ${
//                              letter.isActive ? 'bg-green-500' : 'bg-slate-200'
//                           }`}
//                        >
//                           <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all duration-300 ${
//                              letter.isActive ? 'left-[16px]' : 'left-0.5'
//                           }`} />
//                        </button>
//                     </div>
//                   </td>
                  
//                   {/* Actions */}
//                   <td className="p-3 md:p-4 pr-6 text-right">
//                     <div className="flex items-center justify-end gap-1.5 md:gap-3">
//                       <button 
//                         onClick={() => onDelete?.(letter.id)}
//                         className="text-red-500 hover:text-red-600 p-1 transition-all"
//                         title="Delete Letter"
//                       >
//                         <Trash2 size={16} strokeWidth={1.5} />
//                       </button>
//                       <button 
//                         onClick={() => handleOpenModal(letter)}
//                         className="text-[#00b4d8] hover:text-[#0077b6] p-1 transition-all"
//                         title="Edit Letter"
//                       >
//                         <Edit3 size={16} strokeWidth={1.5} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* 🚀 ADD/EDIT MODAL */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-2 sm:p-4 transition-opacity duration-300 overflow-hidden">
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
                
//                 {/* Modal Header */}
//                 <div className="flex justify-between items-center px-5 md:px-8 py-4 border-b border-slate-100 shrink-0 rounded-t-xl bg-white">
//                     <h2 className="text-lg md:text-[20px] font-semibold text-slate-800">
//                         {editingLetter ? 'Edit Government Letter' : 'Upload New Government Letter'}
//                     </h2>
//                     <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 p-1.5 rounded-full">
//                         <X size={18} />
//                     </button>
//                 </div>

//                 {/* Modal Body */}
//                 <div className="p-5 md:p-8 overflow-y-auto custom-scrollbar flex-1 text-left">
//                     <form onSubmit={handleSubmit} id="letterForm" className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                        
//                         {/* Column 1: Basic Info */}
//                         <div className="space-y-4 md:space-y-6">
//                             <h3 className="text-[#00b4d8] text-[12px] md:text-[13px] font-bold tracking-wider uppercase border-b border-slate-100 pb-2 flex items-center gap-2">
//                                 <Mail size={16} /> Basic info
//                             </h3>
                            
//                             <div className="space-y-1.5">
//                                 <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Letter Title <span className="text-red-500">*</span></label>
//                                 <input 
//                                     name="title" required type="text" placeholder="e.g. Scholarship Notification 2026" 
//                                     className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8]" 
//                                     value={formData.title} 
//                                     onChange={(e) => setFormData({...formData, title: e.target.value.replace(/\b\w/g, c => c.toUpperCase())})} 
//                                 />
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="space-y-1.5">
//                                     <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Ref Number <span className="text-red-500">*</span></label>
//                                     <input 
//                                         name="refNumber" required type="text" placeholder="REF/2026/001" 
//                                         className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8] uppercase" 
//                                         value={formData.refNumber} 
//                                         onChange={(e) => setFormData({...formData, refNumber: e.target.value.toUpperCase()})} 
//                                     />
//                                 </div>
//                                 <div className="space-y-1.5">
//                                     <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Date <span className="text-red-500">*</span></label>
//                                     <input 
//                                         name="date" required type="date" 
//                                         className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8]" 
//                                         value={formData.date} 
//                                         onChange={(e) => setFormData({...formData, date: e.target.value})} 
//                                     />
//                                 </div>
//                             </div>

//                             <div className="space-y-1.5">
//                                 <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Subject <span className="text-red-500">*</span></label>
//                                 <input 
//                                     name="subject" required type="text" placeholder="Brief subject of the letter" 
//                                     className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8]" 
//                                     value={formData.subject} 
//                                     onChange={(e) => setFormData({...formData, subject: e.target.value.replace(/\b\w/g, c => c.toUpperCase())})} 
//                                 />
//                             </div>
//                         </div>

//                         {/* Column 2: Detailed Info & File */}
//                         <div className="space-y-4 md:space-y-6">
//                             <h3 className="text-[#3ed4b2] text-[12px] md:text-[13px] font-bold tracking-wider uppercase border-b border-slate-100 pb-2 flex items-center gap-2">
//                                 <FileCheck size={16} /> Details & Attachment
//                             </h3>

//                             <div className="space-y-1.5">
//                                 <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Category <span className="text-red-500">*</span></label>
//                                 <select 
//                                     name="category" required 
//                                     className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8] appearance-none cursor-pointer"
//                                     value={formData.category} 
//                                     onChange={(e) => setFormData({...formData, category: e.target.value as any})}
//                                 >
//                                     {CATEGORIES.map(cat => (
//                                         <option key={cat} value={cat}>{cat}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="space-y-1.5">
//                                 <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Description <span className="text-red-500">*</span></label>
//                                 <textarea 
//                                     name="description" required rows={3} placeholder="Provide detailed description..." 
//                                     className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8] resize-none" 
//                                     value={formData.description} 
//                                     onChange={(e) => setFormData({...formData, description: e.target.value.replace(/\b\w/g, c => c.toUpperCase())})} 
//                                 />
//                             </div>

//                             <div className="space-y-1.5">
//                                 <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Upload Letter (PDF/Image) {!editingLetter && <span className="text-red-500">*</span>}</label>
//                                 <div className="relative group/upload">
//                                     <input 
//                                         type="file" 
//                                         required={!editingLetter}
//                                         onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
//                                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                                         accept="application/pdf,image/*"
//                                     />
//                                     <div className={`flex items-center gap-3 px-3 py-2.5 border rounded-lg transition-all ${
//                                         selectedFile 
//                                         ? 'border-[#3ed4b2] bg-[#3ed4b2]/10' 
//                                         : 'border-slate-200 bg-white group-hover/upload:border-[#00b4d8]'
//                                     }`}>
//                                         <div className={`p-1.5 rounded-md ${selectedFile ? 'bg-[#3ed4b2] text-white' : 'bg-slate-100 text-slate-400'}`}>
//                                             {selectedFile ? <CheckCircle size={16} /> : <Upload size={16} />}
//                                         </div>
//                                         <div className="flex flex-col">
//                                             <span className={`text-[13px] font-medium ${selectedFile ? 'text-slate-800' : 'text-slate-500'}`}>
//                                                 {selectedFile ? selectedFile.name : `Choose file...`}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </form>
//                 </div>

//                 {/* Modal Footer */}
//                 <div className="px-5 md:px-8 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0 rounded-b-xl">
//                     <button 
//                         type="button" 
//                         onClick={() => setIsModalOpen(false)} 
//                         className="px-5 md:px-6 py-2 md:py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-[13px] md:text-[14px] font-medium hover:bg-slate-50 transition-colors"
//                     >
//                         Cancel
//                     </button>
//                     <button 
//                         type="submit" 
//                         form="letterForm"
//                         disabled={isSaving} 
//                         className="px-5 md:px-6 py-2 md:py-2.5 bg-[#0e8bf1] text-white rounded-lg text-[13px] md:text-[14px] font-medium hover:bg-[#0b73c9] transition-colors flex items-center gap-2 shadow-sm"
//                     >
//                         {isSaving ? <RotateCw className="animate-spin" size={16} /> : (editingLetter ? 'Update Letter' : 'Save Letter')}
//                     </button>
//                 </div>

//             </div>
//         </div>
//       )}

//     </div>
//   );
// }



"use client";

import React, { useState } from "react";
import { 
    Search, RotateCw, 
    Trash2, Calendar, FileCheck, 
    Plus, X, Upload, Hash, Mail,
    Edit3,
    CheckCircle
} from 'lucide-react';
import { getFileUrl } from "@/shared/api/api-client";
import { capitalizeWords } from "@/shared/utils/string-utils";
import { GovernmentLetter, GovLetterTableProps, GovLetterCategory } from "../types";

const CATEGORIES: GovLetterCategory[] = ['Admission', 'Scholarship', 'General', 'Examination', 'Affiliation'];

export function GovLettersTable({
  data,
  onDelete,
  onRefresh,
  onStatusUpdate,
  onSave
}: GovLetterTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLetter, setEditingLetter] = useState<GovernmentLetter | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    title: "",
    refNumber: "",
    date: new Date().toISOString().split('T')[0],
    subject: "",
    description: "",
    category: "General" as GovLetterCategory
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleOpenModal = (letter?: GovernmentLetter) => {
    if (letter) {
      setEditingLetter(letter);
      setFormData({
        title: letter.title,
        refNumber: letter.refNumber,
        date: letter.date,
        subject: letter.subject,
        description: letter.description,
        category: letter.category
      });
    } else {
      setEditingLetter(null);
      setFormData({
        title: "",
        refNumber: "",
        date: new Date().toISOString().split('T')[0],
        subject: "",
        description: "",
        category: "General"
      });
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const dataToSend = new FormData();
    dataToSend.append("title", formData.title);
    dataToSend.append("refNumber", formData.refNumber);
    dataToSend.append("date", formData.date);
    dataToSend.append("subject", formData.subject);
    dataToSend.append("description", formData.description);
    dataToSend.append("category", formData.category);

    // FIXED: Field name must be "images" to match multer config in backend
    if (selectedFile) {
      dataToSend.append("images", selectedFile);
    }

    const success = await onSave?.(editingLetter?.id || null, dataToSend);
    if (success) {
      setIsModalOpen(false);
      setSelectedFile(null);
      // Reset form after successful create
      if (!editingLetter) {
        setFormData({
          title: "",
          refNumber: "",
          date: new Date().toISOString().split('T')[0],
          subject: "",
          description: "",
          category: "General"
        });
      }
    }
    setIsSaving(false);
  };

  const filteredData = data.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.refNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-4 md:gap-6 w-full font-sans max-w-full">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2 shrink-0">
        <div className="w-full md:w-auto">
          <h1 className="text-2xl md:text-3xl font-light text-[#00b4d8] mb-1 tracking-wide">
            Government Letters
          </h1>
          <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-400 tracking-widest uppercase">
            <span>APP</span>
            <span className="text-slate-300">&​gt;</span>
            <span>PUBLIC</span>
            <span className="text-slate-300">&​gt;</span>
            <span className="text-slate-800">GOVT LETTERS</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          
          <div className="flex flex-grow md:flex-grow-0 items-center bg-white px-3 py-2 rounded-md border border-slate-200 shadow-sm h-10 w-full md:w-72">
            <Search className="text-slate-400 mr-2 shrink-0" size={16} />
            <input 
              type="text" 
              placeholder="Search by Title, Ref No, or Subject..." 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-[13px] md:text-sm w-full text-slate-600 placeholder:text-slate-400"
            />
          </div>

          <button 
            onClick={onRefresh}
            className="p-2.5 bg-white border border-slate-200 shadow-sm rounded-md text-slate-400 hover:text-slate-600 transition-colors h-10"
            title="Refresh"
          >
            <RotateCw size={18} />
          </button>

          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#0e8bf1] hover:bg-[#0b73c9] text-white p-2.5 rounded-full shadow-md shadow-blue-200 transition-transform hover:scale-105 shrink-0 h-10 w-10 flex items-center justify-center ml-auto md:ml-0"
            title="Upload New Letter"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>

        </div>
      </div>

      {/* DATA TABLE SECTION */}
      <div className="flex-1 bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap lg:whitespace-normal min-w-[900px]">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr className="border-b border-slate-200 text-[12px] md:text-[13px] text-[#00b4d8] tracking-wide uppercase font-semibold shadow-sm">
                <th className="p-3 md:p-4 w-[60px] text-center bg-slate-50">#</th> 
                <th className="p-3 md:p-4 w-[40%] bg-slate-50">Letter Details</th>
                <th className="p-3 md:p-4 w-[15%] text-center bg-slate-50">Category</th>
                <th className="p-3 md:p-4 w-[15%] text-center bg-slate-50">Date</th>
                <th className="p-3 md:p-4 w-[10%] text-center bg-slate-50">Status</th>
                <th className="p-3 md:p-4 w-[10%] text-right pr-6 bg-slate-50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-left">
              {filteredData.map((letter, idx) => (
                <tr key={letter.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-3 md:p-4 text-center text-slate-400 text-xs font-medium">
                    {idx + 1}
                  </td>
                  
                  {/* Title & Ref info */}
                  <td className="p-3 md:p-4 text-left">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg shrink-0 bg-blue-50 text-blue-500">
                             <FileCheck size={20} />
                        </div>
                        <div className="flex flex-col gap-0.5 relative group/title">
                            <span className="font-semibold text-slate-800 text-[13px] md:text-[14px]">
                              {capitalizeWords(letter.title)}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-[#00b4d8] font-medium">
                                <Hash size={10} />
                                <span className="uppercase tracking-wider">{letter.refNumber.toUpperCase()}</span>
                            </div>
                            
                            <div className="mt-1 flex flex-col gap-1">
                               <p className="text-[11px] text-slate-500 font-medium italic">
                                 {capitalizeWords(letter.subject)}
                               </p>
                               <a 
                                  href={getFileUrl(Array.isArray(letter.images) ? letter.images[0] : letter.images)} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-[10px] text-slate-400 hover:text-[#00b4d8] hover:underline"
                               >
                                  View Document
                               </a>
                            </div>
                        </div>
                    </div>
                  </td>
                  
                  {/* Category Chip */}
                  <td className="p-3 md:p-4 text-center">
                    <span className={`px-2 md:px-3 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${
                        letter.category === 'Admission' ? 'bg-orange-50 text-orange-600' :
                        letter.category === 'Scholarship' ? 'bg-emerald-50 text-emerald-600' :
                        letter.category === 'Examination' ? 'bg-red-50 text-red-600' :
                        letter.category === 'Affiliation' ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                        {letter.category}
                    </span>
                  </td>
                  
                  {/* Date Column */}
                  <td className="p-3 md:p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-[12px] md:text-[13px] text-slate-500 font-light">
                        <Calendar size={14} className="text-[#00b4d8]" />
                        {new Date(letter.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="p-3 md:p-4 text-center">
                    <div className="flex items-center justify-center gap-2 group/toggle">
                       <span className={`text-[10px] font-bold transition-colors ${letter.isActive ? 'text-green-500' : 'text-slate-300'}`}>
                          {letter.isActive ? 'LIVE' : 'HIDDEN'}
                       </span>
                       <button 
                          onClick={() => onStatusUpdate?.(letter.id)}
                          className={`w-8 h-4.5 rounded-full relative transition-all duration-300 shadow-inner ${
                             letter.isActive ? 'bg-green-500' : 'bg-slate-200'
                          }`}
                       >
                          <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all duration-300 ${
                             letter.isActive ? 'left-[16px]' : 'left-0.5'
                          }`} />
                       </button>
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="p-3 md:p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5 md:gap-3">
                      <button 
                        onClick={() => onDelete?.(letter.id)}
                        className="text-red-500 hover:text-red-600 p-1 transition-all"
                        title="Delete Letter"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                      <button 
                        onClick={() => handleOpenModal(letter)}
                        className="text-[#00b4d8] hover:text-[#0077b6] p-1 transition-all"
                        title="Edit Letter"
                      >
                        <Edit3 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-2 sm:p-4 transition-opacity duration-300 overflow-hidden">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center px-5 md:px-8 py-4 border-b border-slate-100 shrink-0 rounded-t-xl bg-white">
                    <h2 className="text-lg md:text-[20px] font-semibold text-slate-800">
                        {editingLetter ? 'Edit Government Letter' : 'Upload New Government Letter'}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 p-1.5 rounded-full">
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 md:p-8 overflow-y-auto custom-scrollbar flex-1 text-left">
                    <form onSubmit={handleSubmit} id="letterForm" className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                        
                        {/* Column 1: Basic Info */}
                        <div className="space-y-4 md:space-y-6">
                            <h3 className="text-[#00b4d8] text-[12px] md:text-[13px] font-bold tracking-wider uppercase border-b border-slate-100 pb-2 flex items-center gap-2">
                                <Mail size={16} /> Basic info
                            </h3>
                            
                            <div className="space-y-1.5">
                                <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Letter Title <span className="text-red-500">*</span></label>
                                <input 
                                    name="title" required type="text" placeholder="e.g. Scholarship Notification 2026" 
                                    className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8]" 
                                    onChange={(e) => setFormData({...formData, title: capitalizeWords(e.target.value)})} 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Ref Number <span className="text-red-500">*</span></label>
                                    <input 
                                        name="refNumber" required type="text" placeholder="REF/2026/001" 
                                        className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8] uppercase" 
                                        value={formData.refNumber} 
                                        onChange={(e) => setFormData({...formData, refNumber: e.target.value.toUpperCase()})} 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Date <span className="text-red-500">*</span></label>
                                    <input 
                                        name="date" required type="date" 
                                        className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8]" 
                                        value={formData.date} 
                                        onChange={(e) => setFormData({...formData, date: e.target.value})} 
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Subject <span className="text-red-500">*</span></label>
                                <input 
                                    name="subject" required type="text" placeholder="Brief subject of the letter" 
                                    className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8]" 
                                    onChange={(e) => setFormData({...formData, subject: capitalizeWords(e.target.value)})} 
                                />
                            </div>
                        </div>

                        {/* Column 2: Detailed Info & File */}
                        <div className="space-y-4 md:space-y-6">
                            <h3 className="text-[#3ed4b2] text-[12px] md:text-[13px] font-bold tracking-wider uppercase border-b border-slate-100 pb-2 flex items-center gap-2">
                                <FileCheck size={16} /> Details & Attachment
                            </h3>

                            <div className="space-y-1.5">
                                <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Category <span className="text-red-500">*</span></label>
                                <select 
                                    name="category" required 
                                    className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8] appearance-none cursor-pointer"
                                    value={formData.category} 
                                    onChange={(e) => setFormData({...formData, category: e.target.value as GovLetterCategory})}
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Description <span className="text-red-500">*</span></label>
                                <textarea 
                                    name="description" required rows={3} placeholder="Provide detailed description..." 
                                    className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8] resize-none" 
                                    onChange={(e) => setFormData({...formData, description: capitalizeWords(e.target.value)})} 
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Upload Letter (PDF/Image) {!editingLetter && <span className="text-red-500">*</span>}</label>
                                <div className="relative group/upload">
                                    <input 
                                        type="file" 
                                        name="images"
                                        required={!editingLetter}
                                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        accept="application/pdf,image/*"
                                    />
                                    <div className={`flex items-center gap-3 px-3 py-2.5 border rounded-lg transition-all ${
                                        selectedFile 
                                        ? 'border-[#3ed4b2] bg-[#3ed4b2]/10' 
                                        : 'border-slate-200 bg-white group-hover/upload:border-[#00b4d8]'
                                    }`}>
                                        <div className={`p-1.5 rounded-md ${selectedFile ? 'bg-[#3ed4b2] text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            {selectedFile ? <CheckCircle size={16} /> : <Upload size={16} />}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-[13px] font-medium ${selectedFile ? 'text-slate-800' : 'text-slate-500'}`}>
                                                {selectedFile ? selectedFile.name : `Choose file...`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="px-5 md:px-8 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0 rounded-b-xl">
                    <button 
                        type="button" 
                        onClick={() => setIsModalOpen(false)} 
                        className="px-5 md:px-6 py-2 md:py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-[13px] md:text-[14px] font-medium hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        form="letterForm"
                        disabled={isSaving} 
                        className="px-5 md:px-6 py-2 md:py-2.5 bg-[#0e8bf1] text-white rounded-lg text-[13px] md:text-[14px] font-medium hover:bg-[#0b73c9] transition-colors flex items-center gap-2 shadow-sm"
                    >
                        {isSaving ? <RotateCw className="animate-spin" size={16} /> : (editingLetter ? 'Update Letter' : 'Save Letter')}
                    </button>
                </div>

            </div>
        </div>
      )}

    </div>
  );
}