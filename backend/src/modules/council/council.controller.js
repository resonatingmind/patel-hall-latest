import {
  getPositionsService,
  createPositionService,
  deletePositionService,
  assignPositionService,
  unassignPositionService
} from "./council.service.js";

export const getPositions = async (req, res) => {
  try {
    const positions = await getPositionsService();
    res.status(200).json(positions);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch positions" });
  }
};

export const createPosition = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Position name is required" });

    const position = await createPositionService(name, description);
    res.status(201).json({ message: "Position created successfully", position });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to create position" });
  }
};

export const deletePosition = async (req, res) => {
  try {
    const { id } = req.params;
    await deletePositionService(id);
    res.status(200).json({ message: "Position deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to delete position" });
  }
};

export const assignPosition = async (req, res) => {
  try {
    const { studentId, positionId } = req.body;
    if (!studentId || !positionId) {
      return res.status(400).json({ message: "studentId and positionId are required" });
    }

    const result = await assignPositionService(studentId, positionId);
    res.status(200).json({ message: "Student assigned successfully", result });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to assign position" });
  }
};

export const unassignPosition = async (req, res) => {
  try {
    const { studentId, positionId } = req.body;
    if (!studentId || !positionId) {
      return res.status(400).json({ message: "studentId and positionId are required" });
    }

    const result = await unassignPositionService(studentId, positionId);
    res.status(200).json({ message: "Student unassigned successfully", result });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to unassign position" });
  }
};
