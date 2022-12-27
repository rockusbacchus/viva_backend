const Category = require("../model/Category");

const index = async (req, res) => {
  const categories = await Category.find();
  if (!categories) {
    res.status(204).json({ message: "No cateogories found." });
  }
  res.json(categories);
};

const show = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }
  const category = await Category.findOne({ _id: req.params.id });
  if (!category) {
    return res
      .status(204)
      .json({ message: `No category matches ID ${req.params.id}` });
  }
  res.json(category);
};

const create = async (req, res) => {
  const { categoryName, description } = req.body;
  if (!categoryName || !description) {
    return res
      .status(400)
      .json({ message: "Name and description are both required." });
  }

  // check for duplicate email addresses in the database
  const duplicate = await Category.findOne({ categoryName }).exec();

  if (duplicate) return res.sendStatus(409);
  try {
    const result = await Category.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "unable to create category" });
  }
};

const update = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }
  const category = await Category.findOne({ _id: req.params.id }).exec();
  if (!category) {
    return res
      .status(204)
      .json({ message: `No category matches ID ${req.params.id}` });
  }
  try {
    updatedCategory = await category.updateOne(req.body);
    console.log(JSON.stringify(updatedCategory));
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ message: "Unable to update cateogory." });
  }
};

const destroy = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }
  const category = await Category.findOne({ _id: req.params.id }).exec();
  if (!category) {
    return res
      .status(204)
      .json({ message: `No category matches ID ${req.params.id}` });
  }

  try {
    console.log(`voiding category ${req.params.id}`);
    const result = await Category.updateOne(
      { _id: req.params.id },
      { void: true }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Unable to delete category" });
  }
};

module.exports = {
  index,
  show,
  create,
  update,
  destroy,
};
