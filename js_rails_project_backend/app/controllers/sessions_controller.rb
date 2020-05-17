class SessionsController < ApplicationController
    def new
        render json: {status: 'test'}
    end

    def create
        user = User.find_by(:email => params[:email])
        if user && user.authenticate(params[:password])
          sessions[:user_id] = user.id
          render json: user, include: [params[:first_name]];
        else
          render json: {status: false}
        end
    end

end