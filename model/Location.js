/*
  Places
  name          :text
  description   :text
  website       :text
  street        :text
  city          :text
  state         :text
  country       :text
  latitude      :float
  longitude     :float
  phone         :text
  time_zone     :text
  void          :boolean
  zip           :text
  created       :timestamp
  updated       :timestamp

*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    website: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    latitude: String,
    longitude: String,
    phone: String,
    time_zone: String,
    void: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Location", locationSchema);
