
export function checkFirewallRule(sourceIP, sourcePort, destIP, destPort, application) {
    console.log(`Checking flow from ${sourceIP}:${sourcePort} to ${destIP}:${destPort} for ${application}`);

    // Simulated logic (Replace with real firewall rule checks later)
    if (sourceIP.startsWith("192.168") && destIP.startsWith("10.")) {
        return "Flow allowed: Internal to external traffic is permitted.";
    }
    return "Flow blocked: No matching firewall rule found.";
}
