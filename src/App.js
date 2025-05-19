import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('a');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, [selectedCategory]);

  const fetchFiles = async () => {
    try {
      const res = await axios.get('https://server-svngoderma.onrender.com/api/upload', {
        params: selectedCategory ? { category: selectedCategory } : {},
      });
      setFiles(res.data);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  const handleUpload = async (e) => {
  e.preventDefault();

  if (!title.trim()) {
    alert('Title is required');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('category', category);
  if (file) {
    formData.append('file', file);
  }

  try {
    await axios.post('https://server-svngoderma.onrender.com/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setTitle('');
    setCategory('a');
    setFile(null);
    fetchFiles();
  } catch (err) {
    console.error('Upload failed:', err);
    alert('Upload failed, check console for details');
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await axios.delete(`https://server-svngoderma.onrender.com/api/upload/${id}`);
      fetchFiles();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: 'Arial, sans-serif', maxWidth: 900, margin: 'auto' }}>
      <h2 style={{ marginBottom: 20 }}>📤 Upload PDF or Image</h2>
      <form onSubmit={handleUpload} style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 30 }}>
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ flex: '1 1 200px', padding: 8 }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={{ flex: '1 1 120px', padding: 8 }}
        >
          <option value="" disabled>Select category</option>
          <option value="a" disabled>A : GENERAL INFORMATION</option>
          <option value="b">B: DOCUMENTS AND INFORMATION</option>
          <option value="c">C : RESULT AND ACADMICS</option>
          <option value="d" disabled>D : STAFF (TEACHING)</option>
          <option value="e" disabled>E: SCHOOL INFRASTRURE</option>
          <option value="f" disabled>F</option>
        </select>
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={(e) => setFile(e.target.files[0])}
          
          style={{ flex: '1 1 200px', padding: 8 }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Upload</button>
      </form>

      <h3>🔍 Filter by Category</h3>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={{ padding: 8, marginBottom: 30 }}
      >
        <option value="">All</option>
        <option value="a" disabled>A</option>
        <option value="b">B</option>
        <option value="c">C</option>
        <option value="d" disabled>D</option>
        <option value="e" disabled>E</option>
        <option value="f" disabled>F</option>
      </select>

      <h3>📂 Uploaded Files</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {files.map((file) => {
          const encodedFilePath = encodeURIComponent(file.filePath);
          const fileUrl = `https://server-svngoderma.onrender.com/uploads/${encodedFilePath}`;

          return (
            <li key={file._id} style={{
              border: '1px solid #ddd',
              borderRadius: 6,
              padding: 16,
              marginBottom: 20,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <div style={{ marginBottom: 8 }}>
                <strong>{file.title}</strong> ({file.category}) – {file.fileType}
              </div>
              {file.fileType.startsWith('image') ? (
                <img
                  src={fileUrl}
                  alt={file.title}
                  style={{ width: 150, marginTop: 10, borderRadius: 4 }}
                />
              ) : file.fileType === 'application/pdf' ? (
                <a href={fileUrl} target="_blank" rel="noreferrer" style={{ color: '#007bff' }}>
                  View PDF
                </a>
              ) : (
                <span>Unsupported file type</span>
              )}
              <br />
              <button
                onClick={() => handleDelete(file._id)}
                style={{
                  marginTop: 10,
                  background: '#e63946',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default App;
