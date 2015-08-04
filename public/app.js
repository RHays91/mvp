(function() {

var bass = 1;
var mid = 1;
var treb = 1;

var colours = ['#121A4A', '#397FE8', '#4CC3FF'];
var trebNodes = [];
var midNodes = [];
var bassNodes = [];

// Set up audio context per web audio api
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext;

var analyser = context.createAnalyser();
analyser.fftSize = 256;

// var bassAnalyser = context.createAnalyser();
// bassAnalyser.fftSize = 2048;

var stream = document.querySelector('#audio');
var frequencyData = new Float32Array(analyser.frequencyBinCount);
setInterval(function(){console.log(frequencyData)}, 5000);
// var bassFrequencyData = new Float32Array(analyser.frequencyBinCount);

// Play stream and start basic pulse visuals
stream.addEventListener('canplay', function() {
  var source = context.createMediaElementSource(stream);
  source.connect(analyser);
  analyser.connect(context.destination);
  stream.play();
  d3.timer(pulse);
});


var env = d3.select('#envBounds');
// Append treb nodes
for (var i = 0; i < treb; i++) {
  var cx = '50%';
  var cy = '20%';

  var node = env.append('circle')
   .attr('class', 'node trebNode')
   .attr('cx', cx)
   .attr('cy', cy)
   .attr('r', 5)
   .attr('fill', colours[2]);

  trebNodes.push(node);
}
// Append mid nodes
for (var i = 0; i < mid; i++) {
  var cx = '50%';
  var cy = '55%';

  var node = env.append('circle')
   .attr('class', 'node midNode')
   .attr('cx', cx)
   .attr('cy', cy)
   .attr('r', 15)
   .attr('fill', colours[1]);

  midNodes.push(node);
}
// Append bass nodes
for (var i = 0; i < bass; i++) {
  var cx = '30%';
  var cy = '80%';

  var node = env.append('rect')
   .attr('class', 'node bassNode')
   .attr('x', cx)
   .attr('y', cy)
   .attr('width', 500)
   .attr('height', 20)
   .attr('fill', colours[0]);

  bassNodes.push(node);
}

var pulse = function() {
  analyser.getFloatFrequencyData(frequencyData);    
  env.selectAll('.trebNode')
   .data(frequencyData)
   .style('transform', function(d) {
     return 'scale(' + Math.abs(d)/10 + ')';
   });
// };
   env.selectAll('.midNode')
   .data(frequencyData)
   .style('transform', function(d) {
     return 'scale(' + Math.abs(d)/20 + ')';
   });
   env.selectAll('.bassNode')
   .data(frequencyData)
   .style('transform', function(d) {
     return 'scale(' + Math.abs(d)/40 + ')';
   });
};

})();