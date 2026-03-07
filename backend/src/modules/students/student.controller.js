import {
  getStudentsService,
  createStudentService,
  bulkCreateStudentsService,
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
    // Usually prisma unique constraint maps to a specific error we can catch, but let's handle generally 
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
