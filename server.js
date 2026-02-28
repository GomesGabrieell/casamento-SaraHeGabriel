const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // pasta para seu HTML/JS frontend

app.post('/confirmar-presenca', (req, res) => {
    const nomeProcurado = req.body.nome;
    
    fs.readFile('lista.txt', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Erro ao ler arquivo.');

        const linhas = data.split('\n');
        let encontrado = false;

        for (let i = 0; i < linhas.length; i++) {
            if (linhas[i].replace('*','').trim() === nomeProcurado) {
                encontrado = true;
                if (linhas[i].startsWith('*')) {
                    return res.send('Presença já confirmada!');
                } else {
                    linhas[i] = '*' + linhas[i]; // adiciona *
                    fs.writeFile('lista.txt', linhas.join('\n'), (err) => {
                        if (err) return res.status(500).send('Erro ao atualizar arquivo.');
                        return res.send('Presença confirmada!');
                    });
                    return; // sai do loop
                }
            }
        }

        if (!encontrado) return res.send('Nome informado não foi encontrado.');
    });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
