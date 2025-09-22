import { useState } from "react";
import { cloneDriveLink } from "@/lib/api";

export default function CloneBox() {
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("");

  const handleClone = async () => {
    setStatus("Cloning...");
    const res = await cloneDriveLink(link);
    setStatus(res.message || "Done");
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Paste Google Drive link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <button onClick={handleClone}>Clone</button>
      <p>{status}</p>
    </div>
  );
}
