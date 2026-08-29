import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSupportRequests } from "../api/supportApi";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
export default function Support() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await getSupportRequests();
      if (res.status) {
        setTickets(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch support data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const filteredTickets = tickets.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.phone.includes(search),
  );

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
          className="bg-white/90 backdrop-blur-xl rounded-[32px] p-6 md:p-8 shadow-2xl shadow-indigo-950/5 border border-slate-200/60 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                Support Management
              </h2>
              <p className="text-sm text-slate-400 mt-1 font-medium">
                View and manage customer inquiries and messages
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchTickets}
              className="self-start md:self-auto flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-600 font-semibold px-5 py-2.5 rounded-xl border border-indigo-100 transition-colors text-sm shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              Refresh Table
            </motion.button>
          </div>

          <div className="mb-6 group">
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
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by Name, Email or Phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-3.5 pl-12 pr-4 rounded-2xl bg-slate-50 border border-slate-200/80 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 font-medium transition-all hover:border-slate-300 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="overflow-hidden border border-slate-200/60 rounded-2xl bg-white/50 backdrop-blur-sm shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/85 bg-slate-50/70">
                   
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Name
                    </th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Contact Info
                    </th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Message Preview
                    </th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Received Date
                    </th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right pr-6">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    [1, 2, 3, 4, 5].map((idx) => (
                      <tr key={idx}>
                        <td className="p-4 pl-6">
                          <div className="h-5 w-10 bg-slate-200 rounded animate-pulse" />
                        </td>
                        <td className="p-4">
                          <div className="h-5 w-28 bg-slate-200 rounded animate-pulse" />
                        </td>
                        <td className="p-4">
                          <div className="h-9 w-36 bg-slate-200 rounded animate-pulse" />
                        </td>
                        <td className="p-4">
                          <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
                        </td>
                        <td className="p-4">
                          <div className="h-5 w-24 bg-slate-200 rounded animate-pulse" />
                        </td>
                        <td className="p-4 text-right pr-6">
                          <div className="h-10 w-28 bg-slate-200 rounded-lg animate-pulse ml-auto" />
                        </td>
                      </tr>
                    ))
                  ) : filteredTickets.length > 0 ? (
                    filteredTickets.map((t) => (
                      <tr
                        key={t.id}
                        className="hover:bg-indigo-50/15 transition-colors"
                      >
                       
                        <td className="p-4 font-bold text-slate-700 text-sm">
                          {t.name}
                        </td>
                        <td className="p-4">
                          <div className="text-slate-600 font-semibold text-sm">
                            {t.email}
                          </div>
                          <div className="text-slate-400 text-xs mt-0.5">
                            {t.phone}
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="max-w-[250px] text-slate-500 text-sm truncate">
                            {t.message}
                          </p>
                        </td>
                        <td className="p-4 text-slate-500 font-medium text-sm">
                          {new Date(t.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right pr-6">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold rounded-xl border border-indigo-100 text-xs shadow-sm transition-colors"
                            onClick={() => handleViewDetails(t)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2.2}
                              stroke="currentColor"
                              className="w-3.5 h-3.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              />
                            </svg>
                            View details
                          </motion.button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="p-10 text-center text-slate-400 font-medium"
                      >
                        No support requests found matching the parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showModal && selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl w-full max-w-xl shadow-2xl relative overflow-hidden border border-slate-200/50 z-10"
            >
              <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <h3 className="text-xl font-extrabold text-slate-800">
                    Support Inquiry Details
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setShowModal(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5">
                      Sender
                    </span>
                    <p className="text-sm font-bold text-slate-700">
                      {selectedTicket.name}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5">
                      Received At
                    </span>
                    <p className="text-sm font-bold text-slate-700">
                      {new Date(selectedTicket.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5">
                      Email
                    </span>
                    <p className="text-sm font-bold text-slate-700">
                      {selectedTicket.email}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5">
                      Phone Number
                    </span>
                    <p className="text-sm font-bold text-slate-700">
                      {selectedTicket.phone}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5 block">
                    Customer Message
                  </label>
                  <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 text-sm font-semibold text-slate-600 leading-relaxed max-h-[180px] overflow-y-auto whitespace-pre-wrap">
                    {selectedTicket.message}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.015, y: -0.5 }}
                    whileTap={{ scale: 0.985 }}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold tracking-wide transition-all border border-slate-200 text-center text-sm shadow-sm"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </motion.button>

                  <motion.a
                    whileHover={{ scale: 1.015, y: -0.5 }}
                    whileTap={{ scale: 0.985 }}
                    href={`mailto:${selectedTicket.email}`}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold tracking-wide transition-all shadow-md shadow-emerald-500/10 border border-white/10 flex items-center justify-center gap-2 text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                      />
                    </svg>
                    Reply via Email
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
