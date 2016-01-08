var pageReady = false;

$(document).on('ready', function() {
  calculateStats();
  setTimeout(function() {
    calculateStats();
  }, 2000);
});
