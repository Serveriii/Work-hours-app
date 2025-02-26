class ProjectsController < ApplicationController
  def index
    render json: Project.all
  end

  def create
    project = Project.new(project_params)
    if project.save
      render json: project, status: :created
    else
      render json: { errors: project.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    project = Project.find_by(title: params[:title])
    if project.update(project_params)
      render json: project, status: :ok
    else
      render json: { errors: project.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def project_params
    params.require(:project).permit(:title, :project_done, :work_amount, :work_logged)
  end
end
