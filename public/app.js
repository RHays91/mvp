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

var stream = document.querySelector('#audio');

// var freqDomain = new Float32Array(analyser.frequencyBinCount);

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
   .attr('fill', "rgba(18,26,74,0.9)");

  //  var gradient = svg.append("svg:defs")
  // .append("svg:linearGradient")
  //   .attr("id", "gradient")
  //   .attr("x1", "0%")
  //   .attr("y1", "0%")
  //   .attr("x2", "100%")
  //   .attr("y2", "100%")
  //   .attr("spreadMethod", "pad");

  bassNodes.push(node);
}
// var barray = [];
// var marray = [];
// var tarray = [];

var pulse = function() {

  // monitoring frequency Domain
  var freqDomain = new Float32Array(analyser.frequencyBinCount);
  analyser.getFloatFrequencyData(freqDomain);

  // getFreqVal(x-Hz) should return peak value when analyzing x-Hz sound wave
  var getFreqVal = function (freq) {
    var nyquist = context.sampleRate / 2;
    var index = Math.round(freq/nyquist * freqDomain.length);
    return freqDomain[index];
  };

  // set up helper functions to analyze bass/mid/treb average signal strength
  // @ given moment in time
    // when these averages exceed threshold for a range --> trigger animation
  var rangeSignalAnalyzer = function(min, max, samples){
    var min = min;
    var max = max;
    var step = (max-min)/samples;

    var sum = 0;
    for (var i = min; i < max; i += step){
      sum += getFreqVal(i);
    }
    return sum / samples;
  };


  // var bassAnalysis = function(){
  //   var min = 0; //0 Hz
  //   var max = 320; //320 Hz
  //   var step = (max - min) / 20;

  //   var sum = 0;
  //   for (var i = min; i < max; i += step){
  //     sum += getFreqVal(i);
  //   }
  //   // barray.push(sum / 20);
  //   return sum / 20;
  // };

  // var midAnalysis = function(){
  //   var min = 320; //320 Hz
  //   var max = 1280; //1280 Hz
  //   var step = (max - min) / 60;

  //   var sum = 0;
  //   for (var i = min; i < max; i += step){
  //     sum += getFreqVal(i);
  //   }
  //   // marray.push(sum / 60);
  //   return sum / 60;
  // };

  // var trebAnalysis = function(){
  //   var min = 1280; //0 Hz
  //   var max = 20840; //20840 Hz
  //   var step = (max - min) / 1220;

  //   var sum = 0;
  //   for (var i = min; i < max; i += step){
  //     sum += getFreqVal(i);
  //   }
  //   // tarray.push(sum / 1220);
  //   return sum / 1220;
  // };

  // console.log(
  //   bassAnalysis(),
  //   midAnalysis(),
  //   trebAnalysis()
  //   );
  if (rangeSignalAnalyzer(1280,20840,1220) > -70.31){
    env.selectAll('.trebNode')
      .data(freqDomain)
      .style('transform', function(d) {
        return 'scale(' + Math.abs(d)/10 + ')';
    });
  }
  if (rangeSignalAnalyzer(320,1280,60) > -44.17){
    env.selectAll('.midNode')
    .data(freqDomain)
    .style('transform', function(d) {
      return 'scale(' + Math.abs(d)/10 + ')';
    });
  }
  if (rangeSignalAnalyzer(0,320,20) > -32.06){
    env.selectAll('.bassNode')
    .data(freqDomain)
    .style('transform', function(d) {
      return 'scale(' + Math.abs(d)/10 + ')';
    });
  }
};

})();