import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        backgroundColor: "#09090b",
        color: "#ffffff",
        fontFamily: "sans-serif",
        padding: "4rem 2rem",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <h1
          style={{ color: "#ff2a5f", fontSize: "4rem", margin: "0 0 1rem 0" }}
        >
          404
        </h1>
        <h2
          style={{ color: "#ffffff", fontSize: "1.5rem", margin: "0 0 1rem 0" }}
        >
          LOG_ERROR: PAGE_NOT_FOUND
        </h2>
        <p style={{ color: "#a1a1aa", fontSize: "14px", lineHeight: "1.6" }}>
          The requested memory coordinates could not be retrieved. The sector
          might have been deflated.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            backgroundColor: "#ff2a5f",
            color: "#ffffff",
            textDecoration: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            fontWeight: "bold",
            marginTop: "1.5rem",
          }}
        >
          RETURN TO HOME
        </Link>
      </div>
    </div>
  );
}
