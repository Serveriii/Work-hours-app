class ProjectsController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  # GET /projects
  def index
    begin
      projects = Project.all
      render json: projects
    rescue => e
      Rails.logger.error e.message
      render json: { error: 'Failed to fetch projects' }, status: :internal_server_error
    end
  end

  # GET /projects/:id
  def show
    project = Project.find(params[:id])
    render json: project
  end

  # POST /projects
  def create
    begin
      project = Project.new(project_params)
      if project.save
        render json: project, status: :created
      else
        render json: { errors: project.errors.full_messages }, status: :unprocessable_entity
      end
    rescue => e
      Rails.logger.error e.message
      render json: { error: 'Failed to create project' }, status: :internal_server_error
    end
  end

  # PATCH/PUT /projects/:id
  def update
    project = Project.find(params[:id])
    if project.update(project_params)
      render json: project
    else
      render json: { errors: project.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /projects/:id
  def destroy
    begin
      project = Project.find(params[:id])
      if project.destroy
        head :no_content
      else
        render json: { error: 'Failed to delete project' }, status: :unprocessable_entity
      end
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Project not found' }, status: :not_found
    rescue => e
      Rails.logger.error e.message
      render json: { error: 'Failed to delete project' }, status: :internal_server_error
    end
  end

  private

  def project_params
    params.require(:project).permit(:title, :description, :project_done, :work_amount, :work_logged)
  end

  def record_not_found
    render json: { error: 'Project not found' }, status: :not_found
  end
end
