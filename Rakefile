#  You need rsync.yml file containing : 
#user : user@example.com
#document_root : /path

require "rubygems"
require 'yaml'

YAML::ENGINE.yamler = 'syck'
rsync = open('rsync.yml') {|f| YAML.load(f) }

ssh_user       = rsync['user']
document_root  = rsync['document_root']

def ok_failed(condition)
  if (condition)
    puts "## Result : OK"
  else
    puts "## Result : FAILED"
  end
end

def deploy(env, ssh_user , document_root)
  current_path = File.expand_path File.dirname(__FILE__)
  puts "## Deploying website via Rsync in #{env} environment"
  comm = "rsync -axvzco #{current_path}/*  #{ssh_user}:#{document_root}#{env}/ --progress "
  puts "  Will execute : #{comm}"
  ok_failed system(comm)
end


desc "Deploy website via rsync"
task :deploy , :env  do |t,args|
  if args[:env]
    ['dev', 'staging', 'prod'].each do |e|  
      if args[:env] == e then deploy(args[:env], ssh_user , document_root) end
    end
  
  else puts 'No env parameter , try rake deploy[dev]' end
 
end
