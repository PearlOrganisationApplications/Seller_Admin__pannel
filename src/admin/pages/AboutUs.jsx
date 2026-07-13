import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAboutUs, updateAboutUs } from "../api/aboutUsApi";
import { motion } from "framer-motion";
export default function AboutUs() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [content, setContent] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchAboutUsData();
  }, []);

  const fetchAboutUsData = async () => {
    try {
      setLoading(true);
      const res = await getAboutUs();
      if (res.status && res.data) {
        setContent({
          title: res.data.title,
          description: res.data.description,
        });
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const payload = {
        title: content.title,
        description: content.description,
      };

      const res = await updateAboutUs(payload);

      if (res.status) {
        alert(res.message || "About Us updated successfully!");
        fetchAboutUsData();
      } else {
        alert("Update failed: " + (res.message || "Unknown error"));
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Internal Server Error";
      alert("Error: " + errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/60 blur-[130px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-100/60 blur-[130px] animate-pulse delay-700" />

        <div className="w-full max-w-3xl px-4 z-10">
          <div className="h-10 w-44 bg-slate-200/80 rounded-xl mb-6 animate-pulse" />
          <div className="bg-white/90 rounded-3xl p-10 shadow-xl border border-slate-100 space-y-8">
            <div className="space-y-4">
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
              <div className="h-12 w-full bg-slate-100 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-4 w-36 bg-slate-200 rounded animate-pulse" />
              <div className="h-48 w-full bg-slate-100 rounded-xl animate-pulse" />
            </div>
            <div className="h-14 w-60 bg-slate-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 flex flex-col items-center relative overflow-hidden font-sans">
      <motion.div
        animate={{
          x: [0, 15, -15, 0],
          y: [0, -20, 20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-100/50 blur-[140px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -15, 15, 0],
          y: [0, 20, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-100/50 blur-[140px] pointer-events-none"
      />

      <div className="w-full z-10">
        {" "}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(-1)}
          className="group mb-6 flex items-center gap-2 bg-white hover:bg-slate-50 text-indigo-600 px-5 py-2.5 rounded-2xl border border-slate-200/80 shadow-sm transition-all font-semibold text-sm backdrop-blur-sm"
        >
          <span className="transition-transform group-hover:-translate-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </span>
          Go Back
        </motion.button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="bg-white/90 backdrop-blur-xl rounded-[32px] p-6 md:p-10 shadow-2xl shadow-indigo-950/5 border border-slate-200/60 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              About Us Management
            </h2>
            <p className="text-sm text-slate-400 mt-1 font-medium">
              Update company profile information displayed on the platform
            </p>
          </div>

          <form onSubmit={handleUpdate}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              <motion.div variants={itemVariants} className="group space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 block transition-colors group-focus-within:text-indigo-600">
                  Page Title
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 pointer-events-none text-indigo-500/80 transition-colors group-focus-within:text-indigo-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    required
                    value={content.title}
                    onChange={(e) =>
                      setContent({ ...content, title: e.target.value })
                    }
                    placeholder="e.g. About Kalki Deals"
                    className="w-full py-3.5 pl-12 pr-4 rounded-2xl bg-slate-50 border border-slate-200/80 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 font-medium transition-all hover:border-slate-300"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="group space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 block transition-colors group-focus-within:text-indigo-600">
                  Description / Content
                </label>
                <div className="relative flex items-start">
                  <div className="absolute left-4 top-4 pointer-events-none text-indigo-500/80 transition-colors group-focus-within:text-indigo-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                      />
                    </svg>
                  </div>
                  <textarea
                    required
                    rows="10"
                    value={content.description}
                    onChange={(e) =>
                      setContent({ ...content, description: e.target.value })
                    }
                    placeholder="Describe your platform..."
                    style={{ lineHeight: "1.6" }}
                    className="w-full py-3.5 pl-12 pr-4 rounded-2xl bg-slate-50 border border-slate-200/80 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 font-medium transition-all hover:border-slate-300 resize-none min-h-[220px]"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.015, y: -1 }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  disabled={isUpdating}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold tracking-wide transition-all shadow-lg shadow-indigo-500/10 border border-white/10 flex items-center justify-center gap-3 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className={`w-5 h-5 ${isUpdating ? "animate-bounce" : ""}`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                    />
                  </svg>
                  {isUpdating ? "Processing..." : "Update About Us"}
                </motion.button>
              </motion.div>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
