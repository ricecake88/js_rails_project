class ApplicationController < ActionController::API
    include ActionController::Cookies
    include ActionController::RequestForgeryProtection
    before_action :current_user

    #protect_from_forgery with: :exception
    #protect_from_forgery with :null_session

    def test
        render json: { test: "success" }
    end

    def set_user
        current_user = session[:user]
    end

    def logged_in
        !!session[:user_id]
    end

    def logout!
        session.clear
    end

    helpers do
    def current_user
        #nil || User.find(session[:user].id)
        if session[:user_id].present?
            User.find(session[:user_id])
        else
            nil
        end
    end
    end
end
