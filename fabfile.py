from fabric.api import * 
from pprint import pprint
import yaml
import os

def dev():
    config = setup()
    current_path = os.getcwd()
    local('rsync -axvzco %s/*  %s@%s:%s --progress ' % (current_path , config['user'], config['server'], config['copy_to']))
    sudo('rsync -avz %s/* %s/dev/' % (config['copy_to'] , config['document_root']))
    sudo('chown -R www-data:www-data %s/dev' % config['document_root'])
    
def production():
    config = setup()
    run('cd %s && git pull origin production:production && git checkout production' % config['repo_path']) 
    sudo('rsync -avz %s/* %s/prod/' % (config['repo_path'] , config['document_root']))
    sudo('chown -R www-data:www-data %s/prod' % config['document_root'])
    
    
def setup():
    config = read_yaml("rsync.yml")
    server_address = "%s@%s:%s" % (config['user'],config['server'],config['port'])
    #set the current host 
    env.host_string = server_address
    env.password = config['password'] 
    return config
        
def read_yaml(file_name):
    f = open(file_name)
    data = yaml.load(f)
    f.close()
    return data
 


