import * as d3 from "d3";
import { useEffect, useRef } from "react";
import {
  energyData,
  highlights,
  currentTime,
  customMessage,
} from "../data/data";

const EnergyTimeline = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const parsedData = energyData.map((d) => ({
      ...d,
      date: new Date(d.time),
    }));

    const margin = { top: 40, right: 80, bottom: 40, left: 80 };
    const width = 600 - margin.left - margin.right;
    const height = 1400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().domain([0, 1]).range([0, width]);

    const yScale = d3
      .scaleTime()
      .domain(d3.extent(parsedData, (d) => d.date) as [Date, Date])
      .range([0, height]);

    // === 4. Background Time Blocks ===
    const day = parsedData[0].date.toISOString().split("T")[0];
    const timeBlocks = [
      {
        label: "Late Night",
        start: `${day}T00:00:00Z`,
        end: `${day}T06:00:00Z`,
        color: "rgba(1, 0, 72, 0.25)",
      },
      {
        label: "Morning",
        start: `${day}T06:00:00Z`,
        end: `${day}T12:00:00Z`,
        color: "rgba(101, 67, 33, 0.25)",
      },
      {
        label: "Afternoon",
        start: `${day}T12:00:00Z`,
        end: `${day}T18:00:00Z`,
        color: "rgba(75, 0, 130, 0.25)",
      },
      {
        label: "Evening",
        start: `${day}T18:00:00Z`,
        end: `${day}T21:00:00Z`,
        color: "rgba(139, 0, 70, 0.25)",
      },
      {
        label: "Night",
        start: `${day}T21:00:00Z`,
        end: `${day}T23:59:59Z`,
        color: "rgba(60, 0, 80, 0.25)",
      },
    ];

    timeBlocks.forEach((block) => {
      const yStart = yScale(new Date(block.start));
      const yEnd = yScale(new Date(block.end));
      chart
        .append("rect")
        .attr("x", 0)
        .attr("y", yStart)
        .attr("width", width)
        .attr("height", yEnd - yStart)
        .attr("fill", block.color);
    });

    // === 5. Time Block Labels ===
    timeBlocks.forEach((block) => {
      const yMid =
        (yScale(new Date(block.start)) + yScale(new Date(block.end))) / 2;
      chart
        .append("text")
        .attr("x", width + 10)
        .attr("y", yMid)
        .text(block.label)
        .attr("font-size", 12)
        .attr("fill", "#333")
        .attr("alignment-baseline", "middle");
    });

    // === 3. Colored Segmented Curve ===
    for (let i = 0; i < parsedData.length - 1; i++) {
      const segment = [parsedData[i], parsedData[i + 1]];
      const color =
        segment[0].level >= 0.6
          ? "#256EFF"
          : segment[0].level >= 0.3
          ? "#DC8F69"
          : "#B7148E";

      chart
        .append("path")
        .datum(segment)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 6)
        .attr(
          "d",
          d3
            .line<(typeof segment)[0]>()
            .x((d) => xScale(d.level))
            .y((d) => yScale(d.date))
            .curve(d3.curveMonotoneY)
        );
    }

    // === 2. Time Markers (y-axis on left) ===
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(d3.timeHour.every(1))
      .tickFormat((d) => d3.utcFormat("%-I:%M %p")(d as Date));
    chart.append("g").call(yAxis);

    // === 6. Current Time Indicator ===
    const current = new Date(currentTime);
    const yCurrent = yScale(current);

    chart
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yCurrent)
      .attr("y2", yCurrent)
      .attr("stroke", "white")
      .attr("stroke-width", 4);

    chart
      .append("circle")
      .attr(
        "cx",
        xScale(parsedData.find((d) => d.time === currentTime)?.level || 0.5)
      )
      .attr("cy", yCurrent)
      .attr("r", 5)
      .attr("fill", "white");

    // === 7. Custom Message at Current Time ===
    const messageX = width / 2;
    const messageY = yCurrent - 70;

    const messageGroup = chart
      .append("g")
      .attr("transform", `translate(${messageX},${messageY})`);

    messageGroup
      .append("rect")
      .attr("x", -196)
      .attr("y", 0)
      .attr("width", 400)
      .attr("height", 60)
      .attr("rx", 8)
      .attr("fill", "#fff")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1.5)
      .attr("filter", "url(#drop-shadow)");

    messageGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("font-size", 12)
      .attr("font-weight", "bold")
      .attr("fill", "#222")
      .text(customMessage.title);

    messageGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .attr("font-size", 11)
      .attr("fill", "#555")
      .text(customMessage.description);

    // === 5. Highlight Labels (from highlights[]) ===
    highlights.forEach((h) => {
      const y = yScale(new Date(h.time));
      const level = parsedData.find((d) => d.time === h.time)?.level || 0.5;
      const x = xScale(level);
      const fontSize = 11;
      const paddingX = 6;
      const paddingY = 4;

      // Temporary text to measure width
      const tempText = chart
        .append("text")
        .text(h.label)
        .attr("font-size", fontSize)
        .attr("visibility", "hidden");

      const tempNode = tempText.node();
      if (!tempNode) return;

      const bbox = tempNode.getBBox();
      const textWidth = bbox.width;
      const textHeight = bbox.height;

      tempText.remove();

      const group = chart
        .append("g")
        .attr("transform", `translate(${x}, ${y - 12})`);

      // Background rectangle
      group
        .append("rect")
        .attr("x", -textWidth / 2 - paddingX)
        .attr("y", -textHeight / 2 - paddingY)
        .attr("width", textWidth + paddingX * 2)
        .attr("height", textHeight + paddingY * 2)
        .attr("rx", 4)
        .attr("fill", "white")
        .attr("stroke", h.color)
        .attr("stroke-width", 1.2);

      // Foreground text
      group
        .append("text")
        .text(h.label)
        .attr("font-size", fontSize)
        .attr("fill", h.color)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");
    });

    // === 1. X-axis (hidden, but defined for layout) ===
    const xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(d3.format(".0%"));
    chart.append("g").attr("transform", `translate(0,${height})`).call(xAxis);
  }, []);

  return (
    <div className="overflow-y-auto max-h-screen px-4">
      <p className="text-2xl mb-4">Energy Rhythm</p>
      <svg ref={svgRef} width={700} height={1500} />
    </div>
  );
};

export default EnergyTimeline;
