'use strict';

var nforce = require('nforce');

var org = nforce.createConnection({
    clientId: "3MVG9ZL0ppGP5UrDcZ4l6497UR5SBe6_hDAA2uKO1pyg_6HEGJpvOICzKDeUzvtpr8sQ1CDd5ZsMQ2OLNM35s",
    clientSecret: "3573501030169292200",
    redirectUri: 'https://localhost:3000/oauth/_callback',
    environment: 'production',
    mode: 'single',
    autoRefresh: true
});

//password = password + security token
org.authenticate({username: '', password: ''}, function (err, resp) {
    if (!err) {
        console.log('Successfully connected to Salesforce.');
    }
    if (err) {
        console.error('Cannot connect to Salesforce: ' + err);
    }
});

module.exports = org;
