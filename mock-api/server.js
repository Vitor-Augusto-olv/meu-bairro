// API de mentira (em memória) que segue o contrato do app. Só para desenvolver sem o backend.
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const upload = multer({ dest: path.join(__dirname, 'uploads') });
app.use(cors(), express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const usuarios = [];
const ocorrencias = [];
let seq = 1;

const autenticar = (req, res, next) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  const usuario = usuarios.find((u) => `mock-${u.id}` === token);
  if (!usuario) return res.status(401).json({ message: 'Sessão expirada. Entre de novo.' });
  req.usuario = usuario;
  next();
};

const publico = ({ id, nome, email }) => ({ id, nome, email });

app.post('/api/auth/register', (req, res) => {
  const { nome, email, senha } = req.body;
  if (usuarios.some((u) => u.email === email)) {
    return res.status(409).json({ message: 'E-mail já cadastrado.' });
  }
  usuarios.push({ id: seq++, nome, email, senha });
  res.sendStatus(201);
});

app.post('/api/auth/login', (req, res) => {
  const usuario = usuarios.find((u) => u.email === req.body.email && u.senha === req.body.senha);
  if (!usuario) return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
  res.json({ token: `mock-${usuario.id}`, usuario: publico(usuario) });
});

const dadosDoForm = (req) => {
  const b = req.body;
  const d = { titulo: b.titulo, descricao: b.descricao, categoria: b.categoria, endereco: b.endereco };
  if (b.latitude) d.latitude = Number(b.latitude);
  if (b.longitude) d.longitude = Number(b.longitude);
  if (req.file) d.fotoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  return d;
};

app.get('/api/ocorrencias', autenticar, (_req, res) => res.json([...ocorrencias].reverse()));

app.get('/api/ocorrencias/:id', autenticar, (req, res) => {
  const o = ocorrencias.find((x) => String(x.id) === req.params.id);
  o ? res.json(o) : res.status(404).json({ message: 'Ocorrência não encontrada.' });
});

app.post('/api/ocorrencias', autenticar, upload.single('foto'), (req, res) => {
  const o = {
    id: seq++,
    status: 'ABERTA',
    criadoEm: new Date().toISOString(),
    usuarioId: req.usuario.id,
    ...dadosDoForm(req),
  };
  ocorrencias.push(o);
  res.status(201).json(o);
});

app.put('/api/ocorrencias/:id', autenticar, upload.single('foto'), (req, res) => {
  const o = ocorrencias.find((x) => String(x.id) === req.params.id);
  if (!o) return res.status(404).json({ message: 'Ocorrência não encontrada.' });
  if (o.usuarioId !== req.usuario.id) return res.status(403).json({ message: 'Só o autor pode editar.' });
  Object.assign(o, dadosDoForm(req));
  res.json(o);
});

app.delete('/api/ocorrencias/:id', autenticar, (req, res) => {
  const i = ocorrencias.findIndex((x) => String(x.id) === req.params.id);
  if (i < 0) return res.status(404).json({ message: 'Ocorrência não encontrada.' });
  if (ocorrencias[i].usuarioId !== req.usuario.id) return res.status(403).json({ message: 'Só o autor pode excluir.' });
  ocorrencias.splice(i, 1);
  res.sendStatus(204);
});

app.listen(3333, '0.0.0.0', () => console.log('Mock API em http://0.0.0.0:3333/api'));
