
var RiderProfile = React.createClass({
  getInitialState: function() {
    return {
      img: ''
    };
  },
  componentDidMount: function() {
    
    $.getJSON('https://www.strava.com/api/v3/athletes/630743?access_token=a83c09a1edb86d349e15ed2e271f5f60b57a4c2e&callback=?', function (data) {
      this.setState({
        img: data.profile
      });
    }.bind(this));  
  },
  componentWillUnmount: function() { },
  render: function(){
    return (
      <div id="header"><h1>Doug&#39;s New England KOMs</h1><h3><em>may they rest in peace</em></h3><img src={this.state.img}/></div>
    );
  } 
});

var ProductRow = React.createClass({
  getInitialState: function() {
    return {
      owner: ''
    };
  },
  componentDidMount: function() {
    if(CURRENT_SEGMENTS.indexOf(this.props.segment[0])){ 
      currentSegmentCount ++;
      this.setState({
        owner: 'D Fresh'
      });
    }else{ 
      // reach out and find the new owner 
      $.getJSON('https://www.strava.com/api/v3/segments/'+this.props.segment[0]+'/leaderboard?access_token=a83c09a1edb86d349e15ed2e271f5f60b57a4c2e&callback=?', function (data) {
        this.setState({
          owner: data.entries[0].athlete_name
        });
      }.bind(this)); 
    } 
  },
  componentWillUnmount: function() { },    
  render: function() { 
      console.log("currentSegmentCount",currentSegmentCount);
    return (
      <tr>
        <td>{this.props.segment[1]}</td>
        <td>{this.props.segment[2]}</td>
        <td>{this.props.segment[3]}</td>
        <td>{this.state.owner}</td>  
        <td><a href={'https://www.strava.com/segments/'+this.props.segment[0]} target='blank'>view</a></td>
      </tr>
    );
  }
});

var ProductTable = React.createClass({
  render: function() {
    var rows = [];
    this.props.segments.forEach(function(segment) {
      console.log("building rows");
      rows.push(<ProductRow segment={segment} />);
    }.bind(this));
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>State</th>
              <th>City</th>
              <th>Name</th>
              <th>Owner</th>
              <th>Map</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
});

var FilterableProductTable = React.createClass({
  getInitialState: function() {
    return {
      filterText: '',
      inStockOnly: false
    };
  },
  render: function() {
    return (
      <div>
        <ProductTable segments={this.props.segments} />
      </div>
    );
  }
});

var FooterSummary = React.createClass({
  render: function() {
    return (
      <div>
        <p><strong>original segment count: 108</strong></p>
        <p><strong>segments lost: {108 - currentSegmentCount}</strong></p>          
        <p><strong>original list from: 5-26-16</strong></p>
      </div>
    );
  }
});

// just need ID's of new segments, all the other information comes from the segment call
var CURRENT_SEGMENTS = [''];
//var PREVIOUS_SEGMENTS = xxx
var originalSegmentCount = PREVIOUS_SEGMENTS.length;
var currentSegmentCount = 0;
var difSegmentCount;
$(document).ready(function() {
  $.getJSON( 'https://www.strava.com/api/v3/athletes/630743/koms?per_page=200&access_token=a83c09a1edb86d349e15ed2e271f5f60b57a4c2e&callback=?', function (data) {
  
    // build the list of current segments
    $(data).each(function(index, item) {
      CURRENT_SEGMENTS.push(item.segment.id);
    });
    // build the app
    ReactDOM.render(
      <FilterableProductTable segments={PREVIOUS_SEGMENTS} />,
      document.getElementById('container')
    );
    
    ReactDOM.render(
      <RiderProfile rider={630743} />,
      document.getElementById('header')
    );
    
    ReactDOM.render(
      <FooterSummary />,
      document.getElementById('footer')
    );
  });
});

