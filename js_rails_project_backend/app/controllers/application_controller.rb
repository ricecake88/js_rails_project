class ApplicationController < ActionController::API
    #include ActionController::Cookies
    #include ActionController::RequestForgeryProtection
    attr_reader :current_user

    #protect_from_forgery with: :exception
    #protect_from_forgery with :null_session

    def test
      render json: { test: "success" }
    end

    def logged_in?
      !!@current_user
    end

    protected
    def authenticate_request!
        unless user_id_in_token?
            render json: { errors: ['Not Authenticated'] }, status: :unauthorized
            return
        end
        @current_user = User.find(auth_token[:user_id])
        rescue JWT::VerificationError, JWT::DecodeError
        render json: {errors: ['Not Authenticated'] }, status: :unauthorized
    end

    private
    def http_token
        @http_token ||= if request.headers['Authorization'].present?
          request.headers['Authorization'].split(' ').last
        end
    end

    def auth_token
      @auth_token ||= JsonWebToken.decode(http_token)
    end

    def user_id_in_token?
      http_token && auth_token && auth_token[:user_id].to_i
    end

  end
