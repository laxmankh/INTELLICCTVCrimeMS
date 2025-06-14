import React, { useState, useEffect } from "react";
import "./CrimeDashboard.css";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const CrimeDashboard = () => {
  const [view, setView] = useState("dashboard");
  const [allCrimeRecords, setAllCrimeRecords] = useState([]);
  const [pastCrimeRecordsData, setPastCrimeRecordsData] = useState([]);
  const [currentCrimeRecordsData, setCurrentCrimeRecordsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCrimeRecords = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "http://localhost:3000/api/records/crimerecords"
        );
        setAllCrimeRecords(response.data);
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

    fetchCrimeRecords();
  }, []);

  useEffect(() => {
    setPastCrimeRecordsData(allCrimeRecords.filter(record => record.crime === 'past'));
    setCurrentCrimeRecordsData(allCrimeRecords.filter(record => record.crime === 'current'));
  }, [allCrimeRecords]);

  // Common function for pie and bar chart
  const getChartData = (records) => {
    const typeCounts = records.reduce((acc, record) => {
      acc[record.type] = (acc[record.type] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(typeCounts).map((type) => ({
      name: type,
      value: typeCounts[type],
    }));
  };

  // Function to get chart data grouped by location
  const getLocationChartData = (records) => {
    const locationCounts = records.reduce((acc, record) => {
      acc[record.location] = (acc[record.location] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(locationCounts).map((location) => ({
      name: location,
      value: locationCounts[location],
    }));
  };
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

  return (
    <div className="crime-dashboard">
      <h1>Crime Dashboard</h1>
      <div className="button-group">
        <button
          onClick={() => setView("pastRecords")}
          className={`crime-button ${view === "pastRecords" ? "active" : ""}`}
          disabled={loading}
        >
          Past Crime Records
        </button>
        <button
          onClick={() => setView("liveCrimeMap")}
          className={`crime-button ${
            view === "liveCrimeMap" ? "active" : ""
          }`}
          disabled={loading}
        >
          Current Crime Records
        </button>
      </div>

      {view === "dashboard" && <p>Select an option to view crime data.</p>}

      {view === "pastRecords" && (
        <div>
          <h2>Past Crime Records</h2>
          {loading && <p>Loading past records...</p>}
          {error && <p className="error-message">Error: {error}</p>}
          {!loading && !error && pastCrimeRecordsData.length === 0 && (
            <p>No past crime records found.</p>
          )}
          {!loading && !error && pastCrimeRecordsData.length > 0 && (
          <table className="crime-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Location</th>
                <th>Time</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {pastCrimeRecordsData.map((record) => (
                <tr key={record._id}>
                  <td>{record.type}</td>
                  <td>{record.location}</td>
                  <td>{new Date(record.time).toLocaleString()}</td>
                  <td>{record.confidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}

          {!loading && !error && pastCrimeRecordsData.length > 0 && (
            <>
            <h3>Crime Distribution by Type (Pie)</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={getChartData(pastCrimeRecordsData)}
              cx={200}
              cy={150}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {getChartData(pastCrimeRecordsData).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>

          <h3>Crime Count by Location (Bar Chart)</h3>
          <BarChart
            width={600} 
            height={300}
            data={getLocationChartData(pastCrimeRecordsData)}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }} // Increased bottom margin for labels
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} /> {/* Rotate labels */}
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" name="Number of Crimes" />
              </BarChart>
            </>
          )}
        </div>
      )}

      {view === "liveCrimeMap" && (
        <div>
          <h2>Current Crime Records</h2>
          {loading && <p>Loading current records...</p>}
          {error && <p className="error-message">Error: {error}</p>}
          {!loading && !error && currentCrimeRecordsData.length === 0 && (
            <p>No current crime records found.</p>
          )}
          {!loading && !error && currentCrimeRecordsData.length > 0 && (
          <table className="crime-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Location</th>
                <th>Time</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {currentCrimeRecordsData.map((record) => (
                <tr key={record._id}>
                  <td>{record.type}</td>
                  <td>{record.location}</td>
                  <td>{new Date(record.time).toLocaleString()}</td>
                  <td>{record.confidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}

          {!loading && !error && currentCrimeRecordsData.length > 0 && (
            <>
            <h3>Current Crime Distribution by Type (Pie)</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={getChartData(currentCrimeRecordsData)}
              cx={200}
              cy={150}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {getChartData(currentCrimeRecordsData).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>

          <h3>Current Crime Count by Location (Bar Chart)</h3>
          <BarChart
            width={600}
            height={300}
            data={getLocationChartData(currentCrimeRecordsData)}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }} // Increased bottom margin
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} /> {/* Rotate labels */}
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" name="Number of Crimes" />
              </BarChart>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CrimeDashboard;
