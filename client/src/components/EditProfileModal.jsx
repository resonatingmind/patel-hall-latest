import React, { useState, useEffect, useRef } from "react";
import { MdClose, MdCameraAlt, MdPerson } from "react-icons/md";
import axios from "axios";
import { supabase } from "../lib/supabaseClient";

const BLOCK_OPTIONS = ["A", "B", "C", "D"];

const JOB_PROFILE_OPTIONS = [
  { value: "", label: "Not specified" },
  { value: "SDE", label: "SDE" },
  { value: "DATA", label: "Data" },
  { value: "CONSULT", label: "Consulting" },
  { value: "FINANCE", label: "Finance" },
  { value: "CORE", label: "Core" },
  { value: "PRODUCT", label: "Product" },
  { value: "OTHERS", label: "Others" },
];

const EditProfileModal = ({ isOpen, onClose, userData, onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    block: "",
    roomNumber: "",
    linkedin: "",
    jobProfile: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (userData?.student) {
      setFormData({
        firstName: userData.student.firstName || "",
        lastName: userData.student.lastName || "",
        block: userData.student.block || "",
        roomNumber: userData.student.roomNumber?.toString() || "",
        linkedin: userData.student.linkedin || "",
        jobProfile: userData.student.jobProfile || "",
      });
      setImagePreview(userData.student.image || null);
    }
  }, [userData]);

  useEffect(() => {
    if (!isOpen) {
      setImageFile(null);
      setError("");
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Scroll modal to top when opened
      modalRef.current?.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be less than 2MB.");
      return;
    }

    setImageFile(file);
    setError("");
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");

    const userId = session.user.id;
    const fileExt = file.name.split(".").pop();
    const filePath = `avatar/${userId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("Patelhall")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("Patelhall").getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setError("Session expired. Please log in again.");
        setSaving(false);
        return;
      }

      let imageUrl = userData?.student?.image || null;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        block: formData.block || undefined,
        roomNumber: formData.roomNumber
          ? parseInt(formData.roomNumber)
          : undefined,
        linkedin: formData.linkedin || null,
        jobProfile: formData.jobProfile || null,
        image: imageUrl,
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/users/me/profile`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      onProfileUpdated?.();
      onClose();
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{
        padding:
          "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)",
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white w-[calc(100%-2rem)] max-w-[420px] overflow-y-auto shadow-2xl"
        style={{
          maxHeight: "min(92vh, 700px)",
          borderRadius: "16px",
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between z-10"
          style={{ borderRadius: "16px 16px 0 0" }}
        >
          <h2 className="text-base sm:text-lg font-serif font-bold text-primary">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 cursor-pointer"
            style={{ borderRadius: "50%" }}
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-4 py-4 sm:px-5 sm:py-5">
          {/* Profile Image */}
          <div className="flex flex-col items-center mb-5">
            <div
              className="relative w-20 h-20 sm:w-24 sm:h-24 overflow-hidden border-3 border-primary/10 shadow-md cursor-pointer group"
              style={{ borderRadius: "50%" }}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                  <MdPerson size={40} />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity">
                <MdCameraAlt size={20} className="text-white" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-primary hover:text-primary/80 font-semibold transition-colors mt-2"
            >
              Change Photo
            </button>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 outline-none transition-all text-sm bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20"
                style={{ borderRadius: "10px" }}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 outline-none transition-all text-sm bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20"
                style={{ borderRadius: "10px" }}
              />
            </div>
          </div>

          {/* Block & Room */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
                Block
              </label>
              <select
                name="block"
                value={formData.block}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 outline-none transition-all text-sm bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20"
                style={{ borderRadius: "10px" }}
              >
                <option value="">Select</option>
                {BLOCK_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    Block {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
                Room Number
              </label>
              <input
                type="number"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                min="1"
                placeholder="e.g. 204"
                className="w-full px-3 py-2 border border-gray-200 outline-none transition-all text-sm bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20"
                style={{ borderRadius: "10px" }}
              />
            </div>
          </div>

          {/* LinkedIn */}
          <div className="mb-4">
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
              LinkedIn Profile
            </label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/yourprofile"
              className="w-full px-3 py-2 border border-gray-200 outline-none transition-all text-sm bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20"
              style={{ borderRadius: "10px" }}
            />
          </div>

          {/* Job Profile */}
          <div className="mb-4">
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
              Job Profile Interest
            </label>
            <select
              name="jobProfile"
              value={formData.jobProfile}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 outline-none transition-all text-sm bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20"
              style={{ borderRadius: "10px" }}
            >
              {JOB_PROFILE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-600 px-3 py-2.5 text-xs sm:text-sm font-medium mb-4"
              style={{ borderRadius: "10px" }}
            >
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1 pb-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors font-semibold text-sm"
              style={{ borderRadius: "10px" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-3 py-2.5 bg-primary text-white hover:bg-primary/90 active:bg-primary/80 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(128,0,0,0.2)",
              }}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Saving…
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
