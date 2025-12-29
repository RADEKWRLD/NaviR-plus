interface EngineIconProps {
  engine: string;
  size?: number;
}

export default function EngineIcon({ engine, size = 20 }: EngineIconProps) {
  switch (engine) {
    case 'google':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      );

    case 'bing':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M5 3v18l5-3 7 4V6l-7 2-5-5z" fill="#008373"/>
          <path d="M12 11l5-2v9l-5-3v-4z" fill="#00BCF2"/>
        </svg>
      );

    case 'baidu':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="7" cy="8" r="2" fill="#2932E1"/>
          <circle cx="17" cy="8" r="2" fill="#2932E1"/>
          <circle cx="12" cy="5" r="2" fill="#2932E1"/>
          <path d="M6 14c0-1.5 1-3 3-3h6c2 0 3 1.5 3 3v4c0 1.5-1.5 2-3 2H9c-1.5 0-3-.5-3-2v-4z" fill="#2932E1"/>
        </svg>
      );

    case 'github':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="#24292e"/>
        </svg>
      );

    case 'zhihu':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="7" height="14" rx="1" fill="#0084FF"/>
          <path d="M11 4h7v2h-7V4zm0 4h7v2h-7V8z" fill="#0084FF"/>
          <path d="M14 12h4l-2 6-2-6z" fill="#0084FF"/>
        </svg>
      );

    case 'bilibili':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="4" y="7" width="16" height="12" rx="2" fill="#00A1D6"/>
          <circle cx="9" cy="11" r="1" fill="white"/>
          <circle cx="15" cy="11" r="1" fill="white"/>
          <path d="M8 14h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M7 5l2 2M17 5l-2 2" stroke="#00A1D6" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );

    case 'duckduckgo':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#DE5833"/>
          <ellipse cx="12" cy="13" rx="6" ry="5" fill="white"/>
          <ellipse cx="10" cy="11" rx="2" ry="2.5" fill="#2D4F8E"/>
          <circle cx="10.5" cy="10.5" r="0.8" fill="white"/>
          <ellipse cx="15" cy="12" rx="1.5" ry="2" fill="#2D4F8E"/>
          <path d="M8 16c1.5 1 4.5 1 6 0" stroke="#DE5833" strokeWidth="1.5" strokeLinecap="round"/>
          <ellipse cx="14" cy="8" rx="3" ry="2" fill="#65BC46"/>
        </svg>
      );

    case 'yandex':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#FF0000"/>
          <path d="M13.5 18V9.5L16 6h-2.5l-3 4.5V6H8v12h2.5v-5l3.5 5h2.5l-3-4.5V18z" fill="white"/>
        </svg>
      );

    default:
      return null;
  }
}
