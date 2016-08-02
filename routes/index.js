var express = require('express');
var router = express.Router();
var nforce = require('nforce');
var org = require('../lib/salesforce-connection');
const TEST_USER_UUID = 'test_user_123456';
const USER_ROLE_NAME = 'user';

router.get('/', function (req, res, next) {
    res.render('login');
});

router.get('/login', function (req, res, next) {
    var type = req.query.type;
    if (type) {
        var ses = req.session;
        ses.loginUserType = type;
        if (type == USER_ROLE_NAME) {
            ses.loginUserId = TEST_USER_UUID;
        }
        console.log('session loginUserType:' + ses.loginUserType);
        res.redirect('/event/');
    } else {
        res.redirect('/');
    }
});

router.get('/logout', function (req, res, next) {
    var ses = req.session;
    ses.loginUserType = null;
    req.session.destroy(function (err) {
        if (err) {
            console.error(err);
        } else {
            res.redirect('/');
        }
    });
});

router.get('/event', function (req, res, next) {
    var ses = req.session;
    var type = ses.loginUserType;
    if (!type) {
        res.redirect('/');
    } else {
        res.render('event-list', {});
    }
});

router.get('/rest/event/list', function listEvent(req, res, next) {
    org.query({
            query: "SELECT Id,MineEntry__Description__c,MineEntry__End__c,MineEntry__RegLimit__c,MineEntry__RemainingSeats__c," +
            "MineEntry__Start__c,MineEntry__Status__c,MineEntry__Title__c FROM MineEntry__MyEvent__c Order by CreatedDate DESC"
        })
        .then(
            function (results) {
                respondJSON(res, 'ok', '', results.records);
            }
        )
        .error(
            function (err) {
                console.error('>>>>>>error happens:' + err);
                respondJSON(res, 'error', '', []);
            }
        );
});

router.get('/rest/event/detail', function getEventDetail(req, res, next) {
    org.query({
            query: "SELECT Id,MineEntry__Description__c,MineEntry__End__c,MineEntry__RegLimit__c,MineEntry__RemainingSeats__c," +
            "MineEntry__Start__c,MineEntry__Status__c,MineEntry__Title__c FROM MineEntry__MyEvent__c where Id = '" + req.query.id + "'"
        })
        .then(
            function (results) {
                respondJSON(res, 'ok', '', results.records);
            })
        .error(
            function () {
                respondJSON(res, 'error', '', []);
            }
        );
});

router.post('/rest/event/create', function createEvent(req, res, next) {
    var event = nforce.createSObject('MineEntry__MyEvent__c');
    event.set('MineEntry__Title__c', req.body.title);
    event.set('MineEntry__Status__c', req.body.status);
    event.set('MineEntry__Start__c', req.body.start);
    event.set('MineEntry__End__c', req.body.end);
    event.set('MineEntry__RegLimit__c', req.body.limit);
    event.set('MineEntry__RemainingSeats__c', req.body.seats);
    event.set('MineEntry__Description__c', req.body.description);
    org.insert({sobject: event})
        .then(
            function (response) {
                respondJSON(res, 'ok', '', response);
            }
        )
        .error(
            function () {
                respondJSON(res, 'error', '', []);
            }
        );
});

router.post('/rest/event/update', function updateEvent(req, res, next) {
    var obj = nforce.createSObject('MineEntry__MyEvent__c');
    obj.set('Id', req.body.id);
    obj.set('MineEntry__Title__c', req.body.mineentry__title__c);
    obj.set('MineEntry__Start__c', req.body.mineentry__start__c);
    obj.set('MineEntry__End__c', req.body.mineentry__end__c);
    obj.set('MineEntry__Status__c', req.body.mineentry__status__c);
    obj.set('MineEntry__RegLimit__c', req.body.mineentry__reglimit__c);
    obj.set('MineEntry__RemainingSeats__c', req.body.mineentry__remainingseats__c);
    obj.set('MineEntry__Description__c', req.body.mineentry__description__c);

    org.update({sobject: obj})
        .then(
            function (response) {
                respondJSON(res, 'ok', '', response);
            }
        )
        .error(
            function (err) {
                console.error('>>>>>>error happens:' + err);
                respondJSON(res, 'error', '', {});
            }
        );
});

router.get('/rest/event/delete', function deleteEvent(req, res, next) {
    var obj = nforce.createSObject('MineEntry__MyEvent__c');
    obj.set('Id', req.query.id);
    org.delete({sobject: obj})
        .then(
            function (response) {
                respondJSON(res, 'ok', '', response);
            }
        )
        .error(
            function (err) {
                console.error('>>>>>>error happens:' + err);
                respondJSON(res, 'error', '', {});
            }
        );
});

router.get('/rest/event/detail/sessions', function listSessions(req, res, next) {
    org.query({
            query: "SELECT Id,MineEntry__EventId__c,MineEntry__Status__c," +
            "MineEntry__Title__c,MineEntry__Start__c,MineEntry__End__c,MineEntry__RegLimit__c,MineEntry__RemainingSeats__c" +
            " FROM MineEntry__Session__c where MineEntry__EventId__c = '" + req.query.id + "' Order by CreatedDate DESC"
        })
        .then(
            function (results) {
                respondJSON(res, 'ok', '', results.records);
            }
        )
        .error(
            function (err) {
                console.error('>>>>>>error happens:' + err);
                respondJSON(res, 'error', '', {});
            }
        );
});

router.get('/rest/event/detail/attendees', function listAttendees(req, res, next) {
    org.query({
            query: "SELECT Id,MineEntry__Company__c,MineEntry__Email__c," +
            "MineEntry__FirstName__c,MineEntry__LastName__c,MineEntry__Phone__c " +
            "FROM MineEntry__Attendee__c WHERE MineEntry__EventId__c = '" + req.query.id + "' ORDER BY CreatedDate DESC"
        })
        .then(
            function (results) {
                respondJSON(res, 'ok', '', results.records);
            }
        )
        .error(
            function (err) {
                console.error('>>>>>>error happens:' + err);
                respondJSON(res, 'error', '', {});
            }
        );
});

router.get('/rest/event/detail/getAttendeeEntity', function getAttendeeEntity(req, res, next) {
    org.query({
            query: "SELECT Id,MineEntry__Company__c,MineEntry__Email__c,MineEntry__EventId__c,MineEntry__FirstName__c,MineEntry__LastName__c,MineEntry__Phone__c " +
            "FROM MineEntry__Attendee__c where Id = '" + req.query.attendeeId + "'"
        })
        .then(
            function (results) {
                respondJSON(res, 'ok', '', results.records);
            })
        .error(
            function () {
                respondJSON(res, 'error', '', []);
            }
        );
});

router.get('/rest/event/detail/getRegisteredSessions', function listRegisteredSessions(req, res, next) {
    var eventId = req.query.eventId;
    var userId = req.session.loginUserId;
    org.query({
            query: "SELECT Id,MineEntry__AttendeeId__c,MineEntry__EventId__c," +
            "MineEntry__SessionId__c FROM MineEntry__Attendee_Session__c WHERE MineEntry__UserId__c = '" + userId + "' " +
            " and MineEntry__EventId__c = '" + eventId + "' ORDER BY CreatedDate DESC"
        })
        .then(
            function (results) {
                respondJSON(res, 'ok', '', results.records);
            }
        )
        .error(
            function (err) {
                console.error('>>>>>>error happens:' + err);
                respondJSON(res, 'error', '', {});
            }
        );
});

router.get('/rest/event/detail/attendee/assignedSessionList', function listAttendeeSessionList(req, res, next) {
    org.query({
            query: "SELECT MineEntry__SessionId__c FROM MineEntry__Attendee_Session__c" +
            " WHERE MineEntry__AttendeeId__c = '" + req.query.attendeeId + "'"
        })
        .then(
            function (results) {
                respondJSON(res, 'ok', '', results.records);
            }
        )
        .error(
            function (err) {
                console.error('>>>>>>error happens:' + err);
                respondJSON(res, 'error', '', {});
            }
        );
});

router.post('/rest/event/detail/attendee/assignSession', function assignSession(req, res, next) {
    var list = req.body.sessionList;
    var idArray = [];
    for (var i = 0; i < list.length; i++) {
        idArray.push(list[i]['mineentry__sessionid__c']);
    }
    org.apexRest({
            uri: "MineEntry/assignSessionsForAttendee",
            method: "POST",
            body: JSON.stringify({"eventId": req.body.eventId, "attendeeId": req.body.attendeeId, "sessionIds": idArray.join(',')})
        })
        .then(
            function (response) {
                respondJSON(res, 'ok', '', {});
            })
        .error(
            function (err) {
                console.error('>>>>>>error happens:' + err);
                respondJSON(res, 'error', '', {});
            }
        );
});

router.post('/rest/event/registerSession', function registerSession(req, res, next) {
    var list = req.body.sessionIdList;
    var eventId = req.body.eventId;
    var attendee = req.body.attendee;
    org.apexRest({
            uri: "MineEntry/registerSessions",
            method: "POST",
            body: JSON.stringify({
                "eventId": eventId,
                "userId": req.session.loginUserId,
                "sessionIds": list.join(','),
                "firstName": attendee.FirstName,
                "lastName": attendee.LastName,
                "email": attendee.Email,
                "phone": attendee.Phone,
                "company": attendee.Company
            })
        })
        .then(
            function (response) {
                respondJSON(res, 'ok', '', {});
            })
        .error(
            function (err) {
                console.error('>>>>>>error happens:' + err);
                respondJSON(res, 'error', '', {});
            }
        );
});

router.post('/rest/attendee/create', function createAttendee(req, res, next) {
    var event = nforce.createSObject('MineEntry__Attendee__c');
    event.set('MineEntry__FirstName__c', req.body.FirstName);
    event.set('MineEntry__LastName__c', req.body.LastName);
    event.set('MineEntry__EventId__c', req.body.EventId);
    event.set('MineEntry__Email__c', req.body.Email);
    event.set('MineEntry__Phone__c', req.body.Phone);
    event.set('MineEntry__Company__c', req.body.Company);
    org.insert({sobject: event})
        .then(
            function (response) {
                respondJSON(res, 'ok', '', response);
            }
        )
        .error(
            function (err) {
                console.error('>>>>>>error happens:' + err);
                respondJSON(res, 'error', '', {});
            }
        );
});

router.get('/rest/attendee/delete', function (req, res, next) {

    var obj = nforce.createSObject('MineEntry__Attendee__c');
    obj.set('Id', req.query.id);

    org.delete({sobject: obj})
        .then(
            function (response) {
                respondJSON(res, 'ok', '', response);
            }
        )
        .error(
            function (err) {
                console.error('>>>>>>error happens:' + err);
                respondJSON(res, 'error', '', {});
            }
        );
});

router.post('/rest/session/create', function createSession(req, res, next) {
    var s = nforce.createSObject('MineEntry__Session__c');
    s.set('MineEntry__Title__c', req.body.Title);
    s.set('MineEntry__Status__c', req.body.Status);
    s.set('MineEntry__Start__c', req.body.Start);
    s.set('MineEntry__End__c', req.body.End);
    s.set('MineEntry__RegLimit__c', req.body.RegLimit);
    s.set('MineEntry__RemainingSeats__c', req.body.RemainingSeats);
    s.set('MineEntry__EventId__c', req.body.EventId);
    org.insert({sobject: s})
        .then(
            function (response) {
                respondJSON(res, 'ok', '', response);
            }
        )
        .error(
            function (err) {
                console.error('>>>>>>error happens:' + err);
                respondJSON(res, 'error', '', {});
            }
        );
});

router.get('/rest/session/delete', function (req, res, next) {

    var obj = nforce.createSObject('MineEntry__Session__c');
    obj.set('Id', req.query.id);

    org.delete({sobject: obj})
        .then(
            function (response) {
                respondJSON(res, 'ok', '', response);
            }
        )
        .error(
            function (err) {
                console.error('>>>>>>error happens:' + err);
                respondJSON(res, 'error', '', {});
            }
        );
});

router.get('/rest/user', function getUser(req, res, next) {
    var ses = req.session;
    var type = ses.loginUserType;
    var data = {
        userType: type
    };
    respondJSON(res, 'ok', '', data);
});

function respondJSON(res, code, message, data) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({code: code, message: message, data: data}));
}

module.exports = router;