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

INDEX ponto_idx_genero_nome ON ponto.Genero (nome);

CREATE TABLE ponto.Permissao (
  id serial PRIMARY KEY,
  nome varchar(50) UNIQUE
);

CREATE TABLE ponto.PerfilAcesso (
  id serial PRIMARY KEY,
  nome varchar(50) UNIQUE
);

CREATE TABLE ponto.Usuario (
  id serial PRIMARY KEY,
  nome varchar(100),
  cpf varchar(11) UNIQUE,
  pis varchar(15) UNIQUE,
  matricula varchar(8) UNIQUE,
  pin varchar(4),
  genero_id INT,
  data_nascimento DATE,
  departamento_id INT,
  cargo_id INT,
  data_contratacao DATE,
  regime_id INT,
  ativo BOOLEAN,
  folga_feriado BOOLEAN,
  perfil_acesso_id INT,
  senha_hash varchar(100), 
  jornada_id INT,
  perfil_id INT,
  FOREIGN KEY (genero_id) REFERENCES ponto.Genero(id),
  FOREIGN KEY (departamento_id) REFERENCES ponto.Departamento(id),
  FOREIGN KEY (cargo_id) REFERENCES ponto.Cargo(id),
  FOREIGN KEY (regime_id) REFERENCES ponto.Regime(id),
  FOREIGN KEY (perfil_acesso_id) REFERENCES ponto.PerfilAcesso(id),
  FOREIGN KEY (jornada_id) REFERENCES ponto.Jornada(id),
  FOREIGN KEY (perfil_id) REFERENCES ponto.Perfil(id)
);

CREATE INDEX ponto.idx_usuario_cpf ON ponto.Usuario (cpf);

CREATE TABLE ponto.Motivo (
  id serial PRIMARY KEY,
  motivo varchar(100) UNIQUE
);

CREATE TABLE ponto.Dispensa (
  id serial PRIMARY KEY,
  userid INT,
  data_inicio DATE,
  data_fim DATE,
  motivo_id INT,
  data_registro DATE,
  responsavel_registro varchar(100),
  cod_sequencial varchar(20) UNIQUE,
  FOREIGN KEY (userid) REFERENCES ponto.Usuario(id),
  FOREIGN KEY (motivo_id) REFERENCES ponto.Motivo(id)
);

CREATE TABLE ponto.HoraExtra (
  id serial PRIMARY KEY,
  userid INT,
  cargo_id INT,
  regime_id INT,
  data DATE,
  horas_extras_min INT,
  horario_id INT,
  FOREIGN KEY (userid) REFERENCES ponto.Usuario(id),
  FOREIGN KEY (cargo_id) REFERENCES ponto.Cargo(id),
  FOREIGN KEY (regime_id) REFERENCES ponto.Regime(id),
  FOREIGN KEY (horario_id) REFERENCES ponto.Horario(id)
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
  responsavel_id INT,
  horario_id INT,
  FOREIGN KEY (responsavel_id) REFERENCES ponto.Usuario(id),
  FOREIGN KEY (horario_id) REFERENCES ponto.Horario(id)
);

CREATE TABLE TipoRegistro (
  id serial PRIMARY KEY, 
  tipo varchar(50) UNIQUE 
);

CREATE TABLE ponto.Registro (
  id serial PRIMARY KEY,
  userid INT,
  data DATE,
  hora TIME,
  localizacao VARCHAR(255),
  tipo_registro_id INT,
  FOREIGN KEY (userid) REFERENCES ponto.Usuario(id),
  FOREIGN KEY (tipo_registro_id) REFERENCES ponto.TipoRegistro(id)
);

CREATE TABLE ponto.SolicitacaoAbono (
  codigoId serial PRIMARY KEY,
  userid INT,
  data_solicitacao DATE,
  horario_id INT,
  descricao varchar(255),
  status varchar(20),
  resposta varchar(255),
  responsavel_id INT,
  FOREIGN KEY (userid) REFERENCES ponto.Usuario(id),
  FOREIGN KEY (horario_id) REFERENCES ponto.Horario(id),
  FOREIGN KEY (responsavel_id) REFERENCES ponto.Usuario(id)
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
  rep_id INT,
  tipo varchar(10),  
  FOREIGN KEY (rep_a_id) REFERENCES ponto.REP_A(id),
  FOREIGN KEY (rep_p_id) REFERENCES ponto.REP_P(id)
);

CREATE TABLE ponto.RegistroAbono (
  id serial PRIMARY KEY,
  userid INT,
  data_pedido DATE,
  justificativa_id INT,
  data_requisicao DATE,
  responsavel_id INT,
  cod_solicitacao serial,
  registro_id INT,
  FOREIGN KEY (userid) REFERENCES ponto.Usuario(id),
  FOREIGN KEY (justificativa_id) REFERENCES ponto.Justificativa(id),
  FOREIGN KEY (responsavel_id) REFERENCES ponto.Usuario(id),
  FOREIGN KEY (registro_id) REFERENCES ponto.Registro(id)
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
);

CREATE TABLE ponto.Perfil (
  id serial PRIMARY KEY,
  tipo_id INT,
  FOREIGN KEY (tipo_id) REFERENCES ponto.TipoPerfil(id)
);

CREATE TABLE ponto.Justificativa (
  id serial PRIMARY KEY,
  tipo_id INT,
  valor_outros varchar(255),
  FOREIGN KEY (tipo_id) REFERENCES ponto.TipoJustificativa(id)
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
  usuario_id INT,
  data_alteracao TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (usuario_id) REFERENCES ponto.Usuario(id)
);

CREATE OR REPLACE FUNCTION ponto.log_usuario_changes() RETURNS TRIGGER AS $$
BEGIN
  CASE
    WHEN TG_OP = 'INSERT' THEN
      INSERT INTO ponto.LogsBancoDeDados (tabela_afetada, tipo_operacao, mensagem, usuario_id)
      VALUES ('Usuario', 'INSERT', 'Inserção feita na tabela Usuario - ID: ' || NEW.id, CURRENT_USER);
    WHEN TG_OP = 'UPDATE' THEN
      INSERT INTO ponto.LogsBancoDeDados (tabela_afetada, tipo_operacao, mensagem, usuario_id)
      VALUES ('Usuario', 'UPDATE',
        'Atualização feita na tabela Usuario - ID: ' || NEW.id ||
        ' | Detalhes: ' || jsonb_pretty(to_jsonb(ROW(NEW) - ROW(OLD))), CURRENT_USER);
    WHEN TG_OP = 'DELETE' THEN
      INSERT INTO ponto.LogsBancoDeDados (tabela_afetada, tipo_operacao, mensagem, usuario_id)
      VALUES ('Usuario', 'DELETE', 'Exclusão feita na tabela Usuario - ID: ' || OLD.id, CURRENT_USER);
  END CASE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ponto_usuario_changes
AFTER INSERT OR UPDATE OR DELETE ON ponto.Usuario
FOR EACH ROW
EXECUTE FUNCTION ponto.log_usuario_changes();
