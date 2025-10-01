import React, { useEffect, useState } from "react";
import "../Style/Config.css";
import { toast } from "react-toastify";

function Controls({ endpoints, setShowControls }) {
const API_URL = import.meta.env.VITE_API_URL;


  const [toggles, setToggles] = useState({
    api: false,
    tracer: false,
    limit: false,
    schedule: false,
  });

  const [limitValues, setLimitValues] = useState({ number: "", rate: "" });

  const [scheduleValues, setScheduleValues] = useState({ start: "", end: "" });
  

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/logs/control`);
      const result = await res.json();

      if (result.data && result.data.length > 0) {
        const endpointData = result.data.find((d) => d.endpoint === endpoints);

        if (endpointData) {
          setToggles(
            endpointData.toggles || {
              api: false,
              tracer: false,
              limit: false,
              schedule: false,
            }
          );

          setLimitValues({
            number: endpointData.limitValues?.number?.toString() || "",
            rate: endpointData.limitValues?.rate?.toString() || "",
          });

          setScheduleValues({
            start: endpointData.scheduleValues?.start || "",
            end: endpointData.scheduleValues?.end || "",
          });
        } else {
          setToggles({
            api: false,
            tracer: false,
            limit: false,
            schedule: false,
          });
          setLimitValues({ number: "", rate: "" });
          setScheduleValues({ start: "", end: "" });
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = (key) => {
    setToggles((prev) => {
      const newToggles = { ...prev, [key]: !prev[key] };

      // Reset values if toggle is turned off
      if (key === "limit" && prev.limit) {
        setLimitValues({ number: "", rate: "" });
      }
      if (key === "schedule" && prev.schedule) {
        setScheduleValues({ start: "", end: "" });
      }

      return newToggles;
    });
  };

  const handleLimitChange = (e) => {
    const { name, value } = e.target;
    setLimitValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setScheduleValues((prev) => ({ ...prev, [name]: value }));
  };

  const saveData = async (payload) => {
    try {
      const res = await fetch(`${API_URL}/api/logs/control`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" ,"x-api-key":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOiJQcm9qZWN0IiwiaWF0IjoxNzU5MjI1Mzg4LCJleHAiOjE3NjE4MTczODh9.x-RBO2Sv00Ut0ZYUOCRjJt36SH_ZwanTqehVQ9oyERM",
          },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Configuration saved successfully!");
      }
      else {
        toast.error("Error saving settings.");
        console.error("Error saving:", result);
      }
    } catch (error) {
      toast.error("Error saving settings.");
      console.error("Error saving data:", error);
    }
  };

  const handleSave = () => {
    if(toggles.limit){
      if (!limitValues.number || !limitValues.rate) {
      toast.error("Please enter both number and rate.");
      return;
    }
  }
     if (toggles.schedule) {
    if (!scheduleValues.start || !scheduleValues.end) {
      toast.error("Please enter both start and end times.");
      return;
    }

    // Convert times to Date objects for comparison
    const startTime = new Date(`1970-01-01T${scheduleValues.start}:00`);
    const endTime = new Date(`1970-01-01T${scheduleValues.end}:00`);

    if (startTime >= endTime) {
      toast.error("Start time must be earlier than end time.");
      return;
    }
  }
    const payload = {
      endpoint: endpoints,
      toggles,
      limitValues: {
        number: limitValues.number === "" ? null : Number(limitValues.number),
        rate: limitValues.rate === "" ? null : Number(limitValues.rate),
      },
      scheduleValues: {
        start: scheduleValues.start === "" ? null : scheduleValues.start,
        end: scheduleValues.end === "" ? null : scheduleValues.end,
      },
    };

    saveData(payload);
    setShowControls(false);
  };

  return (
    <div className="controls-panel">
      
      <h3>Controls</h3>

      <div className="control-row">
        <span>API</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={toggles.api}
            onChange={() => handleToggle("api")}
          />
          <span className="slider"></span>
        </label>
      </div>

      <div className="control-row">
        <span>Tracer</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={toggles.tracer}
            onChange={() => handleToggle("tracer")}
          />
          <span className="slider"></span>
        </label>
      </div>

      <div className="control-row">
        <span>Set Limit</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={toggles.limit}
            onChange={() => handleToggle("limit")}
          />
          <span className="slider"></span>
        </label>
      </div>

      {toggles.limit && (
        <div className="inline-form">
          <label>Number of Requests</label>
          <input
            type="number"
            name="number"
            value={limitValues.number}
            onChange={handleLimitChange}
          />
          <label htmlFor="rate">Rate</label>
          <input
            type="number"
            name="rate"
            placeholder="min"
            value={limitValues.rate}
            onChange={handleLimitChange}
          />
        </div>
      )}

      <div className="control-row">
        <span>Schedule On/Off</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={toggles.schedule}
            onChange={() => handleToggle("schedule")}
          />
          <span className="slider"></span>
        </label>
      </div>

      {toggles.schedule && (
        <div className="inline-form2">
          <label htmlFor="start">Start</label>
          <input
            type="time"
            name="start"
            value={scheduleValues.start}
            onChange={handleScheduleChange}
          />
          <label htmlFor="end">End</label>
          <input
            type="time"
            name="end"
            value={scheduleValues.end}
            onChange={handleScheduleChange}
          />
        </div>
      )}

      <div className="bcontainer">
        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}

export default Controls;