import type { CollectionConfig } from "payload";
import { isAdmin } from "@/lib/access";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role"],
    group: "Admin",
    description: "People who can sign in and edit the website.",
  },
  access: {
    // Admins manage accounts; everyone can read their own profile (needed by the admin UI).
    read: ({ req }) => {
      if (req.user?.role === "admin") return true;
      if (req.user) return { id: { equals: req.user.id } };
      return false;
    },
    create: isAdmin,
    update: ({ req, id }) => {
      if (req.user?.role === "admin") return true;
      return req.user?.id === id;
    },
    delete: isAdmin,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      access: {
        // Only admins may change roles — editors can't promote themselves.
        update: ({ req }) => req.user?.role === "admin",
      },
    },
  ],
};
