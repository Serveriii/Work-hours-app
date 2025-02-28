class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  # Add any additional fields you need
  validates :username, presence: true, uniqueness: true
  
  # Helper method to check if user is admin
  def admin?
    admin
  end
end