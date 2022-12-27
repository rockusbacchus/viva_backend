import Queue from "bull";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { Client } from "@googlemaps/google-maps-services-js";
const geoClient = new Client({});
import mongodb from "mongodb";
import dotenv from "dotenv";
const Location = require("./model/Location");
dotenv.config();
const queue = new Queue("geocoder");
const connectDB = require("./config/dbConn");

try {
  // Connect to the MongoDB cluster
  connectDB();
  console.log("Bull processor started.");
  queue.process((job, done) => {
    let location;
    try {
      Location.findOne({ _id: job.data.location_id })
        .then((foundLocation) => {
          location = foundLocation;
          const args = {
            params: {
              key: process.env.GOOGLE_API_KEY,
              address: `${location.street} ${location.city} ${location.state} ${location.country} ${location.zip}`,
            },
          };
          return geoClient.geocode(args);
          // console.log(response);
          // return { gcResponse: response, location: location };
        })
        .then((gcResponse) => {
          console.log(gcResponse);
          const { lat, lng } = gcResponse.data.results[0].geometry.location;
          console.log(lng);
          location.latitude = lat;
          location.longitude = lng;
          return location.save();
        })
        .then(() => {
          console.log("location geocoded successfully");
        })
        .catch((e) => {
          console.log(e);
        });

      done();
    } catch (e) {
      console.log(e);
    }
  });
} catch (e) {
  console.error(e);
  process.exit(1);
}
