var ui = new ReflectUI();

var today = moment().format("YYYY-MM-DD");
var currentWeekStart = moment().subtract(6,'d').format("YYYY-MM-DD");
var previousWeekEnd = moment().subtract(7,'d').format("YYYY-MM-DD");
var previousWeekStart = moment().subtract(13,'d').format("YYYY-MM-DD");

var weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
var dayOfWeek = moment().isoWeekday(Number);
var dayOfWeekShorthand = weekdays.slice(dayOfWeek,dayOfWeek + 1)[0];
var orderedWeekdays = weekdays.slice(dayOfWeek + 1,weekdays.length).concat(weekdays.slice(0,dayOfWeek + 1)).reverse();


var weekdayLabels = {
  "Day of Week": orderedWeekdays
}

function applyFormatters() {
  ui.withFormatters({
    'Hours Asleep': function(d) {
      if (!d) {
        return 0;
      } else {
        var hours = d.toString().split(".")[0];
        var hoursRemainder = d.toString().split(".")[1].slice(0,2);
        var minutes = Math.round(hoursRemainder / 100 * 60);

        return hours + "hrs " + minutes + "min";
      }
    },
    'Hours Awake': function(d) {
      if (!d) {
        return 0;
      } else {
        var hours = d.toString().split(".")[0];
        var hoursRemainder = d.toString().split(".")[1].slice(0,2);
        var minutes = Math.round(hoursRemainder / 100 * 60);

        return hours + "hrs " + minutes + "min";
      }
    },
    'Average Hours Asleep': function(d) {
      var hours = d.toString().split(".")[0];
      var hoursRemainder = d.toString().split(".")[1].slice(0,2);
      var minutes = Math.round(hoursRemainder / 100 * 60);

      return hours + "hrs " + minutes + "min";
    },
    'Day of Week': function(d) {
      if (d === dayOfWeekShorthand) {
        return 'Today';
      } else {
        return d;
      }
    }
  });
};

var currentWeekFilter = [
  {
    "field": "Date",
    "op": ">",
    "value": currentWeekStart
  }
];

function applyOverrides() {
  ui.withOverrides([
    {
      slug: 'time-in-bed',
      path: 'labels',
      value: weekdayLabels
    },
    {
      slug: 'time-in-bed',
      path: 'filters',
      value: currentWeekFilter
    }
  ]);
};

//call to apply custom dates
function applyDates() {
  ui.withDates([currentWeekStart,today], [previousWeekStart,previousWeekEnd]);
  // ui.withDates(['2017-06-01','2017-06-07'], ['2017-06-08','2017-06-14']);
};


function render() {
  ui.view(document.getElementById('reflect-view'), 'L8AxXVPgQsGlX6_TnZ5fHQ');
}

$(function() {
  applyDates();
  applyOverrides();
  applyFormatters();
  render();


  // With JQuery
  var sleepGoalSlider = $("#sleep-goal-slider").slider({
    id: "goalSlider",
    step: 0.5,
    value: 8,
    tooltip: 'hide',
    ticks: [6, 7, 8, 9],
    ticks_positions: [0, 33.333, 66.666, 100],
    ticks_labels: ['6', '7', '8', '9']
  });

  // Set the default value text
  var sliderValue = sleepGoalSlider.slider('getValue');
  $("#sleep-goal-value").text(sliderValue);
  // Update on slide
  $("#sleep-goal-slider").on("slide", function(slideEvt) {
  	$("#sleep-goal-value").text(slideEvt.value);
  });
  // Update on click
  $(".slider-wrapper").on("click", function() {
    sliderValue = sleepGoalSlider.slider('getValue');
  	$("#sleep-goal-value").text(sliderValue);
  });




  var socialGoalSlider = $("#social-goal-slider").slider({
    id: "goalSlider",
    value: 5,
    tooltip: 'hide',
    ticks: [1, 3, 6, 12],
    ticks_positions: [0, 33.333, 66.666, 100],
    ticks_labels: ['1', '3', '6', '12']
  });

  // Set the default value text
  var sliderValue = socialGoalSlider.slider('getValue');
  $("#social-goal-value").text(sliderValue);
  // Update on slide
  $("#social-goal-slider").on("slide", function(slideEvt) {
    $("#social-goal-value").text(slideEvt.value);
  });
  // Update on click
  $(".slider-wrapper").on("click", function() {
    sliderValue = socialGoalSlider.slider('getValue');
    $("#social-goal-value").text(sliderValue);
  });




  var workGoalSlider = $("#work-goal-slider").slider({
    id: "goalSlider",
    value: 90,
    tooltip: 'hide',
    ticks: [70, 80, 90, 100],
    ticks_positions: [0, 33.333, 66.666, 100],
    ticks_labels: ['70%', '80%', '90%', '100%']
  });

  // Set the default value text
  var sliderValue = workGoalSlider.slider('getValue');
  $("#work-goal-value").text(sliderValue);
  // Update on slide
  $("#work-goal-slider").on("slide", function(slideEvt) {
    $("#work-goal-value").text(slideEvt.value);
  });
  // Update on click
  $(".slider-wrapper").on("click", function() {
    sliderValue = workGoalSlider.slider('getValue');
    $("#work-goal-value").text(sliderValue);
  });

  // Swap color of grouped button's active siblin on hover
  $(".btn").hover(function() {
    $(this).siblings(".active").addClass("on-sibling-hover");
  }, function() {
      $(this).siblings(".active").removeClass("on-sibling-hover");
  });
});
