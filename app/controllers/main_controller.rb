class MainController < ActionController::Base
    def index
        render :file => 'index.html', :layout => false
    end
end