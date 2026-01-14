import React, { useState } from "react";
import sellerLogo from "../seller/assets/imgs/seller_Logo.png";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../seller/api/Base_url";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

 const handleLogin = async () => {
  if (!email || !password) {
    alert("Please enter email or password");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
        user_type: "seller",
      }),
    });

    const data = await res.json();
    console.log("API Response:", data);

  if (data.status === true) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("role", "SELLER"); // Standardize the role name

  navigate("/seller/dashboard"); // Use a prefix to keep it separate from admin
} else {
      alert(data.message || "Login failed");
    }
  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }

  setLoading(false);
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-400 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl p-6 flex flex-col md:flex-row items-center">

        {/* LEFT SIDE – IMAGE */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img src={sellerLogo} alt="Seller Logo" className="w-[320px] h-auto" />
        </div>

        {/* RIGHT SIDE – LOGIN FORM */}
        <div className="w-full md:w-1/2 p-6">
          <h1 className="text-4xl font-light mb-6 border-b pb-2 text-right pr-4">
            Kalkideals
          </h1>

          <h2 className="font-semibold text-lg mb-3">Seller Account</h2>

          <div className="flex flex-col gap-4">

            {/* EMAIL */}
            <input
              type="text"
              placeholder="Phone No / Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-md px-3 py-2 w-full outline-none focus:ring focus:ring-blue-300"
            />

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded-md px-3 py-2 w-full outline-none focus:ring focus:ring-blue-300"
            />

            <button
              onClick={handleLogin}
              className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <div className="my-4 flex items-center">
            <div className="flex-grow border-t"></div>
            <span className="mx-2 text-gray-500">OR</span>
            <div className="flex-grow border-t"></div>
          </div>

          <div className="text-center">
            <a className="text-blue-600 text-sm hover:underline" href="#">
              Forgot Password ?
            </a>

            <p className="mt-3 text-sm">
              Don't have an account ?{" "}
              <a
                onClick={() => navigate("/seller-registration")}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Register Now
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
