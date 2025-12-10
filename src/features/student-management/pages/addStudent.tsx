import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// RTK Query
import {
  useAddStudentMutation,
  useCheckStudentBySerialNoQuery,
} from "../studentApi";
import toast from "react-hot-toast";

const initialFormData = {
  serialNumber: "",
  admissionNumber: "",
  rollNumber: "",
  name: "",
  fatherName: "",
  gender: "",
  dateOfBirth: "",
  fatherCNIC: "",
  address: "",
  fatherPhoneNo: "",
  emergencyContact: "",
  email: "",
  studentClass: "",
  section: "",
  sessionYear: "",
  admissionDate: "",
  previousSchool: "",
  feeAmount: "",
  admissionFee: "",
  transportFee: "",
  scholarship: "",
};

const AddStudent = () => {
  const [formData, setFormData] = useState(initialFormData);

  const {
    serialNumber,
    admissionNumber,
    rollNumber,
    name,
    fatherName,
    gender,
    dateOfBirth,
    fatherCNIC,
    address,
    fatherPhoneNo,
    emergencyContact,
    email,
    studentClass,
    section,
    sessionYear,
    admissionDate,
    previousSchool,
    feeAmount,
    admissionFee,
    transportFee,
    scholarship,
  } = formData;

  const {
    data: checkStdBySerial,
    isLoading: isCheckingSerial,
    isError: isSerialError,
  } = useCheckStudentBySerialNoQuery(serialNumber, {
    skip: !serialNumber,
  });

  const [addStudent, { isLoading: isSubmitting }] = useAddStudentMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (checkStdBySerial && checkStdBySerial.status === false) {
      alert("Serial number already exists. Please use a different one.");
      return;
    }

    try {
      const payload = {
        serialNumber,
        admissionNumber,
        rollNumber,
        email,
        password: email,
        name,
        fatherName,
        gender,
        dateOfBirth,
        fatherCNIC,
        fatherPhoneNo,
        emergencyContact,
        address,
        feeAmount: Number(feeAmount) || 0,
        class: studentClass,
        section,
        addmissionDate: admissionDate,
        sessionYear,
        previousSchool,
        addmissionFee: Number(admissionFee) || 0,
        transportFee: Number(transportFee) || 0,
        scholarship
      };

      const response = await addStudent(payload).unwrap();
      toast.success(response.msg);
      setFormData(initialFormData);
      console.log("Student created successfully");
    } catch (error: any) {
      toast.error(error?.data?.msg || "Error creating student");
      console.log("Error creating student:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h1 className="text-2xl font-semibold mb-6">Add New Student</h1>

      <div className="rounded-2xl max-w-6xl mx-auto border border-gray-100 bg-white p-6 md:p-8 space-y-8 shadow-sm">
        {/* Basic Information */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold pb-2">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Serial Number */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">Serial Number</p>
              <Input
                name="serialNumber"
                placeholder="Enter serial number"
                value={serialNumber}
                onChange={handleChange}
              />

              {/* Status message */}
              {serialNumber && (
                <p className="text-[11px] mt-1">
                  {isCheckingSerial && (
                    <span className="text-gray-500">Checking...</span>
                  )}

                  {!isCheckingSerial && isSerialError && (
                    <span className="text-red-500">
                      Something went wrong while checking
                    </span>
                  )}

                  {!isCheckingSerial && !isSerialError && checkStdBySerial && (
                    <span
                      className={
                        checkStdBySerial.status
                          ? "text-emerald-600"
                          : "text-red-500"
                      }
                    >
                      {checkStdBySerial.msg}
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Admission Number */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">
                Admission Number
              </p>
              <Input
                name="admissionNumber"
                placeholder="Enter admission number"
                value={admissionNumber}
                onChange={handleChange}
              />
            </div>

            {/* Roll Number */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">Roll Number</p>
              <Input
                name="rollNumber"
                placeholder="Enter roll number"
                value={rollNumber}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* Personal Information */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold pb-2">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">
                Student Name <span className="text-red-500">*</span>
              </p>
              <Input
                name="name"
                placeholder="Enter student name"
                value={name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">
                Father Name <span className="text-red-500">*</span>
              </p>
              <Input
                name="fatherName"
                placeholder="Enter father name"
                value={fatherName}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">
                Gender <span className="text-red-500">*</span>
              </p>
              <select
                name="gender"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">Date of Birth</p>
              <Input
                type="date"
                name="dateOfBirth"
                value={dateOfBirth}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-emerald-700 border-b border-emerald-100 pb-2">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">Father Contact</p>
              <Input
                name="fatherPhoneNo"
                placeholder="03XXXXXXXXX"
                value={fatherPhoneNo}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">
                Emergency Contact
              </p>
              <Input
                name="emergencyContact"
                placeholder="03XXXXXXXXX"
                value={emergencyContact}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">Email Address</p>
              <Input
                type="email"
                name="email"
                placeholder="student@taleem.com"
                value={email}
                onChange={handleChange}
              />
              {
                email &&(
                   <p className="text-xs text-blue-600">This email be used as password for the student</p>
                )
              }
             
            </div>
          </div>
        </section>

        {/* Account & Identification */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-emerald-700 border-b border-emerald-100 pb-2">
            Account & Identification
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">Father CNIC</p>
              <Input
                name="fatherCNIC"
                placeholder="35201XXXXXXXXX"
                value={fatherCNIC}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">Address</p>
              <Input
                name="address"
                placeholder="Home address"
                value={address}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1" />
          </div>
        </section>

        {/* Class & Session Information */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-emerald-700 border-b border-emerald-100 pb-2">
            Academic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">Class</p>
              <select
                name="studentClass"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 max-h-40 overflow-y-auto"
                value={studentClass}
                onChange={handleChange}
              >
                <option value="">Select Class</option>
                <option value="Nursery">Nursery</option>
                <option value="KG">KG</option>
                <option value="1st">1st</option>
                <option value="2nd">2nd</option>
                <option value="3rd">3rd</option>
                <option value="4th">4th</option>
                <option value="5th">5th</option>
                <option value="6th">6th</option>
                <option value="7th">7th</option>
                <option value="8th">8th</option>
                <option value="9th">9th</option>
                <option value="10th">10th</option>
                <option value="11th">11th</option>
                <option value="12th">12th</option>
              </select>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">Section</p>
              <select
                name="section"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 max-h-40 overflow-y-auto"
                value={section}
                onChange={handleChange}
              >
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="D">E</option>
                <option value="D">F</option>
                <option value="D">G</option>
                <option value="D">H</option>
              </select>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">Session Year</p>
              <Input
                name="sessionYear"
                placeholder="2023-2024"
                value={sessionYear}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">
                Admission Date
              </p>
              <Input
                type="date"
                name="admissionDate"
                value={admissionDate}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">
                Previous School
              </p>
              <Input
                name="previousSchool"
                placeholder="Previous school name"
                value={previousSchool}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1" />
          </div>
        </section>

        {/* Fee & Scholarship */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-emerald-700 border-b border-emerald-100 pb-2">
            Fee & Scholarship
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">
                Monthly Fee Amount
              </p>
              <Input
                type="number"
                name="feeAmount"
                placeholder="5000"
                value={feeAmount}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">Admission Fee</p>
              <Input
                type="number"
                name="admissionFee"
                placeholder="10000"
                value={admissionFee}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">Transport Fee</p>
              <Input
                type="number"
                name="transportFee"
                placeholder="2000"
                value={transportFee}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1 md:col-span-1">
              <p className="text-xs font-medium text-gray-600">Scholarship</p>
              <select
                name="scholarship"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={scholarship}
                onChange={handleChange}
              >
                <option value="">Select Scholarship</option>
                <option value="None">None</option>
                <option value="Half">Half</option>
                <option value="Full">Full</option>
              </select>
            </div>
            <div className="space-y-1" />
            <div className="space-y-1" />
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            className="cursor-pointer"
            disabled={isSubmitting || (checkStdBySerial && checkStdBySerial.status === false)}
          >
            {isSubmitting && (
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {isSubmitting ? "Saving..." : "Save Student"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddStudent;
