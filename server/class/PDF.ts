import { PDFDocument, rgb } from "pdf-lib";

export class PDF {
  readonly NSR: number;
  readonly usuarioID: number;
  readonly username: string;
  readonly CPF: string;
  readonly data: Date;
  readonly hora: Date;
  readonly token: string;
  readonly nomeEmpresa: string = "Sergipe Parque Tecnológico";
  readonly cnpjEmpresa: string = "06.938.508/0001-11";
  readonly enderecoEmpresa: string =
    "Avenida José Conrado de Araújo, 731 - Rosa Elze, São Cristóvão - SE, 49100-000";
  readonly nomedoarquivo: string = "";

  constructor(
    NSR: number,
    usuarioID: number,
    username: string,
    CPF: string,
    data: Date,
    hora: Date,
    token: string
  ) {
    this.NSR = NSR;
    this.usuarioID = usuarioID;
    this.username = username;
    this.CPF = CPF;
    this.data = data;
    this.hora = hora;
    this.token = token;
  }
  getCPF() {
    return this.CPF;
  }
  getToken() {
    return this.token;
  }
  getUserName() {
    return this.username;
  }
  getNSR() {
    return this.NSR;
  }
  getData() {
    return this.data;
  }
  getHora() {
    return this.hora;
  }
  getUsuarioID() {
    return this.usuarioID;
  }
  getNomedoArquivo() {
    return this.nomedoarquivo;
  }
  // Método para criar um comprovante em PDF
  async createComprovate(): Promise<{
    pdfBytes: Uint8Array;
    fileName: string;
  }> {
    const { NSR, usuarioID, data, hora } = this;
    const nome = `${NSR}${usuarioID}${data}${hora}`;
    const nomedoarquivo = `${nome.replace(/[\W_]+/g, "")}.pdf`;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([700, 500]);
    const dataFormatada: string = new Date(this.data).toLocaleDateString(
      "pt-BR"
    );
    page.drawText(`Comprovante de Registro`, {
      x: 25,
      y: 450,
      size: 30,
      color: rgb(0, 0, 0),
    });

    page.drawText(`NSR: ${NSR}`, {
      x: 25,
      y: 400,
      size: 18,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Nome: ${this.username}`, {
      x: 25,
      y: 350,
      size: 18,
      color: rgb(0, 0, 0),
    });

    page.drawText(`CPF: ${this.CPF}`, {
      x: 25,
      y: 300,
      size: 18,
      color: rgb(0, 0, 0),
    });

    page.drawText(`${this.nomeEmpresa}`, {
      x: 25,
      y: 250,
      size: 18,
      color: rgb(0, 0, 0),
    });

    page.drawText(`CNPJ: ${this.cnpjEmpresa}`, {
      x: 25,
      y: 200,
      size: 18,
      color: rgb(0, 0, 0),
    });

    page.drawText(`${this.enderecoEmpresa}`, {
      x: 25,
      y: 150,
      size: 18,
      color: rgb(0, 0, 0),
    });

    const tokenLines = this.splitTextIntoLines(this.token, 60);
    let yOffset = 110;

    page.drawText("Token:", {
      x: 25,
      y: yOffset,
      size: 18,
      color: rgb(0, 0, 0),
    });

    yOffset -= 20;

    tokenLines.forEach((line) => {
      page.drawText(line, {
        x: 25,
        y: yOffset,
        size: 18,
        color: rgb(0, 0, 0),
      });
      yOffset -= 20;
    });

    page.drawText(`Data de emissão: ${dataFormatada}`, {
      x: 300,
      y: 300,
      size: 18,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Hora de emissão: ${this.hora}`, {
      x: 300,
      y: 250,
      size: 18,
      color: rgb(0, 0, 0),
    });
    const pdfBytes = await pdfDoc.save();
    return { pdfBytes, fileName: nomedoarquivo };
  }
  splitTextIntoLines(text: string, maxLineLength: number) {
    const lines = [];
    let currentLine = "";
    const words = text.split("");

    for (const word of words) {
      if (currentLine.length + word.length < maxLineLength) {
        currentLine += word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);

    return lines;
  }
}
