export class Comprovante {
  readonly usuarioId: number;
  readonly registroId: number;
  readonly data: Date;
  readonly hora: Date;
  readonly nomedoarquivo: string;
  readonly arquivo: Uint8Array;

  constructor(
    usuarioId: number,
    registroId: number,
    data: Date,
    hora: Date,
    nomedoarquivo: string,
    arquivo: Uint8Array
  ) {
    this.usuarioId = usuarioId;
    this.registroId = registroId;
    this.data = data;
    this.hora = hora;
    this.nomedoarquivo = nomedoarquivo;
    this.arquivo = arquivo;
  }
  getUsuarioId() {
    return this.usuarioId;
  }
  getRegistroId() {
    return this.registroId;
  }
  getData() {
    return this.data;
  }
  getHora() {
    return this.hora;
  }
  getNomedoArquivo() {
    return this.nomedoarquivo;
  }
  getArquivo() {
    return this.arquivo;
  }
}
