const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    start_time: Date,
    end_time: Date,
    anytime: {
      type: Boolean,
      validate: {
        validator: function (v) {
          return v || (!!this.start_time && !!this.end_time);
        },
        message: "Start and End times required unless anytime is true.",
      },
    },
    website: String,
    location_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    category_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    photos: [{ type: String }],
  },

  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
