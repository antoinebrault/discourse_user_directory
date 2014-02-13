Rails.application.routes.draw do
  get "/directory", to: 'directories#index'
  resource :directory, only: [:index] do
    collection do
      get :users
    end
  end
  get "/directory/:query", to: 'directories#index'
end

