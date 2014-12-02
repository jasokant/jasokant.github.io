'use strict';

angular.module('realm.services').service('GAuthService', function($http, $q) {

  //self reference
  var that = this;

  // date variables
  var now = new Date();
  var today = now.toISOString();

  var twoHoursLater = new Date(now.getTime() + (2 * 1000 * 60 * 60));
  twoHoursLater = twoHoursLater.toISOString();

  // google api console clientID and apiKey (https://code.google.com/apis/console/#project:568391772772)
  var clientId = '572564784307-nk37gr479m8rihtl4m1imgtgch9hbg8s.apps.googleusercontent.com';
  var apiKey = 'AIzaSyCAsPySfq-ocIaLryp4SuAtLK2Qgg1yk6k';

  // enter the scope of current project (this API must be turned on in the google console)
  var scopes = 'https://www.googleapis.com/auth/calendar';

  //
  this.userCalendarId = '';

  // Oauth2 functions
  this.handleClientLoad = function() {
    gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth, 1);
  }

  this.checkAuth = function() {
    gapi.auth.authorize({
      client_id: clientId,
      scope: scopes,
      immediate: true
    }, handleAuthResult);
  }

  function handleAuthResult(authResult) {

  }

  // function triggered when user authorizes app
  this.authorize = function(callback) {
    gapi.auth.authorize({
      client_id: clientId,
      scope: scopes,
      immediate: false
    }, callback);
    return false;
  }

  //returns true if REALM Sessions Calendar exists, otherwise returns false
  this.realmSessionsCalendarExists = function(){
    var deferred = $q.defer();

    var request = gapi.client.calendar.calendarList.list();

    request.execute(function(resp){
      if(resp.items !== undefined)
      {
        console.log('got calendar list successfully')

        resp.items.forEach(function(element,index,array){
          if(element.summary === 'REALM Sessions') 
          {
            userCalendarId = element.id;
            deferred.resolve(true);
          }
        });

        deferred.resolve(false);
      }
      else
      {
        console.log('failed to get calendar list');
        deferred.reject(resp.code);
      }
    });

    return deferred.promise;
  }

  this.createSessionEvent = function(eventResource, authResult) {
    gapi.client.load('calendar', 'v3', function() { // load the calendar api (version 3)

      console.log(eventResource);

      that.realmSessionsCalendarExists().then(function(calendarExists){
        
        //if REALM Sessions calendar exists, create event directly
        if(calendarExists)
        {
          eventResource.calendarId = that.userCalendarId;
          that.createEvent(eventResource);
        } //else create REALM Sessions calendar, then add event
        else
        {
          console.log('no REALM Sessions calendar, creating one...');

          that.createSessionCalendar(eventResource);
        }
      },function(response){
        console.log("couldn't get calendar list, error code: " + response);
      });
    });
  }

  //creates REALM Sessions calendar in users' calendarList
  this.createSessionCalendar = function(eventResource) {
    var request = gapi.client.calendar.calendarList.insert({
      'summary': 'REALM Sessions', // calendar ID
    });

    request.execute(function(resp) {
      if (resp.code === undefined) {
        console.log('created REALM Sessions Calendar');

        userCalendarId = resp.id;
        eventResource.calendarId = userCalendarId;


        that.createEvent(eventResource);
      } else {
        console.log('rejected, code: ' + resp.code);
      }
    });

    
  }

  //create session event
  this.createEvent = function(eventResource){
  
    var request = gapi.client.calendar.events.insert(eventResource);

    request.execute(function(resp){
      console.log(resp);
    });
  }
  
});