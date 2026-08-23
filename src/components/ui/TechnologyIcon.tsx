import { TECHNOLOGY_ICONS } from "@/lib/icons";

const ICON_SIZE_CLASS = "size-[0.8125rem] shrink-0";

type TechnologyIconProps = {
  name: string | undefined;
};

export function TechnologyIcon({ name }: TechnologyIconProps) {
  const path =
    name !== undefined && Object.hasOwn(TECHNOLOGY_ICONS, name)
      ? TECHNOLOGY_ICONS[name]
      : undefined;

  if (path === undefined) {
    return (
      <span
        aria-hidden="true"
        className={`${ICON_SIZE_CLASS} rounded-full border border-muted`}
      />
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={`${ICON_SIZE_CLASS} fill-current`}
      viewBox="0 0 24 24"
    >
      <path d={path} />
    </svg>
  );
}
