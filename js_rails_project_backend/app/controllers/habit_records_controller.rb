class HabitRecordsController < ApplicationController

    before_action :authenticate_request!
    def index
        Rails.logger.info("PARAMS: #{params.inspect}")
        unless logged_in?
            render json: { message: "Error not logged in"}
        else
            records = HabitRecord.records(params, @current_user.id)
            render json: { status: true, record: records, range: params[:range], time: 1.week.ago.to_date, user: @current_user}
        end
    end

    def create
        Rails.logger.info("PARAMS: #{params.inspect}")
        unless logged_in?
            render json: {status: false, message: "Blah"}
        else
            habit = HabitRecord.find_by(:habit_id => params[:habit_id], :user_id => @current_user.id, :time_of_record => params[:time_of_record])
            if habit.present?
                render json: {status: false, errors: habit.errors.full_messages.push("Already Recorded")}
            else
                habit_record = HabitRecord.new(habit_record_params)
                if habit_record.save!
                    render json: {status: true, habit: habit_record}
                else
                    render json: {status: false, errors: habit.errors.full_messages.push("Error, could not be saved.")}
                end
            end
        end

    end

    def destroy
        habit_record = HabitRecord.find(params[:id])
        if habit_record.destroy
            render json: {status: true, id: params[:id]}
        else
            render json: {status: false, message: "Failed"}
        end
    end

    private
    def habit_record_params
        params.permit(:habit_id, :time_of_record, :user_id)
    end
end