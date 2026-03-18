import pool from '../config/db.js';

const getPokemonSelonId = async (id) => {
    // Changement du ? par $1
    const requete = `SELECT * FROM pokemon WHERE id = $1`;
    try {
        const resultats = await pool.query(requete, [id]);
        return resultats.rows; // Les données sont dans .rows
    } catch (erreur) {
        console.error(`Erreur SQL: ${erreur.code} - ${erreur.message}`);
        throw erreur;
    }
};

const getListePokemons = async (page = 1, type = "") => {
    const limite = 25;
    const offset = (page - 1) * limite;
    
    let requete = "SELECT * FROM pokemon";
    let requeteCount = "SELECT COUNT(*) as total FROM pokemon";
    let params = [];

    if (type) {
        requete += " WHERE type_primaire = $1";
        requeteCount += " WHERE type_primaire = $1";
        params.push(type);
    }

    // Gestion dynamique des index pour LIMIT et OFFSET
    const indexLimite = params.length + 1;
    const indexOffset = params.length + 2;
    requete += ` LIMIT $${indexLimite} OFFSET $${indexOffset}`;
    
    try {
        const resPokemons = await pool.query(requete, [...params, limite, offset]);
        const resCount = await pool.query(requeteCount, params);
        
        const total = parseInt(resCount.rows[0].total);
        return {
            pokemons: resPokemons.rows,
            total,
            totalPage: Math.ceil(total / limite) || 1
        };
    } catch (erreur) {
        throw erreur;
    }
};

const ajouterPokemon = async (p) => {
    // Postgres ne donne pas de 'insertId' automatiquement, on ajoute RETURNING id
    const requete = `
        INSERT INTO pokemon (nom, type_primaire, type_secondaire, pv, attaque, defense) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id`;
    const res = await pool.query(requete, [p.nom, p.type_primaire, p.type_secondaire, p.pv, p.attaque, p.defense]);
    return res.rows[0].id;
};

const supprimerPokemon = async (id) => {
    const requete = `DELETE FROM pokemon WHERE id = $1`;
    try {
        const resultat = await pool.query(requete, [id]);
        return resultat.rowCount > 0; // On utilise rowCount au lieu de affectedRows
    } catch (erreur) {
        console.error(`Erreur SQL: ${erreur.code} - ${erreur.message}`);
        throw erreur;
    }
};

export default {
    getPokemonSelonId,
    getListePokemons,
    ajouterPokemon,
    supprimerPokemon
};