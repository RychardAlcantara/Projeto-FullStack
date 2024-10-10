import logo from './logo.svg';
import './App.css';
import { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      apiResponse1: "",  // Resposta da API /testAPI
      apiResponse2: []   // Resposta da API /testDB (usuários do banco de dados)
    };
  }

  // Método para chamar as APIs /testAPI e /testDB
  callAPIs() {
    // Fazendo ambas as requisições ao mesmo tempo
    Promise.all([
      fetch("http://localhost:9000/testAPI"),  // Requisição para /testAPI
      fetch("http://localhost:9000/testUser")    // Requisição para /testDB
    ])
    .then(async ([res1, res2]) => {
      const apiResponse1 = await res1.json();  // Converte a resposta da primeira API (testAPI) para JSON
      const apiResponse2 = await res2.json();  // Converte a resposta da segunda API (testDB) para JSON
      this.setState({ 
        apiResponse1: apiResponse1.message,   // Armazena a mensagem da primeira API
        apiResponse2: apiResponse2            // Armazena os usuários retornados da segunda API
      });
    })
    .catch(err => console.error("Erro ao buscar dados das APIs:", err));
  }

  // Chama as APIs quando o componente é montado
  componentDidMount() {
    this.callAPIs();
  }

  // Renderiza os resultados das duas APIs
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Requisições para APIs</h1>
          
          {/* Exibe a resposta da primeira API (/testAPI) */}
          <p>{this.state.apiResponse1}</p>

          {/* Exibe a lista de usuários retornada pela segunda API (/testDB) */}
          <h2>Usuários:</h2>
          <ul>
            {this.state.apiResponse2.map(usuario => (
              <li key={usuario.id}>
                Nome: {usuario.nome} - Email: {usuario.email}
              </li>
            ))}
          </ul>
        </header>
      </div>
    );
  }
}

export default App;
