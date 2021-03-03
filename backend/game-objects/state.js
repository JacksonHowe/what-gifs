module.exports = function State(theme) {
  this.judge = {};
  this.theme = theme;
  this.submissions = [];
  this.gif = "";
  this.setTheme = function(t) {
    this.theme = t;
  };
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
