"use client";

import React, { useState } from "react";
import { AdmissionTable } from "@/features/admission/components/AdmissionTable";
import { AdmissionDetailsModal } from "@/features/admission/components/AdmissionDetailsModal";
import { AdmissionForm } from "@/features/admission/types";

// DEMO DATA AS REQUESTED
const DEMO_ADMISSIONS: AdmissionForm[] = [
  {
    id: 1,
    applicationNumber: "BPTPIA/2026/001",
    courseType: "Polytechnic (Diploma)",
    applicantName: "Rahul Kumar",
    fatherName: "Sohan Singh",
    motherName: "Sunita Devi",
    dateOfBirth: "2005-08-15",
    aadharNumber: "1234 5678 9012",
    email: "rahul.kumar@email.com",
    mobileNumber: "9876543210",
    gender: "MALE",
    category: "OBC",
    tenthPercentage: "85.4%",
    twelfthPercentage: "78.2%",
    communicationAddress: "Flat 202, Ganga Tower, Boring Road, Patna - 800001",
    permanentAddress: "Village - Rampur, Post - Gaya City, Bihar - 823001",
    courseApplied: "Diploma in Engineering",
    branchApplied: "Computer Science Engineering",
    examCenter: "Patna (Govt. Polytechnic)",
    idDocumentType: "Aadhar Card",
    paymentStatus: "PAID",
    feeAmount: 515,
    submissionDate: "2026-04-10"
  },
  {
    id: 2,
    applicationNumber: "BPTPIA/2026/002",
    courseType: "Polytechnic (Diploma)",
    applicantName: "Priya Kumari",
    fatherName: "Rajesh Prasad",
    motherName: "Meena Devi",
    dateOfBirth: "2006-02-10",
    aadharNumber: "2345 6789 0123",
    email: "priya.k@email.com",
    mobileNumber: "8765432109",
    gender: "FEMALE",
    category: "GENERAL",
    tenthPercentage: "92.0%",
    communicationAddress: "House No 45, Mithila Colony, Darbhanga - 846004",
    permanentAddress: "House No 45, Mithila Colony, Darbhanga - 846004",
    courseApplied: "Diploma in Engineering",
    branchApplied: "Civil Engineering",
    examCenter: "Darbhanga (CM Science College)",
    idDocumentType: "Aadhar Card",
    paymentStatus: "PENDING",
    feeAmount: 515,
    submissionDate: "2026-04-12"
  },
  {
    id: 3,
    applicationNumber: "BPTPIA/2026/003",
    courseType: "Polytechnic (Diploma)",
    applicantName: "Amit Sharma",
    fatherName: "Vijay Sharma",
    motherName: "Savitri Devi",
    dateOfBirth: "2005-12-25",
    aadharNumber: "3456 7890 1234",
    email: "amit.sharma@email.com",
    mobileNumber: "7654321098",
    gender: "MALE",
    category: "EWS",
    tenthPercentage: "76.5%",
    twelfthPercentage: "82.1%",
    communicationAddress: "Line Par, Mirzapur Road, Gaya - 823001",
    permanentAddress: "Line Par, Mirzapur Road, Gaya - 823001",
    courseApplied: "Diploma in Engineering",
    branchApplied: "Mechanical Engineering",
    examCenter: "Gaya (Gaya College)",
    idDocumentType: "PAN Card",
    paymentStatus: "PAID",
    feeAmount: 515,
    submissionDate: "2026-04-15"
  },
   {
    id: 4,
    applicationNumber: "BPTPIA/2026/003",
    courseType: "Polytechnic (Diploma)",
    applicantName: "Amit Sharma",
    fatherName: "Vijay Sharma",
    motherName: "Savitri Devi",
    dateOfBirth: "2005-12-25",
    aadharNumber: "3456 7890 1234",
    email: "amit.sharma@email.com",
    mobileNumber: "7654321098",
    gender: "MALE",
    category: "EWS",
    tenthPercentage: "76.5%",
    twelfthPercentage: "82.1%",
    communicationAddress: "Line Par, Mirzapur Road, Gaya - 823001",
    permanentAddress: "Line Par, Mirzapur Road, Gaya - 823001",
    courseApplied: "Diploma in Engineering",
    branchApplied: "Mechanical Engineering",
    examCenter: "Gaya (Gaya College)",
    idDocumentType: "PAN Card",
    paymentStatus: "PAID",
    feeAmount: 515,
    submissionDate: "2026-04-15"
  },
   {
    id: 5,
    applicationNumber: "BPTPIA/2026/003",
    courseType: "Polytechnic (Diploma)",
    applicantName: "Amit Sharma",
    fatherName: "Vijay Sharma",
    motherName: "Savitri Devi",
    dateOfBirth: "2005-12-25",
    aadharNumber: "3456 7890 1234",
    email: "amit.sharma@email.com",
    mobileNumber: "7654321098",
    gender: "MALE",
    category: "EWS",
    tenthPercentage: "76.5%",
    twelfthPercentage: "82.1%",
    communicationAddress: "Line Par, Mirzapur Road, Gaya - 823001",
    permanentAddress: "Line Par, Mirzapur Road, Gaya - 823001",
    courseApplied: "Diploma in Engineering",
    branchApplied: "Mechanical Engineering",
    examCenter: "Gaya (Gaya College)",
    idDocumentType: "PAN Card",
    paymentStatus: "PAID",
    feeAmount: 515,
    submissionDate: "2026-04-15"
  },
   {
    id: 6,
    applicationNumber: "BPTPIA/2026/003",
    courseType: "Polytechnic (Diploma)",
    applicantName: "Amit Sharma",
    fatherName: "Vijay Sharma",
    motherName: "Savitri Devi",
    dateOfBirth: "2005-12-25",
    aadharNumber: "3456 7890 1234",
    email: "amit.sharma@email.com",
    mobileNumber: "7654321098",
    gender: "MALE",
    category: "EWS",
    tenthPercentage: "76.5%",
    twelfthPercentage: "82.1%",
    communicationAddress: "Line Par, Mirzapur Road, Gaya - 823001",
    permanentAddress: "Line Par, Mirzapur Road, Gaya - 823001",
    courseApplied: "Diploma in Engineering",
    branchApplied: "Mechanical Engineering",
    examCenter: "Gaya (Gaya College)",
    idDocumentType: "PAN Card",
    paymentStatus: "PAID",
    feeAmount: 515,
    submissionDate: "2026-04-15"
  },

   {
    id: 7,
    applicationNumber: "BPTPIA/2026/003",
    courseType: "Polytechnic (Diploma)",
    applicantName:  "Amit Sharma",
    fatherName: "Vijay Sharma",
    motherName: "Savitri Devi",
    dateOfBirth: "2005-12-25",
    aadharNumber: "3456 7890 1234",
    email: "amit.sharma@email.com",
    mobileNumber: "7654321098",
    gender: "MALE",
    category: "EWS",
    tenthPercentage: "76.5%",
    twelfthPercentage: "82.1%",
    communicationAddress: "Line Par, Mirzapur Road, Gaya - 823001",
    permanentAddress: "Line Par, Mirzapur Road, Gaya - 823001",
    courseApplied: "Diploma in Engineering",
    branchApplied: "Mechanical Engineering",
    examCenter: "Gaya (Gaya College)",
    idDocumentType: "PAN Card",
    paymentStatus: "PAID",
    feeAmount: 515,
    submissionDate: "2026-04-15"
  },
   {
    id: 8,
    applicationNumber: "BPTPIA/2026/003",
    courseType: "Polytechnic (Diploma)",
    applicantName: "Amit Sharma",
    fatherName: "Vijay Sharma",
    motherName: "Savitri Devi",
    dateOfBirth: "2005-12-25",
    aadharNumber: "3456 7890 1234",
    email: "amit.sharma@email.com",
    mobileNumber: "7654321098",
    gender: "MALE",
    category: "EWS",
    tenthPercentage: "76.5%",
    twelfthPercentage: "82.1%",
    communicationAddress: "Line Par, Mirzapur Road, Gaya - 823001",
    permanentAddress: "Line Par, Mirzapur Road, Gaya - 823001",
    courseApplied: "Diploma in Engineering",
    branchApplied: "Mechanical Engineering",
    examCenter: "Gaya (Gaya College)",
    idDocumentType: "PAN Card",
    paymentStatus: "PAID",
    feeAmount: 515,
    submissionDate: "2026-04-15"
  },
   {
    id: 9,
    applicationNumber: "BPTPIA/2026/003",
    courseType: "Polytechnic (Diploma)",
    applicantName: "Amit Sharma",
    fatherName: "Vijay Sharma",
    motherName: "Savitri Devi",
    dateOfBirth: "2005-12-25",
    aadharNumber: "3456 7890 1234",
    email: "amit.sharma@email.com",
    mobileNumber: "7654321098",
    gender: "MALE",
    category: "EWS",
    tenthPercentage: "76.5%",
    twelfthPercentage: "82.1%",
    communicationAddress: "Line Par, Mirzapur Road, Gaya - 823001",
    permanentAddress: "Line Par, Mirzapur Road, Gaya - 823001",
    courseApplied: "Diploma in Engineering",
    branchApplied: "Mechanical Engineering",
    examCenter: "Gaya (Gaya College)",
    idDocumentType: "PAN Card",
    paymentStatus: "PAID",
    feeAmount: 515,
    submissionDate: "2026-04-15"
  }
];

export default function AdmissionFormPage() {
  const [admissions, setAdmissions] = useState<AdmissionForm[]>(DEMO_ADMISSIONS);
  const [selectedForm, setSelectedForm] = useState<AdmissionForm | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleView = (form: AdmissionForm) => {
    setSelectedForm(form);
    setIsDetailsOpen(true);
  };

  const handleEdit = (form: AdmissionForm) => {
    alert("Edit feature for full application is coming soon. Use 'View' to see current data.");
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this admission application? This action cannot be undone.")) {
      setAdmissions(admissions.filter(a => a.id !== id));
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-slate-50/30">
        <div className="max-w-[1600px] mx-auto">
            <AdmissionTable 
                data={admissions}
                isLoading={isLoading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <AdmissionDetailsModal 
                isOpen={isDetailsOpen}
                data={selectedForm}
                onClose={() => setIsDetailsOpen(false)}
            />
        </div>
    </div>
  );
}
