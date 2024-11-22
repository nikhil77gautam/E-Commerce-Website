import Order from "../../User/models/orderModel.js";

const adminGetAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    console.log(orders);

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
    console.error("Error fetching orders:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Admin Get Orders by Status
const adminGetOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    if (!["pending", "processing", "shipped", "delivered"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }
    const orders = await Order.find({ status });
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin Update Order Status
const adminUpdateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log(id);
    console.log(status);

    // Update the order status
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    // Check if the order was found and updated
    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Respond with success and the updated order
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (err) {
    // Log the error and respond with a server error
    console.error("Error updating order status:", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { adminGetAllOrders, adminGetOrdersByStatus, adminUpdateOrderStatus };
