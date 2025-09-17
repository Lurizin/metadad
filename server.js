const express = require('express');
const { exiftool } = require('exiftool-vendored');
const path = require('path');
const fs = require('fs/promises');

const app = express();
const port = 3000;

// Middleware para processar JSON no corpo da requisição
app.use(express.json());

// Endpoint para extrair os metadados da imagem
app.post('/extract-metadata', async (req, res) => {
    const { imagePath } = req.body;

    if (!imagePath) {
        return res.status(400).json({ error: 'O caminho da imagem (imagePath) é obrigatório no corpo da requisição.' });
    }

    // Garante que o caminho do arquivo seja absoluto e seguro
    const absolutePath = path.resolve(imagePath);

    try {
        // Verifica se o arquivo existe antes de tentar ler
        await fs.access(absolutePath);

        // Usa o exiftool para ler os metadados do arquivo
        const metadata = await exiftool.read(absolutePath);
        
        // Retorna os metadados encontrados
        res.json({ success: true, metadata });
    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.status(404).json({ success: false, error: 'O arquivo de imagem não foi encontrado.' });
        }
        // Trata outros erros
        res.status(500).json({ success: false, error: `Erro ao ler os metadados: ${error.message}` });
    }
});

// Inicia o servidor na porta especificada
app.listen(port, () => {
    console.log(`API de metadados rodando em http://localhost:${port}`);
});