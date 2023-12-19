CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA ponto;

CREATE TABLE ponto.Empresa (
  id serial PRIMARY KEY,
  nome varchar(100),
  cnpj varchar(14) UNIQUE,
  razao_social varchar(255),
  logo bytea
);

CREATE TABLE ponto.Regime (
  id serial PRIMARY KEY,
  nome varchar(100) UNIQUE
);

CREATE TABLE ponto.Departamento (
  id serial PRIMARY KEY,
  nome varchar(100) UNIQUE
);

CREATE TABLE ponto.Cargo (
  id serial PRIMARY KEY,
  nome varchar(100) UNIQUE
);

CREATE TABLE ponto.Genero (
  id serial PRIMARY KEY,
  nome varchar(10) UNIQUE
);

CREATE TABLE ponto.TipoPerfil (
  id serial PRIMARY KEY,
  nome varchar(50) UNIQUE,
  pode_criar_usuario BOOLEAN,
  pode_editar_usuario BOOLEAN,
  pode_excluir_usuario BOOLEAN,
  pode_criar_registro BOOLEAN,
  pode_editar_registro BOOLEAN,
  pode_excluir_registro BOOLEAN,
  pode_alterar_configuracoes BOOLEAN
);

CREATE TABLE ponto.Perfil (
  id serial PRIMARY KEY,
  tipo INT,
  FOREIGN KEY (tipo) REFERENCES ponto.TipoPerfil(id)
);

CREATE TABLE ponto.Horario (
  id serial PRIMARY KEY,
  horario_entrada TIME,
  entrada_inicio TIME,
  entrada_fim TIME,
  saida TIME,
  saida_inicio TIME,
  saida_fim TIME,
  tem_intervalo BOOLEAN,
  horario_intervalo TIME,
  inicio_intervalo TIME,
  fim_intervalo TIME
);

CREATE TABLE ponto.Jornada (
  id serial PRIMARY KEY,
  nome varchar(100),
  horario INT,
  FOREIGN KEY (horario) REFERENCES ponto.Horario(id)
);

CREATE TABLE ponto.Usuario (
  id serial PRIMARY KEY,
  nome varchar(100),
  cpf varchar(11) UNIQUE,
  pis varchar(15) UNIQUE,
  matricula varchar(8) UNIQUE,
  pin varchar(4) UNIQUE,
  genero INT,
  data_nascimento DATE,
  departamento INT,
  cargo INT,
  data_contratacao DATE,
  regime INT,
  ativo BOOLEAN,
  folga_feriado BOOLEAN,
  senha varchar(100), 
  jornada INT,
  perfil INT,
  FOREIGN KEY (genero) REFERENCES ponto.Genero(id),
  FOREIGN KEY (departamento) REFERENCES ponto.Departamento(id),
  FOREIGN KEY (cargo) REFERENCES ponto.Cargo(id),
  FOREIGN KEY (regime) REFERENCES ponto.Regime(id),
  FOREIGN KEY (jornada) REFERENCES ponto.Jornada(id),
  FOREIGN KEY (perfil) REFERENCES ponto.Perfil(id)
);

CREATE TABLE ponto.Motivo (
  id serial PRIMARY KEY,
  motivo varchar(100) UNIQUE
);

CREATE TABLE ponto.Dispensa (
  id serial PRIMARY KEY,
  usuario INT,
  data_inicio DATE,
  data_fim DATE,
  motivo INT,
  data_registro DATE,
  responsavel varchar(100),
  codigo varchar(20) UNIQUE,
  FOREIGN KEY (usuario) REFERENCES ponto.Usuario(id),
  FOREIGN KEY (motivo) REFERENCES ponto.Motivo(id)
);

CREATE TABLE ponto.HoraExtra (
  id serial PRIMARY KEY,
  usuario INT,
  cargo INT,
  regime INT,
  data DATE,
  horas_extras_min INT,
  horario INT,
  FOREIGN KEY (usuario) REFERENCES ponto.Usuario(id),
  FOREIGN KEY (cargo) REFERENCES ponto.Cargo(id),
  FOREIGN KEY (regime) REFERENCES ponto.Regime(id),
  FOREIGN KEY (horario) REFERENCES ponto.Horario(id)
);

CREATE TABLE ponto.TipoRegistro (
  id serial PRIMARY KEY, 
  tipo varchar(50) UNIQUE 
);

CREATE TABLE ponto.Registro (
  id serial PRIMARY KEY,
  usuario INT,
  data DATE,
  hora TIME,
  localizacao VARCHAR(255),
  tipo INT,
  FOREIGN KEY (usuario) REFERENCES ponto.Usuario(id),
  FOREIGN KEY (tipo) REFERENCES ponto.TipoRegistro(id)
);

CREATE TABLE ponto.Status(
  id serial PRIMARY KEY,
  nome VARCHAR(20)
);

CREATE TABLE ponto.SolicitacaoAbono (
  id serial PRIMARY KEY,
  usuario INT,
  data_solicitacao DATE,
  horario INT,
  descricao varchar(255),
  status INT,
  resposta varchar(255),
  responsavel INT,
  FOREIGN KEY (usuario) REFERENCES ponto.Usuario(id),
  FOREIGN KEY (horario) REFERENCES ponto.Horario(id),
  FOREIGN KEY (status) REFERENCES ponto.Status(id),
  FOREIGN KEY (responsavel) REFERENCES ponto.Usuario(id)
);

CREATE TABLE ponto.REP_A (
  id serial PRIMARY KEY,
  nome varchar(100),
  local varchar(255),
  marca varchar(100),
  ip varchar(15),
  mask varchar(15),
  porta int,
  ativo BOOLEAN,
  NFR varchar(50),
  model varchar(100),
  senha varchar(100)
);

CREATE TABLE ponto.REP_P (
  id serial PRIMARY KEY,
  nome varchar(100),
  marca_software varchar(100)
);

CREATE TABLE ponto.REP (
  id serial PRIMARY KEY,
  rep INT,
  tipo INT,
  FOREIGN KEY (rep) REFERENCES ponto.REP_A(id) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (rep) REFERENCES ponto.REP_P(id) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE ponto.Justificativa (
  id serial PRIMARY KEY,
  tipo varchar(30) UNIQUE,
  valor_outros varchar(255)
);

CREATE TABLE ponto.RegistroAbono (
  id serial PRIMARY KEY,
  usuario INT,
  data_pedido DATE,
  justificativa INT,
  data_requisicao DATE,
  responsavel INT,
  cod_solicitacao serial,
  registro INT,
  FOREIGN KEY (usuario) REFERENCES ponto.Usuario(id),
  FOREIGN KEY (justificativa) REFERENCES ponto.Justificativa(id),
  FOREIGN KEY (responsavel) REFERENCES ponto.Usuario(id),
  FOREIGN KEY (registro) REFERENCES ponto.Registro(id)
);

CREATE TABLE ponto.Feriados (
  id serial PRIMARY KEY,
  nome varchar(100),
  data DATE
);

CREATE TABLE ponto.LogsBancoDeDados (
  id serial PRIMARY KEY,
  tabela_afetada varchar(100),
  tipo_operacao varchar(10),
  mensagem TEXT,
  usuario INT,
  data_alteracao TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (usuario) REFERENCES ponto.Usuario(id)
);

CREATE INDEX idx_usuario_cpf ON ponto.Usuario (cpf);
CREATE INDEX idx_usuario_data_contratacao ON ponto.Usuario (data_contratacao);
CREATE INDEX idx_usuario_senha ON ponto.Usuario (senha);
CREATE INDEX idx_regime_nome ON ponto.Regime (nome);
CREATE INDEX idx_departamento_nome ON ponto.Departamento (nome);
CREATE INDEX idx_cargo_nome ON ponto.Cargo (nome);
CREATE INDEX idx_genero_nome ON ponto.Genero (nome);
CREATE INDEX idx_tipoPerfil_nome ON ponto.TipoPerfil (nome);
CREATE INDEX idx_jornada_nome ON ponto.Jornada (nome);
CREATE INDEX idx_motivo ON ponto.Motivo (motivo);
CREATE INDEX idx_feriados_nome ON ponto.Feriados (nome);
CREATE INDEX idx_status_nome ON ponto.Status (nome);

CREATE OR REPLACE FUNCTION ponto.log_changes() RETURNS TRIGGER AS $$
BEGIN
  CASE
    WHEN TG_OP = 'INSERT' THEN
      INSERT INTO ponto.LogsBancoDeDados (tabela_afetada, tipo_operacao, mensagem, usuario)
      VALUES (TG_TABLE_NAME, 'INSERT', 'Inserção feita na tabela ' || TG_TABLE_NAME || ' - ID: ' || NEW.id, CURRENT_USER);
    WHEN TG_OP = 'UPDATE' THEN
      INSERT INTO ponto.LogsBancoDeDados (tabela_afetada, tipo_operacao, mensagem, usuario)
      VALUES (TG_TABLE_NAME, 'UPDATE',
        'Atualização feita na tabela ' || TG_TABLE_NAME || ' - ID: ' || NEW.id ||
        ' | Detalhes: ' || jsonb_pretty(to_jsonb(ROW(NEW) - ROW(OLD))), CURRENT_USER);
    WHEN TG_OP = 'DELETE' THEN
      INSERT INTO ponto.LogsBancoDeDados (tabela_afetada, tipo_operacao, mensagem, usuario)
      VALUES (TG_TABLE_NAME, 'DELETE', 'Exclusão feita na tabela ' || TG_TABLE_NAME || ' - ID: ' || OLD.id, CURRENT_USER);
  END CASE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ponto_usuario_changes ON ponto.Usuario;

CREATE TRIGGER ponto_changes
AFTER INSERT OR UPDATE OR DELETE ON ponto.Usuario
FOR EACH ROW
EXECUTE FUNCTION ponto.log_changes();


INSERT INTO ponto.TipoPerfil (nome, pode_criar_usuario, pode_editar_usuario, pode_excluir_usuario, pode_criar_registro, pode_editar_registro, pode_excluir_registro, pode_alterar_configuracoes)
VALUES 
  ('Normal', TRUE, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE),
  ('RH', TRUE, TRUE, FALSE, TRUE, TRUE, FALSE, FALSE),
  ('Admin', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE);

INSERT INTO ponto.Genero (nome) VALUES
  ('Masculino'),
  ('Feminino'),
  ('Outro');

INSERT INTO ponto.TipoRegistro (tipo) VALUES
  ('Entrada'),
  ('Saída');

INSERT INTO ponto.Status (nome) VALUES
  ('Pendente'),
  ('Aprovado'),
  ('Rejeitado');

INSERT INTO ponto.Perfil (tipo) VALUES (1);
INSERT INTO ponto.Perfil (tipo) VALUES (2);
INSERT INTO ponto.Perfil (tipo) VALUES (3);

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'grupo_normal') THEN
    CREATE ROLE grupo_normal;
  END IF;
END $$;
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'grupo_rh') THEN
    CREATE ROLE grupo_rh;
  END IF;
END $$;
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'grupo_admin') THEN
    CREATE ROLE grupo_admin;
  END IF;
END $$;


CREATE USER usuario_normal;
CREATE USER usuario_rh;
CREATE USER usuario_admin;

ALTER USER usuario_normal SET ROLE grupo_normal;
ALTER USER usuario_rh SET ROLE grupo_rh;
ALTER USER usuario_admin SET ROLE grupo_admin;

GRANT SELECT, INSERT ON ponto.Empresa TO grupo_normal;
GRANT SELECT, INSERT ON ponto.Regime TO grupo_normal;

GRANT SELECT, INSERT, UPDATE ON ponto.Empresa TO grupo_rh;
GRANT SELECT, INSERT, UPDATE ON ponto.Regime TO grupo_rh;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA ponto TO grupo_admin;

UPDATE ponto.Usuario
SET perfil = (SELECT id FROM ponto.Perfil WHERE tipo = (SELECT id FROM ponto.TipoPerfil WHERE nome = 'Normal'))
WHERE perfil = (SELECT id FROM ponto.Perfil WHERE tipo = (SELECT id FROM ponto.TipoPerfil WHERE nome = 'Normal'));
UPDATE ponto.Usuario
SET perfil = (SELECT id FROM ponto.Perfil WHERE tipo = (SELECT id FROM ponto.TipoPerfil WHERE nome = 'RH'))
WHERE perfil = (SELECT id FROM ponto.Perfil WHERE tipo = (SELECT id FROM ponto.TipoPerfil WHERE nome = 'RH'));
UPDATE ponto.Usuario
SET perfil = (SELECT id FROM ponto.Perfil WHERE tipo = (SELECT id FROM ponto.TipoPerfil WHERE nome = 'Admin'))
WHERE perfil = (SELECT id FROM ponto.Perfil WHERE tipo = (SELECT id FROM ponto.TipoPerfil WHERE nome = 'Admin'));

CREATE OR REPLACE FUNCTION ponto.log_changes() RETURNS TRIGGER AS $$
BEGIN
  CASE
    WHEN TG_OP = 'INSERT' THEN
      INSERT INTO ponto.LogsBancoDeDados (tabela_afetada, tipo_operacao, mensagem, usuario)
      VALUES (TG_TABLE_NAME, 'INSERT', 'Inserção feita na tabela ' || TG_TABLE_NAME || ' - ID: ' || NEW.id, NEW.id);
    WHEN TG_OP = 'UPDATE' THEN
      INSERT INTO ponto.LogsBancoDeDados (tabela_afetada, tipo_operacao, mensagem, usuario)
      VALUES (TG_TABLE_NAME, 'UPDATE',
        'Atualização feita na tabela ' || TG_TABLE_NAME || ' - ID: ' || NEW.id ||
        ' | Detalhes: ' || jsonb_pretty(to_jsonb(ROW(NEW) - ROW(OLD))), CURRENT_USER);

      IF NEW.perfil = 1 THEN
        EXECUTE 'ALTER USER ' || quote_ident(NEW.nome) || ' SET ROLE grupo_normal;';
      ELSIF NEW.perfil = 2 THEN
        EXECUTE 'ALTER USER ' || quote_ident(NEW.nome) || ' SET ROLE grupo_rh;';
      ELSIF NEW.perfil = 3 THEN
        EXECUTE 'ALTER USER ' || quote_ident(NEW.nome) || ' SET ROLE grupo_admin;';
      END IF;

      IF NEW.senha IS DISTINCT FROM OLD.senha THEN
        NEW.senha := crypt(NEW.senha, gen_salt('bf'));
      END IF;

    WHEN TG_OP = 'DELETE' THEN
      INSERT INTO ponto.LogsBancoDeDados (tabela_afetada, tipo_operacao, mensagem, usuario)
      VALUES (TG_TABLE_NAME, 'DELETE', 'Exclusão feita na tabela ' || TG_TABLE_NAME || ' - ID: ' || OLD.id, CURRENT_USER);
  END CASE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ponto_changes ON ponto.Usuario;

CREATE TRIGGER ponto_changes
AFTER INSERT OR UPDATE OR DELETE ON ponto.Usuario
FOR EACH ROW
EXECUTE FUNCTION ponto.log_changes();

INSERT INTO ponto.Regime (nome) VALUES ('Test');
INSERT INTO ponto.Horario (
  horario_entrada,
  entrada_inicio,
  entrada_fim,
  saida,
  saida_inicio,
  saida_fim,
  tem_intervalo,
  horario_intervalo,
  inicio_intervalo,
  fim_intervalo
) VALUES (
  '09:00:00',
  '08:45:00',
  '09:15:00',
  '18:00:00',
  '17:45:00',
  '18:15:00',
  TRUE,
  '01:00:00',
  '12:00:00',
  '13:00:00'
);
INSERT INTO ponto.Jornada (nome, horario)
VALUES ('Test', 1);
INSERT INTO ponto.Departamento (nome)
VALUES ('Test');
INSERT INTO ponto.Cargo (nome)
VALUES ('Test');

INSERT INTO ponto.Usuario (
  nome,
  cpf,
  pis,
  matricula,
  pin,
  genero,
  data_nascimento,
  departamento,
  cargo,
  data_contratacao,
  regime,
  ativo,
  folga_feriado,
  senha,
  jornada,
  perfil
) VALUES (
  'admin',
  '0000',
  '0000',
  '0000',
  '0000',
  3,
  '1990-01-01',
  1,
  1,
  '2023-01-01',
  1,
  true,
  false,
  'senha_admin',
  1,
  3
);