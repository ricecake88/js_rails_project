class SessionsController < ApplicationController

    def new
        render json: {status: 'test'}
    end

    def create
        user = User.find_by(:email => params[:email])
        if user && user.authenticate(params[:password])
          session[:user_id] = user.id
          render json: {status: true, "email": user.email, "first_name": user.first_name, "last_name": user.last_name};
        else
          render json: {status: false}
        end
    end

    def destroy
      session.delete(:user_id)
      render json: {status: true}
    end

end