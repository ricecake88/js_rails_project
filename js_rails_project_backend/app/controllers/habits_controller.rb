class HabitsController < ApplicationController

    #before_action :authenticate_request!, only: [:index]
    before_action :authenticate_request!

    def index
        unless logged_in?
            render json: {status: false}
        else
            habits = Habit.where(:user_id => @current_user.id)
            render json: {status: true, first_name: @current_user.first_name, last_name: @current_user.last_name, email: @current_user.email, password: @current_user.encrypted_password, id: @current_user.id, habits: habits}
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
                    render json: {status: true, message: "habit saved", habit: habit}
                end

            else
                render json: {status: false, errors: habit.errors.full_messages.push("Habit Already Exists")}
            end
        else
            render json: {status: false, message: "Not Logged In"}
        end
    end

    def update
        unless logged_in?
            render json: {status: false}
        else
            habit = Habit.find(params[:id])
            if habit.update(:name => params[:name])
                render json: {status: true, habit: habit}
            end
        end
    end

    def destroy
        if logged_in?
            name = params['name']
            habit = Habit.find(params[:id]).habit_records.destroy_all
            Habit.find(params[:id]).destroy
            render json: {status: true, id: params['id'], message: name + " has been deleted." };
        end
    end

    private
    def habit_params
        params.require(:habit).permit(:name, :frequency_mode, :user_id)
    end
end