import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSmtpSettings, updateSmtpSettings } from "../api/smtpApi";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
export default function SmtpSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [settings, setSettings] = useState({
    mail_host: "",
    mail_port: "",
    mail_username: "",
    mail_password: "",
    mail_encryption: "",
  });

  useEffect(() => {
    fetchSmtpData();
  }, []);

  const fetchSmtpData = async () => {
    try {
      setLoading(true);
      const res = await getSmtpSettings();
      if (res.status && res.data) {
        setSettings({
          mail_host: res.data.mail_host,
          mail_port: res.data.mail_port.toString(),
          mail_username: res.data.mail_username,
          mail_password: res.data.mail_password,
          mail_encryption: res.data.mail_encryption,
        });
      }
    } catch (err) {
      console.error("Failed to fetch SMTP settings", err);
      toast.error("Failed to load SMTP settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const payload = {
        mail_host: settings.mail_host,
        mail_port: settings.mail_port,
        mail_username: settings.mail_username,
        mail_password: settings.mail_password,
        mail_encryption: settings.mail_encryption,
      };

      const res = await updateSmtpSettings(payload);

      if (res.status) {
        toast.success(res.message || "SMTP Settings Updated Successfully!");
        fetchSmtpData();
      } else {
        toast.error("Failed to update: " + res.message);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Internal Server Error";
      toast.error("Error: " + errorMsg);
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                  <div className="h-12 w-full bg-slate-100 rounded-xl animate-pulse" />
                </div>
              ))}
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
        staggerChildren: 0.05,
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
     
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="bg-white/90 backdrop-blur-xl rounded-[32px] p-6 md:p-10 shadow-2xl shadow-indigo-950/5 border border-slate-200/60 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              SMTP Configuration
            </h2>
            <p className="text-sm text-slate-400 mt-1 font-medium">
              Configure email server parameters for system notifications
            </p>
          </div>

          <form onSubmit={handleSave}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              <motion.div variants={itemVariants} className="group space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 block transition-colors group-focus-within:text-indigo-600">
                  SMTP Host
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
                        d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v3.75a3 3 0 0 1-3 3M12 4.5V21"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    required
                    value={settings.mail_host}
                    onChange={(e) =>
                      setSettings({ ...settings, mail_host: e.target.value })
                    }
                    placeholder="e.g. smtp.gmail.com"
                    className="w-full py-3.5 pl-12 pr-4 rounded-2xl bg-slate-50 border border-slate-200/80 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 font-medium transition-all hover:border-slate-300 placeholder-slate-400"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="group space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 block transition-colors group-focus-within:text-indigo-600">
                  SMTP Port
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
                        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    required
                    value={settings.mail_port}
                    onChange={(e) =>
                      setSettings({ ...settings, mail_port: e.target.value })
                    }
                    placeholder="e.g. 587"
                    className="w-full py-3.5 pl-12 pr-4 rounded-2xl bg-slate-50 border border-slate-200/80 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 font-medium transition-all hover:border-slate-300 placeholder-slate-400"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="group space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 block transition-colors group-focus-within:text-indigo-600">
                  Mail Username
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
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    required
                    value={settings.mail_username}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        mail_username: e.target.value,
                      })
                    }
                    placeholder="e.g. system@gmail.com"
                    className="w-full py-3.5 pl-12 pr-4 rounded-2xl bg-slate-50 border border-slate-200/80 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 font-medium transition-all hover:border-slate-300 placeholder-slate-400"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="group space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 block transition-colors group-focus-within:text-indigo-600">
                  Mail Password
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
                        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    required
                    value={settings.mail_password}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        mail_password: e.target.value,
                      })
                    }
                    placeholder="••••••••••••"
                    className="w-full py-3.5 pl-12 pr-4 rounded-2xl bg-slate-50 border border-slate-200/80 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 font-medium transition-all hover:border-slate-300 placeholder-slate-400"
                  />
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="group space-y-2 sm:col-span-2"
              >
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 block transition-colors group-focus-within:text-indigo-600">
                  Encryption Mode
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
                        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1332 9-6.03 9-11.622 0-1.31-.21-2.57-.599-3.747A11.959 11.959 0 0 1 12 2.714Z"
                      />
                    </svg>
                  </div>
                  <select
                    value={settings.mail_encryption}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        mail_encryption: e.target.value,
                      })
                    }
                    className="w-full py-3.5 pl-12 pr-10 rounded-2xl bg-slate-50 border border-slate-200/80 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 font-medium transition-all hover:border-slate-300 appearance-none cursor-pointer"
                  >
                    <option value="tls">tls</option>
                    <option value="ssl">ssl</option>
                    <option value="none">none</option>
                  </select>
                  <div className="absolute right-4 pointer-events-none text-slate-400">
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
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="show"
              className="pt-6"
            >
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
                    d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                  />
                </svg>
                {isUpdating ? "Updating Settings..." : "Update SMTP Settings"}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
