Rails.application.routes.draw do
  resources :users, only: [:index]
  resources :projects, only: [:index, :create, :update]
end
