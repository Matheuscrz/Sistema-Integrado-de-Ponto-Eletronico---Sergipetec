-- Tabela que armazena os diferentes perfis de acesso dos usuários
CREATE TABLE PerfilAcesso(
  id serial PRIMARY KEY, -- Identificador único do perfil
  nome varchar(50) UNIQUE -- Nome do perfil de acesso, deve ser único
);

-- Tabela que armazena informações sobre os usuários do sistema
CREATE TABLE Usuario (
  id serial PRIMARY KEY, -- Identificador único do usuário
  nome varchar(100), -- Nome do usuário
  cpf varchar(11) UNIQUE, -- CPF do usuário, deve ser único
  pin varchar(4), -- PIN do usuário
  senha_hash varchar(100), -- Hash da senha do usuário
  setor varchar(100), -- Setor ao qual o usuário pertence
  horario_entrada time, -- Horário de entrada do usuário
  intervalo_ini time, -- Horário de início do intervalo
  intervalo_fim time, -- Horário de fim do intervalo
  horario_saida time, -- Horário de saída do usuário
  carga_horaria integer, -- Carga horária do usuário
  perfil_acesso_id integer, -- Chave estrangeira referenciando a tabela PerfilAcesso
  FOREIGN KEY (perfil_acesso_id) REFERENCES PerfilAcesso(id)
);

-- Índice para melhorar a busca por CPF e Setor na tabela Usuario
CREATE INDEX idx_usuario_cpf_setor ON Usuario (cpf, setor);

-- Tabela que armazena os diferentes tipos de registros (entrada, saída, etc.)
CREATE TABLE TipoRegistro (
  id serial PRIMARY KEY, -- Identificador único do tipo de registro
  tipo varchar(50) UNIQUE -- Tipo de registro, deve ser único
);

-- Tabela que armazena os registros de entrada/saída dos usuários
CREATE TABLE Registros (
  id SERIAL PRIMARY KEY, -- Identificador único do registro
  usuario_id INT, -- Chave estrangeira referenciando a tabela Usuario
  data DATE, -- Data do registro
  hora TIME, -- Hora do registro
  localizacao VARCHAR(255), -- Localização do registro
  tipo_registro_id INT, -- Chave estrangeira referenciando a tabela TipoRegistro
  FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
  FOREIGN KEY (tipo_registro_id) REFERENCES TipoRegistro(id)
);

-- Índice para melhorar a busca por Usuario e Data na tabela Registros
CREATE INDEX idx_usuario_data ON Registros (usuario_id, data);

-- Tabela que armazena comprovantes associados aos registros dos usuários
CREATE TABLE Comprovante (
  id SERIAL PRIMARY KEY, -- Identificador único do comprovante
  usuario_id INT, -- Chave estrangeira referenciando a tabela Usuario
  registro_id INT, -- Chave estrangeira referenciando a tabela Registros
  data DATE, -- Data do comprovante
  hora TIME, -- Hora do comprovante
  nomedoarquivo VARCHAR(255) NOT NULL, -- Nome do arquivo do comprovante
  arquivo bytea, -- Conteúdo do arquivo do comprovante
  FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
  FOREIGN KEY (registro_id) REFERENCES Registros(id)
);

-- Tabela que armazena justificativas relacionadas aos registros dos usuários
CREATE TABLE Justificativa (
  id SERIAL PRIMARY KEY, -- Identificador único da justificativa
  registro_id INT, -- Chave estrangeira referenciando a tabela Registros
  texto VARCHAR(255), -- Texto da justificativa
  FOREIGN KEY (registro_id) REFERENCES Registros(id)
);

-- Inserção de dados iniciais na tabela PerfilAcesso
INSERT INTO PerfilAcesso (nome) VALUES 
  ('Admin'),
  ('RH'),
  ('Usuario');

-- Inserção de dados iniciais na tabela TipoRegistro
INSERT INTO TipoRegistro (tipo) VALUES
	('Entrada'),
	('Saída para Almoço'),
	('Retorno do Almoço'),
	('Saída');

-- Tabela que armazena logs de alterações nas tabelas Usuario, Registros e Comprovante
CREATE TABLE logs (
  id SERIAL PRIMARY KEY, -- Identificador único do log
  mensagem TEXT, -- Descrição da alteração
  timestamp TIMESTAMP DEFAULT NOW() -- Carimbo de data e hora da alteração
);

-- Triggers

-- Trigger para a tabela Usuario
CREATE OR REPLACE FUNCTION log_usuario_changes() RETURNS TRIGGER AS $$
BEGIN
  CASE
    WHEN TG_OP = 'INSERT' THEN
      INSERT INTO logs (mensagem) VALUES ('Inserção feita na tabela Usuario - ID: ' || NEW.id);
    WHEN TG_OP = 'UPDATE' THEN
      INSERT INTO logs (mensagem) VALUES (
        'Atualização feita na tabela Usuario - ID: ' || NEW.id || 
        ' | Detalhes: ' || jsonb_pretty(to_jsonb(ROW(NEW) - ROW(OLD)))
      );
    WHEN TG_OP = 'DELETE' THEN
      INSERT INTO logs (mensagem) VALUES ('Exclusão feita na tabela Usuario - ID: ' || OLD.id);
  END CASE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER usuario_changes
AFTER INSERT OR UPDATE OR DELETE ON Usuario
FOR EACH ROW
EXECUTE FUNCTION log_usuario_changes();

-- Trigger para a tabela Registros
CREATE OR REPLACE FUNCTION log_registros_changes() RETURNS TRIGGER AS $$
BEGIN
  CASE
    WHEN TG_OP = 'INSERT' THEN
      INSERT INTO logs (mensagem) VALUES ('Inserção feita na tabela Registros - ID: ' || NEW.id);
    WHEN TG_OP = 'UPDATE' THEN
      INSERT INTO logs (mensagem) VALUES (
        'Atualização feita na tabela Registros - ID: ' || NEW.id || 
        ' | Detalhes: ' || jsonb_pretty(to_jsonb(ROW(NEW) - ROW(OLD)))
      );
    WHEN TG_OP = 'DELETE' THEN
      INSERT INTO logs (mensagem) VALUES ('Exclusão feita na tabela Registros - ID: ' || OLD.id);
  END CASE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER registros_changes
AFTER INSERT OR UPDATE OR DELETE ON Registros
FOR EACH ROW
EXECUTE FUNCTION log_registros_changes();

-- Trigger para a tabela Comprovante
CREATE OR REPLACE FUNCTION log_comprovante_changes() RETURNS TRIGGER AS $$
BEGIN
  CASE
    WHEN TG_OP = 'INSERT' THEN
      INSERT INTO logs (mensagem) VALUES ('Inserção feita na tabela Comprovante - ID: ' || NEW.id);
    WHEN TG_OP = 'UPDATE' THEN
      INSERT INTO logs (mensagem) VALUES (
        'Atualização feita na tabela Comprovante - ID: ' || NEW.id || 
        ' | Detalhes: ' || jsonb_pretty(to_jsonb(ROW(NEW) - ROW(OLD)))
      );
    WHEN TG_OP = 'DELETE' THEN
      INSERT INTO logs (mensagem) VALUES ('Exclusão feita na tabela Comprovante - ID: ' || OLD.id);
  END CASE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comprovante_changes
AFTER INSERT OR UPDATE OR DELETE ON Comprovante
FOR EACH ROW
EXECUTE FUNCTION log_comprovante_changes();
