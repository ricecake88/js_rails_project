class HabitsController < ApplicationController

    before_action :authenticate_request

    def index
        unless logged_in?
            render json: {status: false}, status: 401
        else
            habits = Habit.where(:user_id => @current_user.id).order("name ASC")
            render json: {status: true, first_name: @current_user.first_name, last_name: @current_user.last_name, email: @current_user.email, password: @current_user.encrypted_password, id: @current_user.id, habits: habits}
        end
    end

    def create
        unless logged_in?
            render json: {status: false, errors: self.errors.full_messages.push(["Not Logged In"])}, status: 401
        else
            #Rails.logger.info("PARAMS: #{params.inspect}")
            habit = Habit.find_by(:name => params[:name], :user_id => @current_user.id)
            if !habit.present?
                habit = Habit.new(habit_params)
                if habit.save
                    habit.user = @current_user
                    render json: {status: true, habit: habit}
                else
                    render json: {status: false, errors: habit.errors.full_messages}
                    return
                end
            else
                render json: {status: false, errors: habit.errors.full_messages.push(["Habit Already Exists"])}
            end
        end
    end

    def update
        unless logged_in?
            render json: {status: false, errors: self.errors.full_messages.push(["Not Logged In"])}, status: 401
        else
            habit = Habit.find(params[:id])
            if habit.present? && habit.update(habit_params)
                render json: {status: true, habit: habit}
            else
                render json: {status: false, errors: habit.errors.full_messages}
            end
        end
    end

    def destroy
        unless logged_in?
            render json: {status: false, errors: self.errors.full_messages.push(["Not Logged In"])}, status: 401
        else
            name = params['name']
            habit = Habit.find(params[:id])
            if habit.present? && habit.habit_records.destroy_all && habit.destroy
                render json: {status: true, id: params['id']};
            else
                render json: {status: false, errors: "Error deleting habit"}
            end

        end
    end

    private
    def habit_params
        params.require(:habit).permit(:name, :frequency_mode, :num_for_streak, :streak_level, :streak_counter, :color, :user_id)
    end
end