let instance = null; 

module.exports = async () => {
    if (!instance) instance = require("../config/config"); 
    return instance;
}