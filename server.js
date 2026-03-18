import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs'; 
import pokemonsRouter from './src/routes/pokemons.route.js';
import utilisateursRouter from './src/routes/utilisateurs.route.js'; 

dotenv.config();
const app = express();

const swaggerDocument = JSON.parse(fs.readFileSync('./src/config/documentation.json', 'utf8'));
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Pokemon API Docs"
};

app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

app.use('/api', pokemonsRouter);

app.use('/api', utilisateursRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Serveur prêt sur http://localhost:${process.env.PORT || 3000}/api/docs`);
});