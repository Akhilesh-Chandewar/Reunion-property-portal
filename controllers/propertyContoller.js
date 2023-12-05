import Property from "../models/properyModel.js";
import { errorHandler } from "../utils/errorHandler.js";

export const createProperty = async (req, res, next) => {
  try {
    const property = await Property.create({
      ...req.body,
      userRef : req.user.id
    });
    console.log(property);
    return res.status(201).json(property);
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return next(errorHandler(404, "Property not found!"));
  }

  if (req.user.id !== property.userRef) {
    return next(errorHandler(401, "You can only delete your own Propertys!"));
  }

  try {
    await Property.findByIdAndDelete(req.params.id);
    res.status(200).json("Property has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  if (!Property) {
    return next(errorHandler(404, "Property not found!"));
  }
  if (req.user.id !== property.userRef) {
    return next(errorHandler(401, "You can only update your own Propertys!"));
  }

  try {
    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedProperty);
  } catch (error) {
    next(error);
  }
};

export const getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!Property) {
      return next(errorHandler(404, "Property not found!"));
    }
    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};

export const getProperties = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";
    const searchTerm = req.query.searchTerm || "";
    const properties = await Property.find({
      name: { $regex: searchTerm, $options: "i" },
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    return res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};