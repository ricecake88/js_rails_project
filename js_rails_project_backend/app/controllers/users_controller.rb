class UsersController < ApplicationController

    def create
        user = User.find_by(:email => params[:email_address])
        if !user.present?
            user = User.new(user_params)
            if user.save
                session[:user_id] = user.id
                render json: {status: true, first_name: user.first_name }
            end
        else
            render json: {status: false, message: "User already exists at this e-mail address"};
        end
    end

    private
    def user_params
        params.permit(:first_name, :last_name, :email_address, :password)
    end    

end
