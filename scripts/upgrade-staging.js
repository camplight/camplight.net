require('shelljs/global');

var home = "cd ~/camplight.net-preview;";
var remote = function(command){
  return 'ssh node@178.79.173.17 ". ~/.nvm/nvm.sh; nvm use v0.8.1;'+command+'"';
}
var updateCommand = home+" git fetch; git pull --ff origin master";
if(exec(remote(updateCommand)).code != 0){
  echo("Error: failed to update remote "+updateCommand);
  exit(1);
}

var updateDependenciesCommand = home+" npm install";
if(exec(remote(updateDependenciesCommand)).code != 0){
  echo("Error: failed to stop remote "+updateDependenciesCommand);
  exit(1);
}

var stopCommand = home+" forever stop camplight.net.js";
if(exec(remote(stopCommand)).code != 0){
  echo("Error: failed to stop remote "+stopCommand);
  exit(1);
}

var startCommand = home+" CELL_MODE=preview forever start camplight.net.js";
if(exec(remote(startCommand)).code != 0){
  echo("Error: failed to start remote "+startCommand);
  exit(1);
}