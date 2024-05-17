
// The DBPedia SPARQL endpoint URL
const endpointUrl = 'https://dbpedia.org/sparql';

const name = document.getElementById("plantName").textContent

const sparqlQuery = `
        SELECT DISTINCT ?resource
        WHERE {
          ?resource rdfs:label ?label .
          FILTER (langMatches(lang(?label), "en"))
          FILTER regex(?label, "${name}", "i")
        }
        LIMIT 5
        `;

// Encode the query as a URL parameter
const encodedQuery = encodeURIComponent(sparqlQuery);

// Build the URL for the SPARQL query
const url = `${endpointUrl}?query=${encodedQuery}&format=json`;

// Fetch the data from the SPARQL endpoint
fetch(url)
    .then(response => response.json())
    .then(data => {
        // The results are in the 'data' object
        let bindings = data.results.bindings;
        let result = JSON.stringify(bindings);

        bindings.forEach((binding) => {
            if (binding.resource.value != null || binding.resource.value == "") {
                let option = document.createElement("li");
                let link = document.createElement("a")
                link.href = binding.resource.value;
                link.text = binding.resource.value;
                // let optionText = document.createTextNode(binding.resource.value);
                option.appendChild(link);
                document.getElementById("dbpedia").appendChild(option);
            }
        });

        if (bindings.length == 0) {
            let label = document.getElementById("dbpediaLabel")
            label.textContent = " None found";
        }
    });