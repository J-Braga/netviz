import * as d3 from "d3";
import type { Device } from "./devices";

export function drawDevice(group: d3.Selection<SVGGElement, Device, null, undefined>, device: Device): void {
  if (device.type === "switch" || device.type === "router" || device.type === "firewall") {
    group
      .append("rect")
      .attr("width", device.width)
      .attr("height", device.height)
      .attr("rx", 5)
      .style("fill", device.color)
      .style("stroke", "black");

    drawPorts(group, device);
  } else if (device.type === "cloud") {
    drawCloud(group, device);
  }

  drawLabel(group, device);
}

export function drawCloud(group: d3.Selection<SVGGElement, Device, null, undefined>, device: Device): void {
  const { width, height, color } = device;

  const cloudPath = `
    M ${width * 0.2},${height * 0.6}
    C ${width * -0.1},${height * 0.2}, ${width * 0.5},${height * -0.3}, ${width * 0.8},${height * 0.4}
    C ${width * 1.1},${height * -0.1}, ${width * 1.4},${height * 0.5}, ${width},${height * 0.7}
    C ${width * 0.9},${height * 1}, ${width * 0.1},${height * 1}, ${width * 0.2},${height * 0.6}
    Z
  `;

  group
    .append("path")
    .attr("d", cloudPath)
    .style("fill", color || "lightblue")
    .style("stroke", "black")
    .style("stroke-width", 2);
}

export function drawLabel(group: d3.Selection<SVGGElement, Device, null, undefined>, device: Device): void {
  group
    .append("text")
    .attr("x", device.textX)
    .attr("y", device.textY)
    .style("fill", "white")
    .style("font-family", "Arial, sans-serif")
    .style("font-size", "12px")
    .style("text-anchor", "middle")
    .text(device.name);
}

export function drawPorts(group: d3.Selection<SVGGElement, Device, null, undefined>, device: Device): void {
  const portRadius = 4;
  const { cols, rows } = device.ports;
  const portSpacingX = device.portSpacingX;
  const portSpacingY = device.portSpacingY;

  const portGroup = group
    .append("g")
    .attr("class", "port-group")
    .attr("transform", `translate(${device.portX}, ${device.portY})`);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      portGroup
        .append("circle")
        .attr("cx", i * portSpacingX)
        .attr("cy", j * portSpacingY)
        .attr("r", portRadius)
        .style("fill", "gray")
        .style("stroke", "black")
        .on("mouseover", function () {
          d3.select(this).style("fill", "yellow");
        })
        .on("mouseout", function () {
          d3.select(this).style("fill", "gray");
        });
    }
  }
}

// export { Device };
// export function drawDevice(group, device) {
//   if (device.type === "switch" || device.type === "router" || device.type === "firewall") {
//     group.append("rect")
//       .attr("width", device.width)
//       .attr("height", device.height)
//       .attr("rx", 5)
//       .style("fill", device.color)
//       .style("stroke", "black");
// 
//     drawPorts(group, device);
//   } else if (device.type === "cloud") {
//     drawCloud(group, device);
//   }
// 
//   drawLabel(group, device);
// }
// 
// 
// export function drawCloud(group, device) {
//   const { width, height, color } = device;
// 
//   // SVG Path for a Cloud Shape
//   const cloudPath = `
//     M ${width * 0.2},${height * 0.6}
//     C ${width * -0.1},${height * 0.2}, ${width * 0.5},${height * -0.3}, ${width * 0.8},${height * 0.4}
//     C ${width * 1.1},${height * -0.1}, ${width * 1.4},${height * 0.5}, ${width},${height * 0.7}
//     C ${width * 0.9},${height * 1}, ${width * 0.1},${height * 1}, ${width * 0.2},${height * 0.6}
//     Z
//   `;
// 
//   group.append("path")
//     .attr("d", cloudPath)
//     .style("fill", color || "lightblue")
//     .style("stroke", "black")
//     .style("stroke-width", 2);
// }
// 
// export function drawLabel(group, device) {
//   group.append("text")
//     .attr("x", device.textX)
//     .attr("y", device.textY)
//     .style("fill", "white")
//     .style("font-family", "Arial, sans-serif")
//     .style("font-size", "12px")
//     .style("text-anchor", "middle")
//     .text(device.name);
// }
// 
// export function drawPorts(group, device) {
//   const portRadius = 4;
//   const { cols, rows } = device.ports;
//   const portSpacingX = device.portSpacingX;
//   const portSpacingY = device.portSpacingY;
// 
//   const portGroup = group.append("g")
//     .attr("class", "port-group")
//     .attr("transform", `translate(${device.portX}, ${device.portY})`);
// 
//   for (let i = 0; i < cols; i++) {
//     for (let j = 0; j < rows; j++) {
//       portGroup.append("circle")
//         .attr("cx", i * portSpacingX)
//         .attr("cy", j * portSpacingY)
//         .attr("r", portRadius)
//         .style("fill", "gray")
//         .style("stroke", "black")
//         .on("mouseover", function () {
//           d3.select(this).style("fill", "yellow");
//         })
//         .on("mouseout", function () {
//           d3.select(this).style("fill", "gray");
//         });
//     }
//   }
// }
