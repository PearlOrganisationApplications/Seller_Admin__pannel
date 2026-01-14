import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BarChart/AddCategory.css";
import { BASE_URL } from "../api/BaseUrl";

export default function AddCategory() {
  const token = "34|aZU2vxFzktHZcyyLWletpzbszwnNwa3Gh6xhEK960c5cc3eb";
  const navigate = useNavigate();

  const [color, setColors] = useState([]);
  const [category, setCategory] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [specifications, setSpecifications] = useState([]);

  const [showInput, setShowInput] = useState({
    category: false,
    color: false,
    size: false,
    spec: false,
  });

  const [inputs, setInputs] = useState({
    category: "",
    color: "",
    size: "",
    spec: "",
  });

  const [editId, setEditId] = useState(null);
  const [editType, setEditType] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchAll = async () => {
    try {
      const [cat, col, siz, spec] = await Promise.all([
        fetch(`${BASE_URL}/api/admin/categories`, {
           headers: {
             Authorization: `Bearer ${token}` 
            } }),
        fetch(`${BASE_URL}/api/admin/colors`, {
           headers: { 
            Authorization: `Bearer ${token}`
           } }),
        fetch(`${BASE_URL}/api/admin/sizes`, {
           headers: { 
            Authorization: `Bearer ${token}`
           } }),
        fetch(`${BASE_URL}/api/admin/specifications`, {
           headers: { Authorization: `Bearer ${token}`
           } }),
      ]);

      setCategory((await cat.json()).categories || []);
      setColors((await col.json()).colors || []);
      setSizes((await siz.json()).sizes || []);
      setSpecifications((await spec.json()).specifications || []);
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAdd = async (type) => {
    const value = inputs[type].trim();
    if (!value) return alert("Enter a valid value.");

    let url = "";
    let body = {};

    if (type === "category") {
      url = `${BASE_URL}/api/admin/add-category`;
      body = { categories: [value] };
    }
    if (type === "color") {
      url = `${BASE_URL}/api/admin/add-color`;
      body = { colors: [value] };
    }
    if (type === "size") {
      url = `${BASE_URL}/api/admin/add-size`;
      body = { sizes: [value] };
    }
    if (type === "spec") {
      url = `${BASE_URL}/api/admin/add-specification`;
      body = { specifications: [value] };
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.status) {
      alert("Added Successfully!");
      setInputs((prev) => ({ ...prev, [type]: "" }));
      setShowInput((prev) => ({ ...prev, [type]: false }));
      fetchAll();
    } else {
      alert("Failed to add: " + JSON.stringify(data));
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Delete this item?")) return;

    let url = "";
    if (type === "category") url = `${BASE_URL}/api/admin/delete-category/${id}`;
    if (type === "color") url = `${BASE_URL}/api/admin/delete-color/${id}`;
    if (type === "size") url = `${BASE_URL}/api/admin/delete-size/${id}`;
    if (type === "spec") url = `${BASE_URL}/api/admin/delete-specification/${id}`;

    await fetch(url, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchAll();
  };

  // OPEN UPDATE MODAL
  const openEditModal = (type, item) => {
    setEditId(item.id);
    setEditType(type);

    if (type === "category") setInputs((prev) => ({ ...prev, category: item.cetegory }));
    if (type === "color") setInputs((prev) => ({ ...prev, color: item.color }));
    if (type === "size") setInputs((prev) => ({ ...prev, size: item.size }));
    if (type === "spec") setInputs((prev) => ({ ...prev, spec: item.specification }));

    setShowModal(true);
  };

  
  // UPDATE API 
  const handleUpdate = async () => {
    let value = inputs[editType].trim();
    if (!value) return alert("Enter a valid value");

    let url = "";
    let body = {};

    if (editType === "category") {
      url = `${BASE_URL}/api/admin/update-category/${editId}`;
      body = { cetegory: value };
    }
    if (editType === "color") {
      url = `${BASE_URL}/api/admin/update-color/${editId}`;
      body = { color: value };
    }
    if (editType === "size") {
      url = `${BASE_URL}/api/admin/update-size/${editId}`;
      body = { size: value };
    }
    if (editType === "spec") {
      url = `${BASE_URL}/api/admin/update-specification/${editId}`;
      body = { specification: value };
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.status) {
      alert("Updated Successfully!");
      setShowModal(false);
      setEditId(null);
      setEditType("");
      setInputs({ category: "", color: "", size: "", spec: "" });
      fetchAll();
    } else {
      alert("Update Failed: " + JSON.stringify(data));
    }
  };

  
  const renderSection = (title, type, items, keyName) => (
    <div className="section">
      <h3>{title}</h3>

      <div className="options">
        {items.map((item) => (
          <div className="option-item" key={item.id}>
            <span>{item[keyName]}</span>

            <button className="edit-btn" onClick={() => openEditModal(type, item)}>
              ✏️
            </button>

            <button className="delete-hover-btn" onClick={() => handleDelete(type, item.id)}>
              ❌
            </button>
          </div>
        ))}
      </div>

      {/* Input for ADD */}
      {showInput[type] ? (
        <>
          <input
            className="input-box"
            autoFocus
            value={inputs[type]}
            onChange={(e) => setInputs({ ...inputs, [type]: e.target.value })}
          />
          <button className="btn" onClick={() => handleAdd(type)}>Submit</button>
          <button
            className="btn cancel-btn"
            onClick={() => setShowInput((prev) => ({ ...prev, [type]: false }))}
          >
            Cancel
          </button>
        </>
      ) : (
        <button className="add-btn" onClick={() => setShowInput((prev) => ({ ...prev, [type]: true }))}>
          Add {title}
        </button>
      )}
    </div>
  );

  return (
  <div className={`add-category-container ${localStorage.getItem("darkMode") === "true" ? "dark-mode" : ""}`}>
      <h2 className="page-title">Manage Category</h2>
      <div className="nav">
        <h3>Add Category</h3>
        <button onClick={() => navigate("/admin/dashboard")} className="btn">
          Done
        </button>
      </div>

      {renderSection("Category", "category", category, "cetegory")}
      {renderSection("Color", "color", color, "color")}
      {renderSection("Size", "size", sizes, "size")}
      {renderSection("Specification", "spec", specifications, "specification")}

      {/* ========================== MODAL ========================== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Update {editType.toUpperCase()}</h3>

            <input
              className="input-box"
              value={inputs[editType]}
              onChange={(e) => setInputs({ ...inputs, [editType]: e.target.value })}
            />

            <div className="modal-actions">
              <button className="btn" onClick={handleUpdate}>Update</button>
              <button className="btn cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/**
Remaining part
dashbord ==> API Integration in dashbord
order ==> API integration
Notification section
Coupon Management
certified managment
 */