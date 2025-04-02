const { csv, select, scaleLinear, extent, axisLeft, axisBottom, symbol, symbols } = d3;

const csvUrl = 'https://raw.githubusercontent.com/Smaranareddy6/Activity6_Question_3/refs/heads/main/birds_dataset%20(2).csv';

const parseRow = (d) => {
  d.wing_length_mm = d.wing_length_mm === 'NA' ? null : +d.wing_length_mm;
  d.tail_length_mm = d.tail_length_mm === 'NA' ? null : +d.tail_length_mm;
  return d;
};

const xValue = (d) => d.wing_length_mm;
const yValue = (d) => d.tail_length_mm;
const speciesValue = (d) => d.species;

const margin = { top: 60, right: 150, bottom: 80, left: 100 };
const size = 80;

const width = window.innerWidth;
const height = window.innerHeight;

const svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const main = async () => {
  const data = await csv(csvUrl, parseRow);

  const filteredData = data.filter(d => d.wing_length_mm != null && d.tail_length_mm != null);

  const x = scaleLinear()
    .domain(extent(filteredData, xValue))
    .range([margin.left, width - margin.right])
    .nice();

  const y = scaleLinear()
    .domain(extent(filteredData, yValue))
    .range([height - margin.bottom, margin.top])
    .nice();

  const species = [...new Set(filteredData.map(speciesValue))];
  const shapeScale = d3.scaleOrdinal()
    .domain(species)
    .range([d3.symbolCircle, d3.symbolTriangle, d3.symbolDiamond]);

  // X Axis
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(axisBottom(x));

  // Y Axis
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(axisLeft(y));

  // Axis labels
  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height - 30)
    .attr("text-anchor", "middle")
    .text("Wing Length (mm)");

  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", -height / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Tail Length (mm)");

  // Title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .attr("font-size", "26px")
    .attr("fill", "teal")
    .style("font-weight", "bold")
    .html("<u>Scatter Plot for Wing vs Tail Length</u>");

  // Symbols (points)
  svg.selectAll("path.mark")
    .data(filteredData)
    .enter()
    .append("path")
    .attr("class", "mark")
    .attr("transform", d => `translate(${x(xValue(d))},${y(yValue(d))})`)
    .attr("d", d3.symbol().type(d => shapeScale(speciesValue(d))).size(size))
    .attr("fill", "teal");

  // Legend
  const legend = svg.append("g")
    .attr("transform", `translate(${width - 120}, ${margin.top})`);

  species.forEach((s, i) => {
    const g = legend.append("g")
      .attr("transform", `translate(0, ${i * 30})`);

    g.append("path")
      .attr("d", d3.symbol().type(shapeScale(s)).size(size))
      .attr("fill", "teal");

    g.append("text")
      .attr("x", 20)
      .attr("dy", "0.35em")
      .style("font-size", "14px")
      .text(s);
  });
};

main();