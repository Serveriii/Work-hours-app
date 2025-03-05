import React, { useState } from "react";
import { updateWorkLogged, updateWorkAmount } from "../functions/apiFunctions";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const selectableWorkTypes = [
  "All",
  "Development",
  "Design",
  "Research",
  "Other",
];

export default function ProjectListItem({
  project,
  handleDelete,
  adminStatus,
  onProjectUpdate,
}) {
  const [new_work_logged, setNewWorkLogged] = useState("");
  const [work_type, setWorkType] = useState("development");
  const [workTypeList, setWorkTypeList] = useState(selectableWorkTypes);
  const [workTypeIndex, setWorkTypeIndex] = useState(0);
  const [error, setError] = useState(null);
  const [localWorkLogged, setLocalWorkLogged] = useState(project.work_logged);

  const handleArrowClick = (arrowDirection) => {
    if (arrowDirection === "left" && workTypeIndex > 0) {
      setWorkTypeIndex(workTypeIndex - 1);
    } else if (
      arrowDirection === "right" &&
      workTypeIndex < workTypeList.length - 1
    ) {
      setWorkTypeIndex(workTypeIndex + 1);
    }
  };

  const getCurrentWorkAmount = () => {
    const workType = workTypeList[workTypeIndex].toLowerCase();
    return workType === "all"
      ? project.work_amount_total
      : project[`work_amount_${workType}`] || 0;
  };

  const handleWorkLogSubmit = async () => {
    try {
      const amount = parseFloat(new_work_logged);
      if (isNaN(amount) || amount < 0) {
        setError("Please enter a valid number");
        return;
      }

      // Update both work logged and work amount for the specific type
      await updateWorkLogged(project.id, {
        work_logged: amount,
        work_type: work_type,
      });

      // Update the work amount for the specific type
      const updatedProject = await updateWorkAmount(
        project.id,
        work_type,
        getCurrentWorkAmount() + amount
      );

      setLocalWorkLogged(updatedProject.work_logged);
      setNewWorkLogged("");
      setError(null);

      if (onProjectUpdate) {
        onProjectUpdate(updatedProject);
      }
    } catch (error) {
      console.error("Error updating work:", error);
      setError("Failed to update work logged");
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
          <div className="work-amount-item-arrow-container">
            <div className="work-amount-item-arrow">
              <ArrowLeftIcon
                fontSize="large"
                color="primary"
                onClick={() => handleArrowClick("left")}
              />
            </div>
            <p>{workTypeList[workTypeIndex]}</p>
            <div className="work-amount-item-arrow">
              <ArrowRightIcon
                fontSize="large"
                color="primary"
                onClick={() => handleArrowClick("right")}
              />
            </div>
          </div>
          <p className="work-logged">{getCurrentWorkAmount()}</p>
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
