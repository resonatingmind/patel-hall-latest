import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MdAdminPanelSettings,
  MdClose,
  MdEdit,
  MdDelete,
  MdPerson,
  MdEmail,
  MdPhone,
  MdBusiness,
  MdArrowBack,
} from "react-icons/md";
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabaseClient';
import axios from 'axios';
import { toast } from 'sonner';

const AdminAdministrativeMembers = () => {
  const { user } = useAuth();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [administrativeMembers, setAdministrativeMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'ADMIN',
    position: '',
    phone: '',
    office: '',
    password: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAdministrativeMembers();
  }, []);

  useEffect(() => {
    if (isAddModalOpen || isEditModalOpen || isDeleteModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isAddModalOpen, isEditModalOpen, isDeleteModalOpen]);

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  const fetchAdministrativeMembers = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("You must be logged in as Admin.");
        setIsLoading(false);
        return;
      }

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(
        `${API_BASE}/api/users/administration`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setAdministrativeMembers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch administrative members:", error);
      toast.error("Failed to load administrative members.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (member) => {
    setSelectedMember(member);
    setFormData({
      firstName: member.firstName || '',
      lastName: member.lastName || '',
      email: member.email || '',
      role: member.role || 'ADMIN',
      position: member.position || '',
      phone: member.phone || '',
      office: member.office || '',
      password: '',
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (member) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.position) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = await getToken();
      if (!token) {
        toast.error("You must be logged in as Admin.");
        return;
      }

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      await axios.put(
        `${API_BASE}/api/users/administration/${selectedMember.id}`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          position: formData.position,
          phone: formData.phone,
          office: formData.office,
          role: formData.role,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Administrative member updated successfully.");
      setIsEditModalOpen(false);
      setSelectedMember(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        role: 'ADMIN',
        position: '',
        phone: '',
        office: '',
        password: '',
      });
      fetchAdministrativeMembers();
    } catch (error) {
      console.error("Failed to update administrative member:", error);
      const message = error.response?.data?.message || error.message || "Failed to update administrative member.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMember) return;

    try {
      setIsSubmitting(true);
      const token = await getToken();
      if (!token) {
        toast.error("You must be logged in as Admin.");
        return;
      }

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      await axios.delete(
        `${API_BASE}/api/users/administration/${selectedMember.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Administrative member deleted successfully.");
      setIsDeleteModalOpen(false);
      setSelectedMember(null);
      fetchAdministrativeMembers();
    } catch (error) {
      console.error("Failed to delete administrative member:", error);
      const message = error.response?.data?.message || error.message || "Failed to delete administrative member.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.firstName || !formData.position || !formData.password) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = await getToken();
      if (!token) {
        toast.error("You must be logged in as Admin.");
        return;
      }

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      await axios.post(
        `${API_BASE}/api/users/administration/create`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Administrative member added successfully.");
      setIsAddModalOpen(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        role: 'ADMIN',
        position: '',
        phone: '',
        office: '',
        password: '',
      });
      fetchAdministrativeMembers();
    } catch (error) {
      console.error("Failed to add administrative member:", error);
      const message = error.response?.data?.message || error.message || "Failed to add administrative member.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
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
                      ADMINISTRATIVE MEMBERS
                    </h1>
                    <h2 className="text-gold text-base md:text-lg font-medium tracking-widest uppercase font-serif">
                      Manage Hall Administration | Admin Portal
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Administrative Members Section */}
      <section className="py-12 md:py-20 px-4 md:px-20 lg:px-40 flex justify-center relative z-20">
        <div className="max-w-[1200px] w-full bg-white rounded-xl shadow-2xl overflow-hidden border-t-4 border-gold">
          <div className="p-6 md:p-8 bg-gray-50 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h3 className="text-primary text-2xl font-serif font-bold flex items-center gap-2">
                <MdAdminPanelSettings className="text-gold" /> Administrative Members
              </h3>
              <p className="text-gray-500 text-sm mt-1">Manage wardens and administrative staff.</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-primary text-white text-sm font-bold uppercase tracking-wider px-6 py-2.5 rounded-full shadow-lg shadow-primary/20 hover:bg-deep-maroon transition-all transform hover:scale-105"
            >
              <MdAdminPanelSettings size={18} /> Add Member
            </button>
          </div>

          <div className="overflow-x-auto min-h-[200px]">
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : administrativeMembers.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <MdPerson size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No administrative members found.</p>
                <p className="text-sm mt-2">Click "Add Member" to create one.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary/5 border-b border-primary/10">
                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest">Name</th>
                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest">Email</th>
                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest">Position</th>
                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest">Role</th>
                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest">Contact</th>
                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {administrativeMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                    >
                      <td className="p-5">
                        <div className="font-bold text-gray-800 text-lg group-hover:text-primary transition-colors">
                          {member.name || `${member.firstName} ${member.lastName}`.trim() || 'N/A'}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-gray-700">
                          <MdEmail className="text-gray-400" size={16} />
                          <span className="text-sm">{member.email}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="font-medium text-gray-700">{member.position || 'N/A'}</div>
                      </td>
                      <td className="p-5">
                        <div
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            member.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-700 border border-purple-200'
                              : 'bg-blue-100 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {member.role}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="space-y-1">
                          {member.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MdPhone className="text-gray-400" size={14} />
                              <span>{member.phone}</span>
                            </div>
                          )}
                          {member.office && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MdBusiness className="text-gray-400" size={14} />
                              <span>{member.office}</span>
                            </div>
                          )}
                          {!member.phone && !member.office && (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(member)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <MdEdit size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(member)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                            disabled={member.id === user?.id}
                          >
                            <MdDelete size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      {/* Add Administrative Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50 flex-shrink-0">
              <h3 className="text-xl font-bold font-serif text-primary">Add Administrative Member</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="cursor-pointer text-gray-400 hover:text-red-500"
              >
                <MdClose size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                    placeholder="user@kgpian.iitkgp.ac.in"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="WARDEN">WARDEN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Position / Title *
                  </label>
                  <input
                    type="text"
                    name="position"
                    required
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                    placeholder="Warden, Assistant Warden, Caretaker, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Office
                  </label>
                  <input
                    type="text"
                    name="office"
                    value={formData.office}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                    placeholder="e.g. Patel Hall Office"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Temporary Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                    placeholder="Set an initial password"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmitting}
                  className="cursor-pointer px-6 py-2 border rounded-lg text-gray-600 font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-gold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Administrative Member Modal */}
      {isEditModalOpen && selectedMember && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50 flex-shrink-0">
              <h3 className="text-xl font-bold font-serif text-primary">Edit Administrative Member</h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedMember(null);
                }}
                className="cursor-pointer text-gray-400 hover:text-red-500"
              >
                <MdClose size={24} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={selectedMember.email}
                    disabled
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="WARDEN">WARDEN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Position / Title *
                  </label>
                  <input
                    type="text"
                    name="position"
                    required
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                    placeholder="Warden, Assistant Warden, Caretaker, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Office
                  </label>
                  <input
                    type="text"
                    name="office"
                    value={formData.office}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                    placeholder="e.g. Patel Hall Office"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedMember(null);
                  }}
                  disabled={isSubmitting}
                  className="cursor-pointer px-6 py-2 border rounded-lg text-gray-600 font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-gold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Updating..." : "Update Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedMember && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-xl font-bold font-serif text-primary">Delete Member</h3>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedMember(null);
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
                  {selectedMember.name || selectedMember.email}
                </span>
                ?
              </p>
              <p className="text-sm text-red-600 mb-6">
                This action cannot be undone. The member will lose access to the portal immediately.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedMember(null);
                  }}
                  disabled={isSubmitting}
                  className="cursor-pointer px-6 py-2 border rounded-lg text-gray-600 font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isSubmitting}
                  className="cursor-pointer px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAdministrativeMembers;

