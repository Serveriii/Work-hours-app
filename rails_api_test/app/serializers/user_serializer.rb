class UserSerializer
  include JSONAPI::Serializer
  
  attributes :id, :email, :username, :admin
end 