import Order from "../../User/models/orderModel.js";
import Cart from "../../User/models/cartModel.js";
import Income from "../../Admin/models/incomeModel.js";

// Get All Orders for a User
const userAllOrders = async (req, res) => {
  try {
    console.log(req.params);
    const { userId } = req.params;
    const orders = await Order.find({ user: userId }).populate({
      path: "cartProducts.product",
      model: "ECom-Product",
    });

    // console.log(orders);

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Place an Order
const placeOrder = async (req, res) => {
  const { userId, cartId, name, email, mobile, shippingAddress } = req.body;
  // console.log(req.body);

console.log(req.body)

  // Validate input
  if (
    !userId ||
    !cartId ||
    !name ||
    !email ||
    !mobile ||
    !shippingAddress ||
    !shippingAddress.street ||
    !shippingAddress.city ||
    !shippingAddress.state ||
    !shippingAddress.country ||
    !shippingAddress.postalCode
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields and complete shipping address are required",
    });
  }

  try {
    // Fetch the cart and calculate totalAmount in a single iteration
    const cart = await Cart.findById(cartId).populate("products.product");

console.log(cart)

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Calculate totalAmount and prepare cartProducts for order
    let totalAmount = 0;
    const cartProducts = cart.products.map((item) => {
      const productPrice = item.product.price * item.quantity;
      totalAmount += productPrice;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      };
    });

    // Create and save a new order
    const newOrder = await Order.create({
      user: userId,
      cartId,
      name,
      email,
      mobile,
      shippingAddress,
      cartProducts,
      totalAmount,
    });

    // Update income in a single query
    const adminIncome = new Income({
      userId: userId,
      type: "shopping",
      totalAmount: totalAmount,
    });

    adminIncome.save();

    // Clear the cart in a single query
    await Cart.findByIdAndDelete(cartId);

    // Populate and return the newly created order
    const populatedOrder = await Order.findById(newOrder._id).populate(
      "cartProducts.product",
      "name price"
    );
    console.log(populatedOrder);
    console.log(adminIncome);
    console.log(newOrder);
    // Respond with success
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (err) {
    console.error("Error placing order:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export { userAllOrders, placeOrder };
