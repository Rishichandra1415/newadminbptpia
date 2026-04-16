"use client";

import React, { useState } from "react";
import { CoursesTable } from "@/features/master/components/Courses/CoursesTable";
import { CourseModal } from "@/features/master/components/Courses/CourseModal";
import { CourseEntry } from "@/features/master/types";

// DEMO DATA AS REQUESTED
const DEMO_COURSES: CourseEntry[] = [
  { id: 1, name: "B.Tech Computer Science Engineering", isActive: true },
  { id: 2, name: "B.Tech Mechanical Engineering", isActive: true },
  { id: 3, name: "B.Tech Civil Engineering", isActive: true },
  { id: 4, name: "B.Tech Electrical & Electronics Engineering", isActive: true },
  { id: 5, name: "Polytechnic Civil Engineering", isActive: true },
  { id: 6, name: "Polytechnic Mechanical Engineering", isActive: true },
  { id: 7, name: "Polytechnic Computer Science", isActive: true },
  { id: 8, name: "B.Tech Artificial Intelligence & Machine Learning", isActive: false },
  { id: 9, name: "Polytechnic Electrical Engineering", isActive: true },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseEntry[]>(DEMO_COURSES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleEdit = (course: CourseEntry) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setCourses(courses.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const handleSave = async (formData: { name: string; isActive: boolean }) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    if (editingCourse) {
      // Update
      setCourses(courses.map(c => 
        c.id === editingCourse.id ? { ...c, ...formData } : c
      ));
    } else {
      // Create
      const newCourse: CourseEntry = {
        id: Math.max(0, ...courses.map(c => c.id)) + 1,
        ...formData
      };
      setCourses([newCourse, ...courses]);
    }
    
    setIsLoading(false);
    return true;
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-slate-50/30">
        <div className="max-w-[1600px] mx-auto">
            <CoursesTable 
                data={courses}
                isLoading={isLoading}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
            />

            <CourseModal 
                isOpen={isModalOpen}
                editData={editingCourse}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            />
        </div>
    </div>
  );
}
