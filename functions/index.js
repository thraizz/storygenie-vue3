const admin = require("firebase-admin");

admin.initializeApp();

exports.generatestory = require("./generateStory").generateStory;

// Initialize default data for new users
exports.usercreationhook = require("./createUserHook").createUserHook;

// Check if user exists already when adding a collaborator
exports.addcollaboratorhook = require("./addCollaboratorHook").addCollaborator;

exports.removecollaboratorhook =
  require("./removeCollaboratorHook").removeCollaboratorFromProduct;
