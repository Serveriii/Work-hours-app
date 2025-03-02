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
    if (projectFilter === "all") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter((project) => project.title === projectFilter));
    }
  }, [projectFilter]);

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
      });
      setTitle("");
      setDescription("");
      setWorkAmount("");
      const updatedProjects = await apiFunctions.getProjects();
      setFilteredProjects(updatedProjects);
    } catch (error) {
      setError("Failed to create project");
      console.error("Error submitting project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setIsLoading(true);
      setError(null);
      try {
        await apiFunctions.deleteProject(id);
        const updatedProjects = await apiFunctions.getProjects();
        setFilteredProjects(updatedProjects);
      } catch (error) {
        setError("Failed to delete project");
        console.error("Error deleting project:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleProjectUpdate = (updatedProjects) => {
    setFilteredProjects(updatedProjects);
  };


  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      {Boolean(user.admin) && (
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
        {filteredProjects.map((project) => (
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
