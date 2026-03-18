import utilisateurModel from "../models/utilisateur.model.js";

const authentification = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Vous devez fournir une clé api" });
    }

    const parties = authHeader.split(' ');
    if (parties.length !== 2 || parties[0] !== 'cle_api') {
        return res.status(401).json({ message: "Format de l'entête Authorization invalide. Utilisez 'cle_api [votre_cle]'" });
    }

    const cleApi = parties[1];

    try {
        const estValide = await utilisateurModel.validationCle(cleApi);
        if (estValide) {
            next();
        } else {
            return res.status(401).json({ message: "Clé API invalide" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Erreur lors de la validation" });
    }
};

export default authentification;