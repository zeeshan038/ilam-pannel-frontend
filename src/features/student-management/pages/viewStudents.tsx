import { Table } from "antd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useDeleteStudentMutation, useGetAllStudentsQuery, useGetSpecificStudentQuery, useUpdateStudentMutation } from "../studentApi";
import { DeleteButton, EditButton, ViewButton } from "@/components/icons/action";
import toast from "react-hot-toast";

const ViewStudents = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [sessionYearFilter, setSessionYearFilter] = useState("");
  const [scholarshipFilter, setScholarshipFilter] = useState("");
  const [feeStatusFilter, setFeeStatusFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
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
  });

  const handleClearFilters = () => {
    setClassFilter("");
    setSectionFilter("");
    setSessionYearFilter("");
    setScholarshipFilter("");
    setFeeStatusFilter("");
    setGenderFilter("");
  };

  const { data: allStudents, isError: isStudentsError, isLoading: isStudentsLoading } = useGetAllStudentsQuery({
    page: 1,
    limit: 10,
    search,
    class: classFilter,
    section: sectionFilter,
    sessionYear: sessionYearFilter,
    scholarship: scholarshipFilter,
    feeStatus: feeStatusFilter,
    gender: genderFilter,
  });

  const {
    data: specificStudent,
    isLoading: isStudentLoading,
    isError: isStudentError,
  } = useGetSpecificStudentQuery(selectedStudentId as string, {
    skip: !selectedStudentId,
  });

  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenEdit = (id: string) => {
    setSelectedStudentId(id);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedStudentId) return;
    try {
      const body = {
        serialNumber: editForm.serialNumber,
        admissionNumber: editForm.admissionNumber,
        rollNumber: editForm.rollNumber,
        email: editForm.email,
        name: editForm.name,
        fatherName: editForm.fatherName,
        gender: editForm.gender,
        dateOfBirth: editForm.dateOfBirth,
        fatherCNIC: editForm.fatherCNIC,
        fatherPhoneNo: editForm.fatherPhoneNo,
        emergencyContact: editForm.emergencyContact,
        address: editForm.address,
        feeAmount: Number(editForm.feeAmount) || 0,
        class: editForm.studentClass,
        section: editForm.section,
        addmissionDate: editForm.admissionDate,
        sessionYear: editForm.sessionYear,
        previousSchool: editForm.previousSchool,
        addmissionFee: Number(editForm.admissionFee) || 0,
        transportFee: Number(editForm.transportFee) || 0,
        scholarship: editForm.scholarship,
      } as any;
      const res: any = await updateStudent({ studentId: selectedStudentId, body }).unwrap();
      toast.success(res?.msg || "Student updated successfully");
      setIsEditModalOpen(false);
    } catch (error: any) {
      const message = error?.data?.msg || error?.message || "Failed to update student";
      toast.error(message);
    }
  };

  useEffect(() => {
    if (!isEditModalOpen || !specificStudent) return;
    const stu: any = (specificStudent as any).student || specificStudent;
    setEditForm({
      serialNumber: stu.serialNumber || "",
      admissionNumber: stu.admissionNumber || "",
      rollNumber: stu.rollNumber || "",
      name: stu.name || "",
      fatherName: stu.fatherName || "",
      gender: stu.gender || "",
      dateOfBirth: stu.dateOfBirth ? new Date(stu.dateOfBirth).toISOString().slice(0, 10) : "",
      fatherCNIC: stu.fatherCNIC || "",
      address: stu.address || "",
      fatherPhoneNo: stu.fatherPhoneNo || "",
      emergencyContact: stu.emergencyContact || "",
      email: stu.email || "",
      studentClass: stu.class || "",
      section: stu.section || "",
      sessionYear: stu.sessionYear || "",
      admissionDate: stu.addmissionDate ? new Date(stu.addmissionDate).toISOString().slice(0, 10) : "",
      previousSchool: stu.previousSchool || "",
      feeAmount: (stu.feeAmount ?? "").toString(),
      admissionFee: (stu.addmissionFee ?? "").toString(),
      transportFee: (stu.transportFee ?? "").toString(),
      scholarship: stu.scholarship || "",
    });
  }, [isEditModalOpen, specificStudent]);

  const handleDelete = async () => {
    if (!deleteTargetId) return;

    try {
      const response: any = await deleteStudent(deleteTargetId).unwrap();
      toast.success(response?.msg || "Student deleted successfully");

      setIsDeleteModalOpen(false);
      setDeleteTargetId(null);

      // If details modal was open for this student, close it
      if (selectedStudentId === deleteTargetId) {
        setSelectedStudentId(null);
        setIsModalOpen(false);
      }
    } catch (error: any) {
      const message = error?.data?.msg || error?.message || "Failed to delete student";
      toast.error(message);
    }
  };

  const columns = [
    {
      title: "SNo ",
      dataIndex: "serialNumber",
      key: "serialNumber",
    },
    {
      title: "Admission No",
      dataIndex: "admissionNumber",
      key: "admissionNumber",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Roll Number",
      dataIndex: "rollNumber",
      key: "rollNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Father Name",
      dataIndex: "fatherName",
      key: "fatherName",
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
    },
    {
      title: "Section",
      dataIndex: "section",
      key: "section",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Father CNIC",
      dataIndex: "fatherCNIC",
      key: "fatherCNIC",
    },
    {
      title: "Father Phone No",
      dataIndex: "fatherPhoneNo",
      key: "fatherPhoneNo",
    },

    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Fee Amount",
      dataIndex: "feeAmount",
      key: "feeAmount",
    },

    {
      title: "Session Year",
      dataIndex: "sessionYear",
      key: "sessionYear",
    },
    {
      title: "Previous School",
      dataIndex: "previousSchool",
      key: "previousSchool",
    },
    {
      title: "Admission Fee",
      dataIndex: "addmissionFee",
      key: "addmissionFee",
    },
    {
      title: "Transport Fee",
      dataIndex: "transportFee",
      key: "transportFee",
    },
    {
      title: "Scholarship",
      dataIndex: "scholarship",
      key: "scholarship",
    },
    {
      title: "Fee Status",
      dataIndex: "feeStatus",
      key: "feeStatus",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      width: 160,
      render: (_: any, record: any) => (
        <div className="flex gap-2 justify-end">
          {/* View icon button */}
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 cursor-pointer p-0 text-gray-800 border-gray-300"
            onClick={() => {
              setSelectedStudentId(record.key);
              setIsModalOpen(true);
            }}
          >
            <ViewButton />
          </Button>

          {/* Update icon button*/}
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 cursor-pointer p-0 text-gray-800 border-gray-300"
            onClick={() => handleOpenEdit(record.key)}
          >
            <EditButton />
          </Button>
          {/* Delete icon button */}
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 cursor-pointer p-0 text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => {
              setDeleteTargetId(record.key);
              setIsDeleteModalOpen(true);
            }}
          >
            <DeleteButton />
          </Button>
        </div>
      ),
    },
  ];

  // Map API data to Antd table format
  const tableData =
    allStudents?.students?.map((stu: any) => ({
      key: stu._id,
      serialNumber: stu.serialNumber,
      name: stu.name,
      admissionNumber: stu.admissionNumber,
      rollNumber: stu.rollNumber,
      class: stu.class,
      section: stu.section,
      fatherName: stu.fatherName,
      fatherCNIC: stu.fatherCNIC,
      fatherPhoneNo: stu.fatherPhoneNo,
      gender: stu.gender,
      dateOfBirth: stu.dateOfBirth,
      address: stu.address,
      email: stu.email,
      feeAmount: stu.feeAmount,
      sessionYear: stu.sessionYear,
      previousSchool: stu.previousSchool,
      addmissionFee: stu.addmissionFee,
      transportFee: stu.transportFee,
      scholarship: stu.scholarship,
      feeStatus: stu.feeStatus,
      role: stu.role,
    })) || [];

  const totalStudents = allStudents?.pagination?.total ?? 0;

  return (
    <div>
      {/* Top bar */}
      <div className="flex justify-end item-center gap-2 flex-col md:flex-row">
        <Input
          placeholder="Search name"
          className="md:w-[200px] w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex items-center justify-between flex-col md:flex-row gap-2 ">
          <Button
            className="cursor-pointer w-full md:w-[120px]"
            onClick={() => setIsFilterOpen((prev) => !prev)}
          >
            {isFilterOpen ? "Hide Filters" : "Filters"}
          </Button>
          <h1 className="bg-gray-100 px-2 py-[7px] rounded border w-full md:w-[200px] text-center">
            Total Students - {totalStudents}
          </h1>
        </div>
      </div>

      {/* Filters panel (slide-down with smooth transition) */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isFilterOpen ? "max-h-80 mt-4 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="p-4 border rounded-md bg-gray-50">
          <div className="flex justify-end mb-3">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handleClearFilters}
            >
              Clear filters
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-h-56 overflow-y-auto pr-1">
            {/* Class (datalist: Nursery, KG, 1-12, custom allowed) */}
            <div>
              <Input
                className="w-full"
                placeholder="Class"
                list="classOptions"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
              />
              <datalist id="classOptions">
                <option value="Nursery" />
                <option value="KG" />
                <option value="1" />
                <option value="2" />
                <option value="3" />
                <option value="4" />
                <option value="5" />
                <option value="6" />
                <option value="7" />
                <option value="8" />
                <option value="9" />
                <option value="10" />
                <option value="11" />
                <option value="12" />
              </datalist>
            </div>

            {/* Section (datalist: A-Z, custom allowed) */}
            <div>
              <Input
                className="w-full"
                placeholder="Section"
                list="sectionOptions"
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
              />
              <datalist id="sectionOptions">
                <option value="A" />
                <option value="B" />
                <option value="C" />
                <option value="D" />
                <option value="E" />
                <option value="F" />
                <option value="G" />
                <option value="H" />
                <option value="I" />
                <option value="J" />
                <option value="K" />
                <option value="L" />
                <option value="M" />
                <option value="N" />
                <option value="O" />
                <option value="P" />
                <option value="Q" />
                <option value="R" />
                <option value="S" />
                <option value="T" />
                <option value="U" />
                <option value="V" />
                <option value="W" />
                <option value="X" />
                <option value="Y" />
                <option value="Z" />
              </datalist>
            </div>

            {/* Session Year dropdown */}
            <div>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm outline-none"
                value={sessionYearFilter}
                onChange={(e) => setSessionYearFilter(e.target.value)}
              >
                <option value="">All Session Years</option>
                <option value="2022-2023">2022-2023</option>
                <option value="2023-2024">2023-2024</option>
                <option value="2024-2025">2024-2025</option>
              </select>
            </div>

            {/* Scholarship dropdown */}
            <div>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm outline-none"
                value={scholarshipFilter}
                onChange={(e) => setScholarshipFilter(e.target.value)}
              >
                <option value="">All Scholarships</option>
                <option value="None">None</option>
                <option value="Half">Half</option>
                <option value="Full">Full</option>
              </select>
            </div>

            {/* Fee Status dropdown */}
            <div>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm outline-none"
                value={feeStatusFilter}
                onChange={(e) => setFeeStatusFilter(e.target.value)}
              >
                <option value="">All Fee Status</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="partial">Partial</option>
              </select>
            </div>

            {/* Gender dropdown */}
            <div>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm outline-none"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6">
        <Table
          columns={columns}
          dataSource={tableData}
          loading={isStudentsLoading}
          rowKey="key"
          scroll={{ x: "max-content" }}
        />
        {isStudentsError && <p className="text-red-500 mt-2">Failed to load students.</p>}
      </div>

      {/* Student detail modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl mx-4 p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Student Details</h2>
              <button
                type="button"
                className="text-sm cursor-pointer text-gray-500 hover:text-gray-800"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedStudentId(null);
                }}
              >
                Close
              </button>
            </div>

            {isStudentLoading && (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-4/6" />
                <div className="h-4 bg-gray-200 rounded w-3/6" />
              </div>
            )}

            {!isStudentLoading && isStudentError && (
              <p className="text-red-500 text-sm">Failed to load student details.</p>
            )}

            {!isStudentLoading && !isStudentError && specificStudent && (
              <div className="space-y-4 text-sm max-h-[70vh] overflow-y-auto pr-1 border border-gray-100 rounded-lg">
                {(() => {
                  const stu: any = (specificStudent as any).student || specificStudent;
                  return (
                    <>
                      {/* Personal Information */}
                      <section>
                        <div className="bg-gray-100 px-4 py-2 rounded-t-lg border-b border-gray-200">
                          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            Personal Information
                          </h3>
                        </div>
                        <div className="px-4 py-3 bg-white grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                          <div className="flex justify-between sm:block">
                            <p className="text-xs text-gray-500">Student Name</p>
                            <p className="font-medium text-gray-800">{stu.name}</p>
                          </div>
                          <div className="flex justify-between sm:block">
                            <p className="text-xs text-gray-500">Father Name</p>
                            <p className="font-medium text-gray-800">{stu.fatherName}</p>
                          </div>
                          <div className="flex justify-between sm:block">
                            <p className="text-xs text-gray-500">Gender</p>
                            <p className="font-medium text-gray-800">{stu.gender}</p>
                          </div>
                          <div className="flex justify-between sm:block">
                            <p className="text-xs text-gray-500">Date of Birth</p>
                            <p className="font-medium text-gray-800">
                              {stu.dateOfBirth && new Date(stu.dateOfBirth).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </section>

                      {/* Contact & Identification */}
                      <section className="border-t border-gray-100">
                        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            Contact &amp; Identification
                          </h3>
                        </div>
                        <div className="px-4 py-3 bg-white grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                          <div className="flex justify-between sm:block">
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="font-medium text-gray-800 break-all">{stu.email}</p>
                          </div>
                          <div className="flex justify-between sm:block">
                            <p className="text-xs text-gray-500">Father CNIC</p>
                            <p className="font-medium text-gray-800">{stu.fatherCNIC}</p>
                          </div>
                          <div className="flex justify-between sm:block">
                            <p className="text-xs text-gray-500">Father Phone</p>
                            <p className="font-medium text-gray-800">{stu.fatherPhoneNo}</p>
                          </div>
                          <div className="flex justify-between sm:block">
                            <p className="text-xs text-gray-500">Emergency Contact</p>
                            <p className="font-medium text-gray-800">{stu.emergencyContact}</p>
                          </div>
                          <div className="sm:col-span-2 flex justify-between sm:block">
                            <p className="text-xs text-gray-500">Address</p>
                            <p className="font-medium text-gray-800">{stu.address}</p>
                          </div>
                        </div>
                      </section>

                      {/* Academic Information */}
                      <section className="border-t border-gray-100">
                        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            Academic Information
                          </h3>
                        </div>
                        <div className="px-4 py-3 bg-white grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                          <div className="flex justify-between sm:block">
                            <p className="text-xs text-gray-500">Serial Number</p>
                            <p className="font-medium text-gray-800">{stu.serialNumber}</p>
                          </div>
                          {stu.admissionNumber && (
                            <div className="flex justify-between sm:block">
                              <p className="text-xs text-gray-500">Admission Number</p>
                              <p className="font-medium text-gray-800">{stu.admissionNumber}</p>
                            </div>
                          )}
                          <div className="flex justify-between sm:block">
                            <p className="text-xs text-gray-500">Roll Number</p>
                            <p className="font-medium text-gray-800">{stu.rollNumber}</p>
                          </div>
                          <div className="flex justify-between sm:block">
                            <p className="text-xs text-gray-500">Class / Section</p>
                            <p className="font-medium text-gray-800">{stu.class} {stu.section}</p>
                          </div>
                          <div className="flex justify-between sm:block">
                            <p className="text-xs text-gray-500">Session Year</p>
                            <p className="font-medium text-gray-800">{stu.sessionYear}</p>
                          </div>
                          <div className="flex justify-between sm:block">
                            <p className="text-xs text-gray-500">Admission Date</p>
                            <p className="font-medium text-gray-800">
                              {stu.addmissionDate && new Date(stu.addmissionDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="sm:col-span-2 flex justify-between sm:block">
                            <p className="text-xs text-gray-500">Previous School</p>
                            <p className="font-medium text-gray-800">{stu.previousSchool}</p>
                          </div>
                        </div>
                      </section>

                      {/* Fee & Scholarship */}
                      <section className="border-t border-gray-100">
                        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            Fee &amp; Scholarship
                          </h3>
                        </div>
                        <div className="px-4 py-3 bg-white grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                          <div className="flex justify-between sm:block">
                            <p className="text-xs text-gray-500">Monthly Fee Amount</p>
                            <p className="font-medium text-gray-800">{stu.feeAmount}</p>
                          </div>
                          <div className="flex justify-between sm:block">
                            <p className="text-xs text-gray-500">Admission Fee</p>
                            <p className="font-medium text-gray-800">{stu.addmissionFee}</p>
                          </div>
                          <div className="flex justify-between sm:block">
                            <p className="text-xs text-gray-500">Transport Fee</p>
                            <p className="font-medium text-gray-800">{stu.transportFee}</p>
                          </div>
                          <div className="flex justify-between sm:block">
                            <p className="text-xs text-gray-500">Scholarship</p>
                            <p className="font-medium text-gray-800">{stu.scholarship || "None"}</p>
                          </div>
                          <div className="sm:col-span-2 flex justify-between sm:block">
                            <p className="text-xs text-gray-500">Fee Status</p>
                            <p className="font-medium text-gray-800">{stu.feeStatus}</p>
                          </div>
                        </div>
                      </section>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm mx-4 p-6">
            <h2 className="text-base font-semibold mb-2">Delete Student</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this student? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteTargetId(null);
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="cursor-pointer bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl mx-4 p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit Student</h2>
              <button
                type="button"
                className="text-sm cursor-pointer text-gray-500 hover:text-gray-800"
                onClick={() => setIsEditModalOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
              <section className="space-y-4">
                <h3 className="text-sm font-semibold">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Serial Number</p>
                    <Input name="serialNumber" value={editForm.serialNumber} onChange={handleEditChange} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Admission Number</p>
                    <Input name="admissionNumber" value={editForm.admissionNumber} onChange={handleEditChange} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Roll Number</p>
                    <Input name="rollNumber" value={editForm.rollNumber} onChange={handleEditChange} />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Student Name</p>
                    <Input name="name" value={editForm.name} onChange={handleEditChange} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Father Name</p>
                    <Input name="fatherName" value={editForm.fatherName} onChange={handleEditChange} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Gender</p>
                    <select
                      name="gender"
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                      value={editForm.gender}
                      onChange={handleEditChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Date of Birth</p>
                    <Input type="date" name="dateOfBirth" value={editForm.dateOfBirth} onChange={handleEditChange} />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Father Contact</p>
                    <Input name="fatherPhoneNo" value={editForm.fatherPhoneNo} onChange={handleEditChange} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Emergency Contact</p>
                    <Input name="emergencyContact" value={editForm.emergencyContact} onChange={handleEditChange} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Email Address</p>
                    <Input type="email" name="email" value={editForm.email} onChange={handleEditChange} />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold">Academic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Class</p>
                    <select
                      name="studentClass"
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                      value={editForm.studentClass}
                      onChange={handleEditChange}
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
                  <div>
                    <p className="text-xs text-gray-600">Section</p>
                    <select
                      name="section"
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                      value={editForm.section}
                      onChange={handleEditChange}
                    >
                      <option value="">Select Section</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="E">E</option>
                      <option value="F">F</option>
                      <option value="G">G</option>
                      <option value="H">H</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Session Year</p>
                    <Input name="sessionYear" value={editForm.sessionYear} onChange={handleEditChange} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Admission Date</p>
                    <Input type="date" name="admissionDate" value={editForm.admissionDate} onChange={handleEditChange} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Previous School</p>
                    <Input name="previousSchool" value={editForm.previousSchool} onChange={handleEditChange} />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold">Fee & Scholarship</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Monthly Fee Amount</p>
                    <Input type="number" name="feeAmount" value={editForm.feeAmount} onChange={handleEditChange} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Admission Fee</p>
                    <Input type="number" name="admissionFee" value={editForm.admissionFee} onChange={handleEditChange} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Transport Fee</p>
                    <Input type="number" name="transportFee" value={editForm.transportFee} onChange={handleEditChange} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Scholarship</p>
                    <select
                      name="scholarship"
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                      value={editForm.scholarship}
                      onChange={handleEditChange}
                    >
                      <option value="">Select Scholarship</option>
                      <option value="None">None</option>
                      <option value="Half">Half</option>
                      <option value="Full">Full</option>
                    </select>
                  </div>
                </div>
              </section>

              <div className="flex justify-end gap-2">
                <Button variant="outline" className="cursor-pointer" onClick={() => setIsEditModalOpen(false)} disabled={isUpdating}>
                  Cancel
                </Button>
                <Button className="cursor-pointer" onClick={handleUpdate} disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Student"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ViewStudents;
