'use-strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    type: { type: String, required: true, enum: ["1:1", "MultiMeet", "EchoEvent"] },
    roomNm: { type: String, required: true },
    hostUserID: [
      { type: String, required: true },
    ],
    clientUserID: [
      { type: String, required: true },
    ],
    startDateTime: { type: String, required: true },
    endDateTime: { type: String, required: true },
    timeZone: { type: String, required: true },
    status: { type: String, required: true },
});



module.exports = mongoose.model('Room', roomSchema);

// const roomSchema = new mongoose.Schema({
//     room: { type: String },
//     type: { type: String, enum: ['P2P', 'SFU', 'C2C', 'BRO'] },
//     hostUserID: [{ type: String, required: true, ref: 'creatorPublicSchema' }],
//     clientUserID: [{ type: String, required: true, ref: 'consumerSchema' }],
//     startDateTime: { type: String, required: true },
//     endDateTime: { type: String, required: true },
//     status: { type: String, required: true },
// });
