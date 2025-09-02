import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

export default function SignupModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    phone: "",
  });

  const handleContinue = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email.");
      return;
    }
    setStep(2);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.password || !formData.phone) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "users"), {
        email,
        ...formData,
        createdAt: new Date(),
      });
      alert("Signup successful!");
      handleClose();
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Error during signup.");
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmail("");
    setFormData({ name: "", password: "", phone: "" });
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={modalStyle}>
        {step === 1 ? (
          <>
            <h2>Enter your email</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              style={{ width: "100%", padding: "8px", marginBottom: "1rem" }}
            />
            <button onClick={handleContinue} style={{ width: "100%" }}>
              Continue
            </button>
          </>
        ) : (
          <>
            <h2>Complete Signup</h2>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              style={{ width: "100%", padding: "8px", marginBottom: "1rem" }}
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              style={{ width: "100%", padding: "8px", marginBottom: "1rem" }}
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              style={{ width: "100%", padding: "8px", marginBottom: "1rem" }}
            />
            <button onClick={handleSubmit} style={{ width: "100%" }}>
              Sign Up
            </button>
          </>
        )}
      </Box>
    </Modal>
  );
}
