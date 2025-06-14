import React, { useState, useEffect } from "react";
import "./CrimeRecords.css";
import axios from "axios";

const CrimeRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "http://localhost:3000/api/records/crimerecords"
        );
        setRecords(response.data);
      } catch (err) {
        console.error("Error fetching crime records:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch crime records."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []); // Empty dependency array means this runs once on component mount

  const filteredRecords = records.filter(record =>
    record.type.toLowerCase().includes(search.toLowerCase()) ||
    record.location.toLowerCase().includes(search.toLowerCase()) ||
    record.time.toLowerCase().includes(search.toLowerCase()) ||
    record.confidence.toString().toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="crime-container">
      <h2>Crime Records</h2>
      <input
        // Disable search while loading
        disabled={loading}
        className="search-bar"
        type="text"
        placeholder="Search records..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="crime-table">
        {/* Display loading or error messages */}
        {loading && (
          <caption>Loading records...</caption>
        )}
        {error && (
          <caption className="error-message">Error: {error}</caption>
        )}
        {/* Display message if no records found after loading */}
        {!loading && !error && records.length === 0 && <caption>No crime records found.</caption>}
        <thead>
          <tr>
            <th>Type</th>
            <th>Location</th>
            <th>Time</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record, index) => (
            <tr key={record._id}>
              <td>{record.type}</td>
              <td>{record.location}</td>
              <td>{new Date(record.time).toLocaleString()}</td> {/* Format the date */}
              <td>{record.confidence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CrimeRecords;
