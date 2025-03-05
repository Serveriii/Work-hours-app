class ProjectsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_project, only: [:show, :update, :destroy, :update_work_amount, :log_work]
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  # GET /projects
  def index
    begin
      Rails.logger.info "Authorization header: #{request.headers['Authorization']}"  # Debug log
      Rails.logger.info "Current user ID: #{@current_user_id}"  # Debug log
      
      projects = Project.order(created_at: :desc)
      render json: projects, status: :ok
    rescue => e
      Rails.logger.error "Projects index error: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render json: { error: 'Failed to fetch projects' }, status: :internal_server_error
    end
  end

  # GET /projects/:id
  def show
    render json: @project
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
    if @project.update(project_params)
      render json: @project
    else
      render json: { errors: @project.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /projects/:id
  def destroy
    begin
      if @project.destroy
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

  # PATCH/PUT /projects/:id/log_work
  def log_work
    return render json: { error: 'Project not found' }, status: :not_found unless @project

    work_type = project_params[:work_type]
    work_logged = project_params[:work_logged].to_f

    # Update the specific work type amount
    work_type_field = "work_amount_#{work_type}"
    current_amount = @project.send(work_type_field) || 0
    
    begin
      @project.update!(
        work_type_field => current_amount + work_logged,
        :work_logged => work_logged
      )
      
      render json: @project
    rescue => e
      Rails.logger.error "Failed to log work: #{e.message}"
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end

  def update_work_amount
    work_type = params[:work_type].downcase
    amount = params[:amount].to_f
    
    work_amount_field = "work_amount_#{work_type}"
    
    if @project.respond_to?(work_amount_field)
      if @project.update(work_amount_field => amount)
        render json: @project
      else
        render json: @project.errors, status: :unprocessable_entity
      end
    else
      render json: { error: "Invalid work type" }, status: :unprocessable_entity
    end
  end

  private

  def set_project
    @project = Project.find(params[:id])
  end

  def project_params
    params.require(:project).permit(
      :title, 
      :description, 
      :project_done, 
      :work_logged,
      :work_type,
      :work_amount_development,
      :work_amount_design,
      :work_amount_research,
      :work_amount_other
    )
  end

  def record_not_found
    render json: { error: 'Project not found' }, status: :not_found
  end
end
