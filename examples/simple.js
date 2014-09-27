var mdns = require('../');

var TIMEOUT = 5000; //5 seconds


mdns.on('ready', function () {
  browse();
});

function browse() {
  var browser = mdns.createBrowser(); //defaults to mdns.ServiceType.wildcard
  //var browser = mdns.createBrowser(mdns.tcp("googlecast"));
  //var browser = mdns.createBrowser(mdns.tcp("workstation"));
  browser.start();

  // browser.on('ready', function onReady() {
  //   console.log('browser is ready');
  //   browser.discover();
  // });


  // browser.on('update', function onUpdate(data) {
  //   console.log('data:', data);
  // });

  //stop after 60 seconds
  setTimeout(function onTimeout() {
    browser.stop();
  }, TIMEOUT);
}
