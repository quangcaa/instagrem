const Conversation = require("../mongo_models/Conversation");
const Message = require("../mongo_models/Message");
const { getRecipientSocketId, io } = require("../socket/socket.js");

const { sequelize, User } = require("../mysql_models");

class DirectController {
  // [GET] /direct/inbox
  // @desc Retrieve inbox
  // @access Private
  async retrieveInbox(req, res) {
    const current_user = req.user.user_id;

    try {
      const conversations = await Conversation.find({
        participants: { $in: [current_user] },
      });

      if (!conversations) {
        return res.json({ message: "No inbox found" });
      }

      const inbox = await Promise.all(
        conversations.map(async (conversation) => {
          const partner_id = conversation.participants.filter(
            (participant) => participant.toString() !== current_user.toString()
          );

          const user = await User.findOne({
            where: { user_id: partner_id },
          });

          const lastMessage = await Message.findOne({
            _id: conversation.lastMessage_id,
          }).sort({ createdAt: -1 });

          return {
            conversation: {
              ...conversation.toObject(),
              participants: partner_id,
            },
            user: {
              user_id: user.user_id,
              username: user.username,
              profile_image_url: user.profile_image_url,
            },
            lastMessage: {
              text: lastMessage.text,
              createdAt: lastMessage.createdAt,
              sender_id: lastMessage.sender_id,
            },
          };
        })
      );

      res.status(200).json(inbox);
    } catch (error) {
      console.error(
        "Error retrieveInbox function in DirectController: ",
        error
      );
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // [GET] /direct/c/:partner_id
  // @desc get message
  // @access Private
  async getMessage(req, res) {
    const { partner_id: receiver_id } = req.params;
    const sender_id = req.user.user_id;

    try {
      const conversation = await Conversation.findOne({
        participants: { $all: [sender_id, receiver_id] },
      });

      if (!conversation) {
        return res
          .status(404)
          .json({ success: false, error: "Conversation not found" });
      }

      const messages = await Message.find({
        conversation_id: conversation._id,
      }).sort({ createdAt: 1 });

      res.json({ success: true, messages });
    } catch (error) {
      console.error("Error getMessage function in DirectController: ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // [POST] /direct/u/:user_id
  // @desc send message
  // @access Private
  async sendMessage(req, res) {
    const { user_id: receiver_id } = req.params;
    const { text } = req.body;
    const sender_id = req.user.user_id;

    try {
      // check if receiver_id exists
      const checkUser = await User.findOne({ where: { user_id: receiver_id } });
      if (!checkUser) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }

      // check if conversation exist, if not create one
      let conversation = await Conversation.findOne({
        participants: { $all: [sender_id, receiver_id] },
      });

      if (!conversation) {
        conversation = new Conversation({
          participants: [sender_id, receiver_id],
        });
        await conversation.save();
      }

      // create message
      const newMessage = new Message({
        conversation_id: conversation._id,
        sender_id,
        receiver_id,
        text,
      });

      // save message and update lastMessage_id in conversation
      await Promise.all([
        newMessage.save(),
        conversation.updateOne({ lastMessage_id: newMessage._id }),
      ]);

      const recipientSocketId = getRecipientSocketId(receiver_id);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("newMessage", newMessage);
      }

      res.status(201).json({
        success: true,
        message: "Sent message ! ! !",
        message: newMessage,
      });
    } catch (error) {
      console.error("Error sendMessage function in DirectController: ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new DirectController();
