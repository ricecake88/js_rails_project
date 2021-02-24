class HabitRecordsController < ApplicationController

    before_action :authenticate_request!
    def index
        unless logged_in?
            render json: { message: "Error not logged in"}
        else
            render json: { record: Habit_Record.all}
        end
    end

    def create
        Rails.logger.info("PARAMS: #{params.inspect}")
        unless logged_in?
            render json: {status: false, message: "Blah"}           
        else
            habit = Habit_Record.find_by(:habit_id => params[:habit_id], :user_id => @current_user.id, :time_of_record => params[:time_of_record])
            if habit.present?
                render json: {status: false, message: "Already Recorded."}
            else
                habit_record = Habit_Record.new(habit_record_params)
                if habit_record.save!
                    render json: {status: true, message: habit_record}
                else
                    render json: {status: false, message: "Error, could not be saved."}
                end
            end
        end

    end


    private
    def habit_record_params
        params.permit(:habit_id, :time_of_record, :user_id)
    end
end