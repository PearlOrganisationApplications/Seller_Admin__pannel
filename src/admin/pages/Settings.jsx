// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./BarChart/Settings.css";

// const Settings = () => {
//   const navigate = useNavigate();

//   const [settings, setSettings] = useState({
//     notifications: true,
//     darkMode: false,
//     autoUpdate: true,
//   });

//   // Load saved dark mode from localStorage on first render
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("darkMode");

//     if (savedTheme !== null) {
//       setSettings((prev) => ({
//         ...prev,
//         darkMode: savedTheme === "true",
//       }));
//     }
//   }, []);

//   // Apply dark mode class to body
//   useEffect(() => {
//     if (settings.darkMode) {
//       document.body.classList.add("dark-mode");
//     } else {
//       document.body.classList.remove("dark-mode");
//     }
//   }, [settings.darkMode]);

//   // Toggle settings values + save dark mode to localStorage
//   const handleToggle = (key) => {
//     const updated = { ...settings, [key]: !settings[key] };

//     setSettings(updated);

//     if (key === "darkMode") {
//       localStorage.setItem("darkMode", updated.darkMode);
//     }
//   };

//   const handleSave = () => {
//     alert("Settings updated successfully!");
//   };

//   const handleLogout = () => {
//     if (window.confirm("Are you sure you want to logout?")) {
//       localStorage.clear();
//       navigate("/login");
//     }
//   };

//   return (
//     <div className="settings-wrapper">
//       <div className="settings-container">

//         {/* Header */}
//         <div className="settings-header">
//           <h2>⚙️ Settings</h2>
//           <button className="back-btn" onClick={() => navigate(-1)}>
//             ⬅ Back
//           </button>
//         </div>

//         {/* Settings Card */}
//         <div className="settings-card">

//           <h3 className="section-title">General</h3>

//           <div className="setting-item">
//             <span>🔔 Notifications</span>
//             <label className="switch">
//               <input
//                 type="checkbox"
//                 checked={settings.notifications}
//                 onChange={() => handleToggle("notifications")}
//               />
//               <span className="slider round"></span>
//             </label>
//           </div>

//           <div className="setting-item">
//             <span>🌙 Dark Mode</span>
//             <label className="switch">
//               <input
//                 type="checkbox"
//                 checked={settings.darkMode}
//                 onChange={() => handleToggle("darkMode")}
//               />
//               <span className="slider round"></span>
//             </label>
//           </div>

//           <div className="setting-item">
//             <span>🔄 Auto Update</span>
//             <label className="switch">
//               <input
//                 type="checkbox"
//                 checked={settings.autoUpdate}
//                 onChange={() => handleToggle("autoUpdate")}
//               />
//               <span className="slider round"></span>
//             </label>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="settings-actions">
//           <button className="save-btn" onClick={handleSave}>
//             💾 Save Settings
//           </button>

//           <button className="logout-btn" onClick={handleLogout}>
//             🔓 Logout
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Settings;
