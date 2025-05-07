import type { NextAdminOptions } from "@premieroctet/next-admin";

const options: NextAdminOptions = {
  title: "Resume Builder Admin",
  model: {
    Resume: {
      title: "Resumes",
      list: {
        fields: {
          id: {},
          title: {},
          fullName: {},
          location: {},
        },
      },
      edit: {
        fields: {
          id: {
            disabled: true,
          },
          title: {
            required: true,
          },
          fullName: {
            required: true,
          },
          location: {},
          about: {
            format: "textarea",
          },
          summary: {
            format: "textarea",
          },
          avatarUrl: {
            format: "uri",
          },
          personalWebsiteUrl: {
            format: "uri",
          },
        },
      },
    },
  },
};

export default options;
