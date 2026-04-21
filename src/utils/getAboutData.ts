import fs from "fs";
import path from "path";

export interface AboutData {
  title?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
}

/**
 * Đọc dữ liệu trang About từ file JSON do TinaCMS quản lý.
 * File: content/about.json
 * Nếu file không tồn tại hoặc bị lỗi, trả về object rỗng (fallback về resources/content.tsx).
 */
export function getAboutData(): AboutData {
  try {
    const filePath = path.join(process.cwd(), "content", "about.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as AboutData;
  } catch {
    return {};
  }
}
