Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get '/test', to: 'application#test'
  post '/login', to: 'sessions#create'
  post '/signup', to: 'users#create'
end
