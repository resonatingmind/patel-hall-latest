import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Home from "../pages/Home";
import Tech from "../pages/hall-culture/Tech";
import Socult from "../pages/hall-culture/Socult";
import Sports from "../pages/hall-culture/Sports";
import Illumination from "../pages/hall-culture/Illumination";
import Initiatives from "../pages/hall-culture/Initiatives";
import Auth from "../pages/Auth";
import UpdatePassword from "../pages/UpdatePassword";
import Portal from "../pages/Portal";
import Administration from "../pages/Administration";
import About from "../pages/About";
import Council from "../pages/Council";
import ParticipationLog from "../pages/portals/member/ParticipationLog";
import Batch from "../pages/portals/member/Batch";
import SubmitGrievance from "../pages/portals/member/SubmitGrievance";
import NotFound from "../pages/NotFound";
import WardenStudentDatabase from "../pages/portals/warden/WardenStudentDatabase";
import WardenCouncil from "../pages/portals/warden/WardenCouncil";
import WardenAlumni from "../pages/portals/warden/WardenAlumni";
import WardenGrievance from "../pages/portals/warden/WardenGrievance";
import ProtectedRoute from "../components/layout/ProtectedRoute";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tech" element={<Tech />} />
      <Route path="/soc-cult" element={<Socult />} />
      <Route path="/sports" element={<Sports />} />
      <Route path="/illumination" element={<Illumination />} />
      <Route path="/initiatives" element={<Initiatives />} />
      <Route
        path="/login"
        element={!user ? <Auth /> : <Navigate to="/portal" replace />}
      />
      <Route path="/administration" element={<Administration />} />
      <Route path="/about" element={<About />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/portal" element={<Portal />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/council" element={<Council />} />
        <Route path="/portal/participation-log" element={<ParticipationLog />} />
        <Route path="/portal/batch" element={<Batch />} />
        <Route path="/portal/submit-grievance" element={<SubmitGrievance />} />
        <Route path="/portal/student-database" element={<WardenStudentDatabase />} />
        <Route path="/portal/council" element={<WardenCouncil />} />
        <Route path="/portal/alumni" element={<WardenAlumni />} />
        <Route path="/portal/grievance" element={<WardenGrievance />} />
      </Route>

      {/* Example of Role Specific Route */}
      {/* <Route element={<ProtectedRoute requiredRole="COUNCIL" />}>
                 <Route path="/manage-events" element={<ManageEvents />} />
            </Route> */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
