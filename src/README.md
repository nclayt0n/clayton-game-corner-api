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
/game/upcoming

### Purpose:
to Get all upcoming games, release date, and type.

### Method:
GET

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

