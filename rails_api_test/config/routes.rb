Rails.application.routes.draw do
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }
  resources :users, only: [:index]
  resources :projects do
    member do
      put 'log_work'
    end
  end
end
