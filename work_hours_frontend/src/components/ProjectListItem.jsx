import React, { useState } from "react";
import { updateWorkLogged, getProjects } from "../functions/apiFunctions";

export default function ProjectListItem({
  project,
  handleDelete,
  adminStatus,
  onProjectUpdate,
}) {
  const [new_work_logged, setNewWorkLogged] = useState("");
  const [work_type, setWorkType] = useState("development");
  const [error, setError] = useState(null);
  const [localWorkLogged, setLocalWorkLogged] = useState(project.work_logged);

  const handleWorkLogSubmit = async () => {
    if (!new_work_logged || isNaN(parseFloat(new_work_logged))) {
      setError("Please enter a valid number of hours");
      return;
    }

    const newTotal = localWorkLogged + parseFloat(new_work_logged);
    setLocalWorkLogged(newTotal);
    setNewWorkLogged("");

    try {
      await updateWorkLogged(project.id, {
        work_logged: parseFloat(new_work_logged),
        work_type: work_type,
      });

      const updatedProjects = await getProjects();
      onProjectUpdate(updatedProjects);
    } catch (error) {
      setLocalWorkLogged(project.work_logged);
      setError("Failed to update work logged");
      console.error("Error updating work logged:", error);
    }
  };

  const parsedDate = new Date(project.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="project-list-item">
      {adminStatus && (
        <button
          className="delete-button"
          onClick={() => handleDelete(project.id)}
        >
          x
        </button>
      )}
      <h2>{project.title}</h2>
      <p>Started: {parsedDate}</p>
      <p>{project.description}</p>
      <div className="work-amount-container">
        <div className="work-amount-item">
          <p>Planned work hours</p>
          <p className="work-amount">{project.work_amount}</p>
        </div>
        <div className="work-amount-item">
          <p>Work done so far</p>
          <p className="work-logged">{localWorkLogged}</p>
        </div>
      </div>
      <div className="work-input-container">
        <p>Type of work</p>
        <select
          className="work-type-select"
          value={work_type}
          onChange={(e) => setWorkType(e.target.value)}
        >
          <option value="development">Development</option>
          <option value="design">Design</option>
          <option value="research">Research</option>
          <option value="other">Other</option>
        </select>
        <p>Add hours worked</p>
        <input
          className="work-input"
          type="number"
          value={new_work_logged}
          placeholder="Hours worked"
          onChange={(e) => setNewWorkLogged(e.target.value)}
        />
        <button className="button" onClick={handleWorkLogSubmit}>
          Log work hours
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
