// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

import Landing              from "./pages/Landing";
import Register             from "./pages/Register";
import TierSelection        from "./pages/TierSelection";
import StorageSelection     from "./pages/StorageSelection";
import DataUpload           from "./pages/DataSelection";
import FieldDetailsModal    from "./pages/FieldDetailsModal";
import VendorMap            from "./pages/VendorMap";
import DigitalTwin          from "./pages/DigitalTwin";
import ClassificationAgent  from "./pages/ClassificationAgent";
import AskImageQuestion     from "./pages/AskImageQuestion";
import VoxelTabViewer       from "./pages/VoxelTabViewer";
import TableA5View          from "./pages/TableA5View";
import Dashboard            from "./pages/Dashboard";
import WellMap              from "./pages/WellMap";
import ROIModal             from "./pages/ROIModal";
import ConvexChat           from "./pages/ConvexChat";
import TexasMap             from "./pages/TexasMap";
import Privacy              from "./pages/Privacy";
import Terms                from "./pages/Terms";
import CloudSiloSetup       from "./pages/CloudSiloSetup";

import Navbar          from "./components/Navbar";
import WorkflowStepper from "./components/WorkflowStepper";
import Footer          from "./components/Footer";
import RequireAuth     from "./components/RequireAuth";

import "./index.css";
import "./App.css";

export default function App() {
  return (
    
      <Router>
        <div className="app-container">
          {/* ----- Header (hidden until login) ----- */}
          <RequireAuth>
            <Navbar />
            <WorkflowStepper />
          </RequireAuth>

          {/* ----- Routed pages ----- */}
          <main className="main-content">
            <Routes>
              {/* 🔓 PUBLIC */}
              <Route path="/" element={<Landing />} />

              {/* 🔐 PROTECTED – wrap EACH element in <RequireAuth> */}
              <Route
                path="/register"
                element={
                  <RequireAuth>
                    <Register />
                  </RequireAuth>
                }
              />
              <Route
                path="/tiers"
                element={
                  <RequireAuth>
                    <TierSelection />
                  </RequireAuth>
                }
              />
              <Route
                path="/storage"
                element={
                  <RequireAuth>
                    <StorageSelection />
                  </RequireAuth>
                }
              />
              <Route
                path="/upload"
                element={
                  <RequireAuth>
                    <DataUpload />
                  </RequireAuth>
                }
              />
              <Route
                path="/roi"
                element={
                  <RequireAuth>
                    <ROIModal />
                  </RequireAuth>
                }
              />
              <Route
                path="/vendor"
                element={
                  <RequireAuth>
                    <VendorMap />
                  </RequireAuth>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/well-map"
                element={
                  <RequireAuth>
                    <WellMap />
                  </RequireAuth>
                }
              />
              <Route
                path="/voxel"
                element={
                  <RequireAuth>
                    <VoxelTabViewer />
                  </RequireAuth>
                }
              />
              <Route
                path="/convex-chat"
                element={
                  <RequireAuth>
                    <ConvexChat />
                  </RequireAuth>
                }
              />
              <Route
                path="/classification-agent"
                element={
                  <RequireAuth>
                    <ClassificationAgent />
                  </RequireAuth>
                }
              />
              <Route
                path="/ask-image"
                element={
                  <RequireAuth>
                    <AskImageQuestion />
                  </RequireAuth>
                }
              />
              <Route
                path="/digital-twin"
                element={
                  <RequireAuth>
                    <DigitalTwin />
                  </RequireAuth>
                }
              />
              <Route
                path="/TableA5View"
                element={
                  <RequireAuth>
                    <TableA5View />
                  </RequireAuth>
                }
              />
              <Route
                path="/texasmap"
                element={
                  <RequireAuth>
                    <TexasMap />
                  </RequireAuth>
                }
              />
              <Route
                path="/privacy"
                element={
                  <RequireAuth>
                    <Privacy />
                  </RequireAuth>
                }
              />
              <Route
                path="/terms"
                element={
                  <RequireAuth>
                    <Terms />
                  </RequireAuth>
                }
              />
              <Route
                path="/cloud-setup"
                element={
                  <RequireAuth>
                    <CloudSiloSetup />
                  </RequireAuth>
                }
              />
              <Route
                path="/FieldDetailsModal"
                element={
                  <RequireAuth>
                    <FieldDetailsModal />
                  </RequireAuth>
                }
              />
            </Routes>
          </main>

          {/* ----- Footer (hidden until login) ----- */}
          <RequireAuth>
            <Footer />
          </RequireAuth>
        </div>
      </Router>
    
  );
}
