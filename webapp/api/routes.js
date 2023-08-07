/**
 * REST routes for uploading and processing images
 **/

const express = require("express");
const router = express.Router();

//Gallery management functions
// - list all galleries
// - add new gallery
// - remove gallery
// - calculate gallery AR.js entry

router.get("/gallery/list", (_req, res) => {
  res.send("List all galleries");
});
router.post("/gallery/add", (_req, res) => {
  res.send("Add a new gallery");
});
router.post("/gallery/remove", (_req, res) => {
  res.send("Remove a gallery");
});
router.post("/gallery/augment", (_req, res) => {
  res.send("Calculate AR.js mind file");
});


//Gallery Entry management functions
// - list all entries in a gallery
// - add gallery entry to this gallery
// - remove gallery entry from this gallery
//
// - add gallery entry attribute to this gallery entry
// - remove gallery entry attribute from this gallery entry
//
// - add image to this gallery entry
// - remove image from this gallery entry

router.get("/gallery-entry/list", (_req, res) => {
  res.send("List all entries in this gallery");
});
router.post("/gallery-entry/add", (_req, res) => {
  res.send("Add an entry to this gallery");
});
router.delete("/gallery-entry/remove", (_req, res) => {
  res.send("Remove an entry from this gallery");
});


router.post("/gallery-entry-attribute/add", (_req, res) => {
  res.send("Add an attribute to an entry in this gallery");
});
router.delete("/gallery-entry-attribute/remove", (_req, res) => {
  res.send("Remove an attribute to any entry in this gallery");
});


router.post("/gallery-entry-image/add", (_req, res) => {
  res.send("Add an image to this gallery entry");
});
router.delete("/gallery-entry-image/remove", (_req, res) => {
  res.send("Remove an entry from this gallery entry");
});


module.exports = router;
