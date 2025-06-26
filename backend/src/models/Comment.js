const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  news: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'News', 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  text: { 
    type: String, 
    required: true,
    maxlength: 1000 // Prevent excessively long comments
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  replies: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment' 
  }],
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  dislikes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  flags: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }]
}, {
  timestamps: true,
});

// Add compound index to prevent duplicate comments
commentSchema.index(
  { 
    news: 1, 
    user: 1, 
    text: 1, 
    parentComment: 1 
  }, 
  { 
    unique: true,
    partialFilterExpression: {
      parentComment: { $exists: true }
    }
  }
);

module.exports = mongoose.model('Comment', commentSchema);