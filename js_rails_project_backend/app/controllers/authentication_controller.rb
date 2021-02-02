class AuthenticationController < ApplicationController
    def authenticate_user
        user = User.find_for_database_authentication(email: params[:email])
        if user.nil?
          render json: {errors: 'Cannot find user.'}, status: :unauthorized;
        else
          if user.valid_password?(params[:password])
            render json: payload(user)
          else
            render json: {errors: ['Invalid Username/Password'], status: false}, status: :unauthorized
          end
        end
    end

      private

    def payload(user)
      return nil unless user and user.id
      {
        auth_token: JsonWebToken.encode({user_id: user.id}),
        user: {id: user.id, email: user.email},
        status: :authorized
       }
    end
end