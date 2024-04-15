
// Add an attack column.  Pokémon can have no more than four attacks.

// Build a webpage that can display two Pokémon images side by side using the images provided. When each pokemon is clicked an animation should occur to indicate that the pokemon understands its their turn. This animation can be bouncing, spinning, whatever you choose

// Add a button on the webpage called “battle” that randomly loads two pokemon from your Pokédex to be displayed on the page



//This one gets the image into div but will keep refreshing, wont stay
// let pokemonData;
// async function startGame() {
//     // let test = document.getElementById('testingDiv');
//     // test.innerText = pokemonData[0].name;
// // event.preventDefault();
// fetch("http://localhost:5000/pokedex?all")
//     .then((response) => response.json())
    
//     .then((data) => {
//         pokemonData = data;
//         console.log(data[0].type);
//         let test = document.getElementById('testingDiv');
//         test.innerText = pokemonData[0].name;
//     });

//     // .then((pokemonData) => {
//     //     let test = document.getElementById('pokemon1');
//     //     test.innerText = pokemonData[0].name;
//     // });

    
// }
// startGame();

// This function was what Gabe's computer had and it worked
// function startGame() {
//     let pokemonData = [];
//     fetch("http://localhost:5000/pokedex?all")
//         .then((response) => response.json())
        
//         .then((data) => {
//             pokemonData = data;
//             console.log(pokemonData[0].name);
//             let test1 = document.getElementById('testdiv');
//             test1.innerHTML = pokemonData[0].name;
//         });
//         // let test1 = document.getElementById('pokemon1');
//         // console.log(pokemonData;
//         // test1.innerHTML = pokemonData
        
//     }

// Mock API Data because cant fetch it:
let pokemonData = 
[
    {
        "id": 1,
        "name": "Charmander",
        "type": "Fire",
        "region": "Kanto",
        "abilities": "Blaze",
        "image": "https://img.pokemondb.net/artwork/avif/charmander.avif"
    },
    {
        "id": 2,
        "name": "Machop",
        "type": "Fighting",
        "region": "Kanto",
        "abilities": "Guts",
        "image": "https://img.pokemondb.net/artwork/avif/machop.avif"
    },
    {
        "id": 3,
        "name": "Squirtle",
        "type": "Water",
        "region": "Kanto",
        "abilities": "Torrent",
        "image": "https://img.pokemondb.net/artwork/avif/squirtle.avif"
    },
    {
        "id": 4,
        "name": "Bulbasaur",
        "type": "Grass",
        "region": "Kanto",
        "abilities": "Overgrow",
        "image": "https://img.pokemondb.net/artwork/avif/bulbasaur.avif"
    },
    {
        "id": 5,
        "name": "Pikachu",
        "type": "Electric",
        "region": "Kanto",
        "abilities": "Lightning Strike",
        "image": "https://img.pokemondb.net/artwork/avif/pikachu.avif"
    },
    {
        "id": 6,
        "name": "Onix",
        "type": "Rock",
        "region": "Kanto",
        "abilities": "Smash",
        "image": "https://img.pokemondb.net/artwork/avif/onix.avif"
    },
    {
        "id": 7,
        "name": "Caterpie",
        "type": "Bug",
        "region": "Kanto",
        "abilities": "Harden",
        "image": "https://img.pokemondb.net/artwork/avif/caterpie.avif"
    },
    {
        "id": 8,
        "name": "Sandshrew",
        "type": "Ground",
        "region": "Kanto",
        "abilities": "Dig",
        "image": "https://img.pokemondb.net/artwork/avif/sandshrew.avif"
    },
    {
        "id": 9,
        "name": "Oddish",
        "type": "Grass",
        "region": "Kanto",
        "abilities": "Chlorophyll",
        "image": "https://img.pokemondb.net/artwork/avif/oddish.avif"
    }
];

// Creating the website with DOM
// Cant test it with fetch data yet because CORS header ‘Access-Control-Allow-Origin’ missing
// Download an extention for it to be allowed BUT website keeps resetting
function battle() {
    
// Gets the div that holds the pokemon on the left side
let pokemon1 = document.getElementById('pokemon1');
// Add this class to the div to get that "pokemon card" design to it
pokemon1.setAttribute('class', 'pokemon');
// Gets the div that will hold the pokemon pics from API
let pokemonPic1 = document.getElementById('pokemonPic1');
// Creates an image element to hold the pokemon pics
let pokemon1Image = document.createElement('img');
pokemon1Image.setAttribute('class', 'pokemonImage');
// pokemon1Image.setAttribute('id', 'pokemon1Animate');

// These are for the attributes of the pokemon, to list it on the card div
let pokemon1Name = document.getElementById('pokemon1Name');
let poke1Name;
let pokemon1Type = document.getElementById('pokemon1Type');
let poke1Type;
let pokemon1Region = document.getElementById('pokemon1Region');
let poke1Region;
let pokemon1Abilities = document.getElementById('pokemon1Abilities');
let poke1Abilities;


// Gets the div that holds the pokemon on the right side
let pokemon2 = document.getElementById('pokemon2');
// Add this class to the div to get that "pokemon card" design to it
pokemon2.setAttribute('class', 'pokemon');
// Gets the div that will hold the pokemon pics from API
let pokemonPic2 = document.getElementById('pokemonPic2');
// Creates an image element to hold the pokemon pics
let pokemon2Image = document.createElement('img');
pokemon2Image.setAttribute('class', 'pokemonImage');
// pokemon2Image.setAttribute('id', 'pokemon2Animate');

// These are for the attributes of the pokemon, to list it on the card div
let pokemon2Name = document.getElementById('pokemon2Name');
let poke2Name;
let pokemon2Type = document.getElementById('pokemon2Type');
let poke2Type;
let pokemon2Region = document.getElementById('pokemon2Region');
let poke2Region;
let pokemon2Abilities = document.getElementById('pokemon2Abilities');
let poke2Abilities;

// Making these variables global because will need to use it in function to assign value
// But will need it outside of function to assign it to DOM elements
let randomPokemon1;
let randomPokemon2;
// Calling the function because it is not called through a button click or anything
generatePokemon();

// Generate random ID to choose random pokemons to battle against each other
function generatePokemon() {
    randomPokemon1 = Math.ceil(Math.random() * 8);
    // console.log("pokemon 1:", randomPokemon1);
    randomPokemon2 = Math.ceil(Math.random() * 8);
    // console.log("pokemon 2:", randomPokemon2);
}

// Conditional statements to make sure that the pokemons are not the same
// Will add the different attribute to specific values to show up on the card
if (randomPokemon1 !== randomPokemon2) {
    poke1Name = pokemonData[randomPokemon1].name;
    pokemon1Image.src = pokemonData[randomPokemon1].image;
    poke1Type = pokemonData[randomPokemon1].type;
    poke1Region = pokemonData[randomPokemon1].region;
    poke1Abilities = pokemonData[randomPokemon1].abilities;

    poke2Name = pokemonData[randomPokemon2].name;
    pokemon2Image.src = pokemonData[randomPokemon2].image;
    poke2Type = pokemonData[randomPokemon2].type;
    poke2Region = pokemonData[randomPokemon2].region;
    poke2Abilities = pokemonData[randomPokemon2].abilities;
}
// This statement is to check that two of the same pokemons wont show up
else if (randomPokemon1 === randomPokemon2) {
    // If the same pokemons are call, the function is called to run again 
    generatePokemon();
    // If the second time pass this check then the values are updated for each pokemons
    if(randomPokemon1 !== randomPokemon2) {
        poke1Name = pokemonData[randomPokemon1].name;
        pokemon1Image.src = pokemonData[randomPokemon1].image;
        poke1Type = pokemonData[randomPokemon1].type;
        poke1Region = pokemonData[randomPokemon1].region;
        poke1Abilities = pokemonData[randomPokemon1].abilities;
        

        poke2Name = pokemonData[randomPokemon2].name;
        pokemon2Image.src = pokemonData[randomPokemon2].image;
        poke2Type = pokemonData[randomPokemon2].type;
        poke2Region = pokemonData[randomPokemon2].region;
        poke2Abilities = pokemonData[randomPokemon2].abilities;
        
    }
}

// This section is to add a background color to each pokemon based on their type
// I got the colors from the pokemondb database
// This is comparing the pokemons that appear on the left side
if(poke1Type === "Fire") {
    pokemon1.style.backgroundColor = "#ff4422";
}
else if(poke1Type === "Water") {
    pokemon1.style.backgroundColor = "#3399ff";
}
else if(poke1Type === "Grass") {
    pokemon1.style.backgroundColor = "#77cc55";
}
else if(poke1Type === "Ground") {
    pokemon1.style.backgroundColor = "#ddbb55";
}
else if(poke1Type === "Bug") {
    pokemon1.style.backgroundColor = "#aabb22";
}
else if(poke1Type === "Electric") {
    pokemon1.style.backgroundColor = "#ffcc33";
}
else if(poke1Type === "Rock") {
    pokemon1.style.backgroundColor = "#bbaa66";
}
else if(poke1Type === "Bug") {
    pokemon1.style.backgroundColor = "#aabb22";
}
else if(poke1Type === "Fighting") {
    pokemon1.style.backgroundColor = "#b95443";
}


// This section is to add a background color to each pokemon based on their type
// I got the colors from the pokemondb database
// This is comparing the pokemons that appear on the right side
if(poke2Type === "Fire"){
    pokemon2.style.backgroundColor = "#ff4422";
}
else if(poke2Type === "Water") {
    pokemon2.style.backgroundColor = "#3399ff";
}
else if(poke2Type === "Grass") {
    pokemon2.style.backgroundColor = "#77cc55";
}
else if(poke2Type === "Ground") {
    pokemon2.style.backgroundColor = "#ddbb55";
}
else if(poke2Type === "Bug") {
    pokemon2.style.backgroundColor = "#aabb22";
}
else if(poke2Type === "Electric") {
    pokemon2.style.backgroundColor = "#ffcc33";
}
else if(poke2Type === "Rock") {
    pokemon2.style.backgroundColor = "#bbaa66";
}
else if(poke2Type === "Bug") {
    pokemon2.style.backgroundColor = "#aabb22";
}
else if(poke2Type === "Fighting") {
    pokemon2.style.backgroundColor = "#b95443";
}

// This gets the values that were generated in the generatePokemon function and apply it to elements inside the card to display
// This is for the card on the left side
pokemon1Name.innerText = poke1Name;
pokemon1Type.innerText = "Type: " + poke1Type;
pokemon1Region.innerText = "Region: " + poke1Region;
pokemon1Abilities.innerText = "Abilities: " + poke1Abilities;

// This gets the values that were generated in the generatePokemon function and apply it to elements inside the card to display
// This is for the card on the right side
pokemon2Name.innerText = poke2Name;
pokemon2Type.innerText = "Type: " + poke2Type;
pokemon2Region.innerText = "Region: " + poke2Region;
pokemon2Abilities.innerText = "Abilities: " + poke2Abilities;

// This appends the picture generated from the function to the image area on the card
pokemonPic1.appendChild(pokemon1Image);
pokemonPic2.appendChild(pokemon2Image);

// Disables the Battle button so that user cant load multiple pokemons against each other (only 2 at a time)
document.getElementById('battleButton').disabled = true;
}

// When the left card is clicked, the pulse/heartbeat animation will go into effect
// This effect is to let user know which pokemon they have selected
// It is set to stop the effect for the other card if it was clicked beforehand
function pokemon1Selected() {
    let pokemon1 = document.getElementById('pokemon1Div');
    let pokemon2 = document.getElementById('pokemon2Div');
    pokemon1.setAttribute('class', 'pulse animated infinite');
    pokemon2.removeAttribute('class', 'pulse animated infinite');
}

// When the right card is clicked, the pulse/heartbeat animation will go into effect
// This effect is to let user know which pokemon they have selected
// It is set to stop the effect for the other card if it was clicked beforehand
function pokemon2Selected() {
    let pokemon1 = document.getElementById('pokemon1Div');
    let pokemon2 = document.getElementById('pokemon2Div');
    pokemon2.setAttribute('class', 'pulse animated infinite');
    pokemon1.removeAttribute('class', 'pulse animated infinite');

}
