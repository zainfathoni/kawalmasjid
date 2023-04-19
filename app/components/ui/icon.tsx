import {
  AppWindow,
  Circle,
  Cloud,
  Components,
  DashboardSpeed,
  Database,
  DbSearch,
  Group,
  Home,
  InfoEmpty,
  InputSearch,
  LayoutLeft,
  MultiplePages,
  PageEdit,
  PageSearch,
  PageStar,
  UserCrown,
} from "~/icons";

/**
 * Icon Component
 *
 * For automated icon display with name props.
 * Works by mapping the name string with like a switch case.
 * Only used when need to determine icon based on the item name from data.
 */

export const iconMaps = {
  about: <InfoEmpty />,
  appWindow: <AppWindow />,
  components: <Components />,
  dashboard: <DashboardSpeed />,
  database: <Database />,
  default: <Circle />,
  demo: <LayoutLeft />,
  home: <Home />,
  noteCategory: <PageSearch />,
  notes: <MultiplePages />,
  places: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 512"
      role="img"
      fill="currentColor"
      className="size-md"
    >
      <path d="M400 0c7.6 0 14.7 3.6 19.2 9.6 18 24 40.1 42.1 66.5 59.5 15.7 10.3 31.3 19.5 48.2 29.3 13.1 7.6 26.9 15.7 42.2 25.2 31 19.2 48 53.2 48 88.3 0 25.6-8.9 49.2-23.8 67.7 23.5 11.8 39.7 36.2 39.7 64.4v96c0 39.8-32.2 72-72 72H72c-39.8 0-72-32.2-72-72V140.7C0 96.3 20.5 54.3 55.6 27L81.3 7C90 .3 102.1.3 110.8 7l25.7 20c26.9 20.9 45.2 50.4 52.3 83.1-24.1 21.6-38.9 51-43.3 81.9H48v248c0 13.3 10.7 24 24 24h92.1c-2.7-7.5-4.1-15.6-4.1-24v-96c0-28.2 16.2-52.6 39.8-64.4-14.9-18.6-23.8-42.1-23.8-67.8 0-35.1 17-69.1 48-88.3 15.2-9.4 29.1-17.5 42.2-25.2 16.9-9.9 32.5-19 48.2-29.3 26.4-17.4 48.5-35.5 66.4-59.5C385.3 3.6 392.4 0 400 0zM232 464h24v-56c0-13.3 10.7-24 24-24s24 10.7 24 24v56h48v-50c0-19 8.4-37 23-49.2l25-20.8 25 20.8c14.6 12.2 23 30.2 23 49.2v50h48v-56c0-13.3 10.7-24 24-24s24 10.7 24 24v56h24c13.3 0 24-10.7 24-24v-96c0-13.3-10.7-24-24-24H232c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24zM48 144h96v-3.3c0-29.6-13.7-57.6-37.1-75.8L96 56.4l-10.9 8.5C61.7 83.1 48 111.1 48 140.7v3.3zm528 67.8c0-19.9-9.6-37.7-25.3-47.5-12.6-7.8-25.9-15.6-39-23.3-18.3-10.8-36.5-21.4-52.4-31.9C438.2 95.3 418.1 80 400 61c-18.1 18.9-38.2 34.2-59.3 48.1-16 10.5-34.1 21.1-52.4 31.9-13.1 7.7-26.4 15.5-39 23.3-15.7 9.8-25.3 27.7-25.3 47.5 0 33.2 26.9 60.2 60.2 60.2h231.6c33.2 0 60.2-26.9 60.2-60.2z" />
    </svg>
  ),
  noteStatus: <PageStar />,
  noteTag: <PageEdit />,
  search: <InputSearch />,
  searchAdmin: <DbSearch />,
  site: <Cloud />,
  userRole: <UserCrown />,
  users: <Group />,
};

export function lookupIcon(lookupObject: any, defaultCase = "default") {
  return (expression: string | number) => {
    return lookupObject[expression] || lookupObject[defaultCase];
  };
}

export const iconSwitch = lookupIcon(iconMaps, "default");

export function Icon({ name = "default" }: { name?: string }) {
  return iconSwitch(name);
}
