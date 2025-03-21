class Users::SessionsController < Devise::SessionsController
  respond_to :json
  skip_before_action :verify_signed_out_user, only: :destroy

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        status: { code: 200, message: 'Logged in successfully.' },
        data: {
          user: {
            id: resource.id,
            email: resource.email,
            username: resource.username,
            admin: resource.admin || false
          }
        }
      }
    else
      render json: {
        status: { code: 401, message: "Invalid credentials" }
      }, status: :unauthorized
    end
  end

  def respond_to_on_destroy
    if current_user
      render json: {
        status: 200,
        message: "Logged out successfully"
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session."
      }, status: :unauthorized
    end
  end
end 