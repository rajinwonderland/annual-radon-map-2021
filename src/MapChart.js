import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { csv } from "d3-fetch";
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";

const MapChart = ({ setTooltipContent }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // https://www.bls.gov/lau/
    csv("/2021_radon.csv").then((counties) => {
      setData(counties);
    });
  }, []);

  const colors = ["red", "orange", "yellow"];

  const colorScale = scaleLinear().domain([1, 2, 3]).range(colors);

  return (
    <ComposableMap projection="geoAlbersUsa" data-tip="">
      <ZoomableGroup>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const cur = data.find((s) => s.geoid === geo.id);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    const { name } = geo.properties;
                    setTooltipContent(`${name} — Zone ${cur.zone}`);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  style={{
                    default: {
                      outline: "none",
                      stroke: "#475569"
                    },
                    hover: {
                      outline: "none",
                      stroke: "black"
                    },
                    pressed: {
                      outline: "none",
                      stroke: "black"
                    }
                  }}
                  fill={cur ? colorScale(cur.zone) : "#EEE"}
                />
              );
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
};

export default MapChart;
