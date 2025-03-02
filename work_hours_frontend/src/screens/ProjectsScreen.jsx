import React, { useEffect, useState } from "react";
import "../styles/BaseStyles.css";
import "../styles/ProjectsScreen.css";
import ProjectList from "../components/ProjectList";
import { getProjects } from "../functions/apiFunctions";

export default function ProjectsScreen({ user }) {
  const [dateFilter, setDateFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const fetchedProjects = await getProjects();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  return (
    <>
      <div className="filter-container">
        <div className="filter-item">
          <h2 className="body-text">Date</h2>
          <select
            className="body-text filter-select"
            onChange={(e) => setDateFilter(e.target.value)}
            value={dateFilter}
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
            className="body-text filter-select"
            onChange={(e) => setProjectFilter(e.target.value)}
            value={projectFilter}
          >
            <option value="all">All</option>
            {projects.map((project) => (
              <option key={project.id} value={project.title}>
                {project.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <ProjectList
        user={user}
        projects={projects}
        projectFilter={projectFilter}
      />
    </>
  );
}
