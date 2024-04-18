
//Imports express from the node_modules folder
const express = require('express')
const winston = require('winston')

const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json()) // for parsing application/json

const pgp = require('pg-promise')();
const db = pgp("postgres://postgres:goodworks17@localhost:5432/postgres");

// Creating a winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
});


function clientError (req, message, errorCode) {
    logger.log({
        level: 'info',
        endpoint: req.path,
        method: req.method,
        query: req.query,
        pathParameters: req.params,
        body: req.body,
        ip: req.ip,
        error: errorCode,
        message: message,
        timestamp: new Date().toUTCString(),
    });
}

/*
Middleware:
    Creates a log for every API call
*/

let clientID = 0;

app.all('/*', (req, res, next) => {
    clientID++;
    logger.log({
        level:'info',
        endpoint: req.path,
        query: req.query,
        pathParameters: req.params,
        body: req.body,
        ip: req.ip,
        timestamp: new Date().toUTCString(),
    });
    next()
})

// Add an image column in your pokemon table. This will hold images of every single Pokémon. You will have to update your endpoints to account for this new field

/*
Endpoint: 
    Returns a list of pokemons inside the pokedex
Query Parameters:
    all: get the whole list of pokemons that are inside this pokedex
    id[integer]: the id of the pokemon
    name[string]: the name of the pokemon
    type[string]: the pokemon type
    region[string]: the region the pokemon came from
    abilities[string]: the abilities of the pokemon

*/

app.get('/pokedex', async (req, res) => {
    // Makes sure that client does not put in a body in their request
    if(Object.keys(req.body).length != 0) {
        clientError(req, "Request body is not permitted at this endpoint", 400);
        res.status(400).json({error: "Request body is not permitted at this endpoint"});
    } 
    // Makes sure that client only 4 query param (name, type, region, abilities)
    else if(Object.keys(req.query).length > 1) {
        clientError(req, "Query parameters do not meet the requirements", 400);
        res.status(400).json({error: "Query parameters do not meet the requirements length"});
    } 
    // Makes sure that client put in an ID that is a number
    else if(isNaN(req.query.id) && req.query.id != undefined) {
        clientError(req, "ID is not a number", 400);
        res.status(400).json({error: "ID is not a number"});
    } 
    else {
        if(req.query.all === '') {
            res.json(await db.any('SELECT * FROM pokedex'));
        }
        else if(req.query.party != undefined) {
            // Delete the table content so that will not have more than 6 pokemons at all times
            await db.none('DELETE FROM pokemonParty');
            // Store a list of 6 random pokemons in the party variable for access later
            let party = await db.many('SELECT * FROM pokedex ORDER BY RANDOM() LIMIT 6');
            // Go through the loop to add each pokemon and its info into the party of 6
            for(i = 0; i < party.length; i++) {
                await db.none('INSERT INTO pokemonParty(hp, name, type, abilities, image, attack, defense, attacks) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', [party[i].hp, party[i].name, party[i].type, party[i].abilities, party[i].image, party[i].attack, party[i].defense, party[i].attacks]);
            }
            // console.log(party);
            // Get 4 random moves for the pokemon
            let movesParty =  await db.many('SELECT * FROM pokemonParty');
            for(let j = 0; j < movesParty.length; j++) {
                // console.log(movesParty.length);
                let moves = await db.many('SELECT attacks.name FROM pokemonParty INNER JOIN attacks ON pokemonParty.type = attacks.type WHERE pokemonParty.id = $1 ORDER BY RANDOM() LIMIT 4', [movesParty[j].id]);
                // console.log([movesParty[j].id]);
                // 4 variation of moves for 6 pokemons, need to loop through inside initial loop
                // looping through the 4 move pull from above loop
                // listing just the name (disect it)
                
                for(let k = 0; k < moves.length; k++) {
                    moves[k] = moves[k].name;
                }
                // make it easierto convert to string values
                moves = '{' + moves.toString() + '}'; 
                // console.log(moves);
                await db.none('UPDATE pokemonParty SET attacks = $1 WHERE pokemonParty.id = $2', [moves, movesParty[j].id]);
            }
            // Selecting all but the ID from pokemonparty
            res.json(await db.many('SELECT hp, name, type, abilities, image, attack, defense, attacks FROM pokemonParty'));
            }
        else {
            if(req.query.id != undefined) {
                let checkNullID = await db.oneOrNone('SELECT * FROM pokedex WHERE id = $1', [req.query.id]);
                if(checkNullID === null) {
                    clientError(req, "That ID does not exist", 400);
                    res.status(400).json({error: "That ID does not exist"});
                } else {
                    res.json(await db.oneOrNone('SELECT * FROM pokedex WHERE id = $1', [req.query.id]));
                }
                
            } 
            else if(req.query.name != undefined) {
                let checkNullName = await db.oneOrNone('SELECT * FROM pokedex WHERE name = $1', [req.query.name]);
                if(checkNullName === null) {
                    clientError(req, "That pokemon has not been found yet", 400);
                    res.status(400).json({error: "That pokemon has not been found yet"});
                } 
                else {
                    res.json(await db.oneOrNone('SELECT * FROM pokedex WHERE name = $1', [req.query.name]));
                }
            }
            else if(req.query.region != undefined) {
                let checkNullRegion = await db.many('SELECT * FROM pokedex WHERE region = $1', [req.query.region]);
                if(checkNullRegion === null) {
                    clientError(req, "That pokemon has not been found yet", 400);
                    res.status(400).json({error: "That pokemon has not been found yet"});
                } 
                else {
                    res.json(await db.many('SELECT * FROM pokedex WHERE region = $1', [req.query.region]));
                }
            }
            else if(req.query.type != undefined) {
                let checkNullType = await db.oneOrNone('SELECT * FROM pokedex WHERE type = $1', [req.query.type]);
                if(checkNullType === null) {
                    clientError(req, "That pokemon has not been found yet", 400);
                    res.status(400).json({error: "That pokemon has not been found yet"});
                } 
                else {
                    res.json(await db.oneOrNone('SELECT * FROM pokedex WHERE type = $1', [req.query.type]));
                }
            }
            else if(req.query.abilities != undefined) {
                let checkNullAbilities = await db.oneOrNone('SELECT * FROM pokedex WHERE abilities = $1', [req.query.abilities]);
                if(checkNullAbilities === null) {
                    clientError(req, "That pokemon has not been found yet", 400);
                    res.status(400).json({error: "That pokemon has not been found yet"});
                } 
                else {
                    res.json(await db.oneOrNone('SELECT * FROM pokedex WHERE abilities = $1', [req.query.abilities]));
                }
            }
        }
    }
      
});

/*
Endpoint:
    Gets the damage calculation
*/
app.get('/battle', async (req, res) => {
    
});

/*
Endpoint: 
    Gets the background audio
*/
app.get('/backgroundAudio', async (req, res) => {
    try {
        const audioData = await db.many('SELECT name,image,music FROM stage');
            if (!audioData || audioData.length === 0) {
            return res.status(200).json({ error: 'No background audio data found' });
        }
         // Process each row with a for-loop
        for (let i = 0; i < audioData.length; i++) {
            console.log(audioData);
        }
        res.json(audioData);
    } catch (error) {
        console.error('Failed to get background audio data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/*
Endpoint: 
    Adds a new pokemon to the pokedex
Body Parameters:
    name[string](required): the name of the pokemon
    type[string](required): the type attribution of the pokemon
    region[string](required): the region the pokemon came from or found in
    abilities[string](required): the abilities the pokemon has
    image[string](required): an image of the pokemon
        Has to come from a specific website (https://pokemondb.net/pokedex/all)
        Right click the image of the pokemon of choice
        Copy the image link to use
*/


// Function to check if there are special characters in the name field
let paramSpecialChar;
function checkSpecialCharName(req) {
    let stringParam = req.body.name;
    let specialChar = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "=", "+", "~", "?", "<", ",", ".", ">", "/", ";", ":", "[", "]", "{", "}", "`", "|"];
    for(let i = 0; i < stringParam.length; i++) {
        if (specialChar.includes(stringParam[i]) === true) {
            paramSpecialChar = true;
            break;
        }
        else {
            paramSpecialChar = false;
        }
    }
}
// Function to check if there are special characters in the type field
function checkSpecialCharType(req) {
    let stringParam = req.body.type;
    let specialChar = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "~", "?", "<", ",", ".", ">", "/", ";", ":", "[", "]", "{", "}", "`", "|", "'"];
    for(let i = 0; i < stringParam.length; i++) {
        if (specialChar.includes(stringParam[i]) === true) {
            paramSpecialChar = true;
            break;
        }
        else {
            paramSpecialChar = false;
        }
    }
}

// Function to check if there are special characters in the region field
function checkSpecialCharRegion(req) {
    let stringParam = req.body.region;
    let specialChar = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "=", "+", "~", "?", "<", ",", ".", ">", "/", ";", ":", "[", "]", "{", "}", "`", "|"];
    for(let i = 0; i < stringParam.length; i++) {
        if (specialChar.includes(stringParam[i]) === true) {
            paramSpecialChar = true;
            break;
        }
        else {
            paramSpecialChar = false;
        }
    }
}

// Function to check if there are special characters in the abilities field
function checkSpecialCharAbilities(req) {
    let stringParam = req.body.abilities;
    let specialChar = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "~", "?", "<", ",", ".", ">", "/", ";", ":", "[", "]", "{", "}", "`", "|", "'"];
    for(let i = 0; i < stringParam.length; i++) {
        if (specialChar.includes(stringParam[i]) === true) {
            paramSpecialChar = true;
            break;
        }
        else {
            paramSpecialChar = false;
        } 
    }
    
}

// Function to check if there are special characters in the image field
// Will only allow the special characters that are used in the image links for the website we chose (pokemondb.net)

function checkSpecialCharImage(req) {
    let stringParam = req.body.image;
    let specialChar = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "~", "?", "<", ",", ">", ";", "[", "]", "{", "}", "`", "|", "'"];
    let correctLink = "https://img.pokemondb.net/artwork/avif/"
    if(stringParam.indexOf(correctLink) === 0) {
        for(let i = 0; i < stringParam.length; i++) {
            if (specialChar.includes(stringParam[i]) === true) {
                paramSpecialChar = true;
                break;
            }
            else {
                paramSpecialChar = false;
                holder = false;
            } 
        }
    }
    else if(stringParam.indexOf(correctLink) != 0) {
        paramSpecialChar = true;
    }
}

app.post('/pokedex', async function (req, res)  {
    if(req.body.name === undefined) {
        clientError(req, "Name was not stated", 400);
        res.status(400).json({error: "Name was not stated"});
    }
    else if(req.body.type === undefined) {
        clientError(req, "Type was not stated", 400);
        res.status(400).json({error: "Type was not stated"});
    }
    else if(req.body.region === undefined) {
        clientError(req, "Region was not stated", 400);
        res.status(400).json({error: "Region was not stated"});
    }
    else if(req.body.abilities === undefined) {
        clientError(req, "Abilities were not stated", 400);
        res.status(400).json({error: "Abilities were not stated"});
    }
    else if(req.body.image === undefined) {
        clientError(req, "Image was not given", 400); 
        res.status(400).json({error: "Image was not given"});
    }
    else if((typeof (req.body.name) != 'string') || (typeof (req.body.type) != 'string') || (typeof (req.body.region) != 'string') || (typeof (req.body.abilities) != 'string') || (typeof (req.body.image) != 'string')) {
        clientError(req, "Body parameter were not met", 400);
        res.status(400).json({error: "Body parameter were not met"});
    }
    else if(req.body.name != undefined) {
        checkSpecialCharName(req);
        console.log("name")
        if(paramSpecialChar === true) {
            clientError(req, "Cannot use that name", 400);
            res.status(400).json({error: "Cannot use that name"});
        }
        else if(paramSpecialChar === false){
            checkSpecialCharType(req);
            console.log("type")
            if(paramSpecialChar === true) {
                clientError(req, "Not a valid type", 400);
                res.status(400).json({error: "Not a valid type"});
            }
            else if(paramSpecialChar === false) {
                checkSpecialCharRegion(req);
                console.log("region")
                if(paramSpecialChar === true) { 
                    clientError(req, "Not a valid region", 400);
                    res.status(400).json({error: "Not a valid region"});
                }
                else if(paramSpecialChar === false) {
                    checkSpecialCharAbilities(req);
                    console.log("abilities")
                    if(paramSpecialChar === true) {
                        clientError(req, "Not a valid ability", 400);
                        res.status(400).json({error: "Not a valid ability"});
                    } 
                    else if(paramSpecialChar === false) {
                        checkSpecialCharImage(req, res);
                        console.log("image")
                        if(paramSpecialChar === true) {  
                            clientError(req, "Cannot use this image", 400);
                            res.status(400).json({error: "Cannot use this image"});
                        }
                        else if(paramSpecialChar === false) {
                            await db.none('INSERT INTO pokedex(name, type, region, abilities, image) VALUES($1, $2, $3, $4, $5)',
                            [req.body.name, req.body.type, req.body.region, req.body.abilities, req.body.image]);
                            res.json({name: req.body.name, type: req.body.type, region: req.body.region, abilities: req.body.abilities, image: req.body.image});
                        }
                    }
                }
            }
        }
    }
    
});

/* 
Endpoint:
      Updates a pokemon's information
Path Parameters:
      id[integer](required): the ID of the pokemon to updated in the pokedex
*/

app.put('/pokedex/:id', async (req, res) => {
    const {name, type, abilities, region} = req.body;
    // "id" is also coming from req.params
    const id = req.params.id;
    // "try" can be used to execute code that might present an error
    try {
      // Update info sent from the databse
      await db.query('UPDATE pokedex SET name = $1, type = $2, region = $3, abilities = $4 WHERE id = $5',[name, type, region, abilities, id]),
      clientError(req, "Pokémon updated successfully", 400);
      res.status(200).json({ message: 'Pokémon updated successfully' });
    } catch (error) {
      console.error('Error updating Pokémon:', error);
      clientError(req, "Bad request invalid syntax", 400);
      res.status(400).json({ error: 'Bad request invalid syntax' });
    }
  });

/* 
Endpoint:
    Deletes a single pokemon
Path Parameters:
    id[integer](required): the ID of the pokemon to be removed from the pokedex
        Can only accept numbers that are being used with a current pokemon
        Wrong ids will come up invalid
*/
app.delete('/pokedex/:id', async(req, res) => {
    // API call
    let pokeData = await db.any('SELECT * FROM pokedex');
    console.log("id: ", req.params.id);
    // store the data to be returned to the user after
    let temp = 0;
    // Search through the array till we find the correct ID
    if (Object.keys(req.body).length != 0) {
        clientError(req, "Nothing can be in body", 400);
        res.status(400).json({error: "Nothing can be in body"}); 
    if(Object.keys(req.query).length != 0)
        clientError(req, "no queries allowed", 400);
        res.status(400).json({error: "no queries allowed"})
    // checking id is a number only
    } else if(isNaN(req.params.id)){
        clientError(req, "ID is not a Number", 400);
        res.status(400).json({error: "ID is not a Number"});
        } else { 
            // creating variable to be stored in temp value to be returned to customer
            let pokeDataID = await db.any('SELECT * FROM pokedex WHERE id = $1', [req.params.id]);
                // checking if no id was found
                if(pokeDataID == 0){
                    clientError(req, "Invalid ID", 400);
                    res.status(400).json({error: "Invalid ID"})
                // storing found id and returning to client and removing id from database
                } else {
                    temp = pokeDataID[0],
                    res.json(temp);
                    await db.any('DELETE FROM pokedex WHERE id = $1', [req.params.id]);    
                }
        }
            
        
});

// Opens up a port on your computer for the server to listen to
// incoming requests
app.listen(5000, ()=> {
    console.log("Server is running on port 5000");
})