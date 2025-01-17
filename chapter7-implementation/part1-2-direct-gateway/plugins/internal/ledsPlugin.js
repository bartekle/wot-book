
var resources = require('./../../resources/model');
var actuator, interval;
var model = resources.pi.actuators.leds.red;
var pluginName = model.name;
var localParams = {'simulate': false, 'frequency': 2000};

//Object.observe(what, function (changes) {
//  console.info('Change detected by plugin for %s...', pluginName);
//  switchOnOff(model.value); //#B;
/*observableModel = Observable.from(model);
observableModel.observe(changes => {
  changes.forEach(change => {
    console.log(change);
    switchOnOff(model.value);
  })
});
//*/
   //  TU WJEBAĆ Z BIBLIOTEKI OBJECT-OBSERVER
var prox = new Proxy(model, {
  get: function (target, prop, receiver){
    console.info('Change detected by plugin for %s...', pluginName);
    switchOnOff(model.value);
    return Reflect.get(...arguments);
  }
})



exports.start = function (params) {
  localParams = params;
//  observe(model); //#A

  if (localParams.simulate) {
    simulate();
  } else {
    connectHardware();
  }
};

exports.stop = function () {
  if (localParams.simulate) {
    clearInterval(interval);
  } else {
    actuator.unexport();
  }
  console.info('%s plugin stopped!', pluginName);
};

function switchOnOff(value) {
  if (!localParams.simulate) {
    actuator.write(value === true ? 1 : 0, function () { //#C
      console.info('Changed value of %s to %s', pluginName, value);
    });
  }
};

function connectHardware() {
  var Gpio = require('onoff').Gpio;
  actuator = new Gpio(model.gpio, 'out'); //#D
  console.info('Hardware %s actuator started!', pluginName);
};

function simulate() {
  interval = setInterval(function () {
    // Switch value on a regular basis
    if (model.value) {
      model.value = false;
    } else {
      model.value = true;
    }
  }, localParams.frequency);
  console.info('Simulated %s actuator started!', pluginName);
};

//#A Observe the model for the LEDs
//#B Listen for model changes, on changes call switchOnOff
//#C Change the LED state by changing the GPIO state
//#D Connect the GPIO in write (output) mode
