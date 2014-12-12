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
  this.clientId = '572564784307-nk37gr479m8rihtl4m1imgtgch9hbg8s.apps.googleusercontent.com';
  this.apiKey = 'AIzaSyCAsPySfq-ocIaLryp4SuAtLK2Qgg1yk6k';
  this.token;

  // enter the scope of current project (this API must be turned on in the google console)
  this.scopes = 'https://www.googleapis.com/auth/calendar';


  // Oauth2 functions
  function handleClientLoad() {
    gapi.client.setApiKey(that.apiKey);
    that.authorize();
    window.setTimeout(checkAuth, 1);
  }


  this.checkAuth = function() {
    gapi.auth.authorize({
      client_id: that.clientId,
      scope: that.scopes,
      immediate: true
    }, function(token){
      console.log("OAuth2.0 access expired. No worries, it's been refreshed under the hood. New Token: ");
      console.log(token);
    });
  }

  /**
   * Authorize User to uses Google's APIs via OAuth2.0
   * @param  callback  Function to be called once authorization is completed. Takes OAuth 2.0 token object as parameter.
   * @return void
   */
  this.authorize = function() {
    var authorizePromise = $q.defer();

    gapi.auth.authorize({
      client_id: that.clientId,
      scope: that.scopes,
      immediate: false
    }, function(token){
      console.log('Used OAuth2.0 to authorize Google API access! Token:');
      console.log(token);

      console.log('CalendarList Defined?');
      console.log(gapi.client.calendarList === undefined);
      that.token = token;

      authorizePromise.resolve();
    });

    return authorizePromise.promise;
  }

  //If User's REALM Sessions Calendar exists, return its calendarId. If User's REALM Sessions Calendar does not exist, create it and return new calendarId.
  this.getSessionsCalendarId = function(){
    var getSessionsCalendarIdPromise = $q.defer();
    
    var getCalendarListRequest = gapi.client.calendar.calendarList.list();

    //Attempt to get User's CalendarList
    getCalendarListRequest.execute(function(getCalendarListResponse){
      
      //Check response for error code. If none exists, we've successfully gotten the User's CalendarList The power!!! I don't know if I can handle it!!!111!!!11!1
      if(getCalendarListResponse.code === undefined)
      {
        console.log("Got User's CalendarList successfully.");

        that.sessionsCalendarExists(getCalendarListResponse.items).then(function(calendarId){
          console.log('REALM Sessions Calendar exists. Id: ' + calendarId);
          getSessionsCalendarIdPromise.resolve(calendarId);
        }, function(){
          console.log("REALM Sessions Calendar does not exist. Creating it now.")
          that.createCalendar('REALM Sessions').then(function(calendarId){
            getSessionsCalendarIdPromise.resolve(calendarId);
          },function(){});
        });
      }
      else
      {
        console.log("Failed to get user's calendar list. Error Code: " + getCalendarListResponse.code);
        getSessionsCalendarIdPromise.reject();
      }
    });

    return getSessionsCalendarIdPromise.promise;
  }

  this.sessionsCalendarExists = function(calendarList) {
    var sessionsCalendarExistsPromise = $q.defer();
    //Check each Calendar in User's CalendarList to see if REALM Sessions Calendar exists
      //If so, set sessionsCalendarExists to true, and resolve the getSessionsCalendarId promise with the Sessions Calendar's calendarId
      calendarList.forEach(function(element,index,array){
        if(element.summary === 'REALM Sessions') 
        {
          sessionsCalendarExistsPromise.resolve(element.id);
        }
      });

      sessionsCalendarExistsPromise.reject();

      return sessionsCalendarExistsPromise.promise;
  }
  /**
   * Creates Calendar in User's CalendarList
   * @param  String  calendarSummary   Name of calendar to be created. (e.g: 'REALM Sessions')                  
   * @return Promise                   Resolves to new calendarId. Rejects empty.
   */
  this.createCalendar = function(calendarSummary) {
    var createCalendarPromise = $q.defer();

    var createCalendarRequest = gapi.client.calendar.calendars.insert({
      'summary': calendarSummary
    });
    
    //Attempt to create REALM Sessions Calendar
    createCalendarRequest.execute(function(createCalendarResponse) {
      //If error code doesn't exist, we've successfully created the REALM Sessions Calendar
      if (createCalendarResponse.code === undefined) {
        console.log('Successfully created REALM Sessions Calendar (calendarId = ' + createCalendarResponse.id + '). Now adding to calendar list...');

        var addCalendarToListRequest = gapi.client.calendar.calendarList.insert({
          'id': createCalendarResponse.id
        });

        addCalendarToListRequest.execute(function(addCalendarToListResponse){
          if(addCalendarToListResponse.code === undefined)
          { 
            console.log('Successfully added REALM Sessions Calendar to Calendar List.');
          } else {
            console.log('Failed to add REALM Sessions Calendar to Calendar List');
          }
        });
      } //Else, we dun goofed :( (or google did, but probably us)
      else {
        console.log('Failed to create REALM Sessions Calendar: ' + resp.code);
      }
    });

    return createCalendarPromise.promise;
  }

  /**
   * Create Event in User's 'REALM Sessions' Calendar
   * 
   * @param  Int      calendarId          CalendarId of Calendar that new Event will be created in.
   * @param  Bool     sendNotifications   Whether or not new Event should send notifications.
   * @param  String   description         Description of new Event.
   * @param  String   startDateString     RFC 3339 formatted start date of new Event
   * @param  String   endDateString       RFC 3339 formatted end date of new Event
   * 
   * @return Promise  createEventPromise  Resolves if event created successfully. Rejects if not.
   */
  this.createEvent = function(calendarId, sendNotifications, description, startDateString, endDateString){
    
    var createEventPromise = $q.defer();

    var eventResource = {
      'calendarId': calendarId,
      'sendNotifications': sendNotifications,
      'description': description,
      'summary': description,
      'start':{
        'dateTime': startDateString
      },
      'end':{
        'dateTime': endDateString
      }
    }

    console.log('Attempting to create event: ');
    console.log(eventResource);

    var request = gapi.client.calendar.events.insert(eventResource);

    request.execute(function(createEventResponse){
      console.log(createEventResponse);
      if(createEventResponse.code === undefined)
      {
        console.log('Successfully created Session Event. EventId: ' + createEventResponse.id);
        createEventPromise.resolve();
      }
      else
      { 
        console.log('Failed to create Session Event. Error Code' + createEventResponse.code);
        createEventResponse.reject();
      }
    });

    return createEventPromise.promise;
  }

  this.createSessionEvent = function(token, session){
    
  }
  
});