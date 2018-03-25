const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	from: { type: Schema.Types.ObjectId, ref: 'User' },
	to: { type: Schema.Types.ObjectId, ref: 'User' },
	room: String,
	message: String,
	created: { type: Date, default:Date.now }
});

module.exports = mongoose.model('Messages', MessageSchema);