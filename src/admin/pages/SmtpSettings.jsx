import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getSmtpSettings, updateSmtpSettings } from "../api/smtpApi";
import toast from "react-hot-toast"; // 1. Import toast

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
      toast.error("Failed to load SMTP settings"); // Optional toast on load failure
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    // Create a loading toast ID so we can dismiss it or update it (optional)
    // For simplicity, we just use standard success/error calls.
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
        // 2. Replace alert with toast.success
        toast.success(res.message || "SMTP Settings Updated Successfully!");
        fetchSmtpData();
      } else {
        // 3. Replace alert with toast.error
        toast.error("Failed to update: " + res.message);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Internal Server Error";
      // 4. Replace alert with toast.error
      toast.error("Error: " + errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <div className="certified-container">Loading Configuration...</div>;
  }

  return (
    <div className="certified-container">
      <div className="header-section">
        <button className="back-btn-new" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <div className="header-text">
          <h2>SMTP Settings</h2>
          <p>Configure email server for system notifications</p>
        </div>
      </div>

      <div className="table-wrapper" style={{ padding: '30px', maxWidth: '800px' }}>
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

            <div className="form-group">
              <label>SMTP Host</label>
              <input
                type="text"
                required
                value={settings.mail_host}
                onChange={(e) => setSettings({ ...settings, mail_host: e.target.value })}
                placeholder="e.g. smtp.gmail.com"
              />
            </div>

            <div className="form-group">
              <label>SMTP Port</label>
              <input
                type="text"
                required
                value={settings.mail_port}
                onChange={(e) => setSettings({ ...settings, mail_port: e.target.value })}
                placeholder="e.g. 587"
              />
            </div>

            <div className="form-group">
              <label>Mail Username</label>
              <input
                type="email"
                required
                value={settings.mail_username}
                onChange={(e) => setSettings({ ...settings, mail_username: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Mail Password</label>
              <input
                type="password"
                required
                value={settings.mail_password}
                onChange={(e) => setSettings({ ...settings, mail_password: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Encryption</label>
              <select
                value={settings.mail_encryption}
                onChange={(e) => setSettings({ ...settings, mail_encryption: e.target.value })}
              >
                <option value="tls">tls</option>
                <option value="ssl">ssl</option>
                <option value="none">none</option>
              </select>
            </div>

          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isUpdating}
            style={{
              marginTop: '30px',
              width: '240px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              opacity: isUpdating ? 0.7 : 1
            }}
          >
            <FaSave /> {isUpdating ? "Updating Settings..." : "Update SMTP Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}