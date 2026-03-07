import {
  getStudentsService,
  createStudentService,
  bulkCreateStudentsService,
  updateStudentService,
  deleteStudentService,
  resetStudentPasswordService,
} from "./student.service.js";

// Fetch all students
export const getStudents = async (req, res) => {
  try {
    const students = await getStudentsService();
    res.status(200).json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

// Create a single student
export const createStudent = async (req, res) => {
  try {
    const studentData = req.body;

    if (!studentData.email || !studentData.rollNumber || !studentData.firstName) {
      return res.status(400).json({ message: "Missing required fields: email, rollNumber, firstName" });
    }

    const student = await createStudentService(studentData);

    res.status(201).json({
      message: "Student added successfully",
      student,
    });
  } catch (err) {
    console.error("Error creating student:", err);
    res.status(500).json({ message: err.message || "Failed to create student" });
  }
};

// Bulk import students
export const bulkImportStudents = async (req, res) => {
  try {
    const { students } = req.body;

    if (!students || !Array.isArray(students)) {
      return res.status(400).json({ message: "Invalid payload: 'students' must be an array." });
    }

    const result = await bulkCreateStudentsService(students);

    res.status(201).json({
      message: "Bulk import processing completed",
      ...result,
    });
  } catch (err) {
    console.error("Error in bulk import:", err);
    res.status(500).json({ message: err.message || "Failed to process bulk import" });
  }
};

// Update a student
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const student = await updateStudentService(id, updateData);

    res.status(200).json({
      message: "Student updated successfully",
      student,
    });
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({ message: err.message || "Failed to update student" });
  }
};

// Delete a student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    await deleteStudentService(id);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ message: err.message || "Failed to delete student" });
  }
};

// Reset a student's password
export const resetStudentPassword = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    await resetStudentPasswordService(id);

    res.status(200).json({ message: "Student password reset successfully" });
  } catch (err) {
    console.error("Error resetting student password:", err);
    res.status(500).json({ message: err.message || "Failed to reset student password" });
  }
};

