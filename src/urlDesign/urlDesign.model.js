const mongoose = require('mongoose');

const { Schema } = mongoose;
const aboutSchema = new Schema(
  {
    _id: false,
    text: { type: String, required: true }
  }
);
const socialSchema = new Schema(
  {
    _id: false,
    networkName: { type: String, required: true },
    url: { type: String, required: true }
  }
);
const testimonialSchema = new Schema(
  { 
    _id: false,
    rating: { type: Number },
    comment: { type: String, required: true },
    userPhoto: { type: Schema.Types.ObjectId, ref: 'userFile', index: true},
    fullName: { type: String, required: true },
    title: { type: String, required: true },
  }
)
const linkSchema = new Schema(
  {
    _id: false,
    title: { type: String, required: true },
    url: { type: String, required: true }
  }
)
const customCTASchema = new Schema(
  {
    _id: false,
    buttonText: {type: String, required: true },
    buttonLink: {type: String, required: true }
  }
)
const infoSchema = new Schema(
  {
    _id: false,
    phoneNumber: { type: String },
    email: { type: String },
    calendar: { type: String },
    location: { type: String },
    website: { type: String },
    links: [linkSchema],
  }
)
const appStoreSchema = new Schema(
  {
  _id: false,
  storeName: { type: String, required: true },
  storeLink: { type: String, required: true }
  }
)
const contactFormfieldSchema = new Schema(
  {
    _id: false,
    fieldName: { type: String, required: true},
    fieldType: { type: String, required: true},
    isRequired: { type: Boolean, required: true}
  }
)
const contactFormSchema = new Schema(
  {
    _id: false,
    contactMail: { type: String, required: true},
    fields: [contactFormfieldSchema]
  }
)
const videoSchema = new Schema(
  {
    _id: false,
    file:{ type: Schema.Types.ObjectId, ref: 'userFile', index:true},
    videoUrl: { type: String }
  }
)
const urlDesignSchema = new Schema(
  {
    userId: { type: String },
    info: infoSchema,
    aboutMe: aboutSchema,
    socialNetworks: [socialSchema],
    video: videoSchema,
    images: [{type: Schema.Types.ObjectId, ref: 'userFile', index: true }],
    testimonials: [testimonialSchema],
    customCTA: customCTASchema,
    appStores: [appStoreSchema],
    contactForm: contactFormSchema
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

const UrlDesign = mongoose.model('urlDesign', urlDesignSchema);
module.exports = UrlDesign;
