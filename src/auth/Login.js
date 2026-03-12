import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "./apiConfig";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import harrierImage from "../pages/images/Harrier.png";

function Login() {
  const [mydata, setData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Validation
  const validate = () => {
    const newErrors = {};

    if (!mydata.email) {
      newErrors.email = "Email is required";
      toast.error("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(mydata.email)) {
      newErrors.email = "Invalid email format";
      toast.error("Invalid email format");
    }

    if (!mydata.password) {
      newErrors.password = "Password is required";
      toast.error("Password is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onChange = (event) => {
    setData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [event.target.name]: "",
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submitValue = (event) => {
    event.preventDefault();

    if (!validate()) return;

    axios
      .post(`${API_BASE_URL}/login`, mydata)
      .then((response) => {
        if (response.data.flag === "1") {
          toast.success("Login successful ");

          const { name, id, role } = response.data;

          localStorage.setItem("name", name);
          localStorage.setItem("id", id);
          localStorage.setItem("role", role);

          setTimeout(() => {
            window.location = "/Dashboard";
          }, 1500);
        } else {
          toast.error("Wrong email or password");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        toast.error(
          error.response.data.message || "Server error. Please try again.",
        );
        console.error(error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-200 flex">
      {/* LEFT SECTION */}
      <div className="lg:w-1/2 flex flex-col p-8 m-32 bg-gray-200">
        {/* NAVIGATION */}
        <div className="flex gap-4 mb-8">
          <Link to="/signup">
            <button className="px-6 py-2 text-gray-600 hover:bg-white hover:shadow-sm rounded-full font-medium transition-all duration-300 hover:scale-105">
              SIGN UP
            </button>
          </Link>

          <button className="px-6 py-2 bg-white text-gray-800 rounded-full font-medium shadow-sm transition-all duration-300 hover:scale-105">
            LOGIN
          </button>
        </div>

        <form onSubmit={submitValue} className="max-w-xl space-y-4">
          <h2 className="text-4xl font-bold text-gray-800">
            Login to your Account
          </h2>

          <p className="text-gray-600">
            Welcome back to RENTGO! Select method to Login
          </p>

          {/* EMAIL */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={mydata.email}
              onChange={onChange}
              className={`w-full pl-12 pr-4 py-3 bg-white border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200`}
            />
          </div>

          {errors.email && (
            <small className="text-red-500">{errors.email}</small>
          )}

          {/* PASSWORD */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={mydata.password}
              onChange={onChange}
              className={`w-full pl-12 pr-12 py-3 bg-white border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200`}
            />

            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {errors.password && (
            <small className="text-red-500">{errors.password}</small>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            Login
          </button>
        </form>
      </div>

      {/* RIGHT IMAGE */}
      <div className="hidden lg:flex items-center justify-center p-8 mx-4">
        <img
          src={harrierImage}
          alt="Tata Harrier"
          className="w-[900px] object-contain"
        />
      </div>
    </div>
  );
}

export default Login;
