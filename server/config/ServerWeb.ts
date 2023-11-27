import * as http from "http";
import * as https from "https";
import * as dotenv from "dotenv";
import { IncomingMessage, ServerResponse } from "http";
import { readFileSync } from "fs";
import express from "express";
import path from "path";

dotenv.config();
class ServerWeb {
  private server: http.Server | https.Server;
  private readonly port: number;
  private readonly app: express.Express;

  constructor(private useHttps: boolean = false) {
    this.port = useHttps ? 3444 : 3000;
    this.app = express();
    // Configurar o middleware express.static para servir arquivos estáticos
    this.app.use(
      express.static(path.join(__dirname, "../../client/Web/public"))
    );
    if (useHttps) {
      const privateKey = readFileSync(
        `${process.env.HTTPS_PRIVATE_KEY_PATH}`,
        "utf8"
      );
      const certificate = readFileSync(
        `${process.env.HTTPS_CERTIFICATE_PATH}`,
        "utf8"
      );
      const credentials = { key: privateKey, cert: certificate };
      this.server = https.createServer(credentials, this.app);
    } else {
      this.server = http.createServer(this.app);
    }
  }
  public start(): void {
    this.server.listen(this.port, () => {
      const address = this.server.address();
      const port = typeof address === "string" ? address : address?.port;
      console.log(`Servidor Web executando na porta: ${port}`);
    });
  }
}

export default ServerWeb;
