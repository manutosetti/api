document.getElementById('buscarInfo').addEventListener('click', async () => {
    const numero = parseInt(document.getElementById('numero').value);
    if (!numero || numero <= 0) return alert('Por favor, ingresa un número válido.');
    
    const resultsContainer = document.getElementById('resultado');
    resultsContainer.innerHTML = ''; 

    const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${numero}`);
    const info = await respuesta.json();
    const pokemons = info.results;

    let pokemonsInfo = [];

    for (const [index, pokemon] of pokemons.entries()) {
        const pokemonDetalles = await fetch(pokemon.url).then(res => res.json());
        const tipos = pokemonDetalles.types.map(type => type.type.name).join(', ');
        const habilidades = pokemonDetalles.abilities.map(ability => ability.ability.name).join(', ');

        pokemonsInfo.push({
            index: index + 1,
            name: pokemon.name,
            img: pokemonDetalles.sprites.front_default,
            url: pokemon.url,
            tipos: tipos,
            habilidades: habilidades
        });
    }

    const crearTarjetas = (filtrarPokemons) => {
        resultsContainer.innerHTML = '';
        filtrarPokemons.forEach(pokemon => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${pokemon.img}" alt="${pokemon.name}">
                <h3>${pokemon.index}. ${pokemon.name}</h3>
                <p><strong>Tipos:</strong> ${pokemon.tipos}</p>
                <p><strong>Habilidades:</strong> ${pokemon.habilidades}</p>
                <p>URL: <a href="${pokemon.url}" target="_blank">Más información</a></p>
            `;
            resultsContainer.appendChild(card);
        });
    };

    crearTarjetas(pokemonsInfo);

    document.getElementById('filtrar').addEventListener('input', (e) => {
        const filtroTexto = e.target.value.toLowerCase();
        const filtrarPokemons = pokemonsInfo.filter(pokemon => 
            pokemon.name.toLowerCase().includes(filtroTexto)
        );
        crearTarjetas(filtrarPokemons);
    });

    document.getElementById('limpiarInfo').addEventListener('click', () => {
        resultsContainer.innerHTML = '';
        document.getElementById('numero').value = '';
        document.getElementById('filtrar').value = '';
    });
});
