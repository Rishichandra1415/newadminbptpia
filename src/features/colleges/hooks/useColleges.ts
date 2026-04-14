import { useState, useCallback, useMemo } from "react";
import { College } from "../types";

const INITIAL_ENGINEERING_COLLEGES: College[] = [
  {
    id: 1,
    name: "R.P Sharma Institute of Technology",
    code: "139",
    totalSeats: 360,
    address: "Saguna More, Khagaul Road, Danapur, Patna.",
    district: "Patna",
    state: "Bihar",
    contacts: ["9798333308", "9798999946"],
    email: "info@rpsit.org.in",
    website: "www.rpsit.org.in",
    feesInfo: "42,500/- Per Semester + Admission Fee 5000/- One Time",
    category: "engineering",
    isActive: true,
    courseMatrix: {
      "CE": { isEnabled: true, seats: 90 },
      "ME": { isEnabled: true, seats: 60 },
      "EEE": { isEnabled: true, seats: 60 },
      "ECE": { isEnabled: true, seats: 30 },
      "CSE": { isEnabled: true, seats: 120 },
    }
  },
  {
    id: 2,
    name: "Netaji Subhas Institute of Technology",
    code: "124",
    totalSeats: 480,
    address: "Amhara, Bihta, Patna.",
    district: "Patna",
    state: "Bihar",
    contacts: ["7781020346", "7781020347"],
    email: "info@nsit.in",
    website: "www.nsit.in",
    feesInfo: "45,000/- Per Semester",
    category: "engineering",
    isActive: true,
    courseMatrix: {
      "CE": { isEnabled: true, seats: 120 },
      "ME": { isEnabled: false, seats: 60 },
      "CSE": { isEnabled: true, seats: 180 },
    }
  }
];

const INITIAL_POLYTECHNIC_COLLEGES: College[] = [
  {
    id: 101,
    name: "Ganga Memorial College of Polytechnic",
    code: "502",
    totalSeats: 300,
    address: "Harnaut, Nalanda.",
    district: "Nalanda",
    state: "Bihar",
    contacts: ["9334114400"],
    email: "gmcp@gmail.com",
    website: "www.gangamemorial.com",
    feesInfo: "30,000/- Per Semester",
    category: "polytechnic",
    isActive: true,
    courseMatrix: {
      "CE": { isEnabled: true, seats: 120 },
      "ME": { isEnabled: true, seats: 120 },
      "EE": { isEnabled: true, seats: 60 },
    }
  }
];

export function useColleges(category: 'engineering' | 'polytechnic') {
  const [colleges, setColleges] = useState<College[]>(() => 
    category === 'engineering' ? INITIAL_ENGINEERING_COLLEGES : INITIAL_POLYTECHNIC_COLLEGES
  );
  const [isLoading, setIsLoading] = useState(false);

  const toggleCourse = useCallback(async (collegeId: number, courseCode: string) => {
    setColleges(prev => prev.map(c => {
      if (c.id === collegeId) {
        const current = c.courseMatrix[courseCode] || { isEnabled: false, seats: 0 };
        return {
          ...c,
          courseMatrix: {
            ...c.courseMatrix,
            [courseCode]: { ...current, isEnabled: !current.isEnabled }
          }
        };
      }
      return c;
    }));
  }, []);

  const toggleStatus = useCallback(async (id: number) => {
    setColleges(prev => prev.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ));
  }, []);

  const deleteCollege = useCallback(async (id: number) => {
    if (confirm("Are you sure you want to delete this college?")) {
        setColleges(prev => prev.filter(c => c.id !== id));
    }
  }, []);

  const saveCollege = useCallback(async (id: number | null, data: Partial<College>) => {
    if (id) {
       setColleges(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    } else {
       const newCollege: College = {
         ...(data as College),
         id: Date.now(),
         isActive: true,
       };
       setColleges(prev => [...prev, newCollege]);
    }
    return true;
  }, []);

  return {
    colleges,
    isLoading,
    toggleCourse,
    toggleStatus,
    deleteCollege,
    saveCollege
  };
}
