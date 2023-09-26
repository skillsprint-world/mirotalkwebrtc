'use strict';

const crypto = require('crypto');
const Room = require('../models/room');

function getUUID4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (c ^ (crypto.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16),
    );
}

async function roomCreate(req, res) {
    try {
        const {  type, hostUserID, clientUserID, startDateTime, endDateTime, status,timeZone } = req.body;
        const data = new Room({
            type: type,
            roomNm: getUUID4(),
            hostUserID: hostUserID,
            clientUserID: clientUserID,
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            timeZone: timeZone,
            status: status
        });
        
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        console.error('Room create error', error);
        res.status(400).json({ message: error.message });
    }
}

async function getUserRole(req, res) {
    try {
        const { roomNm, userId } = req.body;
        const data = await Room.find({ roomNm: roomNm }); //, status: "scheduled" 
        // res.json(req.body.userId );
        if (data.length === 0) {
            console.error('Room Does Not Exist');
            res.json('Please check the Meeting Link');
            res.status(404);
        } else {
            const room = data[0];
            // res.json(data);
            if (room.hostUserID.includes(userId)) {
                // user_id is part of host
                res.json({'Allowed':true , role: 'host' });
            } else if (room.clientUserID.includes(userId)) {
                // user_id is part of client
                res.json({ 'Allowed':true , role: 'client' });
            } else {
                // user_id isn't part of host or client
                console.error('Not authorized to enter the meeting');
                res.status(401).json({ 'Allowed':false , message: 'Unauthorized' });
            }
        }
    } catch (error) {
        console.error('Room findById error', error);
        res.status(400).json({ 'Allowed':false ,message: error.message });
    }
}

async function roomFindBy(req, res) {
    try {
        const data = await Room.find({ _id: req.params._id });
        res.json(data);
    } catch (error) {
        console.error('Room findByObjectId error', error);
        res.status(400).json({ message: error.message });
    }
}

// async function roomDeleteFindBy(req, res) {
//     try {
//         const data = await Room.deleteMany({ userId: req.params.userId });
//         console.log('deleAllRooms data', data);
//         data.deletedCount > 0
//             ? res.json({ message: `${data.deletedCount} documents has been deleted` })
//             : res.json({ message: 'No documents found' });
//     } catch (error) {
//         console.error('Room findByUserId delete error', error);
//         res.status(400).json({ message: error.message });
//     }
// }

async function roomGet(req, res) {
    try {
        const data = await Room.findById(req.params.id);
        res.json(data);
    } catch (error) {
        console.error('Room findById error', error);
        res.status(400).json({ message: error.message });
    }
}

async function roomUpdate(req, res) {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };
        const result = await Room.findByIdAndUpdate(id, updatedData, options);
        res.send(result);
    } catch (error) {
        console.error('Room update error', error);
        res.status(400).json({ message: error.message });
    }
}

// async function roomDelete(req, res) {
//     try {
//         const id = req.params.id;
//         const data = await Room.findByIdAndDelete(id);
//         res.json({ message: `Document with ${data._id} has been deleted` });
//     } catch (error) {
//         console.error('Room delete error', error);
//         res.status(400).json({ message: error.message });
//     }
// }

// async function roomDeleteALL(req, res) {
//     return res.json({ message: '⚠️ Route disabled' });
//     try {
//         const data = await Room.deleteMany();
//         data.deletedCount > 0
//             ? res.json({ message: `${data.deletedCount} documents has been deleted` })
//             : res.json({ message: 'No documents found' });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// }

module.exports = {
    roomCreate,
    roomFindBy,
    // roomDeleteFindBy,
    roomGet,
    roomUpdate,
    // roomDelete,
    // roomDeleteALL,
    getUserRole,
};
