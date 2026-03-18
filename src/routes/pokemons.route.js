import express from 'express';
import { 
    getPokemonById, 
    getPokemonsListe, 
    addPokemon, 
    updatePokemon, 
    deletePokemon 
} from '../controllers/pokemons.controller.js';
import authentification from "../middlewares/auth.middleware.js";

const pokemonsRouter = express.Router();

// Route : GET /api/pokemons/liste
pokemonsRouter.get('/pokemons/liste', getPokemonsListe);

// Route : GET /api/pokemons/:id
pokemonsRouter.get('/pokemons/:id', getPokemonById);

// Route : POST /api/pokemons
pokemonsRouter.post('/pokemons', addPokemon);

// Route : PUT /api/pokemons/:id
pokemonsRouter.put('/pokemons/:id', updatePokemon);

// Route : DELETE /api/pokemons/:id
pokemonsRouter.delete('/pokemons/:id', authentification, deletePokemon);

export default pokemonsRouter;