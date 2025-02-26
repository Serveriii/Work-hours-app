import React, { useState } from "react";
import "../styles/BaseStyles.css";
import "../styles/ProjectsScreen.css";
import ProjectList from "../components/ProjectList";


export default function ProjectsScreen() {
      const [dateFilter, setDateFilter] = useState("all");
      const [projectFilter, setProjectFilter] = useState("all");
      const [userFilter, setUserFilter] = useState("all");

    
  return (
    <>
      <div className="filter-container">
        <div className="filter-item">
          <h2 className="body-text">Date</h2>
          <select
            className="body-text"
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="thisYear">This Year</option>
          </select>
        </div>
        <div className="filter-item">
          <h2 className="body-text">Project</h2>
          <select
            className="body-text"
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="project1">Project 1</option>
            <option value="project2">Project 2</option>
            <option value="project3">Project 3</option>
          </select>
        </div>
      </div>
      <ProjectList dateFilter={dateFilter} projectFilter={projectFilter} />
    </>
  );
}

