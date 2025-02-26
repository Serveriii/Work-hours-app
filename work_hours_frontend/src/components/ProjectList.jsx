import React, { useState, useEffect } from "react";
import * as apiFunctions from "../functions/apiFunctions";
import "../styles/ProjectListStyles.css";

export default function ProjectList(dateFilter, projectFilter) {
  const [projects, setProjects] = useState([]);
  const [isAdmin, setIsAdmin] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [work_amount, setWorkAmount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setProjects(updatedProjects);
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
        setProjects(updatedProjects);
      } catch (error) {
        setError("Failed to delete project");
        console.error("Error deleting project:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await apiFunctions.getProjects();
        setProjects(projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div>
      {isAdmin && (
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
              placeholder="Work Amount"
              onChange={(e) => setWorkAmount(e.target.value)}
            />
            <button className="button" type="submit">
              Add Project
            </button>
          </form>
        </div>
      )}
      {projects.map((project) => (
        <div
          key={project.id}
          style={{
            position: "relative",
            padding: "10px",
            margin: "10px 0",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <button
            className="delete-button"
            onClick={() => handleDelete(project.id)}
          >
            x
          </button>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <p>Work Amount: {project.work_amount}</p>
          <p>Work Logged: {project.work_logged}</p>
        </div>
      ))}
    </div>
  );
}
