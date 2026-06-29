import React, { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { fetchResources, createResource, deleteResource } from "../utils/api";
import "./Resources.css";
import "../components/TasksGoals/TasksGoals.css";

function Resources() {
  const [resources, setResources] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  
  // Modal State
  const [uploadMode, setUploadMode] = useState("FILE"); // "FILE" or "URL"
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("PDF");
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const resData = await fetchResources();
      setResources(resData || []);
    } catch (err) {
      console.error("Error fetching resources:", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert("File is too large! Please upload files under 15 MB.");
      return;
    }

    setIsUploading(true);
    setFileName(file.name);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    setFileSize(sizeInMb);
    
    if (!title) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setTitle(nameWithoutExt);
    }

    if (file.name.endsWith(".pdf")) setType("PDF");
    else if (file.name.match(/\.(mp4|mov|avi|webm)$/i)) setType("Video");
    else setType("Document");

    const reader = new FileReader();
    reader.onload = (event) => {
      setUrl(event.target.result);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim()) {
      alert("Please enter a title and subject.");
      return;
    }
    if (!url) {
      alert(uploadMode === "FILE" ? "Please select a file to attach." : "Please enter a valid URL.");
      return;
    }

    try {
      await createResource({
        title: title.trim(),
        subject: subject.trim(),
        type: uploadMode === "FILE" ? (type || "PDF") : (url.includes("youtube") || url.includes("youtu.be") ? "Video" : "Link"),
        url: url,
        fileName: fileName || undefined,
        fileSize: fileSize || undefined
      });
      
      setShowModal(false);
      resetForm();
      loadData();
    } catch (err) {
      console.error("Error creating resource:", err);
      alert("Failed to save resource. Please try again.");
    }
  };

  const handleDelete = async (id, resTitle) => {
    if (window.confirm(`Are you sure you want to delete "${resTitle}"?`)) {
      await deleteResource(id);
      loadData();
    }
  };

  const resetForm = () => {
    setTitle("");
    setSubject("");
    setType("PDF");
    setUrl("");
    setFileName("");
    setFileSize("");
    setUploadMode("FILE");
  };

  const filtered = resources.filter(r => {
    return filter === "All" || 
      (filter === "PDF" && (r.type === "PDF" || r.type === "Document")) ||
      (filter === "Video" && r.type === "Video") ||
      (filter === "Link" && r.type === "Link");
  });

  const getBadgeClass = (resType) => {
    if (resType === "PDF" || resType === "Document") return "badge-pdf";
    if (resType === "Video") return "badge-video";
    return "badge-link";
  };

  const getBadgeText = (resType) => {
    if (resType === "PDF" || resType === "Document") return "PDF";
    if (resType === "Video") return "VID";
    return "WEB";
  };

  return (
    <AppLayout>
      <div className="resources-container">
        {/* Segmented Filter Bar */}
        <div className="resources-filter-bar">
          <button className={`filter-pill ${filter === "All" ? "active" : ""}`} onClick={() => setFilter("All")}>All Resources ({resources.length})</button>
          <button className={`filter-pill ${filter === "PDF" ? "active" : ""}`} onClick={() => setFilter("PDF")}>PDFs & Docs</button>
          <button className={`filter-pill ${filter === "Video" ? "active" : ""}`} onClick={() => setFilter("Video")}>Videos</button>
          <button className={`filter-pill ${filter === "Link" ? "active" : ""}`} onClick={() => setFilter("Link")}>Web Links</button>
        </div>

        {/* Grid featuring Add Resource Card AFTER existing notes/cards */}
        <div className="resources-grid">
          {filtered.map((res) => (
            <div key={res._id || res.id} className="resource-card">
              <div>
                <div className="resource-card-header">
                  <div className={`resource-icon-badge ${getBadgeClass(res.type)}`}>
                    {getBadgeText(res.type)}
                  </div>
                  <span className="resource-subject-pill">{res.subject || "General"}</span>
                </div>

                <h3 className="resource-title" style={{ marginTop: 18 }}>{res.title}</h3>
                
                <div className="resource-meta" style={{ marginTop: 10 }}>
                  {res.fileName ? (
                    <span>{res.fileName} ({res.fileSize || "Attachment"})</span>
                  ) : (
                    <span>{res.url.length > 42 ? res.url.substring(0, 42) + "..." : res.url}</span>
                  )}
                </div>
              </div>

              <div className="resource-card-footer">
                <a 
                  href={res.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  download={res.fileName ? res.fileName : undefined}
                  className="btn-open-resource"
                >
                  {res.fileName || res.url.startsWith("data:") ? "Download / View" : "Open Link"}
                </a>
                <button 
                  className="btn-delete-resource" 
                  title="Delete resource"
                  onClick={() => handleDelete(res._id || res.id, res.title)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* Add Resource Interactive Box placed AFTER existing cards */}
          <div className="add-resource-card" onClick={() => { resetForm(); setShowModal(true); }}>
            <div className="add-resource-icon-circle">+</div>
            <div>
              <h3 className="add-resource-title">Add New Resource</h3>
              <p className="add-resource-subtitle" style={{ marginTop: 6 }}>UPLOAD PDF, MP4 OR LINK</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Add Resource Modal */}
      {showModal && (
        <div className="modern-modal-backdrop">
          <div className="modern-modal-card" style={{ maxWidth: 480 }}>
            <div className="modern-modal-header">
              <div>
                <h2 className="modern-modal-title">Add Resource</h2>
                <div className="modern-modal-subtitle">Attach a file from your laptop or paste a web link</div>
              </div>
              <button type="button" className="modern-close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Upload Mode Type Selector */}
              <div className="type-selector">
                <div 
                  className={`type-option ${uploadMode === "FILE" ? "selected" : ""}`}
                  onClick={() => setUploadMode("FILE")}
                >
                  <span>Attach PDF / File</span>
                </div>
                <div 
                  className={`type-option ${uploadMode === "URL" ? "selected" : ""}`}
                  onClick={() => setUploadMode("URL")}
                >
                  <span>Web / YouTube Link</span>
                </div>
              </div>

              {/* Title & Subject */}
              <div className="modern-form-group">
                <label className="modern-label">Resource Title</label>
                <input 
                  type="text" 
                  className="modern-input" 
                  placeholder={uploadMode === "FILE" ? "e.g. Chapter 4 Lecture Notes (Auto-filled on file select)" : "e.g. React Hooks Crash Course"}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="modern-form-group">
                <label className="modern-label">Subject / Course</label>
                <input 
                  type="text" 
                  className="modern-input" 
                  placeholder="e.g. Operating Systems, Physics, Web Dev"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  required
                />
              </div>

              {/* File Attachment Drop Zone */}
              {uploadMode === "FILE" ? (
                <div className="modern-form-group">
                  <label className="modern-label">Upload File from Laptop</label>
                  <div className="file-drop-zone">
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg" 
                      onChange={handleFileChange}
                    />
                    {fileName ? (
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--text-heading)", wordBreak: "break-all" }}>{fileName}</div>
                        <div style={{ fontSize: "0.85rem", color: "#10B981", marginTop: 4 }}>Ready to attach ({fileSize})</div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-body)" }}>Click to browse or drag file here</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>Supports PDF, Word Docs, PPT, TXT (Max 15MB)</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* URL Input */
                <div className="modern-form-group">
                  <label className="modern-label">URL Link</label>
                  <input 
                    type="url" 
                    className="modern-input" 
                    placeholder="https://youtube.com/watch?v=..."
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    required={uploadMode === "URL"}
                  />
                </div>
              )}

              <div className="modern-modal-actions" style={{ justifyContent: "flex-end" }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <button type="button" className="modern-btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="modern-btn-save" disabled={isUploading}>
                    {isUploading ? "Processing..." : "Save Resource"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default Resources;
