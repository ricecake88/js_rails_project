class HabitsController < ApplicationController

    #before_action :authenticate_request!, only: [:index]
    before_action :authenticate_request!

    def index
        if logged_in?
            habits = Habit.where(:user_id => @current_user.id)
            if !habits.present?
                render json: {status: true, first_name: @current_user.first_name, last_name: @current_user.last_name, email: @current_user.email, password: @current_user.encrypted_password, id: @current_user.id, habits:''};
            else
                render json: {status: true, first_name: @current_user.first_name, last_name: @current_user.last_name, email: @current_user.email, password: @current_user.encrypted_password, id: @current_user.id, habits: habits}
            end
        else
            render json: {status: false}
        end
    end

    def create
        if logged_in?
            Rails.logger.info("PARAMS: #{params.inspect}")
            habit = Habit.find_by(:name => params[:name], :user_id => @current_user.id)
            if !habit.present?
                habit = Habit.new(habit_params)
                if habit.save!
                    habit.user = @current_user
                    render json: {status: true, message: "habit saved"}
                end

            else
                render json: {status: false, message: "habit exists"}
            end
        else
            render json: {status: false, message: "Not Logged In"}
        end
    end

    private
    def habit_params
        params.require(:habit).permit(:name, :frequency_mode, :user_id)
    end
end