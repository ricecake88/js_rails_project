class UsersController < ApplicationController

    def create
        user = User.find_by(:email => params[:email])
        if !user.present?
            user = User.new(user_params)
            if user.save
                session[:user_id] = user.id
                render json: {status:true, first_name: user.first_name, last_name: user.last_name, email:user.email }
            end
        else
            render json: {status: false, message: "User already exists at this e-mail address"}
        end
    end

    private
    def user_params
        params.permit(:firstName, :lastName, :email, :password)
    end    

end
