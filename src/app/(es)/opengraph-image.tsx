import { getContent } from "@/content";
import {
  PREVIEW_CONTENT_TYPE,
  PREVIEW_SIZE,
  renderPreviewImage,
} from "@/lib/preview-image";

const { site } = getContent("es");

export const alt = `${site.name} — ${site.role}`;
export const size = PREVIEW_SIZE;
export const contentType = PREVIEW_CONTENT_TYPE;

export default function OpengraphImage() {
  return renderPreviewImage(site);
}
