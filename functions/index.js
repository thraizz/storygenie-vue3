const admin = require("firebase-admin");

admin.initializeApp();

exports.generatestory = require("./generateStory").generateStory;

// New function for regenerating stories
exports.regeneratestory = require("./regenerateStory").regenerateStory;

// Initialize default data for new users
exports.usercreationhook = require("./createUserHook").createUserHook;

// Check if user exists already when adding a collaborator
exports.addcollaboratorhook = require("./addCollaboratorHook").addCollaborator;

exports.removecollaboratorhook =
  require("./removeCollaboratorHook").removeCollaboratorFromProduct;

exports.removeuserhook = require("./removeUserHook").removeUserHook;
