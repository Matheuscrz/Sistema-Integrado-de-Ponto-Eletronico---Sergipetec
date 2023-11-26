export class Registro {
  readonly usuarioId: number;
  readonly data: Date;
  readonly hora: Date;
  readonly localizacao: string;
  readonly tipoRegistroId: number;

  constructor(
    usuarioId: number,
    data: Date,
    hora: Date,
    localizacao: string,
    tipoRegistroId: number
  ) {
    this.usuarioId = usuarioId;
    this.data = data;
    this.hora = hora;
    this.localizacao = localizacao;
    this.tipoRegistroId = tipoRegistroId;
  }

  getUsuarioId() {
    return this.usuarioId;
  }

  getData() {
    return this.data;
  }

  getHora() {
    return this.hora;
  }

  getLocalizacao() {
    return this.localizacao;
  }

  getTipoRegistroId() {
    return this.tipoRegistroId;
  }
}
