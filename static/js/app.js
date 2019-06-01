function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  let metadataURL = `/metadata/${sample}`;
  d3.json(metadataURL).then(function(data){
    console.log(data)
 

    // Use d3 to select the panel with id of `#sample-metadata`
      let sampleMetadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
      sampleMetadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
      Object.entries(data).forEach(([key, value]) => {
        sampleMetadata
          .append("div")
          .text(`${key} ": " ${value}`);
      });
    });
  }
    
function buildCharts(sample) {

  //Use `d3.json` to fetch the sample data for the plots
  let sampleURL = `/samples/${sample}`;
  d3.json(sampleURL).then(function(data){
    console.log(data)

  //Set variables for the required data values to build the plots
    let otuIds = data.otu_ids;
    let sampleValues = data.sample_values;
    let otuLabels = data.otu_labels;

  //Build a Bubble Chart using the sample data
    let bubbleChart = d3.select("#bubble")

    var trace1 = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds
    }
  };

    var data1 = [trace1];

    var layout1 = {
      title: 'Bubble Chart',
      showlegend: false,
      xaxis: {title: "OTU ID"}
  };

    Plotly.newPlot("bubble", data1, layout1);

  //Build a Pie Chart
    let pieChart = d3.select("#pie")

  // Slice the top 10 values to display on the pie chart
    let slicedotuIds = otuIds.slice(0,10);
    let slicedsampleValues = sampleValues.slice(0,10);
    let slicedotuLabels = otuLabels.slice(0,10);

    var trace2 = [{
      title: "Top 10 Samples",
      values: slicedsampleValues,
      labels: slicedotuIds,
      hovertext: slicedotuLabels,
      type: 'pie'
    }];

    // var data2 = [trace2]

    var layout2 = {
      height: 600,
      width: 600
  };

    Plotly.newPlot("pie", trace2, layout2);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
