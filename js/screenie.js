// Masonry
window.goMasonry = function() {
  var container = document.querySelector('#thumbnails');
  var msnry = new Masonry( container, {
    // options
    columnWidth: 250,
    itemSelector: '.item'
  });
};

var Screenies = React.createClass({
  loadUsernamesFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return { data: [] };
  },
  componentDidMount: function() {
    this.loadUsernamesFromServer();
    setInterval(this.loadUsernamesFromServer, this.props.pollInterval);
  },
  componentDidUpdate: function() {
    goMasonry();
  },
  render: function() {
    return (
      <div id="thumbnails">
        {this.state.data.map(function(username) {
          return (
            <Thumbnail username={username} />
          )
        })}
      </div>
    )
  }
});
var Thumbnail = React.createClass({
  render: function() {
    var username = this.props.username;
    return (
      <div className="item thumbnail">
        <img src={"/backend/screenies/" + username + "-thumb.png"} />
        <div className="caption">
          <a className="btn btn-lg btn-info" href={"https://github.com/" + username}><i className="fa fa-github"></i> {username}</a>
        </div>
      </div>
    )
  }
});
React.render(
  <Screenies url="/backend/screenies.json" pollInterval="2000" />,
  document.getElementById('container')
);