set :application, "school_enrollment_frontend"
set :repo_url, "git@github.com:aheacon/school_enrollment_frontend.git"

append :linked_files, ".env"
append :linked_dirs, "node_modules"

set :keep_releases, 5

namespace :npm do
  desc "npm package install and build"
  task :install_and_build do
    on roles(:app), in: :sequence, wait: 5 do
      within release_path  do
        execute :npm, "install"
        execute :npm, "run build"
      end
    end
  end
end

namespace :pm2 do
  desc "pm2 service start_or_restart"
  task :start_or_restart do
    on roles(:app), in: :sequence, wait: 5 do
      within release_path  do
        execute :pm2, "delete all"
        execute :pm2, "startOrRestart ecosystem.config.js"
        execute :pm2, "save"
      end
    end
  end
end

namespace :deploy do
  before :reverted, 'npm:install'
  after :published, "npm:install_and_build"
  after :published, "pm2:start_or_restart"
end
