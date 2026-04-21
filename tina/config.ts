import { defineConfig } from "tinacms";

// ============================================================
// TinaCMS Configuration
// Đây là file schema duy nhất của TinaCMS.
// - TinaCMS chỉ đọc/ghi file .mdx vật lý.
// - Logic đọc MDX của Next.js (getPosts + gray-matter) KHÔNG bị ảnh hưởng.
// ============================================================

export default defineConfig({
  // Chạy local (không cần Tina Cloud khi dev)
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  branch:
    process.env.NEXT_PUBLIC_TINA_BRANCH ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.HEAD ||
    "main",
  token: process.env.TINA_TOKEN || "",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },

  // ============================================================
  // SCHEMA — 2 Collections: Blog và Projects
  // ============================================================
  schema: {
    collections: [
      // ----------------------------------------------------------
      // Collection 1: BLOG
      // Path: src/app/blog/posts  (file .mdx)
      // ----------------------------------------------------------
      {
        name: "blog",
        label: "Blog Posts",
        path: "src/app/blog/posts",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "datetime",
            name: "publishedAt",
            label: "Published At",
            required: true,
          },
          {
            type: "string",
            name: "summary",
            label: "Summary",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            name: "tag",
            label: "Tag",
          },
          {
            type: "image",
            name: "image",
            label: "Cover Image",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],

        // Tên file mới sẽ dùng slug từ title
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return (values?.title || "new-post")
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
            },
          },
        },
      },

      // ----------------------------------------------------------
      // Collection 2: PROJECTS (Work)
      // Path: src/app/work/projects  (file .mdx)
      // ----------------------------------------------------------
      {
        name: "projects",
        label: "Work / Projects",
        path: "src/app/work/projects",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "datetime",
            name: "publishedAt",
            label: "Published At",
            required: true,
          },
          {
            type: "string",
            name: "summary",
            label: "Summary",
            ui: {
              component: "textarea",
            },
          },
          {
            // images là flat array of strings để tương thích với gray-matter reader hiện tại
            // utils.ts đọc: data.images || [] → cần format: ["path1", "path2"]
            type: "string",
            name: "images",
            label: "Images / Media (paths)",
            list: true,
            ui: {
              component: "text",
            },
          },
          {
            type: "string",
            name: "link",
            label: "External Link",
          },
          {
            // team là array of objects
            type: "object",
            name: "team",
            label: "Team Members",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.name || "Member",
              }),
            },
            fields: [
              {
                type: "string",
                name: "name",
                label: "Name",
              },
              {
                type: "string",
                name: "role",
                label: "Role",
              },
              {
                type: "image",
                name: "avatar",
                label: "Avatar",
              },
              {
                type: "string",
                name: "linkedIn",
                label: "LinkedIn URL",
              },
            ],
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],

        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return (values?.title || "new-project")
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
            },
          },
        },
      },
      // ----------------------------------------------------------
      // Collection 3: STATIC PAGES (JSON)
      // Path: content/  (file .json)
      // Dùng cho About, Home, Gallery... (không phải Markdown)
      // ----------------------------------------------------------
      {
        name: "pages",
        label: "Static Pages",
        path: "content",
        format: "json",
        ui: {
          allowedActions: {
            create: false, // Chỉ edit, không tạo mới từ admin (file do dev tạo sẵn)
            delete: false,
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Page Title",
          },
          {
            type: "image",
            name: "avatar",
            label: "Avatar Image",
          },
          {
            type: "string",
            name: "bio",
            label: "Bio / Introduction",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            name: "skills",
            label: "Skills",
            list: true,
            ui: {
              component: "text",
            },
          },
        ],
      },
    ],
  },
});
