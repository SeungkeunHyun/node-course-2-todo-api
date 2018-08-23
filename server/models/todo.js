var mongoose = require('mongoose');
var Todo = mongoose.model("Todo", {
    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    _creator: {
        type: String,
        required: true
    }
});

module.exports = {
    Todo
};