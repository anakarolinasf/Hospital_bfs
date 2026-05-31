const hospital = {
    Recepcao: ["Corredor_A", "Corredor_B"],
    Corredor_A: ["Recepcao", "UTI", "Laboratorio"],
    Corredor_B: ["Recepcao", "Farmacia", "Radiologia"],
    UTI: ["Corredor_A", "Centro_Cirurgico"],
    Laboratorio: ["Corredor_A", "Farmacia"],
    Farmacia: ["Laboratorio", "Corredor_B", "Emergencia"],
    Radiologia: ["Corredor_B", "Pediatria"],
    Centro_Cirurgico: ["UTI", "Sala_Recuperacao"],
    Sala_Recuperacao: ["Centro_Cirurgico"],
    Pediatria: ["Radiologia", "Quarto_101"],
    Quarto_101: ["Pediatria", "Quarto_102"],
    Quarto_102: ["Quarto_101"],
    Emergencia: ["Farmacia", "Ambulancia"],
    Ambulancia: ["Emergencia"]
};

const originSelect = document.getElementById("originSelect");
const destinationSelect = document.getElementById("destinationSelect");
const runButton = document.getElementById("runButton");
const statusTag = document.getElementById("statusTag");
const loadingOverlay = document.getElementById("loadingOverlay");
const toast = document.getElementById("toast");
const bfsState = document.getElementById("bfsState");
const toastState = document.getElementById("toastState");

const infoOrigin = document.getElementById("infoOrigin");
const infoDestination = document.getElementById("infoDestination");
const infoDistance = document.getElementById("infoDistance");
const infoConnections = document.getElementById("infoConnections");
const infoVisited = document.getElementById("infoVisited");
const infoNodes = document.getElementById("infoNodes");
const infoEdges = document.getElementById("infoEdges");
const infoMostDistant = document.getElementById("infoMostDistant");
const infoFarthest = document.getElementById("infoFarthest");

const nodes = Object.keys(hospital).map((id) => ({
    data: { id, label: id.replace(/_/g, " ") }
}));

const edges = [];
Object.entries(hospital).forEach(([node, neighbors]) => {
    neighbors.forEach((neighbor) => {
        if (!edges.some((edge) => edge.data.source === neighbor && edge.data.target === node)) {
            edges.push({
                data: { id: `${node}-${neighbor}`, source: node, target: neighbor }
            });
        }
    });
});

// Função para calcular tamanho dinâmico do nó
function getNodeSize(label) {
    const baseSize = 65;
    const charWidth = 8;
    const textLength = label.length;
    const calculatedSize = Math.max(baseSize, textLength * charWidth);
    return {
        width: calculatedSize,
        height: calculatedSize,
        fontSize: textLength > 15 ? 9 : textLength > 10 ? 10 : 11
    };
}

// Calcular tamanhos para cada nó
const nodeSizes = {};
nodes.forEach((node) => {
    nodeSizes[node.data.id] = getNodeSize(node.data.label);
});

const cy = cytoscape({
    container: document.getElementById("cy"),
    elements: [...nodes, ...edges],
    style: [
        {
            selector: "node",
            style: {
                "background-color": "#112a43",
                "border-width": 2.5,
                "border-color": "#3ef4a6",
                label: "data(label)",
                "text-valign": "center",
                "text-halign": "center",
                "text-wrap": "wrap",
                "text-max-width": (ele) => {
                    const size = nodeSizes[ele.id()];
                    return size.width - 12;
                },
                color: "#eff8ff",
                "text-outline-width": 0,
                "font-weight": 600,
                width: (ele) => nodeSizes[ele.id()].width,
                height: (ele) => nodeSizes[ele.id()].height,
                "font-size": (ele) => nodeSizes[ele.id()].fontSize,
                "transition-duration": "400ms",
                "transition-property": "background-color, border-width, width, height"
            }
        },
        {
            selector: "edge",
            style: {
                width: 2.5,
                "line-color": "rgba(255,255,255,0.12)",
                "curve-style": "bezier",
                "target-arrow-shape": "none",
                "opacity": 0.65,
                "transition-duration": "400ms",
                "control-point-step-size": 40
            }
        },
        {
            selector: ".visited",
            style: {
                "background-color": "#71f2d8",
                "border-color": "#37a886",
                "border-width": 3,
                width: (ele) => nodeSizes[ele.id()].width + 15,
                height: (ele) => nodeSizes[ele.id()].height + 15
            }
        },
        {
            selector: ".path",
            style: {
                "background-color": "#3ef4a6",
                "border-color": "#2ecf9f",
                "border-width": 3,
                width: (ele) => nodeSizes[ele.id()].width + 25,
                height: (ele) => nodeSizes[ele.id()].height + 25,
                "font-size": (ele) => nodeSizes[ele.id()].fontSize + 1,
                "font-weight": 700
            }
        },
        {
            selector: ".path-edge",
            style: {
                width: 4,
                "line-color": "#3ef4a6",
                "opacity": 1,
                "curve-style": "bezier",
                "line-cap": "round"
            }
        }
    ],
    layout: {
        name: "cose",
        animate: true,
        animationDuration: 800,
        randomize: true,
        componentSpacing: 40,
        nodeSpacing: 12,
        idealEdgeLength: (edge) => {
            const source = edge.source().data('id');
            const target = edge.target().data('id');
            const sourceSize = nodeSizes[source].width / 2;
            const targetSize = nodeSizes[target].width / 2;
            return Math.max(180, sourceSize + targetSize + 80);
        },
        nodeOverlap: 100,
        nestingFactor: 0.1,
        gravity: 0.12,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.99,
        minTemp: 0.4,
        fit: true,
        padding: 80,
        tile: true,
        tilingPaddingVertical: 60,
        tilingPaddingHorizontal: 60,
        gravityRange: 150
    }
});

cy.userZoomingEnabled(true);
cy.userPanningEnabled(true);
cy.boxSelectionEnabled(false);

// Função para ajustar layout baseado no tamanho da tela
function adjustLayoutForScreenSize() {
    const container = document.getElementById("cy");
    const width = container.clientWidth;
    const isMobile = width < 768;
    const isTablet = width < 1200;
    
    const layoutConfig = cy.layout({
        name: "cose",
        animate: true,
        animationDuration: 600,
        randomize: false,
        componentSpacing: isMobile ? 25 : isTablet ? 30 : 40,
        nodeSpacing: isMobile ? 8 : 12,
        idealEdgeLength: (edge) => {
            const source = edge.source().data('id');
            const target = edge.target().data('id');
            const sourceSize = nodeSizes[source].width / 2;
            const targetSize = nodeSizes[target].width / 2;
            const baseLength = sourceSize + targetSize + (isMobile ? 40 : isTablet ? 60 : 80);
            return Math.max(isMobile ? 120 : isTablet ? 150 : 180, baseLength);
        },
        nodeOverlap: 100,
        nestingFactor: 0.1,
        gravity: isMobile ? 0.15 : isTablet ? 0.13 : 0.12,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.99,
        minTemp: 0.4,
        fit: true,
        padding: isMobile ? 40 : isTablet ? 60 : 80,
        tile: true,
        tilingPaddingVertical: isMobile ? 30 : isTablet ? 45 : 60,
        tilingPaddingHorizontal: isMobile ? 30 : isTablet ? 45 : 60,
        gravityRange: isMobile ? 100 : isTablet ? 125 : 150
    });
    
    layoutConfig.run();
}

// Listener para cliques em nós
cy.nodes().forEach((node) => {
    node.on("tap", () => {
        originSelect.value = node.id();
        destinationSelect.value = node.id();
    });
});

// Adicionar efeito visual ao passar o mouse sobre nós
cy.on('mouseover', 'node', (event) => {
    event.target.style({
        'border-width': 3.5
    });
});

cy.on('mouseout', 'node', (event) => {
    event.target.style({
        'border-width': 2.5
    });
});

function populateSelects() {
    nodes.forEach((node) => {
        const optionOrigin = document.createElement("option");
        optionOrigin.value = node.data.id;
        optionOrigin.textContent = node.data.label;
        originSelect.appendChild(optionOrigin);

        const optionDestination = document.createElement("option");
        optionDestination.value = node.data.id;
        optionDestination.textContent = node.data.label;
        destinationSelect.appendChild(optionDestination);
    });
    originSelect.value = "Recepcao";
    destinationSelect.value = "Emergencia";
}

function showToast(message, success = true) {
    toast.textContent = message;
    toast.classList.add("show");
    toast.style.borderColor = success ? "rgba(62, 244, 166, 0.25)" : "rgba(255, 107, 107, 0.25)";
    toastState.textContent = success ? "Sucesso" : "Erro";
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3200);
}

function setStatus(text) {
    statusTag.textContent = text;
}

function showLoading(isLoading) {
    loadingOverlay.classList.toggle("active", isLoading);
}

function clearHighlight() {
    cy.nodes().removeClass("visited path");
    cy.edges().removeClass("path-edge");
}

function highlightPath(path) {
    const pathSet = new Set(path);
    
    // Animar os nós do caminho com delay escalonado
    path.forEach((nodeId, index) => {
        setTimeout(() => {
            const node = cy.getElementById(nodeId);
            node.addClass("path");
        }, index * 80);
    });

    cy.edges().forEach((edge) => {
        if (pathSet.has(edge.source().id()) && pathSet.has(edge.target().id())) {
            const a = edge.source().id();
            const b = edge.target().id();
            if ((path.indexOf(a) + 1 === path.indexOf(b)) || (path.indexOf(b) + 1 === path.indexOf(a))) {
                edge.addClass("path-edge");
            }
        }
    });
}

function animateVisited(order) {
    bfsState.textContent = "Explorando nós";
    return new Promise((resolve) => {
        let index = 0;
        const interval = setInterval(() => {
            if (index >= order.length) {
                clearInterval(interval);
                bfsState.textContent = "Busca concluída";
                resolve();
                return;
            }
            const node = cy.getElementById(order[index]);
            node.addClass("visited");
            index += 1;
        }, 140);
    });
}

async function updateRoute() {
    const origin = originSelect.value;
    const destination = destinationSelect.value;

    if (origin === destination) {
        showToast("Origem e destino não podem ser iguais.", false);
        return;
    }

    clearHighlight();
    setStatus("Calculando a melhor rota...");
    showLoading(true);

    try {
        const response = await fetch("/route", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ origin, destination })
        });

        const data = await response.json();

        if (!data.success) {
            showToast(data.message, false);
            infoOrigin.textContent = origin.replace(/_/g, " ");
            infoDestination.textContent = destination.replace(/_/g, " ");
            infoDistance.textContent = "-";
            infoConnections.textContent = "-";
            infoVisited.textContent = data.visited_count;
            setStatus("Rota não encontrada");
            
            // Fazer fit suave mesmo sem rota encontrada
            setTimeout(() => {
                cy.fit(cy.nodes(), 80);
            }, 300);
            return;
        }

        infoOrigin.textContent = origin.replace(/_/g, " ");
        infoDestination.textContent = destination.replace(/_/g, " ");
        infoDistance.textContent = `${data.distance} setor(es)`;
        infoConnections.textContent = `${data.connections} conexão(ões)`;
        infoVisited.textContent = data.visited_count;
        infoNodes.textContent = data.statistics.total_nodes;
        infoEdges.textContent = data.statistics.total_edges;
        infoMostDistant.textContent = data.statistics.most_distant_sector.replace(/_/g, " ");
        infoFarthest.textContent = `${data.statistics.farthest_distance} ligação(ões)`;

        await animateVisited(data.visited_order);
        highlightPath(data.path);
        showToast(data.message, true);
        setStatus("Rota exibida com sucesso");
        
        // Fit suave final
        setTimeout(() => {
            const pathNodes = cy.nodes().filter((ele) => data.path.includes(ele.id()));
            cy.fit(pathNodes, 100);
        }, data.visited_order.length * 140 + data.path.length * 80 + 300);
    } catch (error) {
        showToast("Falha ao processar a rota. Tente novamente.", false);
        setStatus("Erro na conexão");
        console.error(error);
    } finally {
        showLoading(false);
    }
}

populateSelects();
runButton.addEventListener("click", updateRoute);

// Ajustar layout inicialmente e ao redimensionar
adjustLayoutForScreenSize();

window.addEventListener("resize", () => {
    cy.resize();
    adjustLayoutForScreenSize();
});

cy.on("tap", "node", (event) => {
    const clicked = event.target.id();
    if (!originSelect.value || !destinationSelect.value) {
        originSelect.value = clicked;
        destinationSelect.value = clicked;
        return;
    }

    if (originSelect.value === clicked) {
        destinationSelect.value = clicked;
    }
});

updateRoute();
