(function() {

  var bass = 2;
  var mid = 7;
  var treb = 3;

  var colors = ['#121A2E', '#8ED0EB', '#5EAAD4'];
  var trebNodes = [];
  var midNodes = [];
  var bassNodes = [];

  // Set up audio context per web audio api
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var context = new AudioContext;

  var analyser = context.createAnalyser();
  analyser.fftSize = 256;

  var stream = document.querySelector('#audio');

  // Play stream and start basic pulse visuals
  var source = context.createMediaElementSource(stream);
  var begin = function(){ 
    // stream.addEventListener('canplay', function() {
    source.connect(analyser);
    analyser.connect(context.destination);
    stream.play();
    d3.timer(pulse);
    // });
  };
  var pause = function(){
    stream.pause();
  };

  // begin and pause functionality
  d3.select('body')
    .on('keydown', begin);
  d3.select('body')
    .on('keypress.shiftKey', pause);


  var env = d3.select('#envBounds');

  env.append('circle')
    .attr('id', 'play')
    .attr('cx', '50%')
    .attr('cy', '50%')
    .attr('r', '15%')
    .attr('fill', 'ccc')
    .attr('opacity', 0);
  // Append treb nodes
  for (var i = 0; i < treb; i++) {
    var cxl = 30-(5*i)+'%';
    var cxr = 70+(5*i)+'%'
    var ry = (7-i)+'%';
    // var cy = 75-(3*i)+'%';
    var cy = '50%';

    var nodeL = env.append('ellipse')
     .attr('class', 'node trebNode trebNodeL')
     .attr('cx', cxl)
     .attr('cy', cy)
     .attr('rx', 4)
     .attr('ry', ry)
     .attr('fill', colors[2]);

    var nodeR = env.append('ellipse')
     .attr('class', 'node trebNode trebNodeR')
     .attr('cx', cxr)
     .attr('cy', cy)
     .attr('rx', 4)
     .attr('ry', ry)
     .attr('fill', colors[2]);

    trebNodes.push(nodeL);
    trebNodes.push(nodeR);
  }

  // Append mid nodes
  for (var i = 0; i < mid; i++) {
    // var cx = '50%';
    var cy = 20+(10*i)+'%';

    var nodeL = env.append('rect')
     .attr('class', 'node midNode midNodeL')
     .attr('x', 0)
     .attr('y', cy)
     .attr('width', 20)
     .attr('height', 8)
     .attr('fill', colors[1]);

    var nodeR = env.append('rect')
     .attr('class', 'node midNode midNodeR')
     .attr('x', '100%')
     .attr('y', cy)
     .attr('width', 20)
     .attr('height', 8)
     .attr('fill', colors[1]);

    midNodes.push(nodeL);
    midNodes.push(nodeR);
  }

  // Append bass nodes
  for (var i = 0; i < bass; i++) {
    var cx = '0%';
    var cy;
    if(i === 0){
      cy = '-25px';
    } else {
      cy = '100%';
    }


    var node = env.append('rect')
     .attr('class', 'node bassNode'+' bass'+i)
     .attr('x', cx)
     .attr('y', cy)
     .attr('width', '100%')
     .attr('height', 15)
     .attr('fill', colors[0])

     node.append("linearGradient")
      .attr("x1", 0).attr("y1", "0%")
      .attr("x2", 0).attr("y2", "100%")
    .selectAll("stop")
      .data([
        {offset: "0%", color: colors[0]},
        {offset: "50%", color: colors[1]},
        {offset: "100%", color: "#fff"}
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

    // Treble Visualization
    if (rangeSignalAnalyzer(1280,20840,1220) > -88.31){
      env.selectAll('.trebNode')
        .data(freqDomain)
        .style('transform', function(d) {
          return 'scale(' + Math.abs(d)/15 + ')';
      });
    }

    // Mid Visualization
    // Peak Signal Flourish
    if (rangeSignalAnalyzer(420,1280,60) > -33.40){
      env.selectAll('.midNode')
      .data(freqDomain)
      .transition().duration(function(d){return d*10})
      .attr('fill', '#A3FFA4')
      .style('transform', function(d) {
        return 'scale(' + Math.abs(d)/10 + ')';
      });
    } else if (rangeSignalAnalyzer(420,1280,60) > -40.17){
      env.selectAll('.midNode')
      .data(freqDomain)
      .transition().duration(function(d){return d*10})
      .attr('fill', colors[1])
      .style('transform', function(d) {
        return 'scale(' + Math.abs(d)/10 + ')';
      });
    }

    // Bass Visualization
    if (rangeSignalAnalyzer(0,320,20) > -28.06){
      env.selectAll('.bassNode')
      .data(freqDomain)
      .style('transform', function(d) {
        return 'scale(' + Math.abs(d)/6 + ')';
      });
    }

    // Sub-bass Visualization (TODO, image too big/ jquery can't handle switch atm)
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