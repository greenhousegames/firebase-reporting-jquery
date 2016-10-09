import firebase from 'firebase';
import $ from 'jquery';
import ReportingService from './reporting-service';
import FirebaseClient from './firebase-client';
import ClickReport from './click-report';

$(document).foundation();

// setup firebase
const firebaseClient = new FirebaseClient();
firebaseClient.requireAuth(); // initiate login

// setup reporting
const reportingService = new ReportingService(firebaseClient.firebase);
const report = new ClickReport(reportingService);

$(document).ready(() => {
  // draw charts once page is loaded and user is authenticated
  report.loadCharts(() => {
    firebaseClient.requireAuth().then(() => {
      report.draw();
    });
  });

  // setup buttons
  jQuery('#a_button').click(() => {
    firebaseClient.saveButtonClicked('a', reportingService);
  });
  jQuery('#b_button').click(() => {
    firebaseClient.saveButtonClicked('b', reportingService);
  });
  jQuery('#c_button').click(() => {
    firebaseClient.saveButtonClicked('c', reportingService);
  });
  jQuery('#d_button').click(() => {
    firebaseClient.saveButtonClicked('d', reportingService);
  });

  // make charts responsive
  $(window).resize(() => {
    report.draw();
  });

  // update report when data saved
  firebaseClient.onDataSaved(() => {
    report.draw();
  });
});
