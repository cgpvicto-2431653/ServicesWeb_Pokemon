import utilisateurModel from "../models/utilisateur.model.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const register = async (req, res) => {
    const { nom, courriel, mot_de_passe } = req.body;

    if (!nom || !courriel || !mot_de_passe) {
        return res.status(400).json({ erreur: "Tous les champs sont requis" });
    }

    try {
        const existe = await utilisateurModel.findByEmail(courriel);
        if (existe) return res.status(400).json({ erreur: "Ce courriel est déjà utilisé" });

        const mdpHash = await bcrypt.hash(mot_de_passe, 10);

        const cleApi = crypto.randomUUID();

        await utilisateurModel.create(nom, courriel, mdpHash, cleApi);
        res.status(201).json({ message: "L'utilisateur a été créé", cle_api: cleApi });
    } catch (err) {
        res.status(500).json({ erreur: "Erreur lors de la création" });
    }
};

export const getOrNewKey = async (req, res) => {
    const { courriel, mot_de_passe } = req.body;
    const nouvelle = req.query.nouvelle === '1';

    try {
        const user = await utilisateurModel.findByEmail(courriel);
        if (!user) return res.status(401).json({ erreur: "Identifiants invalides" });

        const mdpValide = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if (!mdpValide) return res.status(401).json({ erreur: "Identifiants invalides" });

        let cleARetourner = user.cle_api;

        if (nouvelle) {
            cleARetourner = crypto.randomUUID();
            await utilisateurModel.updateCle(user.id, cleARetourner);
        }

        res.status(200).json({ cle_api: cleARetourner });
    } catch (err) {
        res.status(500).json({ erreur: "Erreur serveur" });
    }
};