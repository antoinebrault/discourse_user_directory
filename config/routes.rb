Rails.application.routes.draw do
  get "/directory" => 'directories#index'
  resource :directory, only: [:index] do
    collection do
      get :users
    end
  end
end

