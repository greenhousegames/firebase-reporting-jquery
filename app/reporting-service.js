import FirebaseReporting from '@greenhousegames/firebase-reporting';

class ReportingService extends FirebaseReporting {
  constructor(firebase) {
    super({
      firebase: firebase.database().ref('reporting')
    });

    // Add report filter for users
    this.addFilter('users', ['uid']);

    // Metrics for timing
    this.addMetric('timestamp', ['first', 'last']);

    // Metrics for ANY button clicked
    this.addMetric('anyclicked', ['sum']);
    this.enableRetainer('minute', 'anyclicked', ['sum']);
    this.enableRetainer('hour', 'anyclicked', ['sum']);
    this.enableRetainer('day', 'anyclicked', ['sum']);
    this.enableRetainer('week', 'anyclicked', ['sum']);

    // Metrics for A button clicked
    this.addMetric('aclicked', ['sum']);
    this.enableRetainer('minute', 'aclicked', ['sum']);
    this.enableRetainer('hour', 'aclicked', ['sum']);
    this.enableRetainer('day', 'aclicked', ['sum']);
    this.enableRetainer('week', 'aclicked', ['sum']);

    // Metrics for B button clicked
    this.addMetric('bclicked', ['sum']);
    this.enableRetainer('minute', 'bclicked', ['sum']);
    this.enableRetainer('hour', 'bclicked', ['sum']);
    this.enableRetainer('day', 'bclicked', ['sum']);
    this.enableRetainer('week', 'bclicked', ['sum']);

    // Metrics for C button clicked
    this.addMetric('cclicked', ['sum']);
    this.enableRetainer('minute', 'cclicked', ['sum']);
    this.enableRetainer('hour', 'cclicked', ['sum']);
    this.enableRetainer('day', 'cclicked', ['sum']);
    this.enableRetainer('week', 'cclicked', ['sum']);

    // Metrics for D button clicked
    this.addMetric('dclicked', ['sum']);
    this.enableRetainer('minute', 'dclicked', ['sum']);
    this.enableRetainer('hour', 'dclicked', ['sum']);
    this.enableRetainer('day', 'dclicked', ['sum']);
    this.enableRetainer('week', 'dclicked', ['sum']);
  }
}

module.exports = ReportingService;
