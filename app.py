from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Grafo do hospital com setores e conexões
hospital = {
    "Recepcao": ["Corredor_A", "Corredor_B"],
    "Corredor_A": ["Recepcao", "UTI", "Laboratorio"],
    "Corredor_B": ["Recepcao", "Farmacia", "Radiologia"],
    "UTI": ["Corredor_A", "Centro_Cirurgico"],
    "Laboratorio": ["Corredor_A", "Farmacia"],
    "Farmacia": ["Laboratorio", "Corredor_B", "Emergencia"],
    "Radiologia": ["Corredor_B", "Pediatria"],
    "Centro_Cirurgico": ["UTI", "Sala_Recuperacao"],
    "Sala_Recuperacao": ["Centro_Cirurgico"],
    "Pediatria": ["Radiologia", "Quarto_101"],
    "Quarto_101": ["Pediatria", "Quarto_102"],
    "Quarto_102": ["Quarto_101"],
    "Emergencia": ["Farmacia", "Ambulancia"],
    "Ambulancia": ["Emergencia"]
}


def bfs(graph, start, goal):
    """Executa BFS e retorna o menor caminho, quantidade de nós visitados e ordem de visita."""
    if start not in graph or goal not in graph:
        return None, 0, []

    queue = [start]
    visited = {start}
    parent = {}
    visited_order = []

    while queue:
        current = queue.pop(0)
        visited_order.append(current)

        if current == goal:
            break

        for neighbor in graph[current]:
            if neighbor not in visited:
                visited.add(neighbor)
                parent[neighbor] = current
                queue.append(neighbor)

    if goal not in visited:
        return None, len(visited), visited_order

    path = [goal]
    while path[-1] != start:
        path.append(parent[path[-1]])
    path.reverse()

    return path, len(visited), visited_order


def graph_statistics(graph, start_node="Recepcao"):
    """Calcula estatísticas do grafo, incluindo setor mais distante a partir de start_node."""
    distances = {start_node: 0}
    queue = [start_node]

    while queue:
        current = queue.pop(0)
        for neighbor in graph[current]:
            if neighbor not in distances:
                distances[neighbor] = distances[current] + 1
                queue.append(neighbor)

    if not distances:
        return {
            "total_nodes": len(graph),
            "total_edges": sum(len(v) for v in graph.values()) // 2,
            "most_distant_sector": None,
            "farthest_distance": 0,
        }

    farthest_sector = max(distances, key=lambda node: distances[node])
    return {
        "total_nodes": len(graph),
        "total_edges": sum(len(v) for v in graph.values()) // 2,
        "most_distant_sector": farthest_sector,
        "farthest_distance": distances[farthest_sector],
    }


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/route", methods=["POST"])
def route_path():
    data = request.get_json() or {}
    origin = data.get("origin")
    destination = data.get("destination")

    path, visited_count, visited_order = bfs(hospital, origin, destination)
    stats = graph_statistics(hospital, origin if origin in hospital else "Recepcao")

    if path is None:
        return jsonify({
            "success": False,
            "message": f"Não foi possível encontrar caminho de {origin} até {destination}.",
            "visited_count": visited_count,
            "visited_order": visited_order,
            "statistics": stats,
        }), 404

    return jsonify({
        "success": True,
        "path": path,
        "distance": len(path) - 1,
        "connections": len(path) - 1,
        "visited_count": visited_count,
        "visited_order": visited_order,
        "statistics": stats,
        "message": f"Menor rota encontrada de {origin} a {destination} com {len(path) - 1} conexões.",
    })


if __name__ == "__main__":
    app.run(debug=True)
