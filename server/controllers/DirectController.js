const Conversation = require('../mongo_models/Conversation')
const Message = require('../mongo_models/Message')

const { sequelize, User } = require('../mysql_models')

class DirectController {

    // [GET] /direct/inbox
    // @desc Retrieve inbox
    // @access Private
    async retrieveInbox(req, res) {
        const current_user = req.user.user_id

        try {
            const conversations = await Conversation.find({ participants: current_user }).sort({ updatedAt: -1 })

            if (!conversations) {
                return res.json({ message: 'No inbox found' })
            }

            res.status(200).json({ success: true, message: 'Found inbox !', inbox: conversations })
        } catch (error) {
            console.error('Error retrieveInbox function in DirectController: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }


    // [GET] /direct/c/:partner_id
    // @desc get message 
    // @access Private
    async getMessage(req, res) {
        const { partner_id: receiver_id } = req.params
        const sender_id = req.user.user_id

        try {
            const conversation = await Conversation.findOne({ participants: { $all: [sender_id, receiver_id] } })

            if (!conversation) {
                return res.status(404).json({ success: false, message: 'Conversation not found' })
            }

            const messages = await Message.find({ conversation_id: conversation.conversation_id }).sort({ createdAt: -1 })

            res.json({ success: true, messages })
        } catch (error) {
            console.error('Error getMessage function in DirectController: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }


    // [POST] /direct/u/:user_id
    // @desc send message
    // @access Private
    async sendMessage(req, res) {
        const { user_id: receiver_id } = req.params
        const { message } = req.body
        const sender_id = req.user.user_id

        try {
            // check if receiver_id exists
            const checkUser = await User.findOne({ where: { user_id: receiver_id } })

            if (!checkUser) {
                return res.status(404).json({ success: false, error: 'User not found' })
            }

            // check if conversation exist , if not create one
            let conversation = await Conversation.findOne({ participants: { $all: [sender_id, receiver_id] } })

            if (!conversation) {
                conversation = await Conversation.create({ participants: [sender_id, receiver_id] })
            }

            // send message
            const newMessage = new Message({
                conversation_id: conversation.conversation_id,
                sender_id,
                receiver_id,
                message,
            })

            if (newMessage) {
                newMessage.save()
                conversation.lastMessage_id = newMessage._id
            }

            res.json({
                success: true, message: 'Sent message !',
                conversation,
                message: newMessage,
            })
        } catch (error) {
            console.error('Error sendMessage function in DirectController: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
}

module.exports = new DirectController()