import pool from '../config/db.js';

const getPokemonSelonId = async (id) => {
    const requete = `SELECT * FROM pokemon WHERE id = ?`;
    try {
        const [resultats] = await pool.query(requete, [id]);
        return resultats; 
    } catch (erreur) {
        console.error(`Erreur SQL: ${erreur.code} - ${erreur.sqlMessage}`);
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
        requete += " WHERE type_primaire = ?";
        requeteCount += " WHERE type_primaire = ?";
        params.push(type);
    }

    requete += " LIMIT ? OFFSET ?";
    
    try {
        const [pokemons] = await pool.query(requete, [...params, limite, offset]);
        const [countRes] = await pool.query(requeteCount, params);
        
        const total = countRes[0].total;
        return {
            pokemons,
            total,
            totalPage: Math.ceil(total / limite) || 1
        };
    } catch (erreur) {
        throw erreur;
    }
};

const ajouterPokemon = async (p) => {
    const requete = `INSERT INTO pokemon (nom, type_primaire, type_secondaire, pv, attaque, defense) VALUES (?, ?, ?, ?, ?, ?)`;
    const [res] = await pool.query(requete, [p.nom, p.type_primaire, p.type_secondaire, p.pv, p.attaque, p.defense]);
    return res.insertId;
};

const supprimerPokemon = async (id) => {
    const requete = `DELETE FROM pokemon WHERE id = ?`;
    try {
        const [resultat] = await pool.query(requete, [id]);
        return resultat.affectedRows > 0; 
    } catch (erreur) {
        console.error(`Erreur SQL: ${erreur.code} - ${erreur.sqlMessage}`);
        throw erreur;
    }
};

export default {
    getPokemonSelonId,
    getListePokemons,
    ajouterPokemon,
    supprimerPokemon
};
