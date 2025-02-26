import React, { useState, useEffect } from "react";
import * as apiFunctions from "../functions/apiFunctions";

export default function ProjectList(dateFilter, projectFilter) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await apiFunctions.getProjects();
      setProjects(projects);
    };
    fetchProjects();
  }, []);

  return (
    <div>
      {projects.map((project) => (
        <div key={project.id}>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
        </div>
      ))}
  </div>
  );
}
