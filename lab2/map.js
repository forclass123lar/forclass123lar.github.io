(async function () {
    mapboxgl.accessToken = "pk.eyJ1IjoibG90dXM4MyIsImEiOiJjbXdma21laGIwMnI1MnlxNHV6Z2VrZ2tmIn0.XZXZ3usSt_BH1oHlTg1Jzg";
    const buildings = await d3.json("mutistory.geojson"); // filtered data from Open Data Vancouver
    const buildingData = buildings.features.filter(function (permitsFiltered) {
        return permitsFiltered.geometry; // skip permits that have no location
    }).map(function (permitsFiltered) {
        return {
            longlat: permitsFiltered.geometry.coordinates, //separate each mappable property for each permit
            date: permitsFiltered.properties.issuedate
        };
    }).sort(function (firstInLine, nextInLine) {
        return firstInLine.date.localeCompare(nextInLine.date);
    }); //get the permits in order of dates, older dates come first

    // keep the repeated dates
    const dates = buildingData.map(function (rep) {
        return rep.date;
    });

    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/light-v11",
        // bounds: d3.geoBounds(buildings), //this makes the zoom ad center feature useless but its a nice proprety to tunr on an off
        fitBoundsOptions: { padding: 30 },
        projection: 'lambertConformalConic', // conic projection for Vancouver
        zoom: 11.5,
        center: [-123.1, 49.251],
        customAttribution: [
            'Data: <a href="https://opendata.vancouver.ca/explore/assets/issued-building-permits/" target="_blank">City of Vancouver Open Data</a> | Issued Building Permits',
            "Timeline: <a href='https://observablehq.com/@d3/walmarts-growth' target=' blank'>D3 Gallery by Mike Bostock</a> | Walmart's growth"]

    });

    //from mapbox tutorials examples
    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.enable(); //let users scroll
    map.on('style.load', function () {
        map.setFog({}); // set the default atmosphere style
    });

    //slide time!, start on the first date of the latest permit, ends on the earliest date
    const slide = document.getElementById("slide");
    const label = document.getElementById("label");
    const iniciate = document.getElementById("iniciate");
    slide.max = dates.length - 1;

    //take a break to get everything at the same time 
    await new Promise(function (resolve) {
        map.on("load", resolve);
    });

    // one svg circle per permit that appears after the date on timeline appears
    const circleImage = d3.select("#overlay");
    const g = circleImage.append("g").attr("fill", "none").attr("stroke", "black");

    const geoPermitCircle = g.selectAll("circle")
        .data(buildingData)
        .join("circle");

    // first permit is blue
    const first = circleImage.append("circle")
        .attr("fill", "blue")
        .attr("r", 3);

    // for the map view get the screen position from lat long
    function place(mapPosition) {
        const p = map.project(mapPosition.longlat);
        return "translate(" + p.x + "," + p.y + ")";
    }

    // the map moves when you pan or zoom, so every circle has to be placed again
    function reposition() {
        geoPermitCircle.attr("transform", place);
        first.attr("transform", place(buildingData[0]));
    }
    map.on("move", reposition);
    map.on("resize", reposition);
    reposition();

    let previousDate = ""; // text that sorts before every date

    // if you move the slide back and forth this makes the dates and permits adjust based on that
    //for permits that are coming next
    function update(date) {
        geoPermitCircle.filter(function (datePermit) {
            return datePermit.date > previousDate && datePermit.date <= date;
        }).transition().attr("r", 3);
        geoPermitCircle.filter(function (datePermit) {
            return datePermit.date <= previousDate && datePermit.date > date; // permits going away because slide is moving back
        }).transition().attr("r", 0);
        previousDate = date;
    } ////saves the dates for next call


    //state of the map for each move of the timeline
    function show(mapState) {
        slide.value = mapState;
        label.textContent = dates[mapState];
        update(dates[mapState]);
    }

    let dateTimer = null;

    function endSlide() {
        clearInterval(dateTimer); // cancel the repeating actions 
        dateTimer = null; // makes it so that we are stopped
        iniciate.textContent = "Start"; //button for to start again
    }

    iniciate.onclick = function () {
        if (dateTimer) {
            return endSlide();
        }
        if (Number(slide.value) >= dates.length - 1) {
            show(0);// makes it so that we are always on loop
        }
        iniciate.textContent = "Stop"; // button to stop
        dateTimer = setInterval(function () {
            const i = Number(slide.value) + 1;// if date is still inside the list give it a call and show it
            if (i < dates.length) {
                show(i);
            } else {
                endSlide(); //otherwise call to end it
            }
        }, 100); // change here for faster or slower playback (lower faster, higher slower)
    };

    slide.oninput = function () {
        endSlide();
        show(Number(slide.value));
    };

    show(0);
})();
