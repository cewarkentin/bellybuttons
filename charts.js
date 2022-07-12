function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    PANEL.append("h6").text("ID:" + result.id);
    PANEL.append("h6").text("ETHNICITY:" + result.ethnicity);
    PANEL.append("h6").text("GENDER:" + result.gender);
    PANEL.append("h6").text("AGE:" + result.age);
    PANEL.append("h6").text("LOCATION:" + result.location);
    PANEL.append("h6").text("BBTYPE:" + result.bbtype);
    PANEL.append("h6").text("WFREQ:" + result.wfreq);
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesData = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samplesData.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var filteredSamplesArray = filteredSamples[0];
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = filteredSamplesArray.otu_ids;
    var otu_labels = filteredSamplesArray.otu_labels;
    var sample_values = filteredSamplesArray.sample_values;

    // 7. Create the yticks for the bar chart.
    var yticks = otu_ids.slice(0,10).map(otu_ids => "OTU ${otu_ids}").reverse()

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      type: "horizontalBar",
      hovertext: otu_labels
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      hovermode: "closest"
    };
    
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  });
}
