module.exports = function State(theme) {
  this.judge = {};
  this.theme = theme;
  this.submissions = [];
  this.gif = "";
  // This is the offset passed to the Giphy API to tell it how many results to skip.
  // Without using an offset, search and trending return the same result every time,
  // so we're going to need this in order to get a new GIF each time.
  // We should probably reset it whenever the theme is changed, but that may be a
  // problem if multiple rounds use the "default" theme, so it's just going to keep
  // incrementing forever for now. (There is an upper limit to the number of results
  // a given query will get, but it's something like 100k, so we should be fine.)
  this.gifOffset = 0;

  this.setTheme = function(t) {
    this.theme = t;
  };

  this.getTheme = function() {
    return theme;
  }

  this.addSubmission = function(s) {
    this.submissions.push(s);
  };

  this.clearSubmissions = function() {
    this.submissions = [];
  };

  this.setJudge = function(player) {
    this.judge = player;
  };

  this.setGif = function(url) {
    this.gif = url;
  };
};
