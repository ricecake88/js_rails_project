Rails.application.routes.draw do
  devise_for :users
  #devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get '/test', to: 'application#test'
  post '/signup', to: 'users#create'
  delete '/logout', to: 'sessions#destroy'
  post '/habit', to: 'habits#create'
  get '/habits', to: 'habits#index'
  #root to: 'users#index'
  post 'auth_user' => 'authentication#authenticate_user'
end
