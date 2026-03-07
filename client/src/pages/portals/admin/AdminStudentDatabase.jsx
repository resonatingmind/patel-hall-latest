import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MdArrowBack,
  MdSearch,
  MdPerson,
  MdRoom,
  MdSchool,
  MdAdd,
  MdUploadFile,
  MdClose,
  MdEdit,
  MdDelete,
  MdLockReset,
} from "react-icons/md";
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabaseClient';
import axios from 'axios';
import { toast } from 'sonner';

const AdminStudentDatabase = () => {
  const { user } = useAuth();

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  const [allStudents, setAllStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    block: 'All',
    dept: 'All',
    batch: 'All',
    search: ''
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    rollNumber: '',
    email: '',
    department: 'CS',
    block: 'A',
    roomNumber: '',
    joiningYear: new Date().getFullYear().toString()
  });

  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    department: 'CS',
    block: 'A',
    roomNumber: '',
    joiningYear: new Date().getFullYear().toString()
  });

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [csvFile, setCsvFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  const blocks = ['All', 'A', 'B', 'C', 'D'];
  const allDepartments = ['CS', 'EC', 'EE', 'ME', 'CH', 'CE', 'AE', 'IM', 'IE', 'NA', 'AG', 'MI', 'MT', 'BT', 'MF', 'AR', 'MA', 'PH', 'CY', 'HS', 'GG', 'EX'];
  const departments = ['All', ...allDepartments.sort()];

  const currentYear = new Date().getFullYear();
  const batchYears = Array.from({ length: 9 }, (_, i) => (currentYear - i).toString());
  const batches = ['All', ...batchYears];

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchStudents();
  }, []);

  useEffect(() => {
    if (isAddModalOpen || isImportModalOpen || isEditModalOpen || isDeleteModalOpen || isResetPasswordModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isAddModalOpen, isImportModalOpen, isEditModalOpen, isDeleteModalOpen, isResetPasswordModalOpen]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const currentToken = await getToken();
      if (!currentToken) {
        setError("You must be logged in as Admin.");
        setIsLoading(false);
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/students`,
        {
          headers: { Authorization: `Bearer ${currentToken}` }
        }
      );
      setAllStudents(response.data);
      setStudents(response.data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Failed to load students database.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    let filtered = allStudents;

    if (filters.block !== 'All') {
      filtered = filtered.filter(student => student.block === filters.block);
    }

    if (filters.dept !== 'All') {
      filtered = filtered.filter(student => student.department === filters.dept);
    }

    if (filters.batch !== 'All') {
      filtered = filtered.filter(student => String(student.joiningYear) === filters.batch);
    }

    if (filters.search) {
      filtered = filtered.filter(student =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(filters.search.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        student.roomNumber.toString().includes(filters.search.toLowerCase())
      );
    }

    setStudents(filtered);
  }, [filters, allStudents]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.endsWith('@kgpian.iitkgp.ac.in')) {
      toast.error('Only @kgpian.iitkgp.ac.in emails are allowed.');
      return;
    }

    setAdding(true);
    try {
      const currentToken = await getToken();
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/students/create`,
        formData,
        {
          headers: { Authorization: `Bearer ${currentToken}` }
        }
      );
      setIsAddModalOpen(false);
      setFormData({
        firstName: '',
        lastName: '',
        rollNumber: '',
        email: '',
        department: 'CS',
        block: 'A',
        roomNumber: '',
        joiningYear: new Date().getFullYear().toString()
      });
      fetchStudents();
      toast.success("Student added successfully.");
    } catch (err) {
      console.error(err);
      toast.error(`Failed to add student: ${err.response?.data?.message || err.message}`);
    } finally {
      setAdding(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!csvFile) return toast.error("Please select a CSV file.");

    setImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());

        const studentsToImport = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(',').map(v => v.trim());
          const student = {};
          headers.forEach((h, index) => {
            student[h] = values[index];
          });

          if (student.firstName && student.email && student.rollNumber) {
            studentsToImport.push({
              firstName: student.firstName,
              lastName: student.lastName || '',
              email: student.email,
              rollNumber: student.rollNumber,
              department: student.department || 'CS',
              block: student.block || 'A',
              roomNumber: parseInt(student.roomNumber) || 101,
              joiningYear: parseInt(student.joiningYear) || new Date().getFullYear()
            });
          }
        }

        if (studentsToImport.length === 0) {
          throw new Error("No valid students found in CSV. Please check format.");
        }

        const currentToken = await getToken();
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/students/bulk-create`,
          { students: studentsToImport },
          {
            headers: { Authorization: `Bearer ${currentToken}` }
          }
        );

        toast.success(`Import complete: ${res.data.successCount} added, ${res.data.failedCount} failed.`);
        setIsImportModalOpen(false);
        setCsvFile(null);
        fetchStudents();
      } catch (err) {
        console.error(err);
        toast.error(`Import failed: ${err.response?.data?.message || err.message}`);
      } finally {
        setImporting(false);
      }
    };
    reader.readAsText(csvFile);
  };

  const handleOpenEdit = (student) => {
    setSelectedStudent(student);
    setEditFormData({
      firstName: student.firstName || '',
      lastName: student.lastName || '',
      department: student.department || 'CS',
      block: student.block || 'A',
      roomNumber: student.roomNumber?.toString() || '',
      joiningYear: student.joiningYear?.toString() || new Date().getFullYear().toString()
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setUpdating(true);
    try {
      const currentToken = await getToken();
      await axios.put(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/students/${selectedStudent.id}`,
        {
          firstName: editFormData.firstName,
          lastName: editFormData.lastName,
          department: editFormData.department,
          block: editFormData.block,
          roomNumber: editFormData.roomNumber,
          joiningYear: editFormData.joiningYear,
        },
        {
          headers: { Authorization: `Bearer ${currentToken}` }
        }
      );
      toast.success("Student updated successfully.");
      setIsEditModalOpen(false);
      setSelectedStudent(null);
      fetchStudents();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update student: ${err.response?.data?.message || err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenDelete = (student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;

    setDeleting(true);
    try {
      const currentToken = await getToken();
      await axios.delete(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/students/${selectedStudent.id}`,
        {
          headers: { Authorization: `Bearer ${currentToken}` }
        }
      );
      toast.success("Student deleted successfully.");
      setIsDeleteModalOpen(false);
      setSelectedStudent(null);
      fetchStudents();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to delete student: ${err.response?.data?.message || err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenResetPassword = (student) => {
    setSelectedStudent(student);
    setIsResetPasswordModalOpen(true);
  };

  const handleResetPasswordConfirm = async () => {
    if (!selectedStudent) return;

    setResettingPassword(true);
    try {
      const currentToken = await getToken();
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/students/${selectedStudent.id}/reset-password`,
        {},
        {
          headers: { Authorization: `Bearer ${currentToken}` }
        }
      );
      toast.success("Password reset to student's roll number.");
      setIsResetPasswordModalOpen(false);
      setSelectedStudent(null);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to reset password: ${err.response?.data?.message || err.message}`);
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <div className="bg-ivory text-[#2d1a1a] font-display overflow-x-hidden min-h-screen flex flex-col transition-colors duration-300 pt-10">
      {/* Header Section */}
      <section className="relative w-full">
        <div className="flex flex-col w-full">
          <div className="w-full">
            <div className="flex flex-col w-full">
              <div className="@container">
                <div className="relative flex min-h-[350px] flex-col items-center justify-center overflow-hidden p-6 text-center shadow-2xl w-full">
                  <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-xs scale-110"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(74, 0, 0, 0.85) 0%, rgba(16, 22, 34, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCZ_AOtFhZRsAj-qahqn3QKkG8gccl-CNDhqYVLnebmMCt4_PP-td1cAcidBbiOXkWu_h7OMU7kzgkImTqVC8zZP8d_T_87XpaCyxy2Tl7TFHFpRaAg1wuOWYGtHbQf8mF87r1IYMPUFmssSqGfTgZr6RhAyd2QZ1PrmE-wmGM6y-M6bsd1GQS6ddpMDtN7vDyJ6AZgQHFexef8fTL3h9tudRzRQfk76Tuc9ThWRHem9q0Q18vw7ONV3ygPuOEyKWOjQjaxwEwjup4")'
                    }}
                  ></div>
                  <div className="flex flex-col gap-4 relative z-10 max-w-4xl mx-auto px-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Link
                        to="/portal"
                        className="flex items-center gap-1 text-gold/80 hover:text-gold transition-colors text-sm font-bold uppercase tracking-widest"
                      >
                        <MdArrowBack /> Back to Portal
                      </Link>
                    </div>
                    <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-serif font-black leading-tight tracking-[-0.05em] uppercase drop-shadow-lg">
                      STUDENT DATABASE
                    </h1>
                    <h2 className="text-gold text-base md:text-lg font-medium tracking-widest uppercase font-serif">
                      Manage Hall Residents | Admin Portal
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-20 px-4 md:px-20 lg:px-40 flex justify-center relative z-20">
        <div className="max-w-[1200px] w-full bg-white rounded-xl shadow-2xl overflow-hidden border-t-4 border-gold">
          <div className="p-6 md:p-8 bg-gray-50 border-b border-gray-100 flex flex-col gap-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="text-primary text-2xl font-serif font-bold flex items-center gap-2">
                  <MdSchool className="text-gold" /> Student Directory
                </h3>
                <p className="text-gray-500 text-sm mt-1">Manage and view records of hall students.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="cursor-pointer px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-gold transition-colors flex items-center gap-2 text-sm"
                >
                  <MdAdd /> Add Student
                </button>
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="cursor-pointer px-4 py-2 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary/5 transition-colors flex items-center gap-2 text-sm"
                >
                  <MdUploadFile /> Bulk Import
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full pt-4 border-t border-gray-100">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold" />
                <input
                  type="text"
                  placeholder="Search by name, roll, room..."
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm bg-white"
                />
              </div>

              <select
                name="block"
                value={filters.block}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm bg-white cursor-pointer"
              >
                {blocks.map(block => (
                  <option key={block} value={block}>
                    {block === 'All' ? 'All Blocks' : `Block ${block}`}
                  </option>
                ))}
              </select>

              <select
                name="dept"
                value={filters.dept}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm bg-white cursor-pointer"
              >
                <option value="All">All Departments</option>
                {departments
                  .filter(d => d !== 'All')
                  .map(dept => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
              </select>

              <select
                name="batch"
                value={filters.batch}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm bg-white cursor-pointer"
              >
                <option value="All">All Batches</option>
                {batches
                  .filter(b => b !== 'All')
                  .map(batch => (
                    <option key={batch} value={batch}>
                      {batch}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Students List */}
          <div className="overflow-x-auto min-h-[400px]">
            {isLoading ? (
              <div className="flex justify-center items-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="p-10 text-center text-red-500 font-bold">{error}</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary/5 border-b border-primary/10">
                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest">Roll No.</th>
                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest">Name</th>
                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest">Room No</th>
                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest">Dept</th>
                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest text-right">Batch</th>
                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                    >
                      <td className="p-5 font-medium text-gray-500">{student.rollNumber}</td>
                      <td className="p-5">
                        <div className="font-bold text-gray-800 text-lg group-hover:text-primary transition-colors">
                          {student.firstName} {student.lastName}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                          <MdRoom className="text-gray-400 group-hover:text-gold transition-colors" size={16} />
                          {student.block}-{student.roomNumber}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                          <MdSchool className="text-gray-400 group-hover:text-gold transition-colors" size={16} />
                          {student.department}
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        {student.joiningYear && (
                          <div className="inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-gray-50 text-gray-600 border-gray-200">
                            {student.joiningYear}
                          </div>
                        )}
                      </td>
                      <td className="p-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(student)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Edit student"
                          >
                            <MdEdit size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenResetPassword(student)}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Reset password to roll number"
                          >
                            <MdLockReset size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(student)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete student"
                          >
                            <MdDelete size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!isLoading && students.length === 0 && (
              <div className="p-12 text-center text-gray-400">
                <MdPerson size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No students found.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50 flex-shrink-0">
              <h3 className="text-xl font-bold font-serif text-primary">Add New Student</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="cursor-pointer text-gray-400 hover:text-red-500"
              >
                <MdClose size={24} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    pattern=".+@kgpian\.iitkgp\.ac\.in$"
                    title="Must be a @kgpian.iitkgp.ac.in email address"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                    placeholder="user@kgpian.iitkgp.ac.in"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.rollNumber}
                    onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Batch Year *</label>
                  <select
                    required
                    value={formData.joiningYear}
                    onChange={e => setFormData({ ...formData, joiningYear: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  >
                    <option value="" disabled>Select Year</option>
                    {batchYears.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Block</label>
                  <select
                    value={formData.block}
                    onChange={e => setFormData({ ...formData, block: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  >
                    {blocks
                      .filter(b => b !== 'All')
                      .map(b => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Room Number</label>
                  <input
                    type="number"
                    required
                    value={formData.roomNumber}
                    onChange={e => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  >
                    {departments
                      .filter(d => d !== 'All')
                      .map(d => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={adding}
                  className="cursor-pointer px-6 py-2 border rounded-lg text-gray-600 font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="cursor-pointer px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-gold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {adding ? "Adding..." : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import CSV Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-xl font-bold font-serif text-primary">Bulk Import CSV</h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="cursor-pointer text-gray-400 hover:text-red-500"
              >
                <MdClose size={24} />
              </button>
            </div>
            <form onSubmit={handleImportSubmit} className="p-6">
              <p className="text-sm text-gray-500 mb-4">
                Upload a CSV file with the following headers:
                <br />
                <code className="text-xs bg-gray-100 p-1 rounded">
                  email, rollNumber, firstName, lastName, department, block, roomNumber, joiningYear
                </code>
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full border rounded-lg p-2 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              <div className="mt-8 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  disabled={importing}
                  className="cursor-pointer px-6 py-2 border rounded-lg text-gray-600 font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={importing || !csvFile}
                  className="cursor-pointer px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-gold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {importing ? "Importing..." : "Upload & Import"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {isEditModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50 flex-shrink-0">
              <h3 className="text-xl font-bold font-serif text-primary">Edit Student</h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedStudent(null);
                }}
                className="cursor-pointer text-gray-400 hover:text-red-500"
              >
                <MdClose size={24} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.firstName}
                    onChange={e => setEditFormData({ ...editFormData, firstName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editFormData.lastName}
                    onChange={e => setEditFormData({ ...editFormData, lastName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={selectedStudent.rollNumber}
                    disabled
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Roll number cannot be changed.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Batch Year *</label>
                  <select
                    required
                    value={editFormData.joiningYear}
                    onChange={e => setEditFormData({ ...editFormData, joiningYear: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  >
                    {batchYears.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Block</label>
                  <select
                    value={editFormData.block}
                    onChange={e => setEditFormData({ ...editFormData, block: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  >
                    {blocks
                      .filter(b => b !== 'All')
                      .map(b => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Room Number</label>
                  <input
                    type="number"
                    required
                    value={editFormData.roomNumber}
                    onChange={e => setEditFormData({ ...editFormData, roomNumber: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                  <select
                    value={editFormData.department}
                    onChange={e => setEditFormData({ ...editFormData, department: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  >
                    {departments
                      .filter(d => d !== 'All')
                      .map(d => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedStudent(null);
                  }}
                  disabled={updating}
                  className="cursor-pointer px-6 py-2 border rounded-lg text-gray-600 font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="cursor-pointer px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-gold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? "Updating..." : "Update Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Student Modal */}
      {isDeleteModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-xl font-bold font-serif text-primary">Delete Student</h3>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedStudent(null);
                }}
                className="cursor-pointer text-gray-400 hover:text-red-500"
              >
                <MdClose size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete{" "}
                <span className="font-bold">
                  {selectedStudent.firstName} {selectedStudent.lastName} ({selectedStudent.rollNumber})
                </span>
                ?
              </p>
              <p className="text-sm text-red-600 mb-6">
                This action cannot be undone. The student's account and access will be removed.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedStudent(null);
                  }}
                  disabled={deleting}
                  className="cursor-pointer px-6 py-2 border rounded-lg text-gray-600 font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="cursor-pointer px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {isResetPasswordModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-xl font-bold font-serif text-primary">Reset Password</h3>
              <button
                onClick={() => {
                  setIsResetPasswordModalOpen(false);
                  setSelectedStudent(null);
                }}
                className="cursor-pointer text-gray-400 hover:text-red-500"
              >
                <MdClose size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Reset password for{" "}
                <span className="font-bold">
                  {selectedStudent.firstName} {selectedStudent.lastName} ({selectedStudent.rollNumber})
                </span>
                ?
              </p>
              <p className="text-sm text-amber-700 mb-6">
                The student's password will be reset to their roll number.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetPasswordModalOpen(false);
                    setSelectedStudent(null);
                  }}
                  disabled={resettingPassword}
                  className="cursor-pointer px-6 py-2 border rounded-lg text-gray-600 font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetPasswordConfirm}
                  disabled={resettingPassword}
                  className="cursor-pointer px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-gold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resettingPassword ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudentDatabase;

