// ========== DEVICE CREATION FUNCTIONS ==========
function getDeviceCenter(device) {
  return {
    cx: device.x + device.width / 2,
    cy: device.y + device.height / 2
  };
}

// Function to create a switch with customizable port positioning
function createSwitch(id, name, x, y, options = {}) {
  return {
    id,
    x,
    y,
    type: "switch",
    width: options.width || 160,
    height: options.height || 60,
    ports: options.ports || { cols: 12, rows: 2 },
    name: options.name || name,
    color: options.color || "steelblue",
    textX: options.textX || 80,  // Centered by default
    textY: options.textY || 15,  // 15px from top by default

    portX: options.portX || 12,  // Ports start 10px from left
    portY: options.portY || (options.height || 50) - 15, 
    portSpacingX: options.portSpacingX || 12,
    portSpacingY: options.portSpacingY || 15,
  };
}

// Function to create a router with customizable port positioning
function createRouter(id, name, x, y, options = {}) {
  return {
    id,
    x,
    y,
    type: "router",
    width: options.width || 120,
    height: options.height || 50,
    ports: options.ports || { cols: 4, rows: 1 },
    name: options.name || name,
    color: options.color || "orange",
    textX: options.textX || 60,
    textY: options.textY || 15,

    portX: options.portX || 10,
    portY: options.portY || (options.height || 40) - 5,
    portSpacingX: options.portSpacingX || 12,
    portSpacingY: options.portSpacingY || 0,
  };
}

// Function to create a firewall with customizable port positioning
function createFirewall(id, name, x, y, options = {}) {
  return {
    id,
    x,
    y,
    type: "firewall",
    width: options.width || 120,
    height: options.height || 60,
    ports: options.ports || { cols: 6, rows: 2 },
    name: options.name || name,
    color: options.color || "red",
    textX: options.textX || 60,
    textY: options.textY || 20,

    portX: options.portX || 20,
    portY: options.portY || (options.height || 45) - 10,
    portSpacingX: options.portSpacingX || 15,
    portSpacingY: options.portSpacingY || 15,
  };
}

// ========== DRAWING FUNCTIONS ==========

// Function to draw the correct device type
function drawDevice(group, device) {
  if (device.type === "switch") return drawSwitch(group, device);
  if (device.type === "router") return drawRouter(group, device);
  if (device.type === "firewall") return drawFirewall(group, device);
}

// Function to draw a switch (rectangle)
function drawSwitch(group, device) {
  group.append("rect")
    .attr("width", device.width)
    .attr("height", device.height)
    .attr("rx", 5)
    .style("fill", device.color)
    .style("stroke", "black");

  drawPorts(group, device);
  drawLabel(group, device);
}

// Function to draw a router (circle)
function drawRouter(group, device) {
  group.append("rect")
    .attr("width", device.width)
    .attr("height", device.height)
    .attr("rx", 5)
    .style("fill", device.color)
    .style("stroke", "black");

  drawPorts(group, device);
  drawLabel(group, device);
}

// Function to draw a firewall (hexagon)
function drawFirewall(group, device) {
  group.append("rect")
    .attr("width", device.width)
    .attr("height", device.height)
    .attr("rx", 5)
    .style("fill", device.color)
    .style("stroke", "black");

  drawPorts(group, device);
  drawLabel(group, device);
}

// ========== COMMON DRAWING FUNCTIONS ==========
// Function to draw ports based on device settings
function drawPorts(group, device) {
  const portRadius = 4;
  const { cols, rows } = device.ports;
  const portSpacingX = device.portSpacingX;
  const portSpacingY = device.portSpacingY;

  const portGroup = group.append("g")
    .attr("class", "port-group")
    .attr("transform", `translate(${device.portX}, ${device.portY})`); // ✅ Move ports as a group

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      portGroup.append("circle")
        .attr("cx", i  * portSpacingX)
        .attr("cy", j * portSpacingY)
        .attr("r", portRadius)
        .style("fill", "gray")
        .style("stroke", "black")
        .on("mouseover", function () {
          d3.select(this).style("fill", "yellow"); // ✅ Highlight port on hover
        })
        .on("mouseout", function () {
          d3.select(this).style("fill", "gray"); // ✅ Restore color on mouseout
        });
    }
  }
}

// Function to draw a label with configurable positioning
function drawLabel(group, device) {
  group.append("text")
    .attr("x", device.textX)
    .attr("y", device.textY)
    .style("fill", "white")
    .style("font-family", "Arial, sans-serif")
    .style("font-size", "12px")
    .style("text-anchor", "middle")
    .text(device.name);
}

function getPortPosition(device, portIndex) {
  const { cols, rows } = device.ports;
  const totalPorts = cols * rows;

  // Ensure port index is within range
  const portNum = Math.min(portIndex, totalPorts - 1);
  const col = portNum % cols;
  const row = Math.floor(portNum / cols);

  return {
    x: device.x + device.portX + col * device.portSpacingX,
    y: device.y + device.portY + row * device.portSpacingY
  };
}

// ========== NETWORK DIAGRAM ==========

function createNetworkDiagram(containerId, options = {}) {
  const width = options.width || 800;
  const height = options.height || 600;

  const container = d3.select(`#${containerId}`);
  const svg = container
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`);

  const linkGroup = svg.append("g").attr("class", "links");
  const nodeGroup = svg.append("g").attr("class", "nodes");

  let nodes = null;
  let links = null;
  const nodeMap = new Map();

  // DRAG FUNCTION: Moves nodes when dragged
  function drag(simulation) {
    function dragStarted(event, d) {
      d3.select(this).raise().classed("active", true);
    }

    function dragged(event, d) {
      d.x = Math.max(0, Math.min(width - d.width, event.x));
      d.y = Math.max(0, Math.min(height - d.height, event.y));

      d3.select(this).attr("transform", `translate(${d.x}, ${d.y})`);

      updateLinks();
    }

    function dragEnded(event, d) {
      d3.select(this).classed("active", false);
    }

    return d3.drag()
      .on("start", dragStarted)
      .on("drag", dragged)
      .on("end", dragEnded);
  }

  function updateLinks() {
    links
      .attr("x1", d => {
        const sourceDevice = nodeMap.get(d.source);
        return sourceDevice ? getPortPosition(sourceDevice, d.sourcePort).x : 0;
      })
      .attr("y1", d => {
        const sourceDevice = nodeMap.get(d.source);
        return sourceDevice ? getPortPosition(sourceDevice, d.sourcePort).y : 0;
      })
      .attr("x2", d => {
        const targetDevice = nodeMap.get(d.target);
        return targetDevice ? getPortPosition(targetDevice, d.targetPort).x : 0;
      })
      .attr("y2", d => {
        const targetDevice = nodeMap.get(d.target);
        return targetDevice ? getPortPosition(targetDevice, d.targetPort).y : 0;
      });
  }

  function update(data) {
    nodeMap.clear();
    data.nodes.forEach(node => nodeMap.set(node.id, node));

    nodes = nodeGroup
      .selectAll(".device-group")
      .data(data.nodes, d => d.id)
      .join(
        enter => {
          const group = enter.append("g")
            .attr("class", "device-group")
            .attr("transform", d => `translate(${d.x}, ${d.y})`)
            .call(drag()); // ✅ Enable dragging

          group.each(function(d) {
            drawDevice(d3.select(this), d);
          });

          return group;
        },
        update => update.attr("transform", d => `translate(${d.x}, ${d.y})`)
      );

    links = linkGroup
      .selectAll(".link")
      .data(data.links)
      .join("line")
      .attr("class", "link")
      .style("stroke", "black")
      .style("stroke-width", 2);

    updateLinks();
    linkGroup.raise();

  }

  return { update };
}

// ========== EXAMPLE USAGE ==========

document.addEventListener("DOMContentLoaded", () => {
  const network = createNetworkDiagram("network-container");
  const data = {
    nodes: [
      createFirewall("FW1", "Edge Firewall 1", 100, 0),
      createRouter("R1", "Wan Rotuer 1", 300, 200),
      createSwitch("SW1", "Core Switch 1", 100, 300),
      createSwitch("SW2", "Core Switch 2", 300, 300),
    ],
    links: [
      { source: "SW1", sourcePort: 5, target: "R1", targetPort: 5 },
      { source: "SW1", sourcePort: 0, target: "SW2", targetPort: 0 },
      { source: "R1", sourcePort: 0, target: "FW1", targetPort: 0 }
    ]  };

  network.update(data);
});

