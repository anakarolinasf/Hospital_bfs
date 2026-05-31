# Sistema Inteligente de Rotas Hospitalares 🏥

Um aplicativo web interativo que utiliza **BFS (Busca em Largura)** para encontrar a menor rota entre setores de um hospital. Visualize o grafo hospitalar e explore as conexões de forma intuitiva.

## 📋 Características

- ✅ Algoritmo BFS para encontrar o caminho mais curto entre setores
- ✅ Visualização interativa do grafo hospitalar com Cytoscape
- ✅ Interface moderna e responsiva
- ✅ Painel de informações com estatísticas do grafo
- ✅ Seleção de origem e destino por dropdown
- ✅ Exibição do caminho, distância e nós visitados
- ✅ Análise do setor mais distante da recepção

## 🏗️ Arquitetura do Projeto

```
hospital_bfs/
├── app.py                 # Backend Flask
├── static/
│   ├── script.js         # Lógica frontend e integração Cytoscape
│   └── style.css         # Estilos da interface
├── templates/
│   └── index.html        # Página principal
├── .gitignore            # Arquivos ignorados no Git
└── README.md             # Este arquivo
```

## 🗺️ Estrutura do Grafo Hospitalar

O hospital possui 14 setores conectados:

- **Recepcao** → Central de entrada
- **Corredor_A e Corredor_B** → Circulação principal
- **UTI** → Unidade de Terapia Intensiva
- **Laboratorio** → Análises clínicas
- **Farmacia** → Distribuição de medicamentos
- **Radiologia** → Exames de imagem
- **Centro_Cirurgico** → Procedimentos cirúrgicos
- **Sala_Recuperacao** → Pós-operatório
- **Pediatria** → Atendimento infantil
- **Quarto_101 e Quarto_102** → Leitos
- **Emergencia** → Pronto atendimento
- **Ambulancia** → Serviço de transporte

## 🚀 Como Executar

### Pré-requisitos

- Python 3.8+
- pip (gerenciador de pacotes Python)
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/hospital_bfs.git
   cd hospital_bfs
   ```

2. **Crie um ambiente virtual:**
   ```bash
   python -m venv .venv
   ```

3. **Ative o ambiente virtual:**
   - **Windows:**
     ```bash
     .\.venv\Scripts\activate
     ```
   - **macOS/Linux:**
     ```bash
     source .venv/bin/activate
     ```

4. **Instale as dependências:**
   ```bash
   pip install flask
   ```

5. **Inicie o servidor:**
   ```bash
   python app.py
   ```

6. **Acesse no navegador:**
   ```
   http://localhost:5000
   ```

## 🎮 Como Usar

1. **Selecione a origem** no primeiro dropdown (ex: Recepcao)
2. **Selecione o destino** no segundo dropdown (ex: UTI)
3. **Clique em "Calcular rota"**
4. O sistema mostrará:
   - 📍 O caminho mais curto entre os setores
   - 📊 Número de nós visitados durante a busca
   - 🔗 Ordem de visita dos nós
   - 📈 Estatísticas do grafo

## 🔍 Algoritmo BFS Implementado

```python
def bfs(graph, start, goal):
    """
    Executa Busca em Largura para encontrar o caminho mais curto
    
    Retorna:
    - path: lista com o caminho do start até goal
    - visited_count: quantidade de nós visitados
    - visited_order: ordem de visitação dos nós
    """
```

**Características:**
- Encontra **garantidamente** o caminho mais curto em grafos não ponderados
- Complexidade: O(V + E) onde V = vértices e E = arestas
- Usa fila (FIFO) para exploração nível por nível

## 📊 Estatísticas do Grafo

O sistema exibe:
- **Total de setores:** 14 nós
- **Total de conexões:** Arestas do grafo
- **Setor mais distante:** Calculado a partir da recepção
- **Distância máxima:** Número de passos até o setor mais distante

## 🛠️ Tecnologias Utilizadas

- **Backend:** Flask (Python)
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Visualização:** Cytoscape.js
- **Fontes:** Google Fonts (Inter)

## 📁 Estrutura de Dependências

```
Flask==2.3.0+
Cytoscape.js 3.24.0 (CDN)
Google Fonts API (CDN)
```

## 👤 Autor

Desenvolvido como trabalho da disciplina de **Resolução de Problemas com Grafos** - Universidade de Fortaleza (Unifor)

---

**Dúvidas?** Abra uma issue no repositório GitHub!
