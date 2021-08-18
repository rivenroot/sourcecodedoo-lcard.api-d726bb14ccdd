const Joi = require('joi');
const UrlDesign = require('./urlDesign.model');

// Validate urlDesign schema
const infoSchema = Joi.object().keys({
  phoneNumber: Joi.string().allow(''),
  email: Joi.string().allow(''),
  calendar: Joi.string().allow(''),
  location: Joi.string().allow(''),
  website: Joi.string().allow(''),
  links: Joi.array().items(
    Joi.object().keys({
      title: Joi.string(),
      url: Joi.string(),
    }),
  )
});
const aboutMeSchema = Joi.object().keys({
  text: Joi.string().required()
})
const socialLinksSchema = Joi.array().items(
  Joi.object().keys({
    networkName: Joi.string().required(),
    url: Joi.string().required()
  })
)
const appStoresSchema = Joi.array().items(
  Joi.object().keys({
    storeName: Joi.string().required(),
    storeLink: Joi.string().required()
  })
)
const videoSchema = Joi.object().keys({
  actionType: Joi.string().required(),
  file: Joi.string().allow(''),
  videoUrl: Joi.string().allow()
})
const imagesSchema = Joi.array().items(
  Joi.string().required()
)
const testimonialsSchema = Joi.array().items(
  Joi.object().keys({
    rating: Joi.number(),
    comment: Joi.string().required(),
    userPhoto: Joi.object(),
    fullName: Joi.string().required(),
    title: Joi.string().required(),
  })
);
const ctaSchema = Joi.object().keys({
  buttonText: Joi.string().required(),
  buttonLink: Joi.string().required()
});
const contactFormSchema = Joi.object().keys({
  contactMail: Joi.string().required(),
  fields: Joi.array().items(
    Joi.object().keys({
      fieldName: Joi.string().required(),
      fieldType: Joi.string().required(),
      isRequired: Joi.boolean().required()
    })
  )
});
exports.GetUrlDesign = async (req, res) => {
  try {
    const { id } = req.decoded;
    await UrlDesign.findOne({ userId: id }).populate('images').populate('testimonials.userPhoto').populate('video.file').exec(function (err, urlDesign) {
      if (err) {
        return res.status(500).json({
          error: true,
          message: err.message
        });
      }
      return res.status(200).json({
        success: true,
        data: urlDesign
      });
    });


  } catch (error) {
    console.error('url-design-error', error);
    return res.status(500).json({
      error: true,
      message: 'Cannot get Card design for a user!',
    });
  }
}
exports.AddInfo = async (req, res) => {
  try {
    const result = infoSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    const { id } = req.decoded;
    let urlDesign = await UrlDesign.findOne({ userId: id });

    if (!urlDesign) {
      urlDesign = new UrlDesign();
      urlDesign = {
        ...urlDesign,
        userId: id,
        info: result.value
      };
      await UrlDesign.create(urlDesign, function (err, doc) {
        if (doc) {
          doc.populate('images').populate('testimonials.userPhoto').populate('video.file').execPopulate().then(function (dc, rej) {
            return res.status(200).json({
              success: true,
              message: 'Info added.',
              data: dc
            });
          });

        } else {
          return res.status(500).json({
            error: true,
            message: err.message
          })
        }
      });
    } else {
      await UrlDesign.updateOne({ _id: urlDesign._id }, { info: result.value }, function (err, upd) {
        if (upd) {
          UrlDesign.findById(urlDesign._id).populate('images').populate('testimonials.userPhoto').populate('video.file').exec(function (e, d) {
            if (d) {
              return res.status(200).json({
                success: true,
                message: 'Info updated.',
                data: d
              });
            }
          })
        } else {
          return res.status(500).json({
            error: true,
            message: err.message,
          });
        }
      })

    }
  } catch (error) {
    console.error('url-design-error', error);
    return res.status(500).json({
      error: true,
      message: 'Cannot Add/Update Info',
    });
  }
};
exports.AddAboutMe = async (req, res) => {
  try {
    const result = aboutMeSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    const { id } = req.decoded;

    let urlDesign = await UrlDesign.findOne({ userId: id });

    if (!urlDesign) {
      urlDesign = new UrlDesign();
      urlDesign = {
        ...urlDesign,
        userId: id,
        aboutMe: result.value
      }
      await UrlDesign.create(urlDesign, function (err, doc) {
        if (doc) {
          doc.populate('images').populate('testimonials.userPhoto').populate('video.file').execPopulate().then(function (dc, rej) {
            return res.status(200).json({
              success: true,
              message: 'About Me added.',
              data: dc
            });
          });

        } else {
          return res.status(500).json({
            error: true,
            message: err.message
          })
        }
      });
    } else {
      await UrlDesign.updateOne({ _id: urlDesign._id }, { aboutMe: result.value }, function (err, upd) {
        if (upd) {
          UrlDesign.findById(urlDesign._id).populate('images').populate('testimonials.userPhoto').populate('video.file').exec(function (e, d) {
            if (d) {
              return res.status(200).json({
                success: true,
                message: 'About Me updated.',
                data: d
              });
            }
          })
        } else {
          return res.status(500).json({
            error: true,
            message: err.message,
          });
        }
      })
    }
  } catch (error) {
    console.error('url-design-error', error);
    return res.status(500).json({
      error: true,
      message: 'Cannot Add/Update About Me',
    });
  }
};
exports.AddSocialLinks = async (req, res) => {
  try {
    const result = socialLinksSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    const { id } = req.decoded;

    let urlDesign = await UrlDesign.findOne({ userId: id });

    if (!urlDesign) {
      urlDesign = new UrlDesign();
      urlDesign = {
        ...urlDesign,
        userId: id,
        socialNetworks: result.value
      }
      await UrlDesign.create(urlDesign, function (err, doc) {
        if (doc) {
          doc.populate('images').populate('testimonials.userPhoto').populate('video.file').execPopulate().then(function (dc, rej) {
            return res.status(200).json({
              success: true,
              message: 'Social networks added.',
              data: dc
            });
          });

        } else {
          return res.status(500).json({
            error: true,
            message: err.message
          })
        }
      });
    } else {
      await UrlDesign.updateOne({ _id: urlDesign._id }, { socialNetworks: result.value }, function (err, upd) {
        if (upd) {
          UrlDesign.findById(urlDesign._id).populate('images').populate('testimonials.userPhoto').populate('video.file').exec(function (e, d) {
            if (d) {
              return res.status(200).json({
                success: true,
                message: 'Social Links updated.',
                data: d
              });
            }
          })
        } else {
          return res.status(500).json({
            error: true,
            message: err.message,
          });
        }
      })
    }
  } catch (error) {
    console.error('url-design-error', error);
    return res.status(500).json({
      error: true,
      message: 'Cannot Add/Update Social links',
    });
  }
};
exports.AddAppStores = async (req, res) => {
  try {
    const result = appStoresSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    const { id } = req.decoded;

    let urlDesign = await UrlDesign.findOne({ userId: id });

    if (!urlDesign) {
      urlDesign = new UrlDesign();
      urlDesign = {
        ...urlDesign,
        userId: id,
        appStores: result.value
      }
      await UrlDesign.create(urlDesign, function (err, doc) {
        if (doc) {
          doc.populate('images').populate('testimonials.userPhoto').populate('video.file').execPopulate().then(function (dc, rej) {
            return res.status(200).json({
              success: true,
              message: 'App stores added.',
              data: dc
            });
          });

        } else {
          return res.status(500).json({
            error: true,
            message: err.message
          })
        }
      });
    } else {
      await UrlDesign.updateOne({ _id: urlDesign._id }, { appStores: result.value }, function (err, upd) {
        if (upd) {
          UrlDesign.findById(urlDesign._id).populate('images').populate('testimonials.userPhoto').populate('video.file').exec(function (e, d) {
            if (d) {
              return res.status(200).json({
                success: true,
                message: 'App Stores updated.',
                data: d
              });
            }
          })
        } else {
          return res.status(500).json({
            error: true,
            message: err.message,
          });
        }
      })
    }
  } catch (error) {
    console.error('url-design-error', error);
    return res.status(500).json({
      error: true,
      message: 'Cannot Add/Update AppStores',
    });
  }
};
exports.AddVideo = async (req, res) => {
  try {
    const result = videoSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    const { id } = req.decoded;
    let urlDesign = await UrlDesign.findOne({ userId: id });

    if (!urlDesign) {
      urlDesign = new UrlDesign();
      urlDesign = {
        ...urlDesign,
        userId: id,
        video: result.value
      }
      await UrlDesign.create(urlDesign, function (err, doc) {
        if (doc) {
          doc.populate('images').populate('testimonials.userPhoto').populate('video.file').execPopulate().then(function (dc, rej) {
            return res.status(200).json({
              success: true,
              message: 'Video added.',
              data: dc
            });
          });

        } else {
          return res.status(500).json({
            error: true,
            message: err.message
          })
        }
      });
    } else {
      await UrlDesign.updateOne({ _id: urlDesign._id }, { video: result.value }, function (err, upd) {
        if (upd) {
          UrlDesign.findById(urlDesign._id).populate('images').populate('testimonials.userPhoto').populate('video.file').exec(function (e, d) {
            if (d) {
              return res.status(200).json({
                success: true,
                message: 'Video updated.',
                data: d
              });
            }
          })
        } else {
          return res.status(500).json({
            error: true,
            message: err.message,
          });
        }
      })
    }
  } catch (error) {
    console.error('url-design-error', error);
    return res.status(500).json({
      error: true,
      message: 'Cannot Add/Update video',
    });
  }
};
exports.AddImages = async (req, res) => {
  try {
    const result = imagesSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    const { id } = req.decoded;
    let urlDesign = await UrlDesign.findOne({ userId: id });

    if (!urlDesign) {
      urlDesign = new UrlDesign();
      urlDesign = {
        ...urlDesign,
        userId: id,
        images: result.value
      }
      await UrlDesign.create(urlDesign, function (err, doc) {
        if (doc) {
          doc.populate('images').populate('testimonials.userPhoto'), populate('video.file').execPopulate().then(function (dc, rej) {
            return res.status(200).json({
              success: true,
              message: 'Images added.',
              data: dc
            });
          });

        } else {
          return res.status(500).json({
            error: true,
            message: err.message
          })
        }
      });
    } else {
      await UrlDesign.updateOne({ _id: urlDesign._id }, { images: result.value }, function (err, upd) {
        if (upd) {
          UrlDesign.findById(urlDesign._id).populate('images').populate('testimonials.userPhoto').populate('video.file').exec(function (e, d) {
            if (d) {
              return res.status(200).json({
                success: true,
                message: 'Images updated.',
                data: d
              });
            }
          })
        } else {
          return res.status(500).json({
            error: true,
            message: err.message,
          });
        }
      })
    }
  } catch (error) {
    console.error('url-design-error', error);
    return res.status(500).json({
      error: true,
      message: 'Cannot Add/Update images',
    });
  }
};
exports.AddTestimonials = async (req, res) => {
  try {
    const result = testimonialsSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    const { id } = req.decoded;

    let urlDesign = await UrlDesign.findOne({ userId: id });

    if (!urlDesign) {
      urlDesign = new UrlDesign();
      urlDesign = {
        ...urlDesign,
        userId: id,
        testimonials: result.value
      }
      await UrlDesign.create(urlDesign, function (err, doc) {
        if (doc) {
          doc.populate('images').populate('testimonials.userPhoto').populate('video.file').execPopulate().then(function (dc, rej) {
            return res.status(200).json({
              success: true,
              message: 'Testimonials added.',
              data: dc
            });
          });

        } else {
          return res.status(500).json({
            error: true,
            message: err.message
          })
        }
      });
    } else {
      await UrlDesign.updateOne({ _id: urlDesign._id }, { testimonials: result.value }, function (err, upd) {
        if (upd) {
          UrlDesign.findById(urlDesign._id).populate('images').populate('testimonials.userPhoto').populate('video.file').exec(function (e, d) {
            if (d) {
              return res.status(200).json({
                success: true,
                message: 'Testimonials updated.',
                data: d
              });
            }
          });
        } else {
          return res.status(500).json({
            error: true,
            message: err.message,
          });
        }
      })
    }
  } catch (error) {
    console.error('url-design-error', error);
    return res.status(500).json({
      error: true,
      message: 'Cannot Add/Update Testimonials',
    });
  }
};
exports.AddCta = async (req, res) => {
  try {
    const result = ctaSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    const { id } = req.decoded;

    let urlDesign = await UrlDesign.findOne({ userId: id });

    if (!urlDesign) {
      urlDesign = new UrlDesign();
      urlDesign = {
        ...urlDesign,
        userId: id,
        customCTA: result.value
      }
      await UrlDesign.create(urlDesign, function (err, doc) {
        if (doc) {
          doc.populate('images').populate('testimonials.userPhoto').populate('video.file').execPopulate().then(function (dc, rej) {
            return res.status(200).json({
              success: true,
              message: 'Custom CTA added.',
              data: dc
            });
          });

        } else {
          return res.status(500).json({
            error: true,
            message: err.message
          })
        }
      });
    } else {
      await UrlDesign.updateOne({ _id: urlDesign._id }, { customCTA: result.value }, function (err, upd) {
        if (upd) {
          UrlDesign.findById(urlDesign._id).populate('images').populate('testimonials.userPhoto').populate('video.file').exec(function (e, d) {
            if (d) {
              return res.status(200).json({
                success: true,
                message: 'Custom CTA updated.',
                data: d
              });
            }
          });
        } else {
          return res.status(500).json({
            error: true,
            message: err.message,
          });
        }
      })
    }
  } catch (error) {
    console.error('url-design-error', error);
    return res.status(500).json({
      error: true,
      message: 'Cannot Add/Update Custom CTA',
    });
  }
};
exports.AddContactForm = async (req, res) => {
  try {
    const result = contactFormSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    const { id } = req.decoded;

    let urlDesign = await UrlDesign.findOne({ userId: id });

    if (!urlDesign) {
      urlDesign = new UrlDesign();
      urlDesign = {
        ...urlDesign,
        userId: id,
        contactForm: result.value
      }
      await UrlDesign.create(urlDesign, function (err, doc) {
        if (doc) {
          doc.populate('images').populate('testimonials.userPhoto').populate('video.file').execPopulate().then(function (dc, rej) {
            return res.status(200).json({
              success: true,
              message: 'Contact form added.',
              data: dc
            });
          });

        } else {
          return res.status(500).json({
            error: true,
            message: err.message
          })
        }
      });
    } else {
      await UrlDesign.updateOne({ _id: urlDesign._id }, { contactForm: result.value }, function (err, upd) {
        if (upd) {
          UrlDesign.findById(urlDesign._id).populate('images').populate('testimonials.userPhoto').populate('video.file').exec(function (e, d) {
            if (d) {
              return res.status(200).json({
                success: true,
                message: 'Contact Form updated.',
                data: d
              });
            }
          });
        } else {
          return res.status(500).json({
            error: true,
            message: err.message,
          });
        }
      })
    }
  } catch (error) {
    console.error('url-design-error', error);
    return res.status(500).json({
      error: true,
      message: 'Cannot Add/Update Contact Form',
    });
  }
};