import pool from '../config/db.js';

const utilisateurModel = {
    create: async (nom, courriel, mdpHash, cleApi) => {
        const result = await pool.query(
            "INSERT INTO utilisateurs (nom, courriel, mot_de_passe, cle_api) VALUES ($1, $2, $3, $4) RETURNING id",
            [nom, courriel, mdpHash, cleApi]
        );
        return result.rows[0].id;
    },

    findByEmail: async (courriel) => {
        const result = await pool.query("SELECT * FROM utilisateurs WHERE courriel = $1", [courriel]);
        return result.rows[0];
    },

    validationCle: async (cleApi) => {
        const result = await pool.query("SELECT id FROM utilisateurs WHERE cle_api = $1", [cleApi]);
        return result.rows.length > 0;
    },

    updateCle: async (id, nouvelleCle) => {
        await pool.query("UPDATE utilisateurs SET cle_api = $1 WHERE id = $2", [nouvelleCle, id]);
        return nouvelleCle;
    }
};

export default utilisateurModel;