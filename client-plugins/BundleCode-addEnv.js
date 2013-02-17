module.exports = function(){
  return function(bundle){
    var clientEnv = {
      CELL_MODE: process.env.CELL_MODE || process.env.NODE_ENV
    }
    bundle.include(null, "env", "module.exports = "+JSON.stringify(clientEnv)+";");
  }
}