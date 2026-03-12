const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname));

// Rota para agendar
app.post('/agendar', (req, res) => {
  const { nome, celular, servico, horario, pagamento } = req.body;

  const mensagem = `✂️ Novo agendamento confirmado!\n\n👤 Cliente: ${nome}\n📞 Telefone: ${celular}\n💈 Serviço: ${servico}\n🕒 Horário: ${horario}\n💳 Pagamento: ${pagamento}`;

  axios.post('https://api.z-api.io/instances/3E94E1D5DD191111653C9ADC54EDACF3/token/6DE16A907FE40F32A7F46D8A/send-text', {
    phone: '34996765003',
    message: mensagem
  })
  .then(() => {
    console.log("✅ Mensagem enviada para o Francisco");

    // Salva o nome do cliente em cookie por 7 dias
    res.cookie('cliente', nome, { maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.send("Agendamento confirmado e padrinho notificado!");
  })
  .catch(err => {
    console.error("❌ Erro ao enviar mensagem:", err);
    res.send("Agendamento salvo, mas houve erro ao notificar o padrinho.");
  });
});

// Rota para verificar o nome do cliente salvo no cookie
app.get('/cliente', (req, res) => {
  const cliente = req.cookies.cliente;
  if (cliente) {
    res.send(`Bem-vindo de volta, ${cliente}!`);
  } else {
    res.send("Olá! Faça seu agendamento para começar.");
  }
});

// Inicia o servidor
app.listen(3000, () => {
  console.log("🚀 Servidor rodando em http://localhost:3000");
});
