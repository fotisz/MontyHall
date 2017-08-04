<!DOCTYPE html>
<html>
  <head>
    <style>
      body{
        margin: 0;
        font-family: 'Roboto', helvetica, sans-serif;
        text-anchor: middle;
      }
      circle{
        fill: black;
      }
      .doors g text{
        fill: white;
      }
      .states text{
        font-size: 15px;
      }
      .states .cover text{
        fill: white;
      }
      .states .cover {
        fill: black;
      }
      .door .prize text{
        fill: white;
      }
      .door.goat .prize circle {
        fill: #E74C3C;
      }
      .door.car .prize circle{
        fill: #2ECC71;
      }
      .door.goat .prize circle.highlight{
        fill: white;
        stroke: #E74C3C;
      }
      .door.car .prize circle.highlight{
        fill: white;
        stroke: #2ECC71;
      }
      circle.highlight {
        fill: white;
        stroke: black;
        stroke-width: 2;
        opacity: 0;
      }
      .state .pointer{
        stroke: #2ECC71;
        fill: #2ECC71;
        opacity: 0;
      }
      .state .pointer-line{
        fill: none;
        stroke-width: 2;
      }
      .state .pointer text{
        stroke: none;
        fill: black;
        stroke-width: 1;
      }
    </style>
  </head>
  <body>
    <link href='http://fonts.googleapis.com/css?family=Roboto:300' rel='stylesheet' type='text/css'>
    <script src="../../js/d3.js"></script>
    <script src="../../js/jquery-1.10.2.js"></script>
    <script src="../../js/sticker.js"></script>
    <script src="misc.js"></script>
    <script>

var w = window.innerWidth
  , h = window.innerHeight
  , translate = function(x, y){ return 'translate(' + x + ',' + y + ')' }
  , svg = d3.select('body').append('svg').attr({width: w, height: h})
  , node_spacing = 50
  , state_spacing = 300
  , r = 20
  , highlight_border = 5

function loop(){
  var g = svg.append('g').attr({transform: translate(w/2, 0)})

  function add_states(){
    var state_data = [
        [ { door: 1, content: 'car' }, {door: 2, content: 'goat'}, {door: 3, content: 'goat'} ]
      , [ { door: 1, content: 'goat' }, {door: 2, content: 'car'}, {door: 3, content: 'goat'} ]
      , [ { door: 1, content: 'goat' }, {door: 2, content: 'goat'}, {door: 3, content: 'car'} ]
    ]

    var states_g = g.append('g').attr({transform: translate(0, 100), 'class': 'states'})
    var states = states_g.selectAll('g').data(state_data).enter().append('g')
      .attr({
        transform: function(d, i){ return translate(0, 0) }
        , 'class': 'state'
      })

    d3.selectAll('.state').each(function(d){
      var line_data, line, state = d3.select(this), arrow
      both = d[0].content === 'car'
      line = d3.svg.line().interpolate('basis')
      var g = state.append('g').attr('class', 'pointer')
      if(both) g.style('stroke', '#E74C3C').style('fill', '#E74C3C')
      if(d[2].content === 'car' || both){
        line_data = [[-node_spacing, 0], [0, 50], [node_spacing, 0]]
        
        g.append('path').datum(line_data).attr('d', line)
          .attr('class', 'pointer-line')

        arrow = g.append('g')
        arrow.append('path').attr('d', d3.svg.symbol().type('triangle-up'))
        arrow.attr('transform', translate(33, 16) + 'rotate(46)')
          .attr('class', 'pointer-head')
      }
      if(d[1].content === 'car' || both) {
        line_data = [[-node_spacing, 0], [-node_spacing/2, -50], [0, 0]]
        g.append('path').datum(line_data).attr('d', line)
          .attr('class', 'pointer-line')
        
        arrow = g.append('g')
        arrow.append('path').attr('d', d3.svg.symbol().type('triangle-up'))
        arrow.attr('transform', translate(-12, -24) + 'rotate(20)')
          .attr('class', 'pointer-head')
      }
    })

    var state_doors = states.selectAll('g.door').data(function(d, i){ return d })
      .enter().append('g').attr({
        'class': function(d){ return 'door ' + d.content }
        , transform: function(d, i){ 
          return translate(node_spacing * (d.door - 2), 0)
        }
      })

    // state_doors.append('circle').attr({ r: r, 'class': function(d){ return 'prize ' + d.content }})

    state_doors.append('g').attr({
      r: r, 'class': function(d){ return 'prize prize-' + d.door }
    }).call(function(prize){
      prize.append('circle').attr({r: r + highlight_border, 'class': 'highlight'})
      prize.append('circle').attr('r', r)
      prize.append('text').text(function(d){ return d.content })
        .attr('transform', translate(0, r/4))
    })

    state_doors.append('g').attr({
      r: r
      , 'class' : function(d){ return 'cover-' + d.door + ' cover' }
    }).call(function(cover){
      cover.append('circle').attr({r: r + highlight_border, 'class': 'highlight'})
      cover.append('circle').attr('r', r)
      cover.append('text').text(function(d){ return d.door })
          .attr('transform', translate(0, r/4))
    })

    states.transition().duration(1000).delay(function(d, i){ return i * 1000 }).attr({
      transform: function(d, i){ return translate(state_spacing * (i - 1), 150)}
    }).call(function(states){
      var count = 0
      var states_size = states.size()
      states.each('end', function(d, i){
        var state = d3.select(this)
        var cover = state.selectAll('g.cover')
        cover.transition().duration(1000)
          .delay(function(d){ return (d.door-1) * 100})
          .attr('transform', function(d){ return translate(0, -r*1.5) })
          .style('opacity', '0').each('end', function(){
            if(--count) return
            doors_g.append('text').text('if you pick 1...')
              .attr('transform', translate(0, - r * 2))
              .style('opacity','0').transition().duration(1000)
              .style('opacity','1')
            var highlight = d3.selectAll('.door-1 .highlight, .prize-1 .highlight')
              .transition().duration(1000)
              .style('opacity', '1')
              .each('end', function(){
                if(--count) return
                count = states_size
                d3.selectAll('.state').selectAll('.pointer').transition()
                  .duration(1000).style('opacity', '1')
                  .each('end', function(){
                    d3.select(this).append('text').text(function(d){
                      var win = d[0].content !== 'car' ? 'win' : 'lose'
                      return 'you\'ll ' + win + ' if you switch'
                    }).attr('transform', translate(0, 50))
                      .style('opacity','0')
                      .transition().duration(1000)
                      .style('opacity', '1').each('end', function(){
                        if(--count) return
                        setTimeout(function(){
                          svg.style('opacity','1').transition()
                            .duration(1000).style('opacity','0')
                            .each('end', function(){
                              svg.selectAll('*').remove()
                              svg.style('opacity', '1')
                              loop()
                            })
                        }, 5000)
                      })
                  })
              })
            count = highlight.size()
          })
        count = count + cover.size()
        state.append('text')
          .text('1/3 chance the car is \nbehind door ' + (i+1))
          .attr({transform: translate(0, -75)}).style('opacity', 0)
          .transition().duration(1000).style('opacity', 1)
      })
    })
  }

  // state_spacing * (i - 1)

  // add the doors

  var door_data = [ {door: 1}, {door: 2}, {door: 3} ]

  var doors_g = g.append('g').attr({transform: translate(0, 100)})
    .attr('class', 'doors')

  var doors = doors_g.selectAll('g').data(door_data).enter().append('g')
    .attr({
      transform: function(d){ return translate(node_spacing * (d.door - 2), 0) }
      , 'class': function(d){ return 'door ' + 'door-' + d.door }
    }).style('opacity', '0')

  doors.append('circle').attr({r: r + highlight_border, 'class': 'highlight'})
  doors.append('circle').attr({r: r})
  doors.append('text').text(function(d){ return d.door })
    .attr({y: r / 4})
  var door_count = doors.size()
  doors.transition().duration(1000).style('opacity', '1')
    .each('end', function(){ if(!--door_count) add_states() })
}

loop()

  </script>
  </body>
</html>
