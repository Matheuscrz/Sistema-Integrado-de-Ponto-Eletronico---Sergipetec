export class Usuario {
  constructor(
    readonly nome: string,
    readonly cpf: string,
    readonly senha: string,
    readonly pin: string,
    readonly setor: string,
    readonly horarioEntrada: string,
    readonly intervalo_ini: string,
    readonly intervalo_fim: string,
    readonly horarioSaida: string,
    readonly cargaHoraria: number,
    readonly perfilAcessoId: number = 3
  ) {}

  getNome() {
    return this.nome;
  }

  getCPF() {
    return this.cpf;
  }

  getPIN() {
    return this.pin;
  }

  getSetor() {
    return this.setor;
  }

  getHorarioEntrada() {
    return this.horarioEntrada;
  }

  getIntervaloIni() {
    return this.intervalo_ini;
  }

  getIntervaloFim() {
    return this.intervalo_fim;
  }

  getHorarioSaida() {
    return this.horarioSaida;
  }

  getCargaHoraria() {
    return this.cargaHoraria;
  }

  getPerfilAcesso() {
    return this.perfilAcessoId;
  }

  getSenha() {
    return this.senha;
  }

  // Método para obter a senha como uma string
  getSenhaString() {
    return this.senha;
  }
}
