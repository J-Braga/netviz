import { drawDevice } from "./draw.js";

/**
 * Get the center of a device.
 */
function getDeviceCenter(device) {
  return {
    x: device.x + device.width / 2,
    y: device.y + device.height / 2
  };
}

/**
 * Get the position of a specific port on a device.
 */
function getPortPosition(device, portIndex) {
  if (device.type === "cloud") {
    return getDeviceCenter(device); // Clouds connect to the center
  }

  const { cols, rows } = device.ports;
  const totalPorts = cols * rows;
  const portNum = Math.min(portIndex, totalPorts - 1);
  const col = portNum % cols;
  const row = Math.floor(portNum / cols);

  return {
    x: device.x + device.portX + col * device.portSpacingX,
    y: device.y + device.portY + row * device.portSpacingY
  };
}

/**
 * Creates a network diagram inside the specified container.
 * Supports Layer 2 (port-to-port) and Layer 3 (device-to-device) links.
 */
export function createNetworkDiagram(containerId) {
  const width = 800;
  const height = 600;
  let showL2Links = true;
  let showL3Links = true;

  const container = d3.select(`#${containerId}`);
  const svg = container.append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`) // ✅ Dynamically fit window
    .call(d3.zoom().scaleExtent([0.01, Infinity]) 
      .translateExtent([[ -Infinity, -Infinity ], [ Infinity, Infinity ]])
      .on("zoom", zoomed));

  window.addEventListener("resize", () => {
    svg.attr("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);
  });

  const diagramGroup = svg.append("g");

  // Groups for layering
  const linkGroup = diagramGroup.append("g").attr("class", "links");
  const l3LinkGroup = diagramGroup.append("g").attr("class", "l3Links");
  const nodeGroup = diagramGroup.append("g").attr("class", "nodes");

  let nodes = null;
  let links = null;
  let l3Links = null;
  const nodeMap = new Map();

  // Zoom handler (allows free panning and unlimited zooming)
  function zoomed(event) {
    diagramGroup.attr("transform", event.transform);
  }

  // Dragging functionality
  function drag(simulation) {
    function dragStarted(event, d) {
      d3.select(this).raise().classed("active", true);
    }

    function dragged(event, d) {
      d.x = event.x;
      d.y = event.y;

      d3.select(this).attr("transform", `translate(${d.x}, ${d.y})`);
      updateLinks();
      updateL3Links();
    }

    function dragEnded(event, d) {
      d3.select(this).classed("active", false);
    }

    return d3.drag()
      .on("start", dragStarted)
      .on("drag", dragged)
      .on("end", dragEnded);
  }

  // Updates port-to-port link positions
  function updateLinks() {
    if (!links) return;
    links
      .attr("x1", d => getPortPosition(nodeMap.get(d.source), d.sourcePort).x)
      .attr("y1", d => getPortPosition(nodeMap.get(d.source), d.sourcePort).y)
      .attr("x2", d => getPortPosition(nodeMap.get(d.target), d.targetPort).x)
      .attr("y2", d => getPortPosition(nodeMap.get(d.target), d.targetPort).y)
      .style("display", showL2Links ? "block" : "none");
  }

  // Updates Layer 3 (L3) link positions
  function updateL3Links() {
    if (!l3Links) return;
    l3Links
      .attr("x1", d => getDeviceCenter(nodeMap.get(d.source)).x)
      .attr("y1", d => getDeviceCenter(nodeMap.get(d.source)).y)
      .attr("x2", d => getDeviceCenter(nodeMap.get(d.target)).x)
      .attr("y2", d => getDeviceCenter(nodeMap.get(d.target)).y)
      .style("display", showL3Links ? "block" : "none");
  }

  // Updates nodes and links when new data is provided
  function update(data) {
    nodeMap.clear();
    data.nodes.forEach(node => nodeMap.set(node.id, node));

    // Update Nodes (Devices)
    nodes = nodeGroup
      .selectAll(".device-group")
      .data(data.nodes, d => d.id)
      .join(
        enter => {
          const group = enter.append("g")
            .attr("class", "device-group")
            .attr("transform", d => `translate(${d.x}, ${d.y})`)
            .call(drag());

          group.each(function (d) {
            drawDevice(d3.select(this), d);
          });

          return group;
        },
        update => update.attr("transform", d => `translate(${d.x}, ${d.y})`)
      );

    // Update Layer 2 Links (Port-to-Port)
    links = linkGroup
      .selectAll(".link")
      .data(data.links)
      .join("line")
      .attr("class", "link")
      .style("stroke", "black")
      .style("stroke-width", 2);

    updateLinks();

    // Update Layer 3 Links (Device-to-Device)
    l3Links = l3LinkGroup
      .selectAll(".l3Link")
      .data(data.l3Links)
      .join("line")
      .attr("class", "l3Link")
      .style("stroke", "green")
      .style("stroke-dasharray", "5,5")
      .style("stroke-width", 2);

    updateL3Links();

    l3LinkGroup.raise();
    linkGroup.raise();
  }

  // Event Listeners for Toggle Buttons
  document.getElementById("toggle-l2").addEventListener("click", () => {
    showL2Links = !showL2Links;
    updateLinks();
  });

  document.getElementById("toggle-l3").addEventListener("click", () => {
    showL3Links = !showL3Links;
    updateL3Links();
  });

  return { update };
}

