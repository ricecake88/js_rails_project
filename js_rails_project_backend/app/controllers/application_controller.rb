class ApplicationController < ActionController::API
    include ActionController::Cookies
    include ActionController::RequestForgeryProtection

    #protect_from_forgery with: :exception
    #protect_from_forgery with :null_session

    def test
        render json: { test: "success" }
    end
end
