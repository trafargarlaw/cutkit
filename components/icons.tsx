import {
  ArrowUp,
  AudioLines,
  Check,
  ChevronDown,
  ChevronsUpDown,
  Ellipsis,
  Images,
  Lightbulb,
  LoaderCircle,
  Pause,
  Play,
  Scroll,
  User,
  WandSparkles,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      fill="none"
      {...props}
    >
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M34.615 25c0-1.593 1.234-2.885 2.756-2.885h9.873C48.767 22.115 50 23.407 50 25c0 1.593-1.234 2.885-2.755 2.885H37.37c-1.522 0-2.756-1.292-2.756-2.885ZM0 25c0-1.593 1.234-2.885 2.755-2.885h9.874c1.522 0 2.756 1.292 2.756 2.885 0 1.593-1.234 2.885-2.756 2.885H2.755C1.234 27.885 0 26.593 0 25ZM25 0c1.593 0 2.885 1.234 2.885 2.755v9.874c0 1.522-1.292 2.756-2.885 2.756-1.593 0-2.885-1.234-2.885-2.756V2.755C22.115 1.234 23.407 0 25 0ZM25 34.615c1.593 0 2.885 1.234 2.885 2.756v9.873C27.885 48.767 26.593 50 25 50c-1.593 0-2.885-1.234-2.885-2.755V37.37c0-1.522 1.292-2.756 2.885-2.756Z"
        clipRule="evenodd"
      />
      <path
        fill="#fff"
        d="M28.846 25a3.846 3.846 0 1 1-7.692 0 3.846 3.846 0 0 1 7.692 0ZM5.18 10.096c-2.596 0-4.7-2.152-4.7-4.808C.48 2.633 2.585.481 5.18.481c2.594 0 4.698 2.152 4.698 4.807 0 .163-.008.323-.024.481l10.474 10.46a2.932 2.932 0 0 1 0 4.08 2.774 2.774 0 0 1-3.987 0L6.303 9.958c-.36.09-.736.138-1.124.138ZM44.82 39.904c2.596 0 4.7 2.152 4.7 4.807 0 2.656-2.104 4.808-4.7 4.808-2.594 0-4.698-2.152-4.698-4.807 0-.163.008-.323.024-.481L29.672 33.77a2.932 2.932 0 0 1 0-4.08 2.774 2.774 0 0 1 3.987 0l10.038 10.351c.36-.09.736-.138 1.124-.138ZM39.904 5.18c0-2.596 2.152-4.7 4.807-4.7 2.656 0 4.808 2.104 4.808 4.7 0 2.594-2.152 4.698-4.807 4.698-.163 0-.323-.008-.481-.024L33.77 20.328a2.932 2.932 0 0 1-4.08 0 2.774 2.774 0 0 1 0-3.987L40.042 6.303a4.608 4.608 0 0 1-.138-1.124ZM10.096 44.82c0 2.596-2.152 4.7-4.808 4.7-2.655 0-4.807-2.104-4.807-4.7 0-2.594 2.152-4.698 4.807-4.698.163 0 .323.008.481.024l10.46-10.474a2.932 2.932 0 0 1 4.08 0 2.774 2.774 0 0 1 0 3.987L9.958 43.697c.09.36.138.736.138 1.124Z"
      />
    </svg>
  ),
  wandSparkles: WandSparkles,
  check: Check,
  spinner: LoaderCircle,
  arrowUp: ArrowUp,
  squarePlay: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
      <rect
        width="24.07"
        height="24.094"
        x="3.93"
        y="3.906"
        stroke="#2488FE"
        strokeWidth="2.667"
        rx="6.667"
      />
      <path
        stroke="#2488FE"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.667"
        d="M13.333 13.158c0-1.065 1.187-1.7 2.073-1.11l4.263 2.843a1.333 1.333 0 0 1 0 2.218l-4.263 2.842a1.333 1.333 0 0 1-2.073-1.11v-5.683Z"
      />
    </svg>
  ),
  ellipsis: Ellipsis,
  lightBulb: Lightbulb,
  scroll: Scroll,
  chevronsUpDown: ChevronsUpDown,
  hook: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.333"
        d="M10.667 6v4A3.333 3.333 0 1 1 4 10V7.333l2 2M10.667 6a1.333 1.333 0 1 1 0-2.667m0 2.667a1.333 1.333 0 0 0 0-2.667m0 0V2"
      />
    </svg>
  ),
  audio: AudioLines,
  images: Images,
  user: User,
  play: Play,
  chevronDown: ChevronDown,
  pause: Pause,
};
