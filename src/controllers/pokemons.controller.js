import pokemonModel from "../models/pokemons.model.js";

const validerPokemon = (body) => {
    const champsRequis = ["nom", "type_primaire", "pv", "attaque", "defense"];
    return champsRequis.filter(champ => body[champ] === undefined || body[champ] === "");
};

export const getPokemonById = async (req, res) => {
    const id = req.params.id;
    try {
        const resultats = await pokemonModel.getPokemonSelonId(id);
        
        if (resultats.length === 0) {
            return res.status(404).json({ erreur: `Pokemon introuvable avec l'id ${id}` });
        }
        return res.status(200).json(resultats[0]);
    } catch (err) {
        console.error(`Code: ${err.code}, Message: ${err.sqlMessage}`);
        return res.status(500).json({ erreur: `Echec lors de la récupération du pokemon avec l'id ${id}` });
    }
};

export const getPokemonsListe = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const type = req.query.type || "";
    try {
        const data = await pokemonModel.getListePokemons(page, type);
        return res.status(200).json({
            pokemons: data.pokemons,
            type: type,
            nombrePokemonTotal: data.total,
            page: page,
            totalPage: data.totalPage
        });
    } catch (err) {
        return res.status(500).json({ erreur: "Echec lors de la récupération de la liste des pokemons" });
    }
};

export const addPokemon = async (req, res) => {
    const manquants = validerPokemon(req.body);
    if (manquants.length > 0) {
        return res.status(400).json({ erreur: "Le format des données est invalide", champs_manquants: manquants });
    }

    try {
        const newId = await pokemonModel.ajouterPokemon(req.body);
        return res.status(201).json({
            message: `Le pokemon ${req.body.nom} a été ajouté avec succès`,
            pokemon: { id: newId, ...req.body }
        });
    } catch (err) {
        return res.status(500).json({ erreur: `Echec lors de la création du pokemon ${req.body.nom}` });
    }
};

export const updatePokemon = async (req, res) => {
    const { id } = req.params;
    const manquants = validerPokemon(req.body);
    if (manquants.length > 0) {
        return res.status(400).json({ erreur: "Le format des données est invalide", champs_manquants: manquants });
    }

    try {
        const success = await pokemonModel.modifierPokemon(id, req.body);
        if (!success) return res.status(404).json({ erreur: `Le pokemon id ${id} n'existe pas dans la base de données` });
        
        return res.status(200).json({ message: `Le pokemon id ${id} a été modifié avec succès` });
    } catch (err) {
        return res.status(500).json({ erreur: `Echec lors de la modification du pokemon ${req.body.nom}` });
    }
};

export const deletePokemon = async (req, res) => {
    const { id } = req.params;
    try {
        const success = await pokemonModel.supprimerPokemon(id);
        if (!success) return res.status(404).json({ erreur: `Le pokemon id ${id} n'existe pas dans la base de données` });
        
        return res.status(200).json({ message: `Le pokemon id ${id} a été supprimé avec succès` });
    } catch (err) {
        return res.status(500).json({ erreur: `Echec lors de la suppression du pokemon id ${id}` });
    }
};