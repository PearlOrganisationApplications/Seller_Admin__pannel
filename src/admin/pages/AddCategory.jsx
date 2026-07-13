import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BarChart/AddCategory.css";
import * as CategoryAPI from "../api/addCategoryApi";

export default function AddCategory() {
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

  // 1. FETCH ALL DATA
  const fetchAll = async () => {
    try {
      const [catRes, colRes, sizRes, specRes] = await Promise.all([
        CategoryAPI.getCategories(),
        CategoryAPI.getColors(),
        CategoryAPI.getSizes(),
        CategoryAPI.getSpecifications(),
      ]);

      setCategory(catRes.data.categories || []);
      setColors(colRes.data.colors || []);
      setSizes(sizRes.data.sizes || []);
      setSpecifications(specRes.data.specifications || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // 2. HANDLE ADD
  const handleAdd = async (type) => {
    const value = inputs[type].trim();
    if (!value) return alert("Enter a valid value.");

    try {
      let res;
      if (type === "category")
        res = await CategoryAPI.addCategory({ categories: [value] });
      if (type === "color")
        res = await CategoryAPI.addColor({ colors: [value] });
      if (type === "size") res = await CategoryAPI.addSize({ sizes: [value] });
      if (type === "spec")
        res = await CategoryAPI.addSpecification({ specifications: [value] });

      if (res.data.status) {
        alert("Added Successfully!");
        setInputs((prev) => ({ ...prev, [type]: "" }));
        setShowInput((prev) => ({ ...prev, [type]: false }));
        fetchAll();
      }
    } catch {
      alert("Failed to add item.");
    }
  };

  // 3. HANDLE DELETE
  const handleDelete = async (type, id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      if (type === "category") await CategoryAPI.deleteCategory(id);
      if (type === "color") await CategoryAPI.deleteColor(id);
      if (type === "size") await CategoryAPI.deleteSize(id);
      if (type === "spec") await CategoryAPI.deleteSpecification(id);
      fetchAll();
    } catch {
      console.error("Delete failed");
    }
  };

  // 4. HANDLE UPDATE
  const handleUpdate = async () => {
    let value = inputs[editType].trim();
    if (!value) return alert("Enter a valid value");

    try {
      let res;
      if (editType === "category")
        res = await CategoryAPI.updateCategory(editId, { cetegory: value });
      if (editType === "color")
        res = await CategoryAPI.updateColor(editId, { color: value });
      if (editType === "size")
        res = await CategoryAPI.updateSize(editId, { size: value });
      if (editType === "spec")
        res = await CategoryAPI.updateSpecification(editId, {
          specification: value,
        });

      if (res.data.status) {
        alert("Updated Successfully!");
        setShowModal(false);
        setEditId(null);
        setInputs({ category: "", color: "", size: "", spec: "" });
        fetchAll();
      }
    } catch (error) {
      alert("Update Failed", error);
    }
  };

  // OPEN MODAL
  const openEditModal = (type, item) => {
    setEditId(item.id);
    setEditType(type);
    setInputs((prev) => ({
      ...prev,
      category: item.cetegory || "",
      color: item.color || "",
      size: item.size || "",
      spec: item.specification || "",
    }));
    setShowModal(true);
  };

  const renderSection = (title, type, items, keyName) => (
    <div className="section">
      <h3>{title}</h3>
      <div className="options">
        {items.map((item) => (
          <div className="option-item" key={item.id}>
            <span>{item[keyName]}</span>
            <button
              className="edit-btn"
              onClick={() => openEditModal(type, item)}
            >
              ✏️
            </button>
            <button
              className="delete-hover-btn"
              onClick={() => handleDelete(type, item.id)}
            >
              ❌
            </button>
          </div>
        ))}
      </div>
      {showInput[type] ? (
        <>
          <input
            className="input-box"
            autoFocus
            value={inputs[type]}
            onChange={(e) => setInputs({ ...inputs, [type]: e.target.value })}
          />
          <button className="btn" onClick={() => handleAdd(type)}>
            Submit
          </button>
          <button
            className="btn cancel-btn"
            onClick={() => setShowInput((prev) => ({ ...prev, [type]: false }))}
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          className="add-btn"
          onClick={() => setShowInput((prev) => ({ ...prev, [type]: true }))}
        >
          Add {title}
        </button>
      )}
    </div>
  );

  return (
    <div
      className={`add-category-container ${localStorage.getItem("darkMode") === "true" ? "dark-mode" : ""}`}
    >
      <h2 className="page-title">Manage Category</h2>
      <button onClick={() => navigate(-1)} className="btn">
        ← Back
      </button>
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Update {editType.toUpperCase()}</h3>
            <input
              className="input-box"
              value={inputs[editType]}
              onChange={(e) =>
                setInputs({ ...inputs, [editType]: e.target.value })
              }
            />
            <div className="modal-actions">
              <button className="btn" onClick={handleUpdate}>
                Update
              </button>
              <button
                className="btn cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
