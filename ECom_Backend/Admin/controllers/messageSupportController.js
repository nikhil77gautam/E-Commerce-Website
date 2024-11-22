import { MessageSupport } from "../models/messageSupportModel.js";

// Add a new support message
const addSupportMessage = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const newMessage = new MessageSupport({
      user: req.user.name,
      subject,
      message,
    });
    const savedMessage = await newMessage.save();
    res.status(201).json({ success: true, data: savedMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all support messages
const getAllSupportMessages = async (req, res) => {
  try {
    const messages = await MessageSupport.find();
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a specific support message by ID
const getSupportMessageById = async (req, res) => {
  try {
    const message = await MessageSupport.findById(req.params.id);
    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update message status
const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedMessage = await MessageSupport.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedMessage) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }
    res.status(200).json({ success: true, data: updatedMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a support message
const deleteSupportMessage = async (req, res) => {
  try {
    const deletedMessage = await MessageSupport.findByIdAndDelete(
      req.params.id
    );
    if (!deletedMessage) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export {
  addSupportMessage,
  getAllSupportMessages,
  getSupportMessageById,
  updateMessageStatus,
  deleteSupportMessage,
};
