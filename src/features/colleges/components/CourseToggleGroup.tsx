"use client";

import React from "react";

interface CourseToggleGroupProps {
  category: 'engineering' | 'polytechnic';
  selectedCourses: Record<string, { isEnabled: boolean; seats: number }>;
  onToggle: (code: string) => void;
  readOnly?: boolean;
  showSeats?: boolean;
}

const DISCIPLINES = {
  engineering: [
    { code: 'CE', label: 'Civ' },
    { code: 'ME', label: 'Mech' },
    { code: 'CSE', label: 'Comp' },
    { code: 'EEE', label: 'EEE' },
    { code: 'ECE', label: 'ECE' },
    { code: 'BE', label: 'BE' },
  ],
  polytechnic: [
    { code: 'CE', label: 'Civ' },
    { code: 'ME', label: 'Mech' },
    { code: 'EE', label: 'Elec' },
    { code: 'CSE', label: 'Comp' },
    { code: 'ECE', label: 'ECE' },
    { code: 'Auto', label: 'Auto' },
  ]
};

export function CourseToggleGroup({ 
  category, 
  selectedCourses, 
  onToggle, 
  readOnly = false,
  showSeats = false
}: CourseToggleGroupProps) {
  const courses = DISCIPLINES[category];

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {courses.map((course) => {
        const data = selectedCourses[course.code];
        const isActive = data?.isEnabled;

        return (
          <div 
            key={course.code}
            className={`
              flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] font-bold transition-all
              ${isActive 
                ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' 
                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'}
              ${!readOnly ? 'cursor-pointer hover:border-blue-300' : ''}
            `}
            onClick={() => !readOnly && onToggle(course.code)}
          >
            <input 
              type="checkbox" 
              checked={isActive || false} 
              readOnly 
              className="w-3 h-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500 pointer-events-none"
            />
            <span>{course.code}</span>
            {showSeats && isActive && data.seats > 0 && (
              <span className="text-[9px] bg-blue-100 px-1 rounded ml-0.5">: {data.seats}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
