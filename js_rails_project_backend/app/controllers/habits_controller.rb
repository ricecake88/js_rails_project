class HabitsController < ApplicationController

    before_action :authenticate_request!

    def index
        if logged_in?
            render json: {status: true, message: @current_user}
        else
            render json: {status: false, message: "BOOOOO"}
        end
    end

    def create
        user = User.find_by(:email => params[:email])
        if user.present?
            habit = Habit.find_by(:name => params[:name], :user => user.id)
            if (habit.present?)
                render json: {status: false, message: "Habit already exists."}
            else
                habit = Habit.new(habit_params)
                habit.user = user
                if habit.save!
                    render json: {status: true, name: params[:name], frequency_mode: params[:frequency_mode]}
                else
                    render json: {status: false, message: "Habit could not be saved " + (params[:frequency_mode]).to_str}
                end
            end
        else
            render json: {status: false, message: "User could not be found"}
        end
    end

    private
    def habit_params
        params.permit(:name, :frequency_mode)
    end
end