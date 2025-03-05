import React, { useState, useEffect } from "react";
import * as apiFunctions from "../functions/apiFunctions";
import "../styles/ProjectListStyles.css";
import ProjectListItem from "./ProjectListItem";

export default function ProjectList({ user, projects, projectFilter }) {
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [work_amount, setWorkAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ensure projects is an array before filtering
    if (Array.isArray(projects)) {
      if (projectFilter === "all") {
        setFilteredProjects(projects);
      } else {
        setFilteredProjects(
          projects.filter((project) => project.title === projectFilter)
        );
      }
    } else {
      console.error("Projects is not an array:", projects);
      setFilteredProjects([]); // Set empty array as fallback
    }
  }, [projectFilter, projects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await apiFunctions.createProject({
        title,
        description,
        project_done: false,
        work_amount: parseFloat(work_amount) || 0,
        work_logged: 0,
        work_amount_development: 0,
        work_amount_design: 0,
        work_amount_research: 0,
        work_amount_other: 0,
        work_amount_total: 0,
      });

      const updatedProjects = await apiFunctions.getProjects();
      setFilteredProjects(
        Array.isArray(updatedProjects) ? updatedProjects : []
      );
    } catch (error) {
      setError("Failed to create project");
      console.error("Error submitting project:", error);
    } finally {
      setIsLoading(false);
      setTitle("");
      setDescription("");
      setWorkAmount("");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setIsLoading(true);
      setError(null);
      try {
        await apiFunctions.deleteProject(id);
        const updatedProjects = await apiFunctions.getProjects();
        setFilteredProjects(
          Array.isArray(updatedProjects) ? updatedProjects : []
        );
      } catch (error) {
        setError("Failed to delete project");
        console.error("Error deleting project:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleProjectUpdate = (updatedProject) => {
    // Update the specific project in the filtered projects array
    setFilteredProjects((prevProjects) => {
      if (!Array.isArray(prevProjects)) return [];

      return prevProjects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      );
    });
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      {user.admin && (
        <div>
          <h2 className="sub-header">Add Project</h2>
          <form className="form-container" onSubmit={handleSubmit}>
            <input
              type="text"
              value={title}
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              value={description}
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="number"
              value={work_amount}
              placeholder="Planned work hours"
              onChange={(e) => setWorkAmount(e.target.value)}
            />
            <button className="button" type="submit">
              Add Project
            </button>
          </form>
        </div>
      )}
      <div className="project-list-container">
        {Array.isArray(filteredProjects) &&
          filteredProjects.map((project) => (
            <ProjectListItem
              key={project.id}
              project={project}
              handleDelete={handleDelete}
              adminStatus={user.admin}
              onProjectUpdate={handleProjectUpdate}
            />
          ))}
      </div>
    </div>
  );
}
