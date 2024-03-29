/**
 * http://usejsdoc.org/
 */
module.exports=function(RED){

 	//dependency-dht sensor package
 	var sensorLib=require("node-dht-sensor");
 	//var sensorType=11;
	var sensorPin=4;
 	var GPIO=require("onoff").Gpio;
	var LED=new GPIO(23,'out');
	var LED_state=0;
	
	

	function zlsunode(config){
	//init 
	RED.nodes.createNode(this,config);
	
	var node = this;
	this.topic=config.topic;
	this.dht=config.dht;
	this.pin=config.pin;
	//read the data from the sensors
	this.read=function(msgIn){
	var msg = msgIn ? msgIn : {};
	var reading  = { temperature : 100.0, humidity : 110.0 };
		reading=sensorLib.read(this.dht,this.pin);
	LED_state=LED.readSync();  
	
	msg.payload=reading.temperature.toFixed(1);
	msg.humidity = reading.humidity.toFixed(1);
        msg.isValid  = reading.isValid;
        msg.errors   = reading.errors;
        msg.topic    = node.topic || node.name;
            
        if( msg.payload > 20) LED_state=1;
          else LED_state=0;
	 
        return msg; 
	};

	// respond to inputs....
      	this.on('input', function (msg) {
         	msg = this.read(msg);

	         if (msg)
            	node.send(msg);
      	}); 
      } RED.nodes.registerType("zlsunode",zlsunode);
}
