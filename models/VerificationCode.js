const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VerificationCodeSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 180, // 3분 뒤 DB에서 자동 삭제(TTL Index)
    },
});

module.exports = mongoose.model('VerificationCode', VerificationCodeSchema);