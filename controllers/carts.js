import { cartModel } from "../models/cart.js";
import { MealkitModel } from "../models/mealkit.js";
import {
  addMealkitToCartValidator,
  updateMealkitCartValidator,
} from "../validators/carts.js";

export const addMealkitToCart = async (req, res) => {
  const { error, value } = addMealkitToCartValidator.validate(req.body);
  if (error) {
    return res.status(422).json(error);
  }

  const mealkit = await MealkitModel.findById(req.params.id);
  if (!mealkit) {
    return res.status(404).json({ message: "Mealkit not found" });
  }

  const availableStock = mealkit.quantity;

  if (availableStock === 0) {
    return res
      .status(409)
      .json({ message: "This mealkit is currently out of stock." });
  }

  let cart = await cartModel.findOne({ userId: req.auth.id });
  if (!cart) {
    cart = await cartModel.create({ userId: req.auth.id, items: [] });
  }

  let itemFound = false;
  let existingQuantity = 0;

  for (let i = 0; i < cart.items.length; i++) {
    if (cart.items[i].mealkit.toString() === req.params.id) {
      existingQuantity = cart.items[i].quantity;
      const quantity = req.body.quantity;

      if (existingQuantity + quantity > availableStock) {
        const message =
          availableStock <= 10
            ? `Only ${availableStock} items left in stock. Please update your cart.`
            : `You can't add more than the available stock. Please reduce the quantity.`;

        return res.status(409).json({ message });
      }

      cart.items[i].quantity += quantity;
      cart.items[i].total = cart.items[i].quantity * cart.items[i].price;
      itemFound = true;
      break;
    }
  }
  const quantity = req.body.quantity;
  if (!itemFound) {
    if (quantity > availableStock) {
      const message =
        availableStock <= 10
          ? `Only ${availableStock} items left in stock. Please update your cart.`
          : `You can't add more than the available stock. Please reduce the quantity.`;

      return res.status(409).json({ message });
    }

    cart.items.push({
      mealkit: req.params.id,
      price: mealkit.price,
      quantity,
      total: mealkit.price * quantity,
    });
  }

  // Recalculate total cart price
  cart.totalPrice = cart.items.reduce((sum, item) => sum + item.total, 0);
  await cart.save();

  const populatedCart = await cartModel
    .findOne({ _id: cart._id })
    .populate("items.mealkit", "title"); // just populating the title

  return res.status(200).json({
    message: "Cart updated successfully",
    cart: {
      userId: populatedCart.userId,
      items: populatedCart.items.map((item) => ({
        _id: item._id,
        mealkit: item.mealkit._id,
        title: item.mealkit.title,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
    },
  });
};
export const getAllMealkitCarts = async (req, res) => {
  try {
    // Find all carts for the current user
    const mealkitCarts = await cartModel
      .find({ userId: req.auth.id })
      .populate("items.mealkit", "title");

    // Calculate subtotal
    let subtotal = 0;
    for (let i = 0; i < mealkitCarts.length; i++) {
      for (let j = 0; j < mealkitCarts[i].items.length; j++) {
        subtotal += mealkitCarts[i].items[j].total;
      }
    }

    res.status(200).json({
      message: "Carts fetched successfully.",
      mealkitCarts,
      subtotal,
    });
  } catch (error) {
    console.error("Error fetching carts:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateMealkitCart = async (req, res) => {
  const { error, value } = updateMealkitCartValidator.validate(req.body);
  if (error) {
    return res.status(422).json(error);
  }
  try {
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    const cart = await cartModel.findOne({ userId: req.auth.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    let itemIndex = -1;
    for (let i = 0; i < cart.items.length; i++) {
      if (cart.items[i].mealkit.toString() === req.params.id) {
        itemIndex = i;
        break;
      }
    }

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const mealkit = await MealkitModel.findById(req.params.id);
    if (!mealkit) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (quantity > mealkit.quantity) {
      return res
        .status(409)
        .json({ message: "Cannot set quantity greater than available stock" });
    }

    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].total = cart.items[itemIndex].price * quantity;

    // Recalculate totalPrice of the whole cart
    cart.totalPrice = 0;
    for (let i = 0; i < cart.items.length; i++) {
      cart.totalPrice += cart.items[i].total;
    }

    await cart.save();
    return res.status(200).json({
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};

export const deleteMealkitCart = async (req, res) => {
  try {
    const cart = await cartModel.findOne({ userId: req.auth.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    let itemIndex = -1;

    for (let i = 0; i < cart.items.length; i++) {
      if (cart.items[i].mealkit.toString() === req.params.id) {
        itemIndex = i;
        break;
      }
    }

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items.splice(itemIndex, 1); // remove the item

    // Recalculate totalPrice using for loop
    cart.totalPrice = 0;
    for (let i = 0; i < cart.items.length; i++) {
      cart.totalPrice += cart.items[i].total;
    }

    await cart.save();

    return res.status(200).json({ message: "Mealkit removed from cart", cart });
  } catch (error) {
    console.error("Error deleting mealkit cart item:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};
