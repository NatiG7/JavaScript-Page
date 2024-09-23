// Variables
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const pokemonName = document.getElementById('pokemon-name');
const pokemonId = document.getElementById('pokemon-id');
const pokemonWeight = document.getElementById('weight');
const pokemonHeight = document.getElementById('height');
const pokemonType = document.getElementById('types');
const pokemonHP = document.getElementById('hp');
const pokemonAtt = document.getElementById('attack');
const pokemonDef = document.getElementById('defense');
const pokemonSpAtt = document.getElementById('special-attack');
const pokemonSpDef = document.getElementById('special-defense');
const pokemonSpd = document.getElementById('speed');
const spriteContainer = document.getElementById('sprite-container');
let startingIndex = 0;
let endingIndex = 8;
let pokemonDataArr = [];

// All Pokemon Data
const allPokemon = fetch('https://pokeapi.co/api/v2/pokemon?limit=10000')
    .then((res) => res.json())
    .then((data) => { pokemonDataArr = data.results; })
    .catch((err) => { console.error(`Error : ${err}`) });

// Search button listener
searchButton.addEventListener('click', () => {
    resetPokemonDisplay();
    const query = searchInput.value.toLowerCase().trim();
    if (query) {
        fetchPokemon(query);
    }
});

// Functions

const displayPokemon = (pokemon) => {
    pokemonName.textContent = `${pokemon.name}`;
    pokemonId.textContent = `#${pokemon.id}`;
    pokemonWeight.textContent = `Weight: ${pokemon.weight}`;
    pokemonHeight.textContent = `Height: ${pokemon.height}`;
    // Display types
    pokemonType.innerHTML = ''; // Clear previous types
    pokemon.types.forEach(typeInfo => {
        const pokeType = document.createElement('span');
        pokeType.classList.add('pokeType', typeInfo.type.name)
        pokeType.textContent = typeInfo.type.name.toUpperCase();
        pokemonType.appendChild(pokeType);
    });
    const firstType = pokemon.types[0].type.name;
    const firstTypeSpan = document.querySelector('.pokeType.' + firstType);
    const firstTypeColor = getComputedStyle(firstTypeSpan)
        .getPropertyValue('background-color')
        .trim();
    const pokeNameH2 = document.querySelector('.poke-info h2');
    pokeNameH2.style.color = firstTypeColor;

    // Display stats
    pokemonHP.textContent = pokemon.stats[0].base_stat;
    pokemonAtt.textContent = pokemon.stats[1].base_stat;
    pokemonDef.textContent = pokemon.stats[2].base_stat;
    pokemonSpAtt.textContent = pokemon.stats[3].base_stat;
    pokemonSpDef.textContent = pokemon.stats[4].base_stat;
    pokemonSpd.textContent = pokemon.stats[5].base_stat;
    spriteContainer.innerHTML = '';
    const pokemonImg = document.createElement('img');
    pokemonImg.src = pokemon.sprites.front_default;
    pokemonImg.id = 'sprite';
    pokemonImg.alt = `${pokemon.name} image`;
    spriteContainer.appendChild(pokemonImg);
};

const fetchPokemon = async (query) => {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        if (!res.ok) {
            throw new Error("Pokémon not found");
        }
        const pokemon = await res.json();
        displayPokemon(pokemon);
    } catch (error) {
        alert("Pokémon not found");
    }
};

const resetPokemonDisplay = () => {
    pokemonName.textContent = '';
    pokemonId.textContent = '';
    pokemonWeight.textContent = '';
    pokemonHeight.textContent = '';
    pokemonType.textContent = '';
    pokemonHP.textContent = '';
    pokemonAtt.textContent = '';
    pokemonDef.textContent = '';
    pokemonSpAtt.textContent = '';
    pokemonSpDef.textContent = '';
    pokemonSpd.textContent = '';
    spriteContainer.innerHTML = '';
};