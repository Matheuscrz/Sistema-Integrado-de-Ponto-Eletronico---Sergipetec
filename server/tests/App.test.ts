import { App } from "../App";

describe("App", () => {
  it("Inicie o server", () => {
    const app = new App();
    // Substitui a implementação do método start da classe Server por uma função mock
    // Isso evita que o servidor real seja iniciado durante o teste
    const startMock = jest.fn();
    app["server"].start = startMock;
    //Chama o método startServer da classe App
    app.startServer();
    //Verifica se o método start da classe Server foi chamado
    expect(startMock).toHaveBeenCalled();
  });
});
