import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSellerProducts } from "../api/sellerApi";

export default function SellerProducts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSellerProducts(id);
        setProducts(data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="sellers-page-container">
      <div className="header-container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h2 className="page-title">Listed Products (Seller ID: {id})</h2>
      </div>

      {loading ? <p className="loading-text">Loading Products...</p> : (
        <div className="table-responsive">
          <table className="sellers-table">
            <thead>
              <tr>
                <th>Product UID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? products.map((p) => (
                <tr key={p.id}>
                  <td>{p.product_uid}</td>
                  <td className="font-bold">{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className={`status-pill ${p.status}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              )) : <tr><td colSpan="6" style={{textAlign: 'center'}}>No products found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}