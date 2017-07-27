Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'static_pages#index'
  get '/puzzle' => 'static_pages#puzzle'

  get 'auth/:provider/callback', to: 'sessions#create'
  get 'auth/failure', to: redirect('/')
  get 'signout', to: 'sessions#destroy', as: 'signout'
  resources :session, only: [:create, :destroy]

  resources :puzzles, only: [:show]

  namespace :api do
    namespace :v1 do
      resources :puzzles, only: [:show]
    end
  end
end
