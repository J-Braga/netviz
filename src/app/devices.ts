export interface Device {
  id: string;
  name: string;
  type: "cloud" | "switch" | "router" | "firewall";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  textX: number;
  textY: number;
  portX: number;
  portY: number;
  portSpacingX: number;
  portSpacingY: number;
  ports: {
    cols: number;
    rows: number;
  };
}

export function createCloud(id: string, name: string, x: number, y: number): Device {
  return {
    id,
    name: name,
    type: "cloud",
    x,
    y,
    width: 160,
    height: 60,
    color: "lightblue",
    textX: 60,
    textY: 20,
    portX: 0,
    portY: 0,
    portSpacingX: 0,
    portSpacingY: 0,
    ports: { cols: 0, rows: 0 },
  };
}

export function createSwitch(id: string, name: string, x: number, y: number): Device {
  return {
    id,
    name,
    type: "switch",
    x,
    y,
    width: 160,
    height: 60,
    color: "blue",
    textX: 80,
    textY: 15,
    portX: 12,
    portY: 35,
    portSpacingX: 12,
    portSpacingY: 15,
    ports: { cols: 12, rows: 2 },
  };
}

export function createRouter(id: string, name: string, x: number, y: number): Device {
  return {
    id,
    name,
    type: "router",
    x,
    y,
    width: 120,
    height: 50,
    color: "orange",
    textX: 60,
    textY: 15,
    portX: 10,
    portY: 35,
    portSpacingX: 12, 
    portSpacingY: 0,
    ports: { cols: 4, rows: 1 },
  };
}

export function createFirewall(id: string, name: string, x: number, y: number): Device {
  return {
    id,
    name,
    type: "firewall",
    x,
    y,
    width: 120,
    height: 60,
    color: "red",
    textX: 60,
    textY: 20,
    portX: 20,
    portY: 35,
    portSpacingX: 15,
    portSpacingY: 15,
    ports: { cols: 6, rows: 2 },
  };
}