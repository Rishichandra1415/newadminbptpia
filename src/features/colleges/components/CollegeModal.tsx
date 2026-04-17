"use client";

import React, { useState, useEffect } from "react";
import { X, Save, School, MapPin, Globe, Mail, Phone, GraduationCap, DollarSign, FileText, FileBadge, Plus, ShieldCheck, Settings } from "lucide-react";
import { College, CollegeType } from "../types";
import { capitalizeWords } from "@/shared/utils/string-utils";
import { http } from "@/shared/api/api-client";
import { API_ENDPOINTS } from "@/shared/api/api-endpoints";

interface LocationItem {
  id: number;
  name: string;
}

interface CollegeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number | null, data: Partial<College>) => Promise<boolean>;
  category: 'engineering' | 'polytechnic';
  editData?: College | null;
}

export function CollegeModal({ isOpen, onClose, onSave, category, editData }: CollegeModalProps) {
  const [formData, setFormData] = useState<Partial<College>>({
    name: "",
    code: "",
    totalIntake: 0,
    address: "",
    city: "",
    district: "",
    state: "Bihar",
    contacts: [""],
    email: "",
    website: "",
    feesInfo: "",
    category: category,
    type: category.toUpperCase() as CollegeType,
    courseMatrix: {}
  });

  const [states, setStates] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  useEffect(() => {
    if (editData && editData.id) {
      setFormData(editData);
    } else {
      setFormData({
        name: "",
        code: "",
        totalIntake: 0,
        address: "",
        city: "",
        district: "",
        state: "Bihar",
        contacts: [""],
        email: "",
        website: "",
        feesInfo: "",
        category: category,
        type: category.toUpperCase() as CollegeType,
        courseMatrix: {}
      });
    }
  }, [editData, category, isOpen]);

  // Fetch States on mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await http.get<{ success: boolean; data: LocationItem[] }>(API_ENDPOINTS.MASTER.STATES);
        if (response.success) {
          setStates(response.data);
          
          // If we have an initial state (like 'Bihar'), find its ID and fetch districts
          const initialState = response.data.find(s => s.name === (editData?.state || "Bihar"));
          if (initialState) {
            fetchDistricts(initialState.id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch states", error);
      }
    };

    if (isOpen) {
      fetchStates();
    }
  }, [isOpen]);

  const fetchDistricts = async (stateId: number) => {
    setLoadingLocations(true);
    try {
      const response = await http.get<{ success: boolean; data: LocationItem[] }>(`${API_ENDPOINTS.MASTER.CITIES}/${stateId}`);
      if (response.success) {
        setDistricts(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch districts", error);
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleStateChange = (stateName: string) => {
    const selectedState = states.find(s => s.name === stateName);
    setFormData(prev => ({ ...prev, state: stateName, district: "" }));
    if (selectedState) {
      fetchDistricts(selectedState.id);
    } else {
      setDistricts([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(editData?.id || null, formData);
    onClose();
  };

  if (!isOpen) return null;

  const currentType = formData.category || category;

  const toggleCourseInModal = (code: string) => {
    const current = formData.courseMatrix?.[code] || { isEnabled: false, seats: 0 };
    setFormData({
      ...formData,
      courseMatrix: {
        ...formData.courseMatrix,
        [code]: { ...current, isEnabled: !current.isEnabled }
      }
    });
  };

  const updateCourseSeats = (code: string, seats: number) => {
    const current = formData.courseMatrix?.[code] || { isEnabled: false, seats: 0 };
    setFormData({
      ...formData,
      courseMatrix: {
        ...formData.courseMatrix,
        [code]: { ...current, seats }
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-hidden">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <School size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              {editData?.id ? 'Edit Institution Details' : `Register New ${capitalize(currentType)} Institution`}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-slate-50">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
          <form onSubmit={handleSubmit} id="collegeForm" className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 text-left">
            
            {/* Primary Details */}
            <div className="space-y-6">
              <section className="space-y-4">
                <h3 className="text-[#00b4d8] text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 border-b pb-2">
                  <School size={14} /> Institution Identity
                </h3>
                
                {/* Type Selection */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Institution Category</label>
                  <select 
                    className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none bg-white font-medium"
                    value={formData.category}
                    onChange={(e) => setFormData({
                      ...formData, 
                      category: e.target.value as any,
                      type: e.target.value.toUpperCase() as CollegeType
                    })}
                  >
                    <option value="engineering">Engineering College</option>
                    <option value="polytechnic">Polytechnic College</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Full Name</label>
                    <input 
                      required type="text" placeholder="e.g. RPS Institute of Technology" 
                      className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none transition-all" 
                      value={formData.name || ""} 
                      onChange={(e) => setFormData({...formData, name: capitalizeWords(e.target.value)})} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Code #</label>
                    <input 
                      required type="text" placeholder="139" 
                      className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none" 
                      value={formData.code || ""} onChange={(e) => setFormData({...formData, code: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Total Intake</label>
                    <input 
                      type="number" placeholder="360" 
                      className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none bg-slate-50 font-semibold" 
                      value={formData.totalIntake || 0} 
                      readOnly
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Website URL</label>
                    <div className="relative">
                      <Globe size={14} className="absolute left-3 top-3 text-slate-400" />
                      <input 
                        type="text" placeholder="www.college.in" 
                        className="w-full pl-9 p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none" 
                        value={formData.website || ""} onChange={(e) => setFormData({...formData, website: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-amber-500 text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 border-b pb-2">
                  <MapPin size={14} /> Connectivity & Location
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">State</label>
                        <select 
                            className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none bg-white font-medium" 
                            value={formData.state || ""} 
                            onChange={(e) => handleStateChange(e.target.value)}
                        >
                            <option value="">Select State</option>
                            {states.map(s => (
                              <option key={s.id} value={s.name}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">District</label>
                        <select 
                            className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none bg-white font-medium" 
                            value={formData.district || ""} 
                            onChange={(e) => setFormData({...formData, district: e.target.value})}
                            disabled={!formData.state || loadingLocations}
                        >
                            <option value="">Select District</option>
                            {districts.map(d => (
                              <option key={d.id} value={d.name}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">City</label>
                        <input 
                            type="text" placeholder="Patna" 
                            className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none" 
                            value={formData.city || ""} onChange={(e) => setFormData({...formData, city: e.target.value})} 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Pincode</label>
                        <input 
                            type="text" placeholder="800001" 
                            className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none" 
                            value={formData.pincode || ""} onChange={(e) => setFormData({...formData, pincode: e.target.value})} 
                        />
                    </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Official Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-3 text-slate-400" />
                    <input 
                      type="email" placeholder="admin@college.in" 
                      className="w-full pl-9 p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none" 
                      value={formData.email || ""} onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Contact Numbers (Comma separated)</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-3 text-slate-400" />
                    <input 
                        type="text" placeholder="9876543210, 9876543211" 
                        className="w-full pl-9 p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none" 
                        value={formData.contacts?.join(", ") || ""} 
                        onChange={(e) => setFormData({...formData, contacts: e.target.value.split(",").map(c => c.trim())})} 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Complete Mailing Address</label>
                  <textarea 
                    rows={2} placeholder="Full postal address..." 
                    className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none resize-none" 
                    value={formData.address || ""} 
                    onChange={(e) => setFormData({...formData, address: capitalizeWords(e.target.value)})} 
                  />
                </div>
              </section>

              {/* Advanced Settings */}
              {/* <section className="space-y-4">
                <h3 className="text-slate-500 text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 border-b pb-2">
                   <Settings size={14} /> Display & Advanced Settings
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Display Order</label>
                        <input 
                            type="number" 
                            className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none" 
                            value={formData.displayOrder || 0} onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value)})} 
                        />
                    </div>
                    <div className="flex items-end pb-1.5">
                        <label className="flex items-center gap-2 cursor-pointer group">
                             <div className="relative">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={formData.isFeatured || false} 
                                    onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                                />
                                <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-amber-400 transition-colors"></div>
                                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                             </div>
                             <span className="text-[11px] font-bold text-slate-500 uppercase group-hover:text-amber-500 transition-colors">Mark as Featured</span>
                        </label>
                    </div>
                </div>
              </section> */}
            </div>

            {/* Courses & Fees */}
            <div className="space-y-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-emerald-500 text-[11px] font-bold tracking-widest uppercase flex items-center gap-2">
                    <GraduationCap size={16} /> Course matrix
                    </h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                        {capitalize(currentType)}
                    </span>
                </div>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {(DISCIPLINES[currentType] || []).map(disc => {
                    const isSelected = !!formData.courseMatrix?.[disc.code]?.isEnabled;
                    return (
                      <div key={disc.code} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${isSelected ? 'bg-white border-blue-100 shadow-sm ring-1 ring-blue-50' : 'bg-transparent border-slate-200 opacity-60'}`}>
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                            checked={isSelected}
                            onChange={() => toggleCourseInModal(disc.code)}
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700">{disc.code}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{disc.label}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Seats:</label>
                          <input 
                            type="number" 
                            disabled={!isSelected}
                            placeholder="0"
                            className="w-20 p-1.5 text-center text-xs border rounded-md outline-none focus:border-blue-400 disabled:bg-slate-50 font-bold"
                            value={formData.courseMatrix?.[disc.code]?.seats || 0}
                            onChange={(e) => {
                                const newSeats = Number(e.target.value);
                                updateCourseSeats(disc.code, newSeats);
                                
                                // Update total intake
                                let newTotal = 0;
                                const matrix = { ...formData.courseMatrix, [disc.code]: { ...formData.courseMatrix?.[disc.code], seats: newSeats, isEnabled: true } };
                                Object.values(matrix).forEach((v: any) => {
                                    if (v.isEnabled) newTotal += (v.seats || 0);
                                });
                                // Add intakeOther value too
                                if (formData.intakeOther && formData.intakeOther !== "-") {
                                    const otherSeats = parseInt(formData.intakeOther) || 0;
                                    newTotal += otherSeats;
                                }
                                setFormData(prev => ({ ...prev, courseMatrix: matrix, totalIntake: newTotal }));
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-1 pt-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Other Intake (Branches with count)</label>
                    <input 
                        type="text" placeholder="e.g. ME-60, CE-30" 
                        className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none" 
                        value={formData.intakeOther || ""} onChange={(e) => setFormData({...formData, intakeOther: e.target.value})} 
                    />
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-rose-500 text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 border-b pb-2">
                  <DollarSign size={15} /> Fee Structures & Attachments
                </h3>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Fee Details Description</label>
                  <textarea 
                    rows={2} placeholder="e.g. 42,500/- Per Semester..." 
                    className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none resize-none" 
                    value={formData.feesInfo || ""} onChange={(e) => setFormData({...formData, feesInfo: e.target.value})} 
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Brochure Link / Attachment</label>
                    {formData.brochureUrl && formData.brochureUrl.startsWith('data:') && (
                        <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                          <ShieldCheck size={12} /> PDF ATTACHED
                        </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="relative">
                        <FileBadge size={14} className="absolute left-3 top-3 text-slate-400" />
                        <input 
                        type="text" placeholder="https://..." 
                        className="w-full pl-9 pr-32 p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none" 
                        value={formData.brochureUrl && !formData.brochureUrl.startsWith('data:') ? formData.brochureUrl : ""} 
                        onChange={(e) => setFormData({...formData, brochureUrl: e.target.value, brochureFileName: undefined})} 
                        />
                        {/* <div className="absolute right-1 top-1 flex items-center gap-1">
                            <label className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-md text-[11px] font-bold cursor-pointer transition-colors border border-slate-200 flex items-center gap-1.5">
                                <Plus size={14} /> Upload PDF
                                <input 
                                    type="file" 
                                    accept="application/pdf" 
                                    className="hidden" 
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                const base64 = event.target?.result as string;
                                                setFormData({
                                                    ...formData, 
                                                    brochureUrl: base64,
                                                    brochureFileName: file.name
                                                });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </label>
                            {formData.brochureUrl && (
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, brochureUrl: "", brochureFileName: undefined})}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                                    title="Remove Brochure"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div> */}
                    </div>
                    
                    {formData.brochureFileName && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/50 border border-blue-100 rounded-lg">
                            <FileText size={12} className="text-blue-500" />
                            <span className="text-[11px] font-medium text-blue-700 truncate max-w-[300px]">{formData.brochureFileName}</span>
                            <span className="text-[9px] text-blue-400 uppercase font-bold ml-auto">Local Archive</span>
                        </div>
                    )}
                  </div>
                </div>
              </section>

              {/* SEO Section */}
              {/* <section className="space-y-4">
                <h3 className="text-[#00b4d8] text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 border-b pb-2">
                  <Globe size={14} /> Marketing & SEO (Optional)
                </h3>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Focus Meta Title</label>
                  <input 
                    type="text" placeholder="Best Engineering College in..." 
                    className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none" 
                    value={formData.metaTitle || ""} onChange={(e) => setFormData({...formData, metaTitle: e.target.value})} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Meta Description / Keywords</label>
                  <textarea 
                    rows={2} placeholder="Brief marketing summary for search engines..." 
                    className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none resize-none" 
                    value={formData.metaDescription || ""} 
                    onChange={(e) => setFormData({...formData, metaDescription: e.target.value})} 
                  />
                </div>
              </section> */}
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0 rounded-b-xl">
          <button onClick={onClose} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-[13px] font-bold hover:bg-slate-50 transition-colors">
            Discard
          </button>
          <button 
            type="submit" form="collegeForm"
            className="px-8 py-2.5 bg-[#0e8bf1] text-white rounded-lg text-[13px] font-bold hover:bg-[#0b73c9] transition-all flex items-center gap-2 shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save size={16} /> {editData?.id ? 'Update' : 'Save'} Institution
          </button>
        </div>
      </div>
    </div>
  );
}

const DISCIPLINES: Record<string, { code: string; label: string }[]> = {
  engineering: [
    { code: 'CE', label: 'Civil' },
    { code: 'ME', label: 'Mechanical' },
    { code: 'CSE', label: 'Computer Science' },
    { code: 'EEE', label: 'Electrical & Electronics' },
    { code: 'ECE', label: 'Electronics & Comm.' },
    { code: 'IT', label: 'Information Technology' },
    { code: 'AI', label: 'AI & Machine Learning' },
  ],
  polytechnic: [
    { code: 'CE', label: 'Civil' },
    { code: 'ME', label: 'Mechanical' },
    { code: 'EE', label: 'Electrical' },
    { code: 'CSE', label: 'Computer Science' },
    { code: 'ECE', label: 'Electronics & Comm.' },
  ]
};

function capitalize(s: string) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

