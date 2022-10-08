CREATE TABLE IF NOT EXISTS usuarios (
	  id SERIAL PRIMARY KEY,
  	nome TEXT NOT NULL,
  	email TEXT NOT NULL UNIQUE,
  	senha TEXT NOT NULL,
    cpf TEXT,
    telefone TEXT
);

CREATE TABLE IF NOT EXISTS clientes (
	  id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
  	nome TEXT NOT NULL,
  	email TEXT NOT NULL UNIQUE,
    cpf TEXT NOT NULL,
    telefone TEXT NOT NULL,
    logradouro TEXT,
    complemento TEXT,
    cidade TEXT,
    estado TEXT,
    cep TEXT,
    bairro TEXT,
    status BOOLEAN DEFAULT true,
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id)
);

CREATE TABLE IF NOT EXISTS cobrancas (
	  id SERIAL PRIMARY KEY,
  	id_cliente INTEGER NOT NULL,
  	nome TEXT NOT NULL,
    valor INTEGER NOT NULL,
    data_vencimento DATE NOT NULL DEFAULT NOW(),
    status BOOLEAN DEFAULT true,
    descricao TEXT NOT NULL,
  	FOREIGN KEY (id_cliente) REFERENCES clientes (id)
);