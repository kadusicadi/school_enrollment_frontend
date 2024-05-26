set :stage, :development
set :branch, "main"
set :deploy_to, "/srv/school_enrollment_frontend"

server "papandayan.sysops.work",
user: "school_enrollment_frontend",
roles: %w{app},
ssh_options: {
  user: "school_enrollment_frontend",
  keys: %w(/tmp/id),
  forward_agent: false,
  auth_methods: %w(publickey),
  port: 22116
}
