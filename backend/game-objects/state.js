module.exports = function State(theme, gifOffsetMax) {
  this.judge = {};
  this.theme = theme;
  this.submissions = [];
  this.gif = "";
  this.gifOffsetMax = gifOffsetMax;

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

  this.removeSubmission = function(c) {
    this.submissions = this.submissions.filter(function(submission) {
      return submission.caption !== c;
    })
  }

  this.setJudge = function(player) {
    this.judge = player;
  };

  this.setGif = function(url) {
    this.gif = url;
  };
};
