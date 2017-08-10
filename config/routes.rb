Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'static_pages#index'

  get 'auth/:provider/callback', to: 'sessions#create'
  get 'auth/failure', to: redirect('/')
  get 'signout', to: 'sessions#destroy', as: 'signout'
  resources :session, only: [:create, :destroy]

  resources :puzzles, only: [:index, :show, :new, :create, :edit] do
    collection do
      get :random
    end
  end

  resources :users, only: [] do
    resources :puzzles, only: [:index]
  end

  namespace :api do
    namespace :v1 do
      resources :words, only: [:index] do
        collection do
          get :analyze
        end
      end

      resources :puzzles, only: [:show, :update] do
        member do
          patch :publish
          put :publish
        end
      end

      resources :users, only: [] do
        resources :solutions, only: [:update]
      end
    end
  end
end
