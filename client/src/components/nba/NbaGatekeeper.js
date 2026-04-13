import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function NbaGatekeeper({ user, children }) {
    const [loading, setLoading] = useState(false);

    const handleJoinPool = async () => {
        if (!user || !user.id) {
            toast.error("User session not found. Please log in again.");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            // Match the backend expectations: user_id and entry_name
            await axios.post("/api/nba/entries/create", 
                { 
                    entry_name: user.name, 
                    user_id: user.id 
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Entry Created! Good luck!");
            
            // Short delay so they can see the success message before the flip
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            
        } catch (err) {
            console.error("Join Error:", err);
            toast.error("Failed to join. Make sure you don't already have an entry.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div style={{ paddingTop: 100, textAlign: "center" }}>Please log in to participate.</div>;

    // If they don't have an entry, show the CTA Card
    if (!user.hasNbaEntry) {
        return (
            <div style={{ 
                maxWidth: 600, margin: "100px auto", padding: 40, 
                textAlign: "center", background: "#fdfdfd", 
                borderRadius: 12, border: "1px solid #e5e7eb",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
            }}>
                <span style={{ fontSize: 40 }}>🏀</span>
                <h2 style={{ color: "#13447a", marginTop: 10 }}>NBA Playoffs Pool</h2>
                <p style={{ color: "#4b5563", marginBottom: 24, lineHeight: "1.5" }}>
                    You're logged in as <strong>{user.name}</strong>, but you haven't officially joined the pool yet. 
                    Click below to create your entry and start making picks!
                </p>
                <button 
                    onClick={handleJoinPool}
                    disabled={loading}
                    style={{ 
                        backgroundColor: loading ? "#9ca3af" : "#16a34a", 
                        color: "white", 
                        padding: "14px 28px", 
                        borderRadius: 8, 
                        fontWeight: "bold", 
                        border: "none", 
                        cursor: loading ? "not-allowed" : "pointer",
                        fontSize: 16,
                        transition: "background 0.2s"
                    }}
                >
                    {loading ? "Creating Entry..." : "➕ Join NBA Playoff Pool"}
                </button>
            </div>
        );
    }

    // If they HAVE an entry, show the actual page content
    return <>{children}</>;
}