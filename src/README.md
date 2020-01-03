# Clayton Game Corner API

Below is a list of endpoint, their methods, parameters to include if required, success response, error response, and sample call.


## `URL`
/auth/login

### Purpose:
For administrator to view their private admin pages.
### Method:
POST

### URL Params
#### Required:
 email=text, password=text, full_name=text

### Success Response
Code:200<br/>
content: {authToken}

### Error Response
code:400<br/>
 Content:{error:'Missing key in request body'}<br/>
 Content:{error: 'Incorrect email or password'}

### Sample Call 
    postLogin(email, password) {
        let options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
        };
        return fetch(`${config.API_ENDPOINT}/api/auth/login`, options)
            .then(res =>
                (!res.ok) ?
                res.json().then(e => Promise.reject(e)) : res.json());
    }

## `URL`
/users

### Purpose:
to POST credentials for site admin.
### Method:
POST

### URL Params
#### Required:
 email=text, password=text, full_name=text, bio=text

### Success Response
Code:200<br/>

### Error Response
code:400<br/>
 Content:{error:'Email already in use'}<br/>

### Sample Call 

## `URL`
/users/:user_id

### Purpose:
to DELETE credentials.
### Method:
DELETE

### URL Params
#### Required:
 id=integer

### Success Response
Code:204<br/>

### Sample Call 


## `URL`
/users/:user_id

### Purpose:
to GET admin bio.
### Method:
GET

### URL Params
#### Required:
 id=integer

### Success Response
Code:200<br/>

### Sample Call 

## `URL`
/game/upcoming

### Purpose:
to Get all upcoming games, release date, and type, where date is greater than or equal to today's date.

### Method:
GET

### URL Params
#### Required:
 title=text, date=text, game_type=game_type enum
### URL Query
#### Optional:
limit & offset

### Success Response
Code:200<br/>
content: {
        "id": 1,
        "title": "TEST GAME 1",
        "date": "Mon Jan 20 2020 12:00:00 GMT-0500 (Eastern Standard Time)",
        "game_type": "video"
    },

### Error Response
code:400<br/>
 Content:{error:'Missing key in request body'}<br/>

### Sample Call 
    
## `URL`
/game/upcoming

### Purpose:
to POST a new upcoming game with title, release date, and type.

### Method:
POST

### URL Params
#### Required:
 title=text, date=text, game_type=game_type enum

### Success Response
Code:200<br/>
content: {
        "id": 1,
        "title": "TEST GAME 1",
        "date": "Mon Jan 20 2020 12:00:00 GMT-0500 (Eastern Standard Time)",
        "game_type": "video"
    },

### Error Response
code:400<br/>
 Content:{error:'Missing key in request body'}<br/>

### Sample Call 

## `URL`
/game/upcoming/:upcoming_id

### Purpose:
to PATCH or update  title, release date, and/or type of an existing upcoming game.

### Method:
PATCH

### URL Params
#### Required:
 title=text, date=text, game_type=game_type enum

### Success Response
Code:200<br/>
content: {
        "id": 1,
        "title": "TEST GAME 1",
        "date": "Mon Jan 20 2020 12:00:00 GMT-0500 (Eastern Standard Time)",
        "game_type": "video"
    },

### Error Response
code:400<br/>
 Content:{error:'Game doesn't exist'}<br/>

### Sample Call 

## `URL`
/game/upcoming/:upcoming_id

### Purpose:
to GET an existing upcoming game from Database.

### Method:
GET

### URL Params
#### Required:
 id:integer

### Success Response
Code:200<br/>
content: {
        "id": 1,
        "title": "TEST GAME 1",
        "date": "Mon Jan 20 2020 12:00:00 GMT-0500 (Eastern Standard Time)",
        "game_type": "video"
    },

### Error Response
code:400<br/>
 Content:{error:'Game doesn't exist'}<br/>

### Sample Call 
## `URL`
/game/upcoming/:upcoming_id

### Purpose:
to DELETE an existing upcoming game from Database.

### Method:
DELETE

### URL Params
#### Required:
 id:integer

### Success Response
Code:200<br/>
content: {
        "id": 1,
        "title": "TEST GAME 1",
        "date": "Mon Jan 20 2020 12:00:00 GMT-0500 (Eastern Standard Time)",
        "game_type": "video"
    },

### Error Response
code:400<br/>
 Content:{error:'Game doesn't exist'}<br/>

### Sample Call 



## `URL`
/admin/game/upcoming

### Purpose:
to GET existing upcoming games from Database.

### Method:
GET

### Success Response
Code:200<br/>
content: {
        "id": 1,
        "title": "TEST GAME 1",
        "date": "Mon Jan 20 2020 12:00:00 GMT-0500 (Eastern Standard Time)",
        "game_type": "video"
    },

### Error Response
code:400<br/>
 Content:{error:'Game doesn't exist'}<br/>

### Sample Call 
## `URL`
/game/upcoming/:upcoming_id

### Purpose:
to DELETE an existing upcoming game from Database.

### Method:
DELETE

### URL Params
#### Required:
 id:integer

### Success Response
Code:200

### Error Response
code:400<br/>
 Content:{error:'Game doesn't exist'}<br/>

### Sample Call 

## `URL`
/admin/game/review

### Purpose:
to GET existing game reviews from Database.

### Method:
GET
### URL Query
 #### Optional:
 limit & offset

### Success Response
Code:200<br/>
content: {
        "id": 1,
        "title": "TEST GAME 1",
        "review": ""This game was great!,
        "link":"www.notarealsite.com",
        "picture":"[\"animage\"]",
        "game_type": "video"
    },

### Sample Call 

## `URL`
/game/review

### Purpose:
to POST a new game review with title, review, and type.

### Method:
POST

### URL Params
#### Required:
 title=text, review=text, game_type= game_type enum
#### Optional:
picture=text, link=text

### Success Response
Code:200<br/>
content: {
        "id":1,
        "title": "TEST GAME 1",
        "review": ""This game was great!,
        "link":"www.notarealsite.com",
        "picture":"[\"animage\"]",
        "game_type": "tabletop"
    },

### Error Response
code:400<br/>
 Content:{error:'Missing key in request body'}<br/>

### Sample Call

## `URL`
/admin/game/review/tabletop

### Purpose:
to GET existing game reviews from Database where game_type='tabletop'.

### Method:
GET

### URL Query
 #### Optional:
 limit & offset

### Success Response
Code:200<br/>
content: {
        "id": 1,
        "title": "TEST GAME 1",
        "review": ""This game was great!,
        "link":"www.notarealsite.com",
        "picture":"[\"animage\"]",
        "game_type": "tabletop"
    }

### Sample Call 

## `URL`
/admin/game/review/video

### Purpose:
to GET existing game reviews from Database where game_type='video'.

### Method:
GET

### URL Query
 #### Optional:
 limit & offset

### Success Response
Code:200<br/>
content: {
        "id": 1,
        "title": "TEST GAME 1",
        "review": ""This game was great!,
        "link":"www.notarealsite.com",
        "picture":"[\"animage\"]",
        "game_type": "video"
    }

### Sample Call 

## `URL`
/game/review/:review_id

### Purpose:
to DELETE an existing game review from Database.

### Method:
DELETE

### URL Params
#### Required:
 id:integer

### Success Response
Code:200

### Error Response
code:400<br/>
 Content:{error:'Review doesn't exist'}<br/>

### Sample Call 

## `URL`
/game/review/:review_id

### Purpose:
to PATCH or update  title, review, picture, link, and/or type of an existing game review.

### Method:
PATCH

### Success Response
Code:200<br/>
content: {
        "id": 1,
        "title": "TEST GAME 1",
        "review": ""This game was great!,
        "link":"www.notarealsite.com",
        "picture":"[\"animage\"]",
        "game_type": "video"
    }

### Error Response
code:400<br/>
 Content:{error:'Request body must contain title, game type, review'}<br/>

### Sample Call 