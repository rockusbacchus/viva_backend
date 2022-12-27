const Location = require("../model/Location");
// import Queue from "bull";
const Queue = require("bull");

const index = async (req, res) => {
  const locations = await Location.find();
  if (!locations) {
    res.status(204).json({ message: "No locations found." });
  }
  res.json(locations);
};

const show = async (req, res) => {
  if (!req?.params?.id) {
    res.status(400).json({ message: "ID parameter required." });
  }

  const location = await Location.findOne({ _id: req.params.id }).exec();
  if (!location) {
    return res
      .status(204)
      .json({ message: `No location matches ID ${req.params.id}` });
  }
  res.json(location);
};

const create = async (req, res) => {
  try {
    const result = await Location.create(req.body);
    // add this place to the geocoder queue
    const geocoderQueue = new Queue("geocoder");
    geocoderQueue.add({
      location_id: result._id,
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to create location" });
  }
};

const update = async (req, res) => {
  if (!req?.params?.id) {
    res.status(400).json({ message: "ID parameter required." });
  }
  const location = await Location.findOne({ _id: req.params.id }).exec();
  if (!location) {
    return res
      .status(204)
      .json({ message: `No location matches ID ${req.params.id}` });
  }

  try {
    updatedLocation = await location.updateOne(req.body);
    res.json(updatedLocation);
  } catch (err) {
    res.status(500).json({ message: "Unable to update location." });
  }
};

const destroy = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }
  const location = await Location.findOne({ _id: req.params.id }).exec();
  if (!location) {
    return res
      .status(204)
      .json({ message: `No location matches ID ${req.params.id}` });
  }

  try {
    const result = await Location.deleteOne({ _id: req.params.id });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Unable to delete location" });
  }
};

module.exports = {
  index,
  show,
  create,
  update,
  destroy,
};
