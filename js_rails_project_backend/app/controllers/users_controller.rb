class UsersController < ApplicationController

    def index
        render json: {status: true, message: "User#index"}
    end

    def create
        Rails.logger.info("PARAMS: #{params.inspect}")
        user = User.find_by(:email => params[:email])
        if !user.nil? or !user.present?
            user = User.new(user_params)
            if user.save
                session[:user_id] = user.id
                render json: {status:true, first_name: user.first_name, last_name: user.last_name, email:user.email, password:user.password, id:user.id }
                return
            else
                render json: {status: false, message: user.errors.full_messages}
                return
            end
        else
            render json: {status: false, message: "User already exists at this e-mail address"}
            return
        end
        render json: {status: false, message: user.errors.full_messages}
    end

    private
    def user_params
        params.permit(:first_name, :last_name, :email, :password, :password_confirmation)
    end

end
