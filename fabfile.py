from fabric.api import * 
from pprint import pprint
import yaml
import os

#must be refactored to have production and staging as well
def dev():
    config = read_yaml("rsync.yml")
    pprint(config)
    env.password = config['password']
    server_address = "%s@%s:%s" % (config['user'],config['server'],config['port'])
    #set the current host 
    env.host_string = server_address
    current_path = os.getcwd()
    local('rsync -axvzco %s/*  %s@%s:%s --progress ' % (current_path , config['user'], config['server'], config['copy_to']))
    sudo('rsync -avz %s/* %s/dev/' % (config['copy_to'] , config['document_root']))
    sudo('chown -R www-data:www-data %s/dev' % config['document_root'])


def read_yaml(file_name):
    f = open(file_name)
    data = yaml.load(f)
    f.close()
    return data
 


