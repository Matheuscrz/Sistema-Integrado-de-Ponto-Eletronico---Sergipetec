CREATE TABLE PerfilAcesso(
  id serial PRIMARY KEY,
  nome varchar(50) UNIQUE
);

CREATE TABLE Departamento (
  id serial PRIMARY KEY,
  nome varchar(100) ,
  departamento_alocado varchar(100),
  CONSTRAINT idx_departamento_nome UNIQUE (nome)
);

CREATE TABLE Frequencia (
  id serial PRIMARY KEY,
  usuario_id INT,
  departamento_id INT,
  data_inicial DATE,
  data_final DATE,
  incluir_subsetores BOOLEAN,
  horas_extra_min INT,
  jornada_id INT,
  observacoes TEXT,
  FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
  FOREIGN KEY (departamento_id) REFERENCES Departamento(id),
  ADD FOREIGN KEY (jornada_id) REFERENCES Jornada(id)
);

CREATE TABLE Horarios (
  id serial PRIMARY KEY,
  nome varchar(100),
  entrada time,
  entrada_inicio time,
  entrada_fim time,
  saida time
  saida_inicio time,
  saida_fim time
);

CREATE TABLE Jornada (
  id serial PRIMARY KEY,
  nome varchar(100),
  inicio date,
  ciclo varchar(50),
  quantidade integer,
  responsavel varchar(100)
);


CREATE TABLE DetalhesFrequencia (
  id serial PRIMARY KEY,
  frequencia_id INT,
  data DATE,
  turno varchar(50),
  entrada TIME,
  saida TIME,
  horas_trabalhadas_min INT,
  saldo_min INT,
  FOREIGN KEY (frequencia_id) REFERENCES Frequencia(id)
);

CREATE TABLE RegistroDiario (
  id serial PRIMARY KEY,
  usuario_id INT,
  data DATE,
  ponto_registro TIME,
  FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);


CREATE TABLE Usuario (
  id serial PRIMARY KEY, 
  nome varchar(100), 
  cpf varchar(11) UNIQUE,
  pis varchar(15) UNIQUE, 
  matricula varchar(8) UNIQUE,
  cargo_id INT,
  data_contratacao DATE, 
  regime_id INT,
  ativo BOOLEAN,
  folga_feriado BOOLEAN,
  acesso_livre BOOLEAN,
  senha_hash varchar(100), 
  departamento_id INT, 
  ADD FOREIGN KEY (regime_id) REFERENCES Regime(id),
  ADD FOREIGN KEY (cargo_id) REFERENCES Cargo(id),
  FOREIGN KEY (perfil_acesso_id) REFERENCES PerfilAcesso(id)
  FOREIGN KEY (departamento_id) REFERENCES Departamento(id)
);

CREATE TABLE Regime (
  id serial PRIMARY KEY,
  nome varchar(100) UNIQUE
);


CREATE INDEX idx_usuario_cpf_setor ON Usuario (cpf, setor);

CREATE TABLE TipoRegistro (
  id serial PRIMARY KEY, 
  tipo varchar(50) UNIQUE 
);

CREATE TABLE Registros (
  id SERIAL PRIMARY KEY, 
  usuario_id INT,
  data DATE, 
  hora TIME, 
  localizacao VARCHAR(255), 
  tipo_registro_id INT, 
  FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
  FOREIGN KEY (tipo_registro_id) REFERENCES TipoRegistro(id)
);

CREATE INDEX idx_usuario_data ON Registros (usuario_id, data);

CREATE TABLE Comprovante (
  id SERIAL PRIMARY KEY, 
  usuario_id INT, 
  registro_id INT, 
  data DATE, 
  hora TIME, 
  nomedoarquivo VARCHAR(255) NOT NULL, 
  arquivo bytea, 
  FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
  FOREIGN KEY (registro_id) REFERENCES Registros(id)
);

CREATE TABLE Justificativa (
  id SERIAL PRIMARY KEY, 
  registro_id INT, 
  texto VARCHAR(255), 
  FOREIGN KEY (registro_id) REFERENCES Registros(id)
);

CREATE TABLE HistoricoJornada (
  id serial PRIMARY KEY,
  usuario_id INT,
  jornada_id INT,
  data_inicio DATE,
  data_fim DATE,
  FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
  FOREIGN KEY (jornada_id) REFERENCES Jornada(id)
);

CREATE TABLE Afastamento (
  id serial PRIMARY KEY,
  usuario_id INT,
  data_inicio DATE,
  data_fim DATE,
  categoria varchar(50), 
  FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

CREATE TABLE Presenca (
  id serial PRIMARY KEY,
  usuario_id INT,
  data DATE,
  hora TIME,
  status varchar(20),
  FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

CREATE TABLE MotivoAbono (
  id serial PRIMARY KEY,
  motivo varchar(100) UNIQUE
);

CREATE TABLE SolicitacaoAbono (
  id serial PRIMARY KEY,
  usuario_id INT,
  data_solicitacao DATE,
  data_falta DATE,
  pontos_solicitados INT,
  descricao varchar(255),
  motivo_abono_id INT,
  status varchar(20), 
  FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
  FOREIGN KEY (motivo_abono_id) REFERENCES MotivoAbono(id)
);

CREATE TABLE DiasAbertos (
  id serial PRIMARY KEY,
  usuario_id INT,
  data DATE,
  registros_em_aberto INT,
  motivo_abono_id INT,
  descricao varchar(255),
  FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
  FOREIGN KEY (motivo_abono_id) REFERENCES MotivoAbono(id)
);

CREATE TABLE Feriados (
  id serial PRIMARY KEY,
  nome varchar(100),
  data DATE,
  critico BOOLEAN
);

CREATE TABLE JustificativaAbono (
  id serial PRIMARY KEY,
  motivo varchar(255) UNIQUE
);

CREATE TABLE JustificativaAfastamento (
  id serial PRIMARY KEY,
  motivo varchar(255) UNIQUE
);

CREATE TABLE Cargo (
  id serial PRIMARY KEY,
  nome varchar(100) UNIQUE,
  horario_entrada time, 
  intervalo_ini time, 
  intervalo_fim time, 
  horario_saida time, 
  carga_horaria integer, 
  perfil_acesso_id integer, 
);

INSERT INTO AfastamentoCategoria (categoria) VALUES 
  ('Férias'),
  ('Licença Maternidade');

INSERT INTO PerfilAcesso (nome) VALUES 
  ('Admin'),
  ('RH'),
  ('Usuario');

INSERT INTO TipoRegistro (tipo) VALUES
	('Entrada'),
	('Saída para Almoço'),
	('Retorno do Almoço'),
	('Saída');

CREATE TABLE logs (
  id SERIAL PRIMARY KEY, 
  mensagem TEXT, 
  timestamp TIMESTAMP DEFAULT NOW() 
);


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
