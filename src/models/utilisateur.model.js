import pool from '../config/db.js';

const utilisateurModel = {
    create: async (nom, courriel, mdpHash, cleApi) => {
        const [result] = await pool.query(
            "INSERT INTO utilisateurs (nom, courriel, mot_de_passe, cle_api) VALUES (?, ?, ?, ?)",
            [nom, courriel, mdpHash, cleApi]
        );
        return result.insertId;
    },

    findByEmail: async (courriel) => {
        const [rows] = await pool.query("SELECT * FROM utilisateurs WHERE courriel = ?", [courriel]);
        return rows[0];
    },

    validationCle: async (cleApi) => {
        const [rows] = await pool.query("SELECT id FROM utilisateurs WHERE cle_api = ?", [cleApi]);
        return rows.length > 0;
    },

    updateCle: async (id, nouvelleCle) => {
        await pool.query("UPDATE utilisateurs SET cle_api = ? WHERE id = ?", [nouvelleCle, id]);
        return nouvelleCle;
    }
};

export default utilisateurModel;