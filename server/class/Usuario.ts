export class Usuario {
  /**
   * Cria uma instância de Usuario.
   * @param nome - O nome do usuário.
   * @param cpf - O CPF do usuário.
   * @param pis - O PIS do usuário.
   * @param matricula - A matrícula do usuário.
   * @param pin - O PIN do usuário.
   * @param genero - O gênero do usuário.
   * @param data_nascimento - A data de nascimento do usuário.
   * @param departamento - O número do departamento do usuário.
   * @param cargo - O número do cargo do usuário.
   * @param data_contratacao - A data de contratação do usuário.
   * @param regime - O número do regime de trabalho do usuário.
   * @param ativo - Indica se o usuário está ativo (padrão: true).
   * @param folga_feriado - Indica se o usuário tem folga em feriados (padrão: true).
   * @param senha - A senha do usuário.
   * @param jornada - A jornada de trabalho do usuário.
   * @param perfil - O número do perfil do usuário (padrão: 1).
   */
  constructor(
    nome: string,
    cpf: string,
    pis: string,
    matricula: string,
    pin: string,
    genero: number,
    data_nascimento: Date,
    departamento: number,
    cargo: number,
    data_contratacao: Date,
    regime: number,
    ativo: boolean = true,
    folga_feriado: boolean = true,
    senha: string,
    jornada: number,
    perfil: number = 1
  ) {
    if (
      !nome ||
      !cpf ||
      !pis ||
      !matricula ||
      !pin ||
      genero === undefined ||
      !data_nascimento ||
      departamento === undefined ||
      cargo === undefined ||
      !data_contratacao ||
      regime === undefined ||
      !senha ||
      jornada === undefined ||
      perfil === undefined
    ) {
      throw new Error("Todos os campos obrigatórios devem ser fornecidos.");
    }

    this.nome = nome;
    this.cpf = cpf;
    this.pis = pis;
    this.matricula = matricula;
    this.pin = pin;
    this.genero = genero;
    this.data_nascimento = data_nascimento;
    this.departamento = departamento;
    this.cargo = cargo;
    this.data_contratacao = data_contratacao;
    this.regime = regime;
    this.ativo = ativo;
    this.folga_feriado = folga_feriado;
    this.senha = senha;
    this.jornada = jornada;
    this.perfil = perfil;
  }
  getNome(): string {
    return this.nome;
  }

  getCPF(): string {
    return this.cpf;
  }

  getPIS(): string {
    return this.pis;
  }

  getMatricula(): string {
    return this.matricula;
  }

  getPIN(): string {
    return this.pin;
  }

  getGenero(): number {
    return this.genero;
  }

  getDataNascimento(): Date {
    return this.data_nascimento;
  }

  getDepartamento(): number {
    return this.departamento;
  }

  getCargo(): number {
    return this.cargo;
  }

  getDataContratacao(): Date {
    return this.data_contratacao;
  }

  getRegime(): number {
    return this.regime;
  }

  isAtivo(): boolean {
    return this.ativo;
  }

  hasFolgaFeriado(): boolean {
    return this.folga_feriado;
  }

  getSenha(): string {
    return this.senha;
  }

  getJornada(): number {
    return this.jornada;
  }

  getPerfil(): number {
    return this.perfil;
  }
  nome: string;
  cpf: string;
  pis: string;
  matricula: string;
  pin: string;
  genero: number;
  data_nascimento: Date;
  departamento: number;
  cargo: number;
  data_contratacao: Date;
  regime: number;
  ativo: boolean;
  folga_feriado: boolean;
  senha: string;
  jornada: number;
  perfil: number;
}
