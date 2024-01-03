export class Registro {
  /**
   * Cria uma instância de Registro.
   * @param usuario - O número do usuário.
   * @param data - A data do registro.
   * @param hora - A hora do registro.
   * @param localizacao - A localização do registro.
   * @param tipo - O tipo do registro.
   */
  constructor(
    public usuario: number,
    public data: Date,
    public hora: Date,
    public localizacao: string,
    public tipo: number
  ) {
    if (
      usuario === undefined ||
      !data ||
      !hora ||
      !localizacao ||
      tipo === undefined
    ) {
      throw new Error("Todos os campos obrigatórios devem ser fornecidos.");
    }
  }
  getUsuario(): number {
    return this.usuario;
  }

  getData(): Date {
    return this.data;
  }

  getHora(): Date {
    return this.hora;
  }

  getLocalizacao(): string {
    return this.localizacao;
  }

  getTipoRegistro(): number {
    return this.tipo;
  }
}
