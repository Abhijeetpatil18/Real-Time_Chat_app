import React from "react";
import { useSelector } from "react-redux";

function SettingsPage() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <>
      {isAuthenticated ? (
        <div className="div">Seetings page</div>
      ) : (
        <h2>Not allowed</h2>
      )}
    </>
  );
}

export default SettingsPage;
