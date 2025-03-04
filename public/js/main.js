import { createNetworkDiagram } from "./networkDiagram.js";
import { createCloud, createSwitch, createRouter, createFirewall } from "./devices.js";

document.addEventListener("DOMContentLoaded", () => {
  const network = createNetworkDiagram("network-container");

  const data = {
    nodes: [
      createCloud("INTERNET", 400, 0),
      createFirewall("FW1", "Edge Firewall", 100, 100),
      createRouter("R1", "WAN Router", 300, 200),
      createSwitch("SW1", "Core Switch 1", 100, 300),
      createSwitch("SW2", "Core Switch 2", 300, 300),
    ],

    links: [
      { source: "SW1", sourcePort: 5, target: "R1", targetPort: 3 },
      { source: "SW1", sourcePort: 0, target: "SW2", targetPort: 0 },
      { source: "R1", sourcePort: 0, target: "FW1", targetPort: 0 },
    ],

    l3Links: [
      { source: "INTERNET", target: "FW1" },
      { source: "SW1", target: "R1" },
      { source: "R1", target: "FW1" },
    ]

  };

  network.update(data);
  // Handle Firewall Rule Check
  document.getElementById("check-rule").addEventListener("click", () => {
      const sourceIP = document.getElementById("source-address").value;
      const sourcePort = document.getElementById("source-port").value;
      const destIP = document.getElementById("destination-address").value;
      const destPort = document.getElementById("destination-port").value;
      const application = document.getElementById("application").value;

      const result = checkFirewallRule(sourceIP, sourcePort, destIP, destPort, application);
      document.getElementById("rule-result").textContent = result;
  });
});

