/* Iconos line-style (stroke). Uso: <Icon name="heart" size={18} /> */
const ICON_PATHS = {
  dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4a1 1 0 011-1h4a1 1 0 011 1v2H9z"/><path d="M9 11h6M9 15h4"/>',
  steps: '<path d="M4 18v-3a3 3 0 013-3h2"/><circle cx="6" cy="6" r="2.2"/><path d="M14 6h6M14 12h6M14 18h6"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
  shield: '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/>',
  gauge: '<path d="M12 13l4-4"/><path d="M5 19a9 9 0 1114 0"/><circle cx="12" cy="13" r="1.4"/>',
  family: '<circle cx="8" cy="8" r="2.6"/><circle cx="16.5" cy="9" r="2.1"/><path d="M3.5 19a4.5 4.5 0 019 0M14 19a4 4 0 016.5-3.1"/>',
  printer: '<path d="M6 9V4h12v5"/><rect x="5" y="9" width="14" height="7" rx="1.5"/><path d="M8 16h8v4H8z"/>',
  book: '<path d="M5 4h11a2 2 0 012 2v14H7a2 2 0 01-2-2z"/><path d="M18 16H7a2 2 0 00-2 2"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 00-.1-1l2-1.5-2-3.4-2.3 1a7 7 0 00-1.7-1l-.3-2.6h-4l-.3 2.6a7 7 0 00-1.7 1l-2.3-1-2 3.4 2 1.5a7 7 0 000 2l-2 1.5 2 3.4 2.3-1a7 7 0 001.7 1l.3 2.6h4l.3-2.6a7 7 0 001.7-1l2.3 1 2-3.4-2-1.5a7 7 0 00.1-1z"/>',
  heart: '<path d="M12 20s-7-4.5-9.5-9A4.5 4.5 0 0112 6a4.5 4.5 0 019.5 5c-2.5 4.5-9.5 9-9.5 9z"/>',
  lungs: '<path d="M12 3v8M9 8c0 4-1 5-3 7-1.5 1.5-3 1-3-1 0-3 1-6 3-7 1.5-.7 3 .3 3 1zM15 8c0 4 1 5 3 7 1.5 1.5 3 1 3-1 0-3-1-6-3-7-1.5-.7-3 .3-3 1z"/>',
  drop: '<path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z"/>',
  brain: '<path d="M9 4a3 3 0 00-3 3 3 3 0 00-1 5 3 3 0 002 4 3 3 0 005 1V5a2 2 0 00-3-1zM15 4a3 3 0 013 3 3 3 0 011 5 3 3 0 01-2 4 3 3 0 01-5 1"/>',
  scale: '<path d="M12 3v18M5 7h14M7 7l-3 6a3 3 0 006 0L7 7zM17 7l-3 6a3 3 0 006 0l-3-6z"/>',
  accessible: '<circle cx="12" cy="5" r="1.6"/><path d="M12 8v6h4l2 4M12 11l-3 1M8 13a4 4 0 105 5"/>',
  alert: '<path d="M12 3l9 16H3z"/><path d="M12 9v5M12 17v.5"/>',
  alertcircle: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16v.5"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  checkcircle: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chevright: '<path d="M9 6l6 6-6 6"/>',
  chevleft: '<path d="M15 6l-6 6 6 6"/>',
  chevdown: '<path d="M6 9l6 6 6-6"/>',
  arrowright: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',
  download: '<path d="M12 4v11M7 11l5 5 5-5"/><path d="M5 20h14"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V5a1 1 0 011-1h11"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  user: '<circle cx="12" cy="8" r="3.4"/><path d="M5 20a7 7 0 0114 0"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  trash: '<path d="M5 7h14M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M7 7l1 13h8l1-13"/>',
  sparkles: '<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5zM18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8z"/>',
  pdf: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M9 13h1.5a1 1 0 010 2H9zM9 13v4M14 13v4M14 13h2M14 15.5h1.5"/>',
  refresh: '<path d="M4 12a8 8 0 0113-6l2 2M20 12a8 8 0 01-13 6l-2-2"/><path d="M19 4v4h-4M5 20v-4h4"/>',
  dumbbell: '<path d="M6.5 6.5l11 11M4 9l2-2M9 4l-2 2M17 20l-2-2M20 15l-2 2M5 8l3 3M16 13l3 3"/>',
};

function Icon({ name, size = 18, stroke = 2, className = "", style }) {
  return (
    <svg className={"ic " + className} width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"
      strokeLinejoin="round" style={style}
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] || "" }} />
  );
}

window.Icon = Icon;
