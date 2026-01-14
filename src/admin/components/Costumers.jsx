const Costumers = ({ title, qty }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "20px 50px",
        borderRadius: "8px",
        textAlign: "center",
        backgroundColor: "#004AAD",
        color: "#fff",
        width: "fit-content",
      }}
    >
      <h2>{title}</h2>
      <p>{qty}</p>
    </div>
  );
};

export default Costumers;
