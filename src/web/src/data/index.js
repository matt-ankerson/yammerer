import axios from 'axios'

const transformToTree = function(comments) {
    var nodes = {};
    return comments.filter(function (comment) {
      comment.parent = comment.parents.length > 0 ? comment.parents[0] : undefined
      comment.id = comment._id
      delete comment.parents
      delete comment._id
      delete comment.children
      let id = comment.id,
        parentId = comment.parent
      nodes[id] = Object.assign(comment, nodes[id], {
        replies: []
      })
      parentId && (nodes[parentId] = (nodes[parentId] || {
        replies: []
      })).replies.push(comment);

      return !parentId;
    });
  }

export default {
  async getUsers() {
    let response = await axios.get('http://localhost:9000/users')
    return response.data.map(u => {
      return {
        id: u._id,
        name: u.name,
        avatar: u.avatar
      }
    })
  },
  async getPosts() {
    let response = await axios.get('http://localhost:9000/posts/latest')
    
    response.data.forEach((doc) => {
      doc.message = transformToTree(doc.comments)[0]
      doc.id = doc._id
      delete doc._id
      delete doc.__v
      delete doc.comments
    });
    console.log(JSON.stringify(response.data))
    return response.data
  },
  async sendMessage(documentId, postId, content, userId) {
    let response = await axios.post('http://localhost:9000/posts/', {
      documentId: documentId,
      postId: postId,
      userId: userId,
      content: content
    })
    return response.data
  },
  async update(documentId, postId, content, userId) {
    await axios.put('http://localhost:9000/posts/' + documentId + '/' + postId, {
      userId: userId,
      content: content
    })
  },
  async remove(documentId, postId, userId) {
    await axios.delete('http://localhost:9000/posts/' + documentId + '/' + postId + '/' + userId)
  },
  async like(documentId, postId, userId) {
    await axios.put('http://localhost:9000/posts/' + documentId + '/' + postId + '/like', {
      userId: userId
    })
  },
  async unlike(documentId, postId, userId) {
    await axios.put('http://localhost:9000/posts/' + documentId + '/' + postId + '/unlike', {
      userId: userId
    })
  },
  getChannel(data) {
    let message = data.comments[0]
    return {
      id: data._id,
      postedBy: data.postedBy,
      message: {
        content: message.content,
        id: message._id,
        postedBy: message.postedBy,
        createdAt: message.createdAt,
        likes: [],
        replies: []
      }
    };
  },
  getReply(data) {
    let message = data.comments[0]
    return {
      content: message.content,
      id: message._id,
      postedBy: message.postedBy,
      createdAt: message.createdAt,
      likes: [],
      replies: []
    }
  }
}
