export function createCloud(id, x, y, options = {}) {
  return {
    id,
    x,
    y,
    type: "cloud",
    width: options.width || 120,
    height: options.height || 80,
    name: options.name || "Internet",
    color: options.color || "lightblue",
    textX: options.textX || 60,
    textY: options.textY || 20
  };
}

export function createSwitch(id, name, x, y, options = {}) {
  return {
    id, x, y, type: "switch",
    width: options.width || 160,
    height: options.height || 60,
    ports: options.ports || { cols: 12, rows: 2 },
    name: options.name || name,
    color: options.color || "steelblue",
    textX: options.textX || 80,
    textY: options.textY || 15,
    portX: options.portX || 12,
    portY: options.portY || 35,
    portSpacingX: options.portSpacingX || 12,
    portSpacingY: options.portSpacingY || 15,
  };
}

export function createRouter(id, name, x, y, options = {}) {
  return {
    id, x, y, type: "router",
    width: options.width || 120,
    height: options.height || 50,
    ports: options.ports || { cols: 4, rows: 1 },
    name: options.name || name,
    color: options.color || "orange",
    textX: options.textX || 60,
    textY: options.textY || 15,
    portX: options.portX || 10,
    portY: options.portY || 35,
    portSpacingX: options.portSpacingX || 12,
    portSpacingY: options.portSpacingY || 0,
  };
}

export function createFirewall(id, name, x, y, options = {}) {
  return {
    id, x, y, type: "firewall",
    width: options.width || 120,
    height: options.height || 60,
    ports: options.ports || { cols: 6, rows: 2 },
    name: options.name || name,
    color: options.color || "red",
    textX: options.textX || 60,
    textY: options.textY || 20,
    portX: options.portX || 20,
    portY: options.portY || 35,
    portSpacingX: options.portSpacingX || 15,
    portSpacingY: options.portSpacingY || 15,
  };
}

