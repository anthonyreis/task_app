const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', function () {  
    console.log('Conexão estabelecida e rodando em ' + process.env.MONGODB_URL);
}); 
  
mongoose.connection.on('error',function (err) {  
    console.log('Erro de conexão no Mongoose: ' + err);
}); 
  
mongoose.connection.on('disconnected', function () {  
    console.log('Conexão do Mongoose finalizada.'); 
});
  
process.on('SIGINT', function() {  
    mongoose.connection.close(function () { 
        console.log('Conexão do Mongoose terminada devido ao encerramento da aplicação.'); 
        process.exit(0); 
    }); 
}); 