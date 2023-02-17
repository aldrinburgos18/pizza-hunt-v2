const { Comment, Pizza } = require("../models");

const commentController = {
  //add a comment to pizza
  addComment({ params, body }, res) {
    Comment.create(body)
      .then(({ _id }) => {
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $push: { comments: _id } },
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this ID!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },
  //add comment reply
  addReply({ params, body }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $push: { replies: body } },
      { new: true }
    )
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this ID!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },

  //delete a comment
  removeComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
      .then((deletedComment) => {
        if (!deletedComment) {
          return res
            .status(404)
            .json({ message: "No comment found with this ID!" });
        }
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $pull: { comments: params.commentId } },
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this ID!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },
  //delete a comment reply
  removeReply({ params }, res) {
    console.log(params);
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $pull: { replies: { replyId: params.replyId } } },
      { new: true }
    )
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => res.json(err));
  },
};

module.exports = commentController;
