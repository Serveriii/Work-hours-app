class ApplicationController < ActionController::API
  include ActionController::Cookies
  
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :authenticate_user!
  skip_before_action :authenticate_user!, if: :devise_controller?
  
  respond_to :json

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:username])
    devise_parameter_sanitizer.permit(:account_update, keys: [:username])
  end

  private

  def authenticate_user!
    Rails.logger.info "Headers: #{request.headers.to_h}"

    unless request.headers['Authorization'].present?
      Rails.logger.info "No Authorization header present"
      return render json: { error: 'No token provided' }, status: :unauthorized 
    end

    begin
      auth_header = request.headers['Authorization']
      token = auth_header.split(' ').last
      Rails.logger.info "Token being decoded: #{token}"

      jwt_payload = JWT.decode(
        token,
        Rails.application.credentials.devise_jwt_secret_key,
        true,
        { 
          algorithm: 'HS256',
          verify_jti: true
        }
      ).first

      Rails.logger.info "Decoded payload: #{jwt_payload}"
      @current_user_id = jwt_payload['sub']
      
      # Verify user exists
      unless User.exists?(@current_user_id)
        Rails.logger.info "User not found with ID: #{@current_user_id}"
        return render json: { error: 'User not found' }, status: :unauthorized
      end

    rescue JWT::ExpiredSignature
      Rails.logger.info "Token expired"
      render json: { error: 'Token has expired' }, status: :unauthorized
    rescue JWT::DecodeError => e
      Rails.logger.info "JWT decode error: #{e.message}"
      render json: { error: 'Invalid token' }, status: :unauthorized
    rescue => e
      Rails.logger.error "Authentication error: #{e.class} - #{e.message}"
      render json: { error: 'Authentication failed' }, status: :unauthorized
    end
  end

  def current_user
    @current_user ||= User.find(@current_user_id)
  end
end
