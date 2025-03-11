import { createNetworkDiagram } from "./networkDiagram";
import { createCloud, createSwitch, createRouter, createFirewall } from "./devices";
import type { Device } from "./devices";

// Define types for network data
interface Link {
  source: string;
  target: string;
  sourcePort: number;
  targetPort: number;
}

interface L3Link {
  source: string;
  target: string;
}

interface NetworkData {
  nodes: Device[];
  links: Link[];
  l3Links: L3Link[];
}

// Placeholder for checkFirewallRule (implement as needed)
function checkFirewallRule(
  sourceIP: string,
  sourcePort: string,
  destIP: string,
  destPort: string,
  application: string
): string {
  // Dummy implementation; replace with actual logic
  return `Rule check: ${sourceIP}:${sourcePort} -> ${destIP}:${destPort} (${application}) - Allowed`;
}

document.addEventListener("DOMContentLoaded", () => {
  const network = createNetworkDiagram("network-container");

  const data: NetworkData = {
    nodes: [
      createCloud("INTERNET", 'Verizon',400, 0),
      createFirewall("FW1", "Edge Firewall", 100, 100),
      createRouter("R1", "WAN Router", 300, 200),
      createSwitch("SW1", "Core Switch 1", 100, 300),
      createSwitch("SW2", "Core Switch 2", 300, 300),
      createSwitch("SW3", "Access Switch 1", 300, 400),
      createSwitch("SW4", "Access Switch 2", 400, 400),
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
    ],
  };

  network.update(data);

  // Handle Firewall Rule Check
  const checkRuleButton = document.getElementById("check-rule") as HTMLButtonElement | null;
  if (checkRuleButton) {
    checkRuleButton.addEventListener("click", () => {
      const sourceIP = (document.getElementById("source-address") as HTMLInputElement | null)?.value ?? "";
      const sourcePort = (document.getElementById("source-port") as HTMLInputElement | null)?.value ?? "";
      const destIP = (document.getElementById("destination-address") as HTMLInputElement | null)?.value ?? "";
      const destPort = (document.getElementById("destination-port") as HTMLInputElement | null)?.value ?? "";
      const application = (document.getElementById("application") as HTMLInputElement | null)?.value ?? "";

      const result = checkFirewallRule(sourceIP, sourcePort, destIP, destPort, application);
      const resultElement = document.getElementById("rule-result") as HTMLElement | null;
      if (resultElement) resultElement.textContent = result;
    });
  }
});