const Activity = require("../model/Activity");

const index = async (req, res) => {
  const activities = await Activity.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category_id",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $lookup: {
        from: "locations",
        localField: "location_id",
        foreignField: "_id",
        as: "location",
      },
    },
  ]);
  if (!activities)
    return res.status(204).json({ message: "No activities found." });
  res.json(activities);
};

const create = async (req, res) => {
  try {
    const result = await Activity.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to create activity" });
  }
};

const update = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }
  const activity = await Activity.findOne({ _id: req.params.id }).exec();
  if (!activity) {
    return res
      .status(204)
      .json({ message: `No activity matches ID ${req.params.id}` });
  }
  try {
    const updatedActivity = await activity.updateOne(req.body);
    res.json(updatedActivity);
  } catch (err) {
    res.status(500).json({ message: "Unable to update document." });
  }
};

const destroy = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }
  const activity = await Activity.findOne({ _id: req.params.id }).exec();
  if (!activity) {
    return res
      .status(204)
      .json({ message: `No activity matches ID ${req.params.id}` });
  }
  try {
    const result = await Activity.deleteOne({ _id: req.params.id });
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: "Unable to delete document." });
  }
};

const show = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }
  const activity = await Activity.findOne({ _id: req.params.id });
  if (!activity) {
    return res.status(204);
  } else {
    console.log(JSON.stringify(activity));
  }
  res.json(activity);
};

module.exports = {
  index,
  create,
  update,
  destroy,
  show,
};
