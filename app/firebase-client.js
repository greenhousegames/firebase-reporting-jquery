import firebase from 'firebase';

class FirebaseClient {
  constructor() {
    this.firebase = firebase.initializeApp({
      apiKey: 'AIzaSyDRf-RxCxWRecif5l-q2ZMEQ595ohApojs',
      authDomain: 'fir-reporting.firebaseapp.com',
      databaseURL: 'https://fir-reporting.firebaseio.com',
      storageBucket: '',
      messagingSenderId: '275159253276'
    });
    this.dataRef = this.firebase.database().ref('data');
  }

  saveButtonClicked(button, reportingService) {
    const data = {
      uid: this.firebase.auth().currentUser.uid,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      anyclicked: 1
    };
    data[button + 'clicked'] = 1;

    // save metrics first to ensure onDataSaved callback
    // is called after metrics have been calculated
    reportingService.saveMetrics(data).then(() => {
      this.dataRef.push().set(data);
    });
  }

  onDataSaved(cb) {
    let query = this.dataRef.orderByChild('timestamp');
    query.limitToLast(1).once('value', (snapshot) => {
      const data = snapshot.val();
      const keys = data ? Object.keys(data) : null;

      if (keys && keys.length > 0) {
        query = query.startAt(data[keys[0]].timestamp + 1);
      }

      // setup listener
      query.on('child_added', cb);
    });
  }

  waitForAuth() {
    const auth = this.firebase.auth();
    const promise = new Promise((resolve) => {
      const callback = () => {
        off();
        resolve();
      };
      const off = auth.onAuthStateChanged(callback);
    });
    return promise;
  }

  requireAuth() {
    const promise = new Promise((resolve, reject) => {
      this.waitForAuth().then(() => {
        if (!this.firebase.auth().currentUser) {
          this.firebase.auth().signInAnonymously().then(resolve).catch(reject);
        } else {
          resolve();
        }
      }).catch(reject);
    });
    return promise;
  }
}

module.exports = FirebaseClient;
