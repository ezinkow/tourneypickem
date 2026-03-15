import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const GOLD = "#c89d3c";
const BLUE = "#0369a1";

export default function SquaresChangePassword() {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [done, setDone] = useState(false);

    const inputStyle = {
        padding: "10px 12px", borderRadius: 8,
        border: "1px solid #d1d5db", fontSize: 14,
        width: "100%", boxSizing: "border-box",
    };

    const handleSubmit = async () => {
        if (!email || !newPassword || !confirmPassword)
            return toast.error("All fields required");
        if (newPassword !== confirmPassword)
            return toast.error("Passwords don't match");
        try {
            const res = await axios.post("/api/squares/users/change-password", { email, newPassword });
            if (res.data.success) {
                setDone(true);
                toast.success("Password updated!");
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Something went wrong");
        }
    };

    return (
        <div style={{ paddingTop: 68, paddingBottom: 80 }}>
            <Toaster />
            <div style={{
                maxWidth: 420, margin: "40px auto", background: "white",
                borderRadius: 16, padding: "32px 28px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}>
                <h2 style={{ color: BLUE, marginBottom: 6, textAlign: "center" }}>
                    🔑 Change Password
                </h2>
                <p style={{ color: "#6b7280", fontSize: 13, textAlign: "center", marginBottom: 24 }}>
                    Enter your email to update your password
                </p>

                {done ? (
                    <div style={{ textAlign: "center" }}>
                        <div style={{ color: "#16a34a", fontWeight: 600, fontSize: 15, marginBottom: 16 }}>
                            ✅ Password updated successfully!
                        </div>
                        <button
                            onClick={() => window.location.hash = "#/squares/grid"}
                            style={{ padding: "8px 18px", borderRadius: 6, backgroundColor: BLUE, color: "white", border: "none", fontWeight: 600, cursor: "pointer" }}
                        >
                            Back to Grid
                        </button>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4, display: "block" }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4, display: "block" }}>
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                placeholder="New password"
                                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4, display: "block" }}>
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                                style={inputStyle}
                            />
                        </div>
                        <button
                            onClick={handleSubmit}
                            style={{
                                marginTop: 8, padding: "10px 0", borderRadius: 8,
                                backgroundColor: BLUE, color: "white",
                                border: "none", fontWeight: 700, fontSize: 14,
                                cursor: "pointer", width: "100%",
                            }}
                        >
                            Update Password
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}