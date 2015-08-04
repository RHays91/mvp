(function() {

  var bass = 2;
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
    var cx = '0%';
    var cy;
    if(i === 0){
      cy = '-25px';
    } else {
      cy = i*100 + '%';
    }


    var node = env.append('rect')
     .attr('class', 'node bassNode'+' bass'+i)
     .attr('x', cx)
     .attr('y', cy)
     .attr("x1", 0).attr("y1", "0%")
     .attr("x2", 0).attr("y2", "100%")
     .attr('width', '100%')
     .attr('height', 25)
     .attr('fill', "rgba(18,26,74,1)");

     node.append("linearGradient")
      // .attr("id", "temperature-gradient")
      // .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", "0%")
      .attr("x2", 0).attr("y2", "100%")
    .selectAll("stop")
      .data([
        {offset: "0%", color: "steelblue"},
        {offset: "50%", color: "gray"},
        {offset: "100%", color: "red"}
      ])
    .enter().append("stop")
      .attr("offset", function(d) { return d.offset; })
      .attr("stop-color", function(d) { return d.color; });

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

    if (rangeSignalAnalyzer(1280,20840,1220) > -78.31){
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
    if (rangeSignalAnalyzer(0,320,20) > -28.06){
      env.selectAll('.bassNode')
      .data(freqDomain)
      .style('transform', function(d) {
        return 'scale(' + Math.abs(d)/8 + ')';
      });
    }

    // if (rangeSignalAnalyzer(0,20,20) > -20.00){
    //   $('#envBounds').toggleId('#envBounds2');
    //   // var bg = document.getElementById('envBounds');
    //   // var att = document.createAttribute('id');
    //   // att.value = 'envBounds2';
    //   // bg.setAttributeNode(att);

    //   // env.selectAll('#envBounds')
    //   // .data(freqDomain)
    //   // .transition().duration(function(d){return Math.abs(d)/10;})
    //   // .style('transform', function(d) {
    //   //   return 'scale(' + Math.abs(d)/10 + ')';
    //   // });
    // }
  };

})();