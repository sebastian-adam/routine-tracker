const express = require('express');
const passport = require('passport');
const router = express.Router();
const request = require('request');
const { Pool, Client } = require('pg')
const pgp = require('pg-promise');
const moment = require('moment');
const bootstrapSlider = require('bootstrap-slider');

// // hitting specific Fitbit endpoints
// function compileOptions(accessToken) {
//   var today = moment().format("YYYY-MM-DD");
//   var previousWeekStart = moment().subtract(13,'d').format("YYYY-MM-DD");
//
//   var options = {
//     url: 'https://api.fitbit.com/1.2/user/-/sleep/date/' + previousWeekStart + '/' + today + '.json',
//     headers: { 'Authorization': 'Bearer ' + accessToken }
//   }
//   return options;
// };
//
// function callback(error, res, req) {
//   if (!error && res.statusCode == 200) {
//
//     const connectionInfo = {
//       host     : process.env.RDS_HOSTNAME,
//       port     : process.env.RDS_PORT,
//       database : process.env.RDS_DATABASE,
//       user     : process.env.RDS_USERNAME,
//       password : process.env.RDS_PASSWORD
//     };
//     const db = pgp()(connectionInfo);
//
//     const body = JSON.parse(req);
//     const days = body.sleep;
//
//
//     function postLogs(log, summary) {
//       db.none('INSERT INTO sleep_logs(user_id, duration_in_bed, duration_out_of_bed, end_time, date_of_sleep, date_time, level, seconds) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', [1, summary.durationInBed, summary.durationOutOfBed, summary.endTime, summary.dateOfSleep, log.dateTime, log.level, log.seconds])
//           .then(() => {
//               console.log('successfully inserted new row');
//           })
//           .catch(error => {
//               console.log(error);
//           });
//     }
//
//     function loopThroughLogs(logs, summary) {
//       for (var i = 0; i < logs.length; i++) {
//         postLogs(logs[i], summary);
//       }
//     };
//
//     for (var i = 0; i < days.length; i++) {
//       const summary = {
//         dateOfSleep: days[i].dateOfSleep,
//         durationInBed: days[i].duration,
//         durationOutOfBed: 86400000 - days[i].duration,
//         endTime: days[i].endTime
//       };
//
//       const logs = days[i].levels.data;
//       loopThroughLogs(logs, summary);
//     }
//
//   }
// }



//     // db.none('INSERT INTO daily_activity(activeminutes, userid, date) VALUES($1, $2, $3)', [data.goals.activeMinutes, 2, '2017-05-05'])
//     //     .then(() => {
//     //         console.log('successfully inserted new row');
//     //     })
//     //     .catch(error => {
//     //         console.log(error);
//     //     });

const fitbitAuthenticate = passport.authenticate('fitbit', {
  successRedirect: '/success',
  failureRedirect: '/failure'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'OfficeStock' });
});

router.get('/login', fitbitAuthenticate);

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/callback', fitbitAuthenticate);

router.get('/success', function(req, res, next) {
  request(compileOptions(req.user.accessToken), callback);
  res.render('supply', req.user);
});

router.get('/failure', function(req, res) {
  var error = req.flash("error");
  var error_description = req.flash("error_description");
  req.logout();
  res.render('failure', {
    error: error[0],
    error_description: error_description[0],
  });
});

module.exports = router;
