"use client";
import React, { useState, useRef } from "react";
import { 
  ChevronLeft, Upload, X, Check, 
  Info, Layers, Settings, DollarSign, Loader2 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../api/productListingApi";
import toast from "react-hot-toast";

/* ---------------- UI COMPONENTS ---------------- */
const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 transition-all hover:shadow-md">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
        <Icon size={20} />
      </div>
      <h2 className="text-lg font-bold text-gray-800 tracking-tight">{title}</h2>
    </div>
    {children}
  </div>
);

/* ---------------- CONSTANTS ---------------- */
const colorOptions = [{ id: "1", name: "Khaki" }, { id: "2", name: "Light Pink" }, { id: "3", name: "Black" }];
const sizeOptions = [{ id: "1", name: "S" }, { id: "2", name: "M" }, { id: "3", name: "L" }];

export default function ProductListing() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [basicInfo, setBasicInfo] = useState({ category_id: "1", name: "", description: "" });
  const [pricing, setPricing] = useState({ cost_price: "", mrp: "", estimated_selling_price: "", shipping_fee: "0", show_delivery_charge: "yes" });
  const [specs, setSpecs] = useState({ Material: "Cotton", Occasion: "Casual", Fabric: "Silk" });
  const [variants, setVariants] = useState([{ color_id: "1", size_id: "1", price: "", stock: "", sku: "" }]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const addVariantRow = () => setVariants([...variants, { color_id: "1", size_id: "1", price: "", stock: "", sku: "" }]);

  const handleSubmit = async () => {
    if (!basicInfo.name || imageFiles.length === 0) {
      toast.error("Product name and at least one image are required.");
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append("category_id", String(basicInfo.category_id));
    data.append("name", basicInfo.name);
    data.append("description", basicInfo.description);
    data.append("cost_price", String(pricing.cost_price));
    data.append("mrp", String(pricing.mrp));
    data.append("estimated_selling_price", String(pricing.estimated_selling_price));
    data.append("shipping_fee", String(pricing.shipping_fee));
    data.append("show_delivery_charge", pricing.show_delivery_charge);

    imageFiles.forEach(file => data.append("images[]", file, file.name));

    variants.forEach((v, i) => {
      data.append(`variants[${i}][color_id]`, String(v.color_id));
      data.append(`variants[${i}][size_id]`, String(v.size_id));
      data.append(`variants[${i}][price]`, String(v.price));
      data.append(`variants[${i}][stock]`, String(v.stock));
      data.append(`variants[${i}][sku]`, String(v.sku));
    });

    Object.keys(specs).forEach(key => data.append(`specifications[${key}]`, specs[key]));

    try {
      const res = await addProduct(data);
      toast.success("Product published successfully!");
      
      navigate("/seller/all-details"); 
      
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission Failed");
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-gray-900">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft size={24} /></button>
            <h1 className="text-xl font-extrabold tracking-tight">Create Listing</h1>
          </div>
          <button onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg flex items-center gap-2 disabled:bg-blue-300 transition-all hover:bg-blue-700">
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />} Publish Product
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Section title="General Information" icon={Info}>
            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase">Category ID</label>
              <input value={basicInfo.category_id} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-gray-50 outline-blue-500" onChange={e => setBasicInfo({...basicInfo, category_id: e.target.value})} />
              <input placeholder="Product Name" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-blue-500" onChange={e => setBasicInfo({...basicInfo, name: e.target.value})} />
              <textarea placeholder="Description" rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-blue-500" onChange={e => setBasicInfo({...basicInfo, description: e.target.value})} />
            </div>
          </Section>

          <Section title="Pricing & Shipping" icon={DollarSign}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-[10px] uppercase font-bold text-gray-400">Cost Price</label><input type="number" className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-blue-500" onChange={e => setPricing({...pricing, cost_price: e.target.value})} /></div>
              <div><label className="text-[10px] uppercase font-bold text-gray-400">MRP</label><input type="number" className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-blue-500" onChange={e => setPricing({...pricing, mrp: e.target.value})} /></div>
              <div><label className="text-[10px] uppercase font-bold text-gray-400">Selling Price</label><input type="number" className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-blue-500" onChange={e => setPricing({...pricing, estimated_selling_price: e.target.value})} /></div>
              <div><label className="text-[10px] uppercase font-bold text-gray-400">Shipping Fee</label><input type="number" className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-blue-500" onChange={e => setPricing({...pricing, shipping_fee: e.target.value})} /></div>
            </div>
          </Section>

          <Section title="Product Variants" icon={Layers}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead><tr className="text-gray-400 text-xs uppercase font-bold"><th className="pb-3 pr-2">Color</th><th className="pb-3 pr-2">Size</th><th className="pb-3 pr-2">Price</th><th className="pb-3 pr-2">Stock</th><th className="pb-3">SKU</th></tr></thead>
                <tbody>{variants.map((v, i) => (
                    <tr key={i}>
                      <td className="pr-2 pb-2"><select className="border border-gray-200 rounded p-2 text-xs w-full" value={v.color_id} onChange={e => updateVariant(i, 'color_id', e.target.value)}>{colorOptions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></td>
                      <td className="pr-2 pb-2"><select className="border border-gray-200 rounded p-2 text-xs w-full" value={v.size_id} onChange={e => updateVariant(i, 'size_id', e.target.value)}>{sizeOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></td>
                      <td className="pr-2 pb-2"><input className="w-20 border border-gray-200 rounded p-2 text-xs" placeholder="Price" onChange={e => updateVariant(i, 'price', e.target.value)} /></td>
                      <td className="pr-2 pb-2"><input className="w-16 border border-gray-200 rounded p-2 text-xs" placeholder="Qty" onChange={e => updateVariant(i, 'stock', e.target.value)} /></td>
                      <td className="pb-2"><input className="w-full border border-gray-200 rounded p-2 text-xs" placeholder="SKU" onChange={e => updateVariant(i, 'sku', e.target.value)} /></td>
                    </tr>
                ))}</tbody>
              </table>
              <button onClick={addVariantRow} className="mt-2 text-blue-600 text-xs font-bold hover:underline">+ Add row</button>
            </div>
          </Section>

          <Section title="Specifications" icon={Settings}>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{Object.keys(specs).map(key => (
                 <div key={key}><label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">{key}</label><input value={specs[key]} className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm bg-gray-50 outline-blue-500" onChange={e => setSpecs({...specs, [key]: e.target.value})} /></div>
             ))}</div>
          </Section>
        </div>

        <div className="lg:col-span-1">
          <Section title="Media" icon={Upload}>
            <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-all mb-4 group"><Upload className="text-gray-400 group-hover:text-blue-500 mb-2" /><p className="text-xs font-bold text-gray-500">Add Images</p><input type="file" ref={fileInputRef} multiple className="hidden" onChange={handleImageUpload} accept="image/*" /></div>
            <div className="grid grid-cols-3 gap-2">{imagePreviews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 shadow-sm"><img src={src} className="w-full h-full object-cover" alt="Preview" /><button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-white/90 rounded-full p-1 shadow-md hover:bg-red-500 hover:text-white transition-colors"><X size={12} /></button></div>
            ))}</div>
          </Section>
        </div>
      </div>
    </div>
  );
}